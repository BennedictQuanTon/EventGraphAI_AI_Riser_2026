import json
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models import Tenant, Person, Company, Event, Participation, Affiliation, ResolutionLog
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger("eventgraph.seed")

def seed_database(db: Session, tenant_id: str = "tenant-demo-hub"):
    """Seed comprehensive, realistic enterprise ecosystem dataset"""
    
    # Check if already seeded
    existing = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if existing:
        logger.info("Tenant already exists. Skipping seed.")
        return

    # 1. Tenant
    tenant = Tenant(id=tenant_id, name="Enterprise Innovation Node 01")
    db.add(tenant)
    db.flush()

    # 2. Events
    events_data = [
        {
            "id": "ev-ai-riser-2026",
            "name": "AI Riser Vietnam Demo Day 2026",
            "date": "2026-08-20",
            "location": "National Innovation Center (NIC), Hanoi",
            "type": "demo_day"
        },
        {
            "id": "ev-tech-night-2026",
            "name": "Enterprise Tech Networking Night Q2/2026",
            "date": "2026-06-15",
            "location": "The Loop Hub, District 1, HCMC",
            "type": "networking"
        },
        {
            "id": "ev-danang-mixer-2025",
            "name": "Southeast Asia Startup Summit 2025",
            "date": "2025-11-10",
            "location": "Danang Innovation Park, Danang",
            "type": "summit"
        },
        {
            "id": "ev-fintech-expo-2026",
            "name": "Vietnam FinTech & Banking Expo 2026",
            "date": "2026-04-18",
            "location": "SECC Exhibition Center, District 7, HCMC",
            "type": "conference"
        },
        {
            "id": "ev-cloud-summit-2026",
            "name": "Google Cloud & AI Developer Fest 2026",
            "date": "2026-07-22",
            "location": "JW Marriott Convention Center, Hanoi",
            "type": "developer_fest"
        }
    ]

    events_map = {}
    for ed in events_data:
        ev = Event(
            id=ed["id"],
            name=ed["name"],
            date=ed["date"],
            location=ed["location"],
            type=ed["type"],
            tenant_id=tenant_id
        )
        db.add(ev)
        events_map[ed["id"]] = ev
    db.flush()

    # 3. Companies
    companies_data = [
        {
            "id": "c-nextgen-ai",
            "name": "NextGen AI Vietnam",
            "domain": "nextgenai.vn",
            "industry": "Artificial Intelligence & Analytics",
            "size_range": "50-100 employees",
            "description": "Enterprise multimodal AI platform and automated document intelligence for Tier-1 institutions.",
            "products": ["GenAI Enterprise Suite", "Vision Analytics"]
        },
        {
            "id": "c-vinfinty-pay",
            "name": "VinFintech Payments",
            "domain": "vinfinpay.com",
            "industry": "Financial Technology (FinTech)",
            "size_range": "100-250 employees",
            "description": "Cross-border digital payment gateway and smart POS financial infrastructure for omnichannel retail.",
            "products": ["VinPay Gateway", "Smart POS Terminal"]
        },
        {
            "id": "c-dragon-vc",
            "name": "Dragon Venture Capital",
            "domain": "dragonvc.fund",
            "industry": "Venture Capital & Private Equity",
            "size_range": "15-30 investment partners",
            "description": "Early-stage DeepTech and B2B SaaS venture fund investing across Southeast Asia.",
            "products": ["Dragon Seed Fund III", "Startup Growth Lab"]
        },
        {
            "id": "c-cyberguard",
            "name": "CyberGuard Security",
            "domain": "cyberguard.vn",
            "industry": "Cloud & Cybersecurity",
            "size_range": "30-80 engineers",
            "description": "24/7 AI-driven Security Operations Center (SOC) and proactive cloud threat detection platform.",
            "products": ["ThreatEye SOC", "Cloud Guardian"]
        },
        {
            "id": "c-greenfuture",
            "name": "GreenFuture ESG Tech",
            "domain": "greenfuture.vn",
            "industry": "Climate & ESG Technology",
            "size_range": "20-50 employees",
            "description": "Automated greenhouse gas accounting and sustainability disclosure software aligned with global standards.",
            "products": ["CarbonTrack Pro", "ESG Compliance Dashboard"]
        },
        {
            "id": "c-edusmart",
            "name": "EduSmart Interactive",
            "domain": "edusmart.edu.vn",
            "industry": "Educational Technology (EdTech)",
            "size_range": "30-60 employees",
            "description": "Personalized adaptive learning algorithms and AI upskilling curricula for higher education.",
            "products": ["EduSmart AI Tutor", "Virtual Classroom"]
        },
        {
            "id": "c-nexus-sg",
            "name": "Nexus Ventures Singapore",
            "domain": "nexusventures.sg",
            "industry": "Global Venture Capital",
            "size_range": "20-40 partners",
            "description": "Global institutional tech fund accelerating cross-border expansion for SEA tech leaders.",
            "products": ["SEA Horizon Fund", "Founder Syndicate"]
        },
        {
            "id": "c-innovate-hub",
            "name": "National Innovation Hub",
            "domain": "innovatehub.org.vn",
            "industry": "Incubator & Innovation Center",
            "size_range": "40-70 staff",
            "description": "State-of-the-art incubation accelerator, B2B commercialization support, and ecosystem facility.",
            "products": ["Incubation Accelerator", "Coworking Pass"]
        }
    ]

    companies_map = {}
    for cd in companies_data:
        enrichment = {
            "name": cd["name"],
            "domain": cd["domain"],
            "industry": cd["industry"],
            "size_range": cd["size_range"],
            "description": cd["description"],
            "key_products": cd["products"],
            "headquarters": "Hanoi / HCMC / Singapore",
            "sources": [{"title": "Google AI Studio Grounding", "url": f"https://{cd['domain']}"}]
        }
        comp = Company(
            id=cd["id"],
            name=cd["name"],
            domain=cd["domain"],
            industry=cd["industry"],
            size_range=cd["size_range"],
            description=cd["description"],
            enrichment_data=json.dumps(enrichment, ensure_ascii=False),
            tenant_id=tenant_id,
            embedding_json=json.dumps(gemini_service.get_embedding(cd["name"]))
        )
        db.add(comp)
        companies_map[cd["id"]] = comp
    db.flush()

    # 4. Persons & Affiliations & Participations
    persons_data = [
        {
            "id": "p-1",
            "full_name": "Nguyen Thanh Son",
            "title": "Director of Business Development",
            "company_id": "c-nextgen-ai",
            "email": "son.nguyen@nextgenai.vn",
            "phone": "+84 912 345 678",
            "events": [("ev-ai-riser-2026", "speaker"), ("ev-tech-night-2026", "attendee"), ("ev-cloud-summit-2026", "speaker")]
        },
        {
            "id": "p-2",
            "full_name": "Tran Thi Mai Anh",
            "title": "Chief Executive Officer (CEO)",
            "company_id": "c-vinfinty-pay",
            "email": "maianh.tran@vinfinpay.com",
            "phone": "+84 988 123 456",
            "events": [("ev-ai-riser-2026", "speaker"), ("ev-fintech-expo-2026", "keynote"), ("ev-tech-night-2026", "speaker")]
        },
        {
            "id": "p-3",
            "full_name": "Le Hoang Quan",
            "title": "Senior AI Research Lead",
            "company_id": "c-nextgen-ai",
            "email": "quan.le@nextgenai.vn",
            "phone": "+84 903 888 999",
            "events": [("ev-ai-riser-2026", "speaker"), ("ev-cloud-summit-2026", "speaker")]
        },
        {
            "id": "p-4",
            "full_name": "Pham Minh Duc",
            "title": "Managing Partner & Investor",
            "company_id": "c-dragon-vc",
            "email": "duc.pham@dragonvc.fund",
            "phone": "+84 918 777 666",
            "events": [("ev-ai-riser-2026", "vip"), ("ev-tech-night-2026", "sponsor"), ("ev-danang-mixer-2025", "speaker")]
        },
        {
            "id": "p-5",
            "full_name": "Alex Chen",
            "title": "General Partner",
            "company_id": "c-nexus-sg",
            "email": "alex.chen@nexusventures.sg",
            "phone": "+65 8123 4567",
            "events": [("ev-ai-riser-2026", "vip"), ("ev-danang-mixer-2025", "investor")]
        },
        {
            "id": "p-6",
            "full_name": "Hoang Bich Ngoc",
            "title": "VP of Product",
            "company_id": "c-edusmart",
            "email": "ngoc.hoang@edusmart.edu.vn",
            "phone": "+84 945 112 233",
            "events": [("ev-tech-night-2026", "attendee"), ("ev-danang-mixer-2025", "attendee")]
        },
        {
            "id": "p-7",
            "full_name": "Vu Dang Khoa",
            "title": "Co-founder & CTO",
            "company_id": "c-greenfuture",
            "email": "khoa.vu@greenfuture.vn",
            "phone": "+84 977 445 566",
            "events": [("ev-ai-riser-2026", "attendee"), ("ev-cloud-summit-2026", "attendee")]
        },
        {
            "id": "p-8",
            "full_name": "Do Thu Trang",
            "title": "Head of Strategic Partnerships",
            "company_id": "c-innovate-hub",
            "email": "trang.do@innovatehub.org.vn",
            "phone": "+84 933 654 321",
            "events": [("ev-ai-riser-2026", "organizer"), ("ev-tech-night-2026", "organizer"), ("ev-danang-mixer-2025", "organizer")]
        },
        {
            "id": "p-9",
            "full_name": "Bui Quoc Hung",
            "title": "VP of Security Engineering",
            "company_id": "c-cyberguard",
            "email": "hung.bui@cyberguard.vn",
            "phone": "+84 909 223 344",
            "events": [("ev-tech-night-2026", "attendee"), ("ev-cloud-summit-2026", "panelist")]
        },
        {
            "id": "p-10",
            "full_name": "Nguyen Hai Yen",
            "title": "Chief Financial Officer (CFO)",
            "company_id": "c-vinfinty-pay",
            "email": "yen.nguyen@vinfinpay.com",
            "phone": "+84 966 554 433",
            "events": [("ev-fintech-expo-2026", "panelist")]
        }
    ]

    for pd in persons_data:
        p = Person(
            id=pd["id"],
            full_name=pd["full_name"],
            title=pd["title"],
            email=pd["email"],
            phone=pd["phone"],
            tenant_id=tenant_id,
            embedding_json=json.dumps(gemini_service.get_embedding(f"{pd['full_name']} {pd['title']}"))
        )
        db.add(p)
        db.flush()

        # Affiliation
        aff = Affiliation(
            person_id=p.id,
            company_id=pd["company_id"],
            title=pd["title"],
            is_current=True
        )
        db.add(aff)

        # Participations
        for ev_id, role in pd["events"]:
            part = Participation(
                person_id=p.id,
                event_id=ev_id,
                role=role
            )
            db.add(part)

    # 5. Resolution Logs (Audit Trail & Pending Queue)
    res_logs = [
        {
            "id": "res-demo-1",
            "source_type": "card_ocr",
            "source_name": "TechViet Solutions Ltd",
            "entity_type": "company",
            "matched_candidate_id": "c-nextgen-ai",
            "matched_candidate_name": "NextGen AI Vietnam",
            "similarity_score": 0.92,
            "matched_rule": "Corporate Email Domain & Token Alignment",
            "decision": "pending",
            "explanation": "Matching domain 'nextgenai.vn' with 92% semantic cosine similarity between extracted organization entities.",
            "payload_data": {
                "external_id": "EXT-992-CRM",
                "domain": "nextgenai.vn",
                "address": "Floor 12, Keangnam Landmark 72, Hanoi",
                "rep": "Nguyen Thanh Son",
                "industry": "Artificial Intelligence & Analytics"
            }
        },
        {
            "id": "res-demo-2",
            "source_type": "excel_import",
            "source_name": "Son Nguyen Thanh (Son NT)",
            "entity_type": "person",
            "matched_candidate_id": "p-1",
            "matched_candidate_name": "Nguyen Thanh Son",
            "similarity_score": 0.96,
            "matched_rule": "Fuzzy Name Permutation & Phone Hash Match",
            "decision": "pending",
            "explanation": "High Jaro-Winkler string similarity (0.96) and exact match on mobile contact (+84 912 345 678).",
            "payload_data": {
                "external_id": "CSV-ROW-104",
                "title": "BD Director",
                "email": "son.nguyen@nextgenai.vn",
                "phone": "+84 912 345 678",
                "rep": "Nguyen Thanh Son",
                "domain": "nextgenai.vn"
            }
        },
        {
            "id": "res-demo-3",
            "source_type": "web_lead",
            "source_name": "VinFin Payments JSC",
            "entity_type": "company",
            "matched_candidate_id": "c-vinfinty-pay",
            "matched_candidate_name": "VinFintech Payments",
            "similarity_score": 0.94,
            "matched_rule": "Domain & Legal Name Suffix Rule",
            "decision": "auto_merged",
            "explanation": "Exact domain match 'vinfinpay.com' with stripped legal suffix 'JSC'.",
            "payload_data": {"domain": "vinfinpay.com"}
        },
        {
            "id": "res-demo-4",
            "source_type": "event_checkin",
            "source_name": "Mai Anh Tran (VinPay)",
            "entity_type": "person",
            "matched_candidate_id": "p-2",
            "matched_candidate_name": "Tran Thi Mai Anh",
            "similarity_score": 0.95,
            "matched_rule": "Email & Organization Match",
            "decision": "merged",
            "explanation": "Corporate email match 'maianh.tran@vinfinpay.com' confirmed by operator.",
            "payload_data": {"email": "maianh.tran@vinfinpay.com"}
        },
        {
            "id": "res-demo-5",
            "source_type": "card_ocr",
            "source_name": "Arthur Vance Advisory",
            "entity_type": "company",
            "matched_candidate_id": None,
            "matched_candidate_name": None,
            "similarity_score": 0.38,
            "matched_rule": "Novel Entity Isolation Rule",
            "decision": "split",
            "explanation": "No existing candidate exceeded threshold (score 0.38 < 0.60). Isolated as distinct entity.",
            "payload_data": {"name": "Arthur Vance Advisory"}
        }
    ]

    for rl in res_logs:
        log_obj = ResolutionLog(
            id=rl["id"],
            tenant_id=tenant_id,
            source_name=rl["source_name"],
            entity_type=rl["entity_type"],
            matched_candidate_id=rl["matched_candidate_id"],
            matched_candidate_name=rl["matched_candidate_name"],
            similarity_score=rl["similarity_score"],
            matched_rule=rl["matched_rule"],
            decision=rl["decision"],
            explanation=rl["explanation"],
            payload_data=json.dumps(rl["payload_data"], ensure_ascii=False)
        )
        db.add(log_obj)

    db.commit()
    logger.info("Successfully seeded high-density enterprise ecosystem data.")
