from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.schemas import InsightRequest, InsightResponse
from backend.app.services.insight_agent import insight_agent

router = APIRouter(prefix="/api/insight", tags=["Insight Agent"])

@router.post("/recommend-guests", response_model=InsightResponse)
def recommend_guests_for_event(
    req: InsightRequest,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    if not req.event_name:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp tên sự kiện.")
        
    result = insight_agent.recommend_guests(
        db=db,
        event_name=req.event_name,
        event_type=req.event_type or "networking",
        target_industry=req.target_industry,
        topic=req.topic,
        max_recommendations=req.max_recommendations,
        tenant_id=tenant_id
    )
    return result
