import json
from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models import ResolutionLog, Person, Company, Affiliation
from backend.app.schemas import ResolutionDecisionRequest
from backend.app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/resolution", tags=["Standardization & Entity Resolution"])

@router.get("/queue")
def get_pending_resolution_queue(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    pending = db.query(ResolutionLog).filter(
        ResolutionLog.tenant_id == tenant_id,
        ResolutionLog.decision == "pending"
    ).order_by(ResolutionLog.created_at.desc()).all()
    
    results = []
    for item in pending:
        payload = {}
        if item.payload_data:
            try:
                payload = json.loads(item.payload_data)
            except Exception:
                pass
                
        results.append({
            "id": item.id,
            "entity_type": item.entity_type,
            "source_name": item.source_name,
            "matched_candidate_id": item.matched_candidate_id,
            "matched_candidate_name": item.matched_candidate_name,
            "similarity_score": item.similarity_score,
            "matched_rule": item.matched_rule,
            "decision": item.decision,
            "explanation": item.explanation,
            "payload_data": payload,
            "created_at": item.created_at
        })
    return results

@router.get("/logs")
def get_all_resolution_audit_logs(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    logs = db.query(ResolutionLog).filter(
        ResolutionLog.tenant_id == tenant_id
    ).order_by(ResolutionLog.created_at.desc()).all()
    
    results = []
    for item in logs:
        payload = {}
        if item.payload_data:
            try:
                payload = json.loads(item.payload_data)
            except Exception:
                pass
                
        results.append({
            "id": item.id,
            "entity_type": item.entity_type,
            "source_name": item.source_name,
            "matched_candidate_id": item.matched_candidate_id,
            "matched_candidate_name": item.matched_candidate_name,
            "similarity_score": item.similarity_score,
            "matched_rule": item.matched_rule,
            "decision": item.decision,
            "explanation": item.explanation,
            "payload_data": payload,
            "created_at": item.created_at
        })
    return results

@router.post("/{log_id}/decision")
def submit_resolution_decision(
    log_id: str,
    req: ResolutionDecisionRequest,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    log = db.query(ResolutionLog).filter(ResolutionLog.id == log_id, ResolutionLog.tenant_id == tenant_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi chuẩn hóa.")
        
    payload = {}
    if log.payload_data:
        try:
            payload = json.loads(log.payload_data)
        except Exception:
            pass

    if req.decision == "merge":
        log.decision = "merged"
        log.explanation = f"[Đã duyệt gộp] Người dùng đã xác nhận gộp vào [{log.matched_candidate_name}]."
        
        # Update matched candidate if there are new non-empty fields
        if log.entity_type == "person" and log.matched_candidate_id:
            person = db.query(Person).filter(Person.id == log.matched_candidate_id).first()
            if person:
                if not person.email and payload.get("email"):
                    person.email = payload["email"]
                if not person.phone and payload.get("phone"):
                    person.phone = payload["phone"]

    elif req.decision == "create_new":
        log.decision = "rejected_as_new"
        log.explanation = f"[Tách thực thể mới] Người dùng từ chối gộp, tạo hồ sơ độc lập cho [{log.source_name}]."
        
        if log.entity_type == "person":
            new_p = Person(
                full_name=payload.get("full_name", log.source_name),
                title=payload.get("title", ""),
                email=payload.get("email", ""),
                phone=payload.get("phone", ""),
                source_type=payload.get("source_type", "card_scan"),
                tenant_id=tenant_id,
                embedding_json=json.dumps(gemini_service.get_embedding(log.source_name))
            )
            db.add(new_p)
            db.flush()
            
            comp_name = payload.get("company_name", "")
            if comp_name:
                comp = db.query(Company).filter(Company.name.ilike(comp_name.strip()), Company.tenant_id == tenant_id).first()
                if not comp:
                    comp = Company(
                        name=comp_name,
                        tenant_id=tenant_id,
                        embedding_json=json.dumps(gemini_service.get_embedding(comp_name))
                    )
                    db.add(comp)
                    db.flush()
                db.add(Affiliation(person_id=new_p.id, company_id=comp.id, title=new_p.title or "Thành viên"))

    else:
        log.decision = "rejected"
        log.explanation = "[Đã hủy] Bản ghi đã bị từ chối."

    db.commit()
    return {"success": True, "decision": log.decision, "log_id": log.id}
