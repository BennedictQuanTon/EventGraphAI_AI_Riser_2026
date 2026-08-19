import json
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models import Tenant, Person, Company, Event, Participation, Affiliation, ResolutionLog
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger("eventgraph.seed")

def seed_database(db: Session, tenant_id: str = "tenant-demo-hub"):
    """Seed comprehensive, realistic Vietnamese ecosystem dataset"""
    
    # Check if already seeded
    existing = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if existing:
        logger.info("Tenant already exists. Skipping seed.")
        return

    # 1. Tenant
    tenant = Tenant(id=tenant_id, name="Demo Innovation Hub (Vietnam)")
    db.add(tenant)
    db.flush()

    # 2. Events
    events_data = [
        {
            "id": "ev-ai-riser-2026",
            "name": "AI Riser Vietnam Demo Day 2026",
            "date": "2026-08-20",
            "location": "Trung tâm Đổi mới Sáng tạo Quốc gia (NIC), Hà Nội",
            "type": "demo_day"
        },
        {
            "id": "ev-tech-night-2026",
            "name": "Tech Networking Night Q2/2026",
            "date": "2026-06-15",
            "location": "The Loop Hub, Quận 1, TP. Hồ Chí Minh",
            "type": "networking"
        },
        {
            "id": "ev-danang-mixer-2025",
            "name": "Startup Mixer Đà Nẵng 2025",
            "date": "2025-11-10",
            "location": "Danang Innovation Park, Hải Châu, Đà Nẵng",
            "type": "summit"
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
            "industry": "Trí tuệ nhân tạo (AI & Big Data)",
            "size_range": "50-100 nhân viên",
            "description": "Nền tảng phát triển giải pháp AI đa phương thức và tự động hóa quy trình cho doanh nghiệp quy mô vừa và lớn.",
            "products": ["GenAI Enterprise Suite", "Vision Analytics"]
        },
        {
            "id": "c-vinfinty-pay",
            "name": "VinFintech Payments",
            "domain": "vinfinpay.com",
            "industry": "Công nghệ Tài chính (FinTech)",
            "size_range": "100-250 nhân viên",
            "description": "Cung cấp hạ tầng thanh toán số, giải pháp QR xuyên biên giới và cổng tài chính thông minh cho nhà bán lẻ.",
            "products": ["VinPay Gateway", "Smart POS Terminal"]
        },
        {
            "id": "c-edusmart",
            "name": "EduSmart Interactive",
            "domain": "edusmart.edu.vn",
            "industry": "Công nghệ Giáo dục (EdTech)",
            "size_range": "20-50 nhân viên",
            "description": "Nền tảng học tập thích ứng cá nhân hóa cho học sinh và đào tạo kỹ năng AI cho sinh viên đại học.",
            "products": ["EduSmart AI Tutor", "Virtual Classroom"]
        },
        {
            "id": "c-greenfuture",
            "name": "GreenFuture ESG Tech",
            "domain": "greenfuture.vn",
            "industry": "Công nghệ Xanh & ESG (GreenTech)",
            "size_range": "10-30 nhân viên",
            "description": "Phần mềm đo lường phát thải carbon tự động và quản trị báo cáo phát triển bền vững theo chuẩn quốc tế.",
            "products": ["CarbonTrack Pro", "ESG Compliance Dashboard"]
        },
        {
            "id": "c-dragon-vc",
            "name": "Dragon Venture Capital",
            "domain": "dragonvc.fund",
            "industry": "Quỹ Đầu tư Khởi nghiệp (Venture Capital)",
            "size_range": "15-30 nhân viên",
            "description": "Quỹ đầu tư mạo hiểm giai đoạn Seed và Series A tập trung vào DeepTech, AI và B2B SaaS tại Đông Nam Á.",
            "products": ["Dragon Seed Fund III", "Startup Growth Lab"]
        },
        {
            "id": "c-cyberguard",
            "name": "CyberGuard Security",
            "domain": "cyberguard.vn",
            "industry": "An ninh Mạng & Cloud (Cybersecurity)",
            "size_range": "30-80 nhân viên",
            "description": "Giải pháp bảo vệ dữ liệu đám mây và giám sát an toàn thông tin 24/7 ứng dụng máy học cảnh báo sớm.",
            "products": ["ThreatEye SOC", "Cloud Guardian"]
        },
        {
            "id": "c-agritrust",
            "name": "AgriTrust Blockchain",
            "domain": "agritrust.vn",
            "industry": "Nông nghiệp Công nghệ cao (AgriTech)",
            "size_range": "20-50 nhân viên",
            "description": "Hệ thống truy xuất nguồn gốc nông sản và hợp đồng thông minh cho chuỗi cung ứng xuất khẩu nông sản Việt.",
            "products": ["AgriOrigin Tag", "Supply Trace API"]
        },
        {
            "id": "c-innovate-hub",
            "name": "National Innovation Hub",
            "domain": "innovatehub.org.vn",
            "industry": "Vườn ươm & Hỗ trợ Khởi nghiệp",
            "size_range": "40-70 nhân viên",
            "description": "Không gian làm việc chung, tổ chức sự kiện quốc tế và vườn ươm tài năng công nghệ trẻ.",
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
            "headquarters": "Hà Nội / TP.HCM",
            "sources": [{"title": "Google AI Studio Verified Grounding", "url": f"https://{cd['domain']}"}]
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
            "full_name": "Nguyễn Thanh Sơn",
            "title": "Giám đốc Phát triển Kinh doanh (BD Director)",
            "company_id": "c-nextgen-ai",
            "email": "son.nguyen@nextgenai.vn",
            "phone": "0912 345 678",
            "events": [("ev-ai-riser-2026", "speaker"), ("ev-tech-night-2026", "attendee"), ("ev-danang-mixer-2025", "attendee")]
        },
        {
            "id": "p-2",
            "full_name": "Trần Thị Mai Anh",
            "title": "Chief Executive Officer (CEO & Co-founder)",
            "company_id": "c-vinfinty-pay",
            "email": "maianh.tran@vinfinpay.com",
            "phone": "0988 123 456",
            "events": [("ev-ai-riser-2026", "speaker"), ("ev-tech-night-2026", "speaker")]
        },
        {
            "id": "p-3",
            "full_name": "Lê Hoàng Quân",
            "title": "Senior AI Research Lead",
            "company_id": "c-nextgen-ai",
            "email": "quan.le@nextgenai.vn",
            "phone": "0903 888 999",
            "events": [("ev-ai-riser-2026", "speaker")]
        },
        {
            "id": "p-4",
            "full_name": "Phạm Minh Đức",
            "title": "Managing Partner / Investor",
            "company_id": "c-dragon-vc",
            "email": "duc.pham@dragonvc.fund",
            "phone": "0918 777 666",
            "events": [("ev-ai-riser-2026", "vip"), ("ev-tech-night-2026", "sponsor"), ("ev-danang-mixer-2025", "speaker")]
        },
        {
            "id": "p-5",
            "full_name": "Hoàng Bích Ngọc",
            "title": "Head of Product",
            "company_id": "c-edusmart",
            "email": "ngoc.hoang@edusmart.edu.vn",
            "phone": "0945 112 233",
            "events": [("ev-tech-night-2026", "attendee"), ("ev-danang-mixer-2025", "attendee")]
        },
        {
            "id": "p-6",
            "full_name": "Vũ Đăng Khoa",
            "title": "Founder & CTO",
            "company_id": "c-greenfuture",
            "email": "khoa.vu@greenfuture.vn",
            "phone": "0977 445 566",
            "events": [("ev-ai-riser-2026", "attendee")]
        },
        {
            "id": "p-7",
            "full_name": "Đỗ Thu Trang",
            "title": "Head of Partnership & Ecosystem",
            "company_id": "c-innovate-hub",
            "email": "trang.do@innovatehub.org.vn",
            "phone": "0933 654 321",
            "events": [("ev-ai-riser-2026", "organizer"), ("ev-tech-night-2026", "organizer"), ("ev-danang-mixer-2025", "organizer")]
        },
        {
            "id": "p-8",
            "full_name": "Bùi Quốc Hưng",
            "title": "VP of Engineering",
            "company_id": "c-cyberguard",
            "email": "hung.bui@cyberguard.vn",
            "phone": "0909 223 344",
            "events": [("ev-tech-night-2026", "attendee")]
        },
        {
            "id": "p-9",
            "full_name": "Nguyễn Hải Yến",
            "title": "Chief Financial Officer (CFO)",
            "company_id": "c-vinfinty-pay",
            "email": "yen.nguyen@vinfinpay.com",
            "phone": "0966 554 433",
            "events": [("ev-tech-night-2026", "attendee")]
        },
        {
            "id": "p-10",
            "full_name": "Đặng Tuấn Kiệt",
            "title": "Co-founder & Chief Architect",
            "company_id": "c-agritrust",
            "email": "kiet.dang@agritrust.vn",
            "phone": "0982 334 455",
            "events": [("ev-danang-mixer-2025", "speaker")]
        },
        {
            "id": "p-11",
            "full_name": "Lương Minh Tuấn",
            "title": "Investment Associate",
            "company_id": "c-dragon-vc",
            "email": "tuan.luong@dragonvc.fund",
            "phone": "0915 998 877",
            "events": [("ev-ai-riser-2026", "attendee"), ("ev-tech-night-2026", "attendee")]
        },
        {
            "id": "p-12",
            "full_name": "Võ Thị Quỳnh Như",
            "title": "AI Product Manager",
            "company_id": "c-nextgen-ai",
            "email": "nhu.vo@nextgenai.vn",
            "phone": "0938 121 212",
            "events": [("ev-ai-riser-2026", "attendee")]
        },
        {
            "id": "p-13",
            "full_name": "Hồ Gia Huy",
            "title": "Operations Director",
            "company_id": "c-edusmart",
            "email": "huy.ho@edusmart.edu.vn",
            "phone": "0971 789 789",
            "events": [("ev-danang-mixer-2025", "attendee")]
        },
        {
            "id": "p-14",
            "full_name": "Phan Cẩm Tú",
            "title": "Sustainability Consultant",
            "company_id": "c-greenfuture",
            "email": "tu.phan@greenfuture.vn",
            "phone": "0908 678 901",
            "events": [("ev-ai-riser-2026", "attendee")]
        },
        {
            "id": "p-15",
            "full_name": "Trịnh Công Hậu",
            "title": "Security Specialist",
            "company_id": "c-cyberguard",
            "email": "hau.trinh@cyberguard.vn",
            "phone": "0919 456 789",
            "events": [("ev-tech-night-2026", "attendee")]
        }
    ]

    for pd in persons_data:
        p = Person(
            id=pd["id"],
            full_name=pd["full_name"],
            title=pd["title"],
            email=pd["email"],
            phone=pd["phone"],
            source_type="excel_import",
            tenant_id=tenant_id,
            embedding_json=json.dumps(gemini_service.get_embedding(pd["full_name"]))
        )
        db.add(p)
        db.flush()

        # Affiliation
        if pd.get("company_id") and pd["company_id"] in companies_map:
            aff = Affiliation(
                person_id=p.id,
                company_id=pd["company_id"],
                title=pd["title"],
                is_current=True
            )
            db.add(aff)

        # Participations
        for ev_id, role in pd.get("events", []):
            if ev_id in events_map:
                part = Participation(
                    person_id=p.id,
                    event_id=ev_id,
                    role=role
                )
                db.add(part)

    # 5. Pre-populated Resolution Audit Logs (Demonstrating live Entity Resolution capability)
    resolution_logs_data = [
        {
            "entity_type": "person",
            "source_name": "NGUYEN THANH SON",
            "matched_candidate_id": "p-1",
            "matched_candidate_name": "Nguyễn Thanh Sơn",
            "similarity_score": 0.96,
            "matched_rule": "same_company_email_domain + high_name_similarity_92%",
            "decision": "auto_merged",
            "explanation": "[Tự động gộp] Tương đồng tên 92% và cùng miền email công ty [@nextgenai.vn]. Đã đồng bộ lịch sử tham gia.",
            "payload_data": json.dumps({"full_name": "NGUYEN THANH SON", "email": "son.nguyen@nextgenai.vn", "title": "BD Director", "source": "card_scan"})
        },
        {
            "entity_type": "person",
            "source_name": "Trần M. Anh",
            "matched_candidate_id": "p-2",
            "matched_candidate_name": "Trần Thị Mai Anh",
            "similarity_score": 0.78,
            "matched_rule": "same_company_email_domain + fuzzy_name_match",
            "decision": "pending",
            "explanation": "[Chờ duyệt] Phát hiện trùng lặp tiềm năng (78%) với CEO VinFintech Payments do cùng miền email @vinfinpay.com.",
            "payload_data": json.dumps({"full_name": "Trần M. Anh", "email": "maianh.tran@vinfinpay.com", "title": "CEO", "source": "excel_import"})
        },
        {
            "entity_type": "person",
            "source_name": "Đỗ Thu Trang",
            "matched_candidate_id": "p-7",
            "matched_candidate_name": "Đỗ Thu Trang",
            "similarity_score": 0.99,
            "matched_rule": "exact_email_match + exact_phone_match",
            "decision": "auto_merged",
            "explanation": "[Tự động gộp] Trùng khớp 100% email [trang.do@innovatehub.org.vn] và số điện thoại [0933 654 321].",
            "payload_data": json.dumps({"full_name": "Đỗ Thu Trang", "email": "trang.do@innovatehub.org.vn", "title": "Head of Partnership", "source": "excel_import"})
        }
    ]

    for rld in resolution_logs_data:
        r_log = ResolutionLog(
            entity_type=rld["entity_type"],
            source_name=rld["source_name"],
            matched_candidate_id=rld["matched_candidate_id"],
            matched_candidate_name=rld["matched_candidate_name"],
            similarity_score=rld["similarity_score"],
            matched_rule=rld["matched_rule"],
            decision=rld["decision"],
            explanation=rld["explanation"],
            payload_data=rld["payload_data"],
            tenant_id=tenant_id
        )
        db.add(r_log)

    db.commit()
    logger.info("Successfully seeded EventGraph database with realistic Vietnamese ecosystem data.")
