import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, Header, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.services.ocr_agent import ocr_agent
from backend.app.services.enrichment_agent import enrichment_agent
from backend.app.services.excel_agent import excel_agent
from backend.app.schemas import CompanyEnrichmentRequest, ExcelColumnMapping

router = APIRouter(prefix="/api/ingest", tags=["Ingestion Pipeline"])

@router.post("/card")
async def scan_business_card(
    file: UploadFile = File(...),
    event_id: str = Form(None),
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Ảnh danh thiếp không hợp lệ hoặc rỗng.")
    
    result = ocr_agent.process_card_image(
        db=db,
        image_bytes=contents,
        mime_type=file.content_type or "image/jpeg",
        tenant_id=tenant_id,
        event_id=event_id
    )
    return result

@router.post("/company")
def add_and_enrich_company(
    req: CompanyEnrichmentRequest,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    if not req.company_name:
        raise HTTPException(status_code=400, detail="Vui lòng nhập tên công ty.")
        
    result = enrichment_agent.enrich_company(
        db=db,
        company_name=req.company_name,
        domain=req.domain,
        tenant_id=tenant_id,
        save_to_db=True
    )
    return result

@router.post("/excel/preview")
async def preview_excel_file(
    file: UploadFile = File(...)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="File rỗng.")
        
    try:
        preview = excel_agent.preview_file(contents, file.filename)
        return preview
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Không thể đọc file Excel/CSV: {str(e)}")

@router.post("/excel/batch")
async def process_excel_batch(
    file: UploadFile = File(...),
    mapping_json: str = Form(...),
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    contents = await file.read()
    
    try:
        mapping_dict = json.loads(mapping_json)
        mapping = ExcelColumnMapping(**mapping_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cấu trúc mapping không hợp lệ: {str(e)}")

    try:
        stats = excel_agent.process_import(
            db=db,
            file_bytes=contents,
            filename=file.filename,
            mapping=mapping,
            tenant_id=tenant_id
        )
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý import: {str(e)}")
