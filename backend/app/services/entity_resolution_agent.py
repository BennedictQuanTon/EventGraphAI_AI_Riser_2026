import json
import logging
import numpy as np
from difflib import SequenceMatcher
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session
from backend.app.models import Person, Company, ResolutionLog, Affiliation
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger("eventgraph.entity_resolution")

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    arr1 = np.array(v1)
    arr2 = np.array(v2)
    norm1 = np.linalg.norm(arr1)
    norm2 = np.linalg.norm(arr2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(arr1, arr2) / (norm1 * norm2))

def normalize_text(text: str) -> str:
    if not text:
        return ""
    import unicodedata
    n = unicodedata.normalize('NFKD', text.lower())
    return ''.join([c for c in n if not unicodedata.combining(c)]).strip()

def get_email_domain(email: Optional[str]) -> Optional[str]:
    if not email or "@" not in email:
        return None
    domain = email.split("@")[-1].strip().lower()
    # Ignore generic public email domains for company matching
    if domain in ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"]:
        return None
    return domain

class EntityResolutionAgent:
    def __init__(self):
        self.auto_merge_threshold = 0.88
        self.review_queue_threshold = 0.60

    def resolve_person(
        self, 
        db: Session, 
        person_data: Dict[str, Any], 
        tenant_id: str
    ) -> Tuple[str, Optional[Person], Optional[ResolutionLog]]:
        """
        Evaluate if person matches existing DB records.
        Returns: (status: 'auto_merged' | 'pending_review' | 'created_new', person_instance, resolution_log)
        """
        full_name = person_data.get("full_name", "").strip()
        email = (person_data.get("email") or "").strip().lower()
        phone = (person_data.get("phone") or "").strip()
        
        if not full_name:
            return "created_new", None, None

        # Existing persons in tenant
        existing_persons = db.query(Person).filter(Person.tenant_id == tenant_id).all()
        if not existing_persons:
            return "created_new", None, None

        new_embedding = gemini_service.get_embedding(full_name)
        
        best_match: Optional[Person] = None
        highest_score = 0.0
        applied_rule = ""
        explanation = ""

        for candidate in existing_persons:
            cand_name = candidate.full_name
            cand_email = (candidate.email or "").strip().lower()
            cand_phone = (candidate.phone or "").strip()
            
            score = 0.0
            rules = []

            # 1. Exact Email Match -> Absolute Match
            if email and cand_email and email == cand_email:
                score = 0.99
                rules.append("exact_email_match")
                explanation = f"Trùng khớp 100% địa chỉ email [{email}]."

            # 2. Exact Phone Match
            elif phone and cand_phone and phone.replace(" ", "").replace(".", "") == cand_phone.replace(" ", "").replace(".", ""):
                score = 0.95
                rules.append("exact_phone_match")
                explanation = f"Trùng khớp số điện thoại [{phone}]."

            else:
                # 3. Embedding Vector Cosine Similarity
                cand_vec = json.loads(candidate.embedding_json) if candidate.embedding_json else gemini_service.get_embedding(cand_name)
                emb_sim = cosine_similarity(new_embedding, cand_vec)
                
                # 4. Text Levenshtein String Similarity
                norm_sim = SequenceMatcher(None, normalize_text(full_name), normalize_text(cand_name)).ratio()
                name_sim = (emb_sim * 0.5) + (norm_sim * 0.5)
                score = name_sim

                if name_sim > 0.80:
                    rules.append(f"high_name_similarity_{int(name_sim*100)}%")

                # 5. Email Domain Match Boost
                domain_new = get_email_domain(email)
                domain_cand = get_email_domain(cand_email)
                if domain_new and domain_cand and domain_new == domain_cand:
                    score = min(0.96, score + 0.20)
                    rules.append("same_company_email_domain")
                    explanation = f"Tương đồng tên {int(name_sim*100)}% và cùng miền email công ty [@{domain_new}]."
                else:
                    explanation = f"Độ tương đồng tên và chức danh {int(name_sim*100)}% so với ứng viên [{cand_name}]."

            if score > highest_score:
                highest_score = score
                best_match = candidate
                applied_rule = " + ".join(rules) if rules else "embedding_similarity"

        # Decisions
        if highest_score >= self.auto_merge_threshold and best_match:
            # Auto merge into best_match
            log = ResolutionLog(
                entity_type="person",
                source_name=full_name,
                matched_candidate_id=best_match.id,
                matched_candidate_name=best_match.full_name,
                similarity_score=round(highest_score, 3),
                matched_rule=applied_rule,
                decision="auto_merged",
                explanation=f"[Tự động gộp] {explanation}",
                payload_data=json.dumps(person_data, ensure_ascii=False),
                tenant_id=tenant_id
            )
            db.add(log)
            db.commit()
            return "auto_merged", best_match, log

        elif highest_score >= self.review_queue_threshold and best_match:
            # Send to Pending Review queue
            log = ResolutionLog(
                entity_type="person",
                source_name=full_name,
                matched_candidate_id=best_match.id,
                matched_candidate_name=best_match.full_name,
                similarity_score=round(highest_score, 3),
                matched_rule=applied_rule,
                decision="pending",
                explanation=f"[Chờ duyệt] {explanation}",
                payload_data=json.dumps(person_data, ensure_ascii=False),
                tenant_id=tenant_id
            )
            db.add(log)
            db.commit()
            return "pending_review", best_match, log

        else:
            # Create new entity
            return "created_new", None, None

    def resolve_company(
        self, 
        db: Session, 
        company_name: str, 
        domain: Optional[str], 
        tenant_id: str
    ) -> Tuple[str, Optional[Company]]:
        """Find or create matching company"""
        c_name = company_name.strip()
        if not c_name:
            return "created_new", None

        existing_companies = db.query(Company).filter(Company.tenant_id == tenant_id).all()
        for cand in existing_companies:
            # Match domain
            if domain and cand.domain and domain.lower() == cand.domain.lower():
                return "matched", cand
            # Match normalized name
            norm1 = normalize_text(c_name).replace("cong ty", "").replace("cp", "").replace("tnhh", "").strip()
            norm2 = normalize_text(cand.name).replace("cong ty", "").replace("cp", "").replace("tnhh", "").strip()
            if norm1 == norm2 or SequenceMatcher(None, norm1, norm2).ratio() > 0.85:
                return "matched", cand

        return "created_new", None

entity_resolution_agent = EntityResolutionAgent()
