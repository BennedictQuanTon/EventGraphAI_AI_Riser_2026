from typing import List
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models import Feedback
from backend.app.schemas import FeedbackCreate

router = APIRouter(prefix="/api/feedback", tags=["Active User Engagement (Gold Tier)"])

@router.get("")
def list_feedbacks(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    feedbacks = db.query(Feedback).filter(Feedback.tenant_id == tenant_id).order_by(Feedback.created_at.desc()).all()
    return [
        {
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "role": f.role,
            "rating": f.rating,
            "comment": f.comment,
            "created_at": f.created_at
        }
        for f in feedbacks
    ]

@router.post("")
def submit_feedback(
    data: FeedbackCreate,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    fb = Feedback(
        name=data.name,
        email=data.email,
        role=data.role,
        rating=data.rating,
        comment=data.comment,
        tenant_id=tenant_id
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return {"success": True, "id": fb.id, "message": "Cảm ơn bạn đã đóng góp phản hồi trải nghiệm sản phẩm!"}
