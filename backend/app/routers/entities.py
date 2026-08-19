import json
from typing import Optional, List
from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models import Person, Company, Event, Participation, Affiliation
from backend.app.schemas import EventCreate

router = APIRouter(prefix="/api/entities", tags=["Entities Directory"])

@router.get("/persons")
def list_persons(
    search: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
    event_id: Optional[str] = Query(None),
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    query = db.query(Person).filter(Person.tenant_id == tenant_id)
    
    if search:
        s = f"%{search.strip()}%"
        query = query.filter((Person.full_name.ilike(s)) | (Person.email.ilike(s)) | (Person.title.ilike(s)))
        
    if event_id:
        query = query.join(Participation).filter(Participation.event_id == event_id)
        
    persons = query.order_by(Person.created_at.desc()).all()
    
    results = []
    for p in persons:
        affiliations = [
            {
                "company_id": aff.company.id,
                "company_name": aff.company.name,
                "industry": aff.company.industry,
                "title": aff.title,
                "is_current": aff.is_current
            }
            for aff in p.affiliations if aff.company
        ]
        
        events = [
            {
                "event_id": pt.event.id,
                "event_name": pt.event.name,
                "event_date": pt.event.date,
                "role": pt.role
            }
            for pt in p.participations if pt.event
        ]
        
        results.append({
            "id": p.id,
            "full_name": p.full_name,
            "title": p.title,
            "phone": p.phone,
            "email": p.email,
            "language_detected": p.language_detected,
            "source_type": p.source_type,
            "companies": affiliations,
            "events": events,
            "created_at": p.created_at
        })
        
    return results

@router.get("/persons/{person_id}")
def get_person_detail(
    person_id: str,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    p = db.query(Person).filter(Person.id == person_id, Person.tenant_id == tenant_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin nhân sự.")
        
    affiliations = [
        {
            "company_id": aff.company.id,
            "company_name": aff.company.name,
            "industry": aff.company.industry,
            "domain": aff.company.domain,
            "title": aff.title,
            "is_current": aff.is_current
        }
        for aff in p.affiliations if aff.company
    ]
    
    events = [
        {
            "event_id": pt.event.id,
            "event_name": pt.event.name,
            "event_date": pt.event.date,
            "location": pt.event.location,
            "role": pt.role
        }
        for pt in p.participations if pt.event
    ]
    
    return {
        "id": p.id,
        "full_name": p.full_name,
        "title": p.title,
        "phone": p.phone,
        "email": p.email,
        "language_detected": p.language_detected,
        "source_type": p.source_type,
        "companies": affiliations,
        "events": events,
        "created_at": p.created_at,
        "updated_at": p.updated_at
    }

@router.get("/companies")
def list_companies(
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    query = db.query(Company).filter(Company.tenant_id == tenant_id)
    
    if search:
        s = f"%{search.strip()}%"
        query = query.filter((Company.name.ilike(s)) | (Company.domain.ilike(s)) | (Company.description.ilike(s)))
        
    if industry:
        query = query.filter(Company.industry.ilike(f"%{industry.strip()}%"))
        
    companies = query.order_by(Company.name.asc()).all()
    
    results = []
    for c in companies:
        enrichment = {}
        if c.enrichment_data:
            try:
                enrichment = json.loads(c.enrichment_data)
            except Exception:
                pass
                
        member_count = len(c.affiliations)
        
        results.append({
            "id": c.id,
            "name": c.name,
            "domain": c.domain,
            "industry": c.industry,
            "size_range": c.size_range,
            "description": c.description,
            "member_count": member_count,
            "enrichment_details": enrichment,
            "created_at": c.created_at
        })
        
    return results

@router.get("/companies/{company_id}")
def get_company_detail(
    company_id: str,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    c = db.query(Company).filter(Company.id == company_id, Company.tenant_id == tenant_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Không tìm thấy doanh nghiệp.")
        
    enrichment = {}
    if c.enrichment_data:
        try:
            enrichment = json.loads(c.enrichment_data)
        except Exception:
            pass
            
    members = [
        {
            "person_id": aff.person.id,
            "full_name": aff.person.full_name,
            "title": aff.title or aff.person.title,
            "email": aff.person.email,
            "phone": aff.person.phone
        }
        for aff in c.affiliations if aff.person
    ]
    
    return {
        "id": c.id,
        "name": c.name,
        "domain": c.domain,
        "industry": c.industry,
        "size_range": c.size_range,
        "description": c.description,
        "members": members,
        "enrichment_details": enrichment,
        "created_at": c.created_at
    }

@router.get("/events")
def list_events(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    events = db.query(Event).filter(Event.tenant_id == tenant_id).order_by(Event.date.desc()).all()
    
    results = []
    for ev in events:
        results.append({
            "id": ev.id,
            "name": ev.name,
            "date": ev.date,
            "location": ev.location,
            "type": ev.type,
            "participant_count": len(ev.participations),
            "created_at": ev.created_at
        })
    return results

@router.get("/events/{event_id}")
def get_event_detail(
    event_id: str,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    ev = db.query(Event).filter(Event.id == event_id, Event.tenant_id == tenant_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện.")
        
    participants = []
    for pt in ev.participations:
        if pt.person:
            comp_name = pt.person.affiliations[0].company.name if pt.person.affiliations and pt.person.affiliations[0].company else "Tự do"
            participants.append({
                "person_id": pt.person.id,
                "full_name": pt.person.full_name,
                "title": pt.person.title,
                "company": comp_name,
                "role": pt.role,
                "email": pt.person.email
            })
            
    return {
        "id": ev.id,
        "name": ev.name,
        "date": ev.date,
        "location": ev.location,
        "type": ev.type,
        "participant_count": len(participants),
        "participants": participants,
        "created_at": ev.created_at
    }

@router.post("/events")
def create_event(
    ev_data: EventCreate,
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    ev = Event(
        name=ev_data.name,
        date=ev_data.date,
        location=ev_data.location,
        type=ev_data.type,
        tenant_id=tenant_id
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev
