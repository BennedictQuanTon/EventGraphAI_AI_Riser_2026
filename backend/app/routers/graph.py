from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.models import Person, Company, Event, Participation, Affiliation

router = APIRouter(prefix="/api/graph", tags=["Graph Visualization"])

@router.get("/topology")
def get_graph_topology(
    x_tenant_id: str = Header(None),
    db: Session = Depends(get_db)
):
    tenant_id = x_tenant_id or settings.DEFAULT_TENANT_ID
    
    persons = db.query(Person).filter(Person.tenant_id == tenant_id).all()
    companies = db.query(Company).filter(Company.tenant_id == tenant_id).all()
    events = db.query(Event).filter(Event.tenant_id == tenant_id).all()
    
    nodes = []
    links = []
    
    # 1. Event Nodes (Big Hubs)
    for ev in events:
        nodes.append({
            "id": ev.id,
            "label": ev.name,
            "type": "event",
            "subtitle": f"{ev.date} • {ev.location}",
            "details": {
                "date": ev.date,
                "location": ev.location,
                "type": ev.type,
                "participant_count": len(ev.participations)
            },
            "val": 25,
            "color": "#F59E0B"  # Amber/Orange for Events
        })
        
    # 2. Company Nodes (Medium Hubs)
    for comp in companies:
        nodes.append({
            "id": comp.id,
            "label": comp.name,
            "type": "company",
            "subtitle": comp.industry or "Doanh nghiệp",
            "details": {
                "domain": comp.domain,
                "industry": comp.industry,
                "size_range": comp.size_range,
                "description": comp.description,
                "member_count": len(comp.affiliations)
            },
            "val": 18,
            "color": "#3B82F6"  # Blue for Companies
        })
        
    # 3. Person Nodes
    for p in persons:
        primary_comp = p.affiliations[0].company.name if p.affiliations and p.affiliations[0].company else "Tự do"
        nodes.append({
            "id": p.id,
            "label": p.full_name,
            "type": "person",
            "subtitle": f"{p.title or 'Chuyên gia'} ({primary_comp})",
            "details": {
                "title": p.title,
                "email": p.email,
                "phone": p.phone,
                "source_type": p.source_type,
                "language": p.language_detected
            },
            "val": 10,
            "color": "#10B981"  # Emerald/Green for Persons
        })

    # 4. Affiliation Links (Person -> Company)
    affiliations = db.query(Affiliation).join(Person).filter(Person.tenant_id == tenant_id).all()
    for aff in affiliations:
        links.append({
            "source": aff.person_id,
            "target": aff.company_id,
            "label": aff.title or "Thuộc về",
            "type": "affiliation",
            "color": "#60A5FA"
        })

    # 5. Participation Links (Person -> Event)
    participations = db.query(Participation).join(Person).filter(Person.tenant_id == tenant_id).all()
    for part in participations:
        links.append({
            "source": part.person_id,
            "target": part.event_id,
            "label": f"Tham dự ({part.role})",
            "type": "participation",
            "color": "#FBBF24"
        })

    stats = {
        "total_nodes": len(nodes),
        "total_links": len(links),
        "total_persons": len(persons),
        "total_companies": len(companies),
        "total_events": len(events)
    }

    return {
        "nodes": nodes,
        "links": links,
        "stats": stats
    }
