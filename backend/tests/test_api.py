import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_tenants():
    response = client.get("/api/auth/tenants")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "name" in data[0]

def test_api_entities_persons():
    response = client.get("/api/entities/persons")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10
    assert any(p["full_name"] == "Nguyễn Thanh Sơn" for p in data)

def test_api_entities_companies():
    response = client.get("/api/entities/companies")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(c["name"] == "NextGen AI Vietnam" for c in data)

def test_api_entities_events():
    response = client.get("/api/entities/events")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

def test_api_graph_topology():
    response = client.get("/api/graph/topology")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "links" in data
    assert len(data["nodes"]) > 10
    assert len(data["links"]) > 10

def test_api_resolution_queue():
    response = client.get("/api/resolution/queue")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_api_insight_agent():
    response = client.post("/api/insight/recommend-guests", json={
        "event_name": "AI Summit 2026",
        "target_industry": "AI",
        "topic": "Đổi mới sáng tạo",
        "max_recommendations": 3
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data["recommendations"]) > 0
    assert "relevance_score" in data["recommendations"][0]

def test_api_chat_assistant():
    response = client.post("/api/chat", json={
        "query": "Ai từng tham gia 2 sự kiện?"
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data["answer"]) > 10
    assert "entities_cited" in data
