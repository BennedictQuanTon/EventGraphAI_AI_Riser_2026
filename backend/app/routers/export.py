from fastapi import APIRouter, Depends, Header, Response
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.services.google_sheets_service import google_sheets_service

router = APIRouter(prefix="/api/export", tags=["Data Export & Google Sheets"])

@router.get("/csv")
def export_csv(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    csv_data = google_sheets_service.export_graph_to_csv(db, tenant_id=tenant_id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=eventgraph_export.csv"}
    )
