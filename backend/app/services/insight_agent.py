import json
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models import Person, Company, Event, Participation, Affiliation
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger("eventgraph.insight_agent")

class InsightAgent:
    def recommend_guests(
        self, 
        db: Session, 
        event_name: str, 
        event_type: str = "networking",
        target_industry: str = None, 
        topic: str = None, 
        max_recommendations: int = 5,
        tenant_id: str = "tenant-demo-hub"
    ) -> Dict[str, Any]:
        """Analyze graph connections to recommend targeted guests for upcoming events"""
        
        # 1. Fetch graph context
        persons = db.query(Person).filter(Person.tenant_id == tenant_id).all()
        if not persons:
            return {
                "event_name": event_name,
                "summary_analysis": "Chưa có đủ dữ liệu người tham dự trong hệ sinh thái để phân tích đồ thị.",
                "recommendations": []
            }

        person_profiles = []
        for p in persons:
            # Companies
            companies = [
                {"name": aff.company.name, "industry": aff.company.industry or "Chưa phân loại"}
                for aff in p.affiliations if aff.company
            ]
            primary_comp = companies[0]["name"] if companies else "Độc lập"
            primary_ind = companies[0]["industry"] if companies else "Chưa phân loại"

            # Past events
            events_attended = [part.event.name for part in p.participations if part.event]
            roles = [part.role for part in p.participations]

            person_profiles.append({
                "id": p.id,
                "name": p.full_name,
                "title": p.title or "Chuyên gia",
                "company": primary_comp,
                "industry": primary_ind,
                "events_count": len(events_attended),
                "past_events": events_attended,
                "roles": roles
            })

        # 2. Score candidates based on relevance
        scored = []
        for p in person_profiles:
            score = 0.50
            reasons = []

            # Industry alignment
            if target_industry and (target_industry.lower() in p["industry"].lower() or p["industry"].lower() in target_industry.lower()):
                score += 0.30
                reasons.append(f"Hoạt động trong đúng lĩnh vực mục tiêu: {p['industry']}")

            # Topic matching
            if topic and (topic.lower() in p["title"].lower() or topic.lower() in p["industry"].lower()):
                score += 0.20
                reasons.append(f"Kinh nghiệm chuyên môn phù hợp với chủ đề '{topic}'")

            # Active networker
            if p["events_count"] >= 2:
                score += 0.15
                reasons.append(f"Thành viên tích cực tham gia {p['events_count']} sự kiện trước đây ({', '.join(p['past_events'][:2])})")
            elif p["events_count"] == 1:
                reasons.append(f"Đã tham dự sự kiện '{p['past_events'][0]}'")

            # Role VIP bonus
            if any(r in ["speaker", "sponsor", "vip"] for r in p["roles"]):
                score += 0.10
                reasons.append("Từng đóng vai trò Diễn giả / Đối tác tài trợ VIP")

            scored.append({
                "person_id": p["id"],
                "full_name": p["name"],
                "title": p["title"],
                "company_name": p["company"],
                "industry": p["industry"],
                "relevance_score": min(0.99, round(score, 2)),
                "reasons": reasons or ["Có tiềm năng kết nối mới trong mạng lưới hệ sinh thái"],
                "past_events": p["past_events"]
            })

        # Sort descending by score
        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        top_recs = scored[:max_recommendations]

        summary = f"Insight Agent đã phân tích {len(persons)} hồ sơ đối tác trong đồ thị quan hệ. Dựa trên tính chất sự kiện '{event_name}' ({event_type}), hệ thống đề xuất top {len(top_recs)} khách mời có độ tương thích cao nhất về chuyên môn, lịch sử tham gia và tiềm năng networking liên ngành."

        return {
            "event_name": event_name,
            "summary_analysis": summary,
            "recommendations": top_recs
        }

insight_agent = InsightAgent()
