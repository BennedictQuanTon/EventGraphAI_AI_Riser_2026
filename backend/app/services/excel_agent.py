import io
import json
import logging
import pandas as pd
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models import Event, Person, Company, Affiliation, Participation
from backend.app.services.gemini_service import gemini_service
from backend.app.services.entity_resolution_agent import entity_resolution_agent
from backend.app.schemas import ExcelColumnMapping

logger = logging.getLogger("eventgraph.excel_agent")

def guess_column(columns: List[str], keywords: List[str]) -> Optional[str]:
    for col in columns:
        col_lower = str(col).strip().lower()
        for kw in keywords:
            if kw in col_lower:
                return str(col)
    return None

class ExcelAgent:
    def preview_file(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Read header columns and preview top 5 rows with auto-detected mapping"""
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(file_bytes))
        else:
            df = pd.read_excel(io.BytesIO(file_bytes))

        # Clean columns
        df.columns = [str(c).strip() for c in df.columns]
        columns = list(df.columns)
        
        preview_rows = df.head(5).fillna("").to_dict(orient="records")
        
        # Auto detection
        suggested_mapping = {
            "full_name_col": guess_column(columns, ["họ tên", "họ và tên", "tên", "full name", "name"]),
            "title_col": guess_column(columns, ["chức vụ", "chức danh", "vị trí", "title", "position"]),
            "company_col": guess_column(columns, ["công ty", "tổ chức", "đơn vị", "company", "organization"]),
            "email_col": guess_column(columns, ["email", "e-mail", "thư"]),
            "phone_col": guess_column(columns, ["sđt", "điện thoại", "phone", "mobile", "tel"]),
            "role_col": guess_column(columns, ["vai trò", "role", "loại vé", "ticket"])
        }

        return {
            "filename": filename,
            "total_rows": len(df),
            "columns": columns,
            "suggested_mapping": suggested_mapping,
            "preview_rows": preview_rows
        }

    def process_import(
        self, 
        db: Session, 
        file_bytes: bytes, 
        filename: str, 
        mapping: ExcelColumnMapping, 
        tenant_id: str = "tenant-demo-hub"
    ) -> Dict[str, Any]:
        """Process bulk import with Entity Resolution and Graph insertion"""
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(file_bytes))
        else:
            df = pd.read_excel(io.BytesIO(file_bytes))

        df.columns = [str(c).strip() for c in df.columns]
        df = df.fillna("")

        # 1. Create or Find Event
        event = db.query(Event).filter(
            Event.tenant_id == tenant_id,
            Event.name.ilike(mapping.event_name.strip())
        ).first()

        if not event:
            event = Event(
                name=mapping.event_name.strip(),
                date=mapping.event_date or "2026",
                location=mapping.event_location or "Online / Hội trường chính",
                type="conference",
                tenant_id=tenant_id,
                raw_source_file_url=filename
            )
            db.add(event)
            db.flush()

        stats = {
            "total_rows": len(df),
            "processed_rows": 0,
            "new_persons": 0,
            "new_companies": 0,
            "auto_merged": 0,
            "pending_reviews": 0,
            "event_id": event.id,
            "event_name": event.name
        }

        # 2. Process each row
        for _, row in df.iterrows():
            full_name = str(row.get(mapping.full_name_col, "")).strip() if mapping.full_name_col else ""
            if not full_name:
                continue

            title = str(row.get(mapping.title_col, "")).strip() if mapping.title_col else ""
            company_name = str(row.get(mapping.company_col, "")).strip() if mapping.company_col else ""
            email = str(row.get(mapping.email_col, "")).strip() if mapping.email_col else ""
            phone = str(row.get(mapping.phone_col, "")).strip() if mapping.phone_col else ""
            role = str(row.get(mapping.role_col, "attendee")).strip().lower() if mapping.role_col else "attendee"
            if not role:
                role = "attendee"

            stats["processed_rows"] += 1

            # Company lookup / create
            target_company = None
            if company_name:
                _, target_company = entity_resolution_agent.resolve_company(db, company_name, None, tenant_id)
                if not target_company:
                    enrich_data = gemini_service.enrich_company_info(company_name)
                    target_company = Company(
                        name=company_name,
                        domain=enrich_data.get("domain"),
                        industry=enrich_data.get("industry"),
                        size_range=enrich_data.get("size_range"),
                        description=enrich_data.get("description"),
                        enrichment_data=json.dumps(enrich_data, ensure_ascii=False),
                        tenant_id=tenant_id,
                        embedding_json=json.dumps(gemini_service.get_embedding(company_name))
                    )
                    db.add(target_company)
                    db.flush()
                    stats["new_companies"] += 1

            # Person Resolution
            person_data = {
                "full_name": full_name,
                "title": title,
                "company_name": company_name,
                "email": email,
                "phone": phone,
                "source_type": "excel_import"
            }

            status, matched_person, _ = entity_resolution_agent.resolve_person(db, person_data, tenant_id)

            if status == "auto_merged" and matched_person:
                stats["auto_merged"] += 1
                target_person = matched_person
                # Record participation
                existing_part = db.query(Participation).filter(
                    Participation.person_id == target_person.id,
                    Participation.event_id == event.id
                ).first()
                if not existing_part:
                    db.add(Participation(person_id=target_person.id, event_id=event.id, role=role))

            elif status == "pending_review":
                stats["pending_reviews"] += 1
                # Save candidate in log (will be created or merged upon user review)

            else:  # created_new
                target_person = Person(
                    full_name=full_name,
                    title=title,
                    phone=phone,
                    email=email,
                    source_type="excel_import",
                    tenant_id=tenant_id,
                    embedding_json=json.dumps(gemini_service.get_embedding(full_name))
                )
                db.add(target_person)
                db.flush()
                stats["new_persons"] += 1

                if target_company:
                    db.add(Affiliation(person_id=target_person.id, company_id=target_company.id, title=title or "Thành viên", is_current=True))

                db.add(Participation(person_id=target_person.id, event_id=event.id, role=role))

        db.commit()
        return stats

excel_agent = ExcelAgent()
