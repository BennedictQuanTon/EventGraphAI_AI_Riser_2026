from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.schemas import ChatRequest, ChatResponse
from backend.app.services.chat_agent import chat_agent

router = APIRouter(prefix="/api/chat", tags=["Graph RAG Chat Assistant"])

@router.post("", response_model=ChatResponse)
def ask_chat_assistant(
    req: ChatRequest,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    if not req.query:
        raise HTTPException(status_code=400, detail="Vui lòng nhập câu hỏi.")
        
    result = chat_agent.answer_query(
        db=db,
        query=req.query,
        history=req.history,
        tenant_id=tenant_id
    )
    return result
