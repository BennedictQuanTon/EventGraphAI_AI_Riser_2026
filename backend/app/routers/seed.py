from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from backend.app.database import get_db, Base, engine
from backend.app.config import settings
from backend.app.seed_data import seed_database

router = APIRouter(prefix="/api/seed", tags=["Database Seed & Reset"])

@router.post("/reset")
def reset_and_seed_database(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    # Drop and recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Re-seed
    seed_database(db, tenant_id=tenant_id)
    return {"success": True, "message": "Cơ sở dữ liệu đã được tái tạo và nạp đầy đủ dữ liệu mẫu thành công."}
