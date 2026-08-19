import json
import logging
from typing import Dict, Any
from sqlalchemy.orm import Session
from backend.app.models import Person, Company, Affiliation, Participation
from backend.app.services.gemini_service import gemini_service
from backend.app.services.entity_resolution_agent import entity_resolution_agent

logger = logging.getLogger("eventgraph.ocr_agent")

class OCRAgent:
    def process_card_image(
        self, 
        db: Session, 
        image_bytes: bytes, 
        mime_type: str = "image/jpeg",
        tenant_id: str = "tenant-demo-hub",
        event_id: str = None
    ) -> Dict[str, Any]:
        """Extract card data with Gemini Vision and run entity resolution"""
        # 1. OCR with Gemini Vision
        extracted = gemini_service.extract_card_info(image_bytes, mime_type)
        
        full_name = extracted.get("full_name", "").strip()
        company_name = extracted.get("company_name", "").strip()
        title = extracted.get("title", "")
        email = extracted.get("email", "")
        phone = extracted.get("phone", "")
        domain = extracted.get("domain", "")
        language = extracted.get("language_detected", "vi")

        # 2. Entity Resolution for Person
        person_data = {
            "full_name": full_name,
            "title": title,
            "company_name": company_name,
            "email": email,
            "phone": phone,
            "language_detected": language,
            "source_type": "card_scan"
        }
        
        status, matched_person, res_log = entity_resolution_agent.resolve_person(db, person_data, tenant_id)

        target_person = None
        target_company = None

        # 3. Handle Company
        if company_name:
            c_status, matched_company = entity_resolution_agent.resolve_company(db, company_name, domain, tenant_id)
            if matched_company:
                target_company = matched_company
            else:
                # Auto enrich new company
                enrich_data = gemini_service.enrich_company_info(company_name, domain)
                target_company = Company(
                    name=company_name,
                    domain=domain or enrich_data.get("domain"),
                    industry=enrich_data.get("industry"),
                    size_range=enrich_data.get("size_range"),
                    description=enrich_data.get("description"),
                    enrichment_data=json.dumps(enrich_data, ensure_ascii=False),
                    tenant_id=tenant_id,
                    embedding_json=json.dumps(gemini_service.get_embedding(company_name))
                )
                db.add(target_company)
                db.flush()

        # 4. Handle Person depending on resolution
        if status == "auto_merged" and matched_person:
            target_person = matched_person
            # Update fields if missing
            if not target_person.email and email:
                target_person.email = email
            if not target_person.phone and phone:
                target_person.phone = phone
            if not target_person.title and title:
                target_person.title = title
            db.commit()

        elif status == "created_new":
            target_person = Person(
                full_name=full_name,
                title=title,
                phone=phone,
                email=email,
                language_detected=language,
                source_type="card_scan",
                tenant_id=tenant_id,
                embedding_json=json.dumps(gemini_service.get_embedding(full_name))
            )
            db.add(target_person)
            db.flush()

            # Create Affiliation
            if target_company:
                aff = Affiliation(
                    person_id=target_person.id,
                    company_id=target_company.id,
                    title=title or "Thành viên",
                    is_current=True
                )
                db.add(aff)

            # Link to event if specified
            if event_id:
                part = Participation(
                    person_id=target_person.id,
                    event_id=event_id,
                    role="attendee"
                )
                db.add(part)

            db.commit()

        return {
            "success": True,
            "extracted_data": extracted,
            "language": language,
            "resolution_status": status,
            "resolution_log": {
                "id": res_log.id if res_log else None,
                "score": res_log.similarity_score if res_log else 1.0,
                "rule": res_log.matched_rule if res_log else "new_entity",
                "explanation": res_log.explanation if res_log else "Thực thể mới đã được lưu vào Graph."
            } if res_log else None,
            "person": {
                "id": target_person.id if target_person else None,
                "full_name": target_person.full_name if target_person else full_name,
                "title": target_person.title if target_person else title
            } if target_person else None,
            "company": {
                "id": target_company.id if target_company else None,
                "name": target_company.name if target_company else company_name,
                "industry": target_company.industry if target_company else None
            } if target_company else None
        }

ocr_agent = OCRAgent()
