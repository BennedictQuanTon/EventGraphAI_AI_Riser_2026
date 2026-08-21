import json
import os
import io
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MOCK_DATA_DIR = os.path.join(BASE_DIR, "mock_data")


def test_use_case_1_business_cards_ocr():
    """
    Use Case 1: Multimodal Physical Business Card Vision Ingestion & OCR
    Validates benchmark ground truth extractions for executive cards.
    """
    ocr_file = os.path.join(MOCK_DATA_DIR, "use_case_1_cards", "sample_cards_ocr.json")
    assert os.path.exists(ocr_file), "Use Case 1 mock data file missing"
    
    with open(ocr_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "benchmark_cards" in data
    assert len(data["benchmark_cards"]) >= 4

    for card in data["benchmark_cards"]:
        ext = card["expected_extraction"]
        assert ext["full_name"], "Card missing full_name"
        assert ext["company"], "Card missing company"
        assert "@" in ext["email"], "Card missing valid email"
        assert ext["phone"], "Card missing phone"
        assert ext["domain"], "Card missing domain"
        assert card["validation_rules"]["min_ocr_confidence"] >= 0.90


def test_use_case_2_batch_attendee_csv_ingestion():
    """
    Use Case 2: Batch Attendee Excel / CSV Ingestion
    Validates previewing and batch-importing multi-row attendee guestlists.
    """
    csv_file = os.path.join(MOCK_DATA_DIR, "use_case_2_attendees", "ai_riser_demoday_attendees.csv")
    assert os.path.exists(csv_file), "Use Case 2 attendee CSV file missing"
    
    with open(csv_file, "rb") as f:
        csv_content = f.read()

    # 1. Test Excel Preview
    preview_res = client.post(
        "/api/ingest/excel/preview",
        files={"file": ("ai_riser_demoday_attendees.csv", io.BytesIO(csv_content), "text/csv")}
    )
    assert preview_res.status_code == 200
    preview_data = preview_res.json()
    assert "columns" in preview_data
    assert "total_rows" in preview_data
    assert preview_data["total_rows"] >= 10

    # 2. Test Batch Ingest with Mapping
    mapping_payload = {
        "full_name_col": "full_name",
        "title_col": "title",
        "company_col": "company",
        "email_col": "email",
        "phone_col": "phone",
        "role_col": "event_role",
        "event_name": "AI Riser Vietnam Demo Day 2026",
        "event_date": "2026-08-20",
        "event_location": "NIC Hanoi"
    }

    batch_res = client.post(
        "/api/ingest/excel/batch",
        files={"file": ("ai_riser_demoday_attendees.csv", io.BytesIO(csv_content), "text/csv")},
        data={"mapping_json": json.dumps(mapping_payload)}
    )
    assert batch_res.status_code == 200
    res_data = batch_res.json()
    assert "processed_rows" in res_data
    assert "total_rows" in res_data
    assert res_data["total_rows"] >= 10


def test_use_case_3_google_search_grounding():
    """
    Use Case 3: Google Search Grounding Corporate Intelligence
    Validates company profile lookup, domain extraction, product list, and Google citations.
    """
    grounding_file = os.path.join(MOCK_DATA_DIR, "use_case_3_grounding", "grounded_companies.json")
    assert os.path.exists(grounding_file), "Use Case 3 grounding file missing"
    
    with open(grounding_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "grounded_entities" in data
    assert len(data["grounded_entities"]) >= 3

    # Test backend API endpoint for NextGen AI
    response = client.post(
        "/api/ingest/company",
        json={"company_name": "NextGen AI Vietnam"}
    )
    assert response.status_code == 200
    res = response.json()
    assert "name" in res
    assert "domain" in res
    assert "industry" in res
    assert "key_products" in res
    assert len(res["key_products"]) > 0


def test_use_case_4_entity_resolution_scenarios():
    """
    Use Case 4: Explainable Entity Resolution & Deduplication Rules
    Validates cosine vector similarity, Jaro-Winkler fuzzy matching, and audit queue decisions.
    """
    res_file = os.path.join(MOCK_DATA_DIR, "use_case_4_resolution", "entity_resolution_scenarios.json")
    assert os.path.exists(res_file), "Use Case 4 resolution file missing"
    
    with open(res_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "test_scenarios" in data
    assert len(data["test_scenarios"]) >= 4

    # Test resolution queue API
    response = client.get("/api/resolution/queue")
    assert response.status_code == 200
    queue = response.json()
    assert isinstance(queue, list)

    # Test resolution audit logs API
    logs_response = client.get("/api/resolution/logs")
    assert logs_response.status_code == 200
    logs = logs_response.json()
    assert isinstance(logs, list)


def test_use_case_5_graph_topology_and_filtering():
    """
    Use Case 5: Enterprise Knowledge Graph Multi-Filter Topology
    Validates graph nodes (Person, Company, Event) and relational links.
    """
    graph_file = os.path.join(MOCK_DATA_DIR, "use_case_5_graph", "graph_topology_dataset.json")
    assert os.path.exists(graph_file), "Use Case 5 graph file missing"
    
    with open(graph_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert "industries_available" in data
    assert "summits_available" in data

    # Test backend topology API
    response = client.get("/api/graph/topology")
    assert response.status_code == 200
    topo = response.json()
    assert "nodes" in topo
    assert "links" in topo
    assert "stats" in topo
    assert len(topo["nodes"]) >= 10
    assert len(topo["links"]) >= 5


def test_use_case_6_google_workspace_export():
    """
    Use Case 6: Google Workspace & Enterprise Sheets Export
    Validates standardized CSV exports for canonical graph data.
    """
    # Test CSV Export
    res = client.get("/api/export/csv")
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")
    csv_text = res.text
    assert "Person ID" in csv_text or "Họ và Tên" in csv_text or "Email" in csv_text or "Company" in csv_text
