import io
import csv
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models import Person, Company, Event

class GoogleSheetsService:
    def export_graph_to_csv(self, db: Session, tenant_id: str = "tenant-demo-hub") -> str:
        """Export standardized graph records to CSV string for Google Sheets import"""
        persons = db.query(Person).filter(Person.tenant_id == tenant_id).all()
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow([
            "Person ID", "Họ và Tên", "Chức danh", "Công ty", "Ngành nghề", 
            "Email", "Số điện thoại", "Nguồn dữ liệu", "Sự kiện đã tham gia", "Số lần tham dự"
        ])
        
        for p in persons:
            comp_name = p.affiliations[0].company.name if p.affiliations and p.affiliations[0].company else ""
            industry = p.affiliations[0].company.industry if p.affiliations and p.affiliations[0].company else ""
            events = [pt.event.name for pt in p.participations if pt.event]
            
            writer.writerow([
                p.id,
                p.full_name,
                p.title or "",
                comp_name,
                industry,
                p.email or "",
                p.phone or "",
                p.source_type,
                "; ".join(events),
                len(events)
            ])
            
        return output.getvalue()

google_sheets_service = GoogleSheetsService()
