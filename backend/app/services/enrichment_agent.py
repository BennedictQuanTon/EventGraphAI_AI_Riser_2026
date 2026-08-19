import json
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models import Company
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger("eventgraph.enrichment_agent")

class EnrichmentAgent:
    def enrich_company(
        self, 
        db: Session, 
        company_name: str, 
        domain: Optional[str] = None, 
        tenant_id: str = "tenant-demo-hub",
        save_to_db: bool = False
    ) -> Dict[str, Any]:
        """Perform grounded enrichment of company details"""
        profile = gemini_service.enrich_company_info(company_name, domain)

        if save_to_db:
            # Check existing
            company = db.query(Company).filter(
                Company.tenant_id == tenant_id,
                Company.name.ilike(company_name.strip())
            ).first()

            if not company:
                company = Company(
                    name=company_name.strip(),
                    domain=domain or profile.get("domain"),
                    industry=profile.get("industry"),
                    size_range=profile.get("size_range"),
                    description=profile.get("description"),
                    enrichment_data=json.dumps(profile, ensure_ascii=False),
                    tenant_id=tenant_id,
                    embedding_json=json.dumps(gemini_service.get_embedding(company_name))
                )
                db.add(company)
            else:
                company.industry = profile.get("industry") or company.industry
                company.size_range = profile.get("size_range") or company.size_range
                company.description = profile.get("description") or company.description
                company.enrichment_data = json.dumps(profile, ensure_ascii=False)

            db.commit()
            db.refresh(company)
            profile["id"] = company.id

        return profile

enrichment_agent = EnrichmentAgent()
