from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Tenant
from backend.app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication & Multi-Tenant"])

@router.get("/tenants")
def list_tenants(db: Session = Depends(get_db)):
    tenants = db.query(Tenant).all()
    if not tenants:
        return [{"id": settings.DEFAULT_TENANT_ID, "name": "Demo Innovation Hub"}]
    return [{"id": t.id, "name": t.name} for t in tenants]

@router.get("/current")
def get_current_tenant_info(x_tenant_id: str = Header(None), db: Session = Depends(get_db)):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        tenant_name = "Demo Innovation Hub"
    else:
        tenant_name = tenant.name
    return {
        "tenant_id": tenant_id,
        "tenant_name": tenant_name,
        "is_authenticated": True,
        "provider": "Firebase Auth / Multi-Tenant System"
    }
