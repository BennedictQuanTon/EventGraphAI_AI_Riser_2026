from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Base & Shared
class TenantBase(BaseModel):
    name: str

class TenantResponse(TenantBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Person
class PersonBase(BaseModel):
    full_name: str
    title: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    language_detected: Optional[str] = "vi"
    source_type: Optional[str] = "card_scan"
    source_ref_id: Optional[str] = None

class PersonCreate(PersonBase):
    company_name: Optional[str] = None
    event_id: Optional[str] = None
    role: Optional[str] = "attendee"

class PersonResponse(PersonBase):
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    companies: Optional[List[Dict[str, Any]]] = []
    events: Optional[List[Dict[str, Any]]] = []
    class Config:
        from_attributes = True

# Company
class CompanyBase(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size_range: Optional[str] = None
    description: Optional[str] = None
    enrichment_data: Optional[str] = None

class CompanyCreate(CompanyBase):
    auto_enrich: Optional[bool] = True

class CompanyResponse(CompanyBase):
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    enrichment_details: Optional[Dict[str, Any]] = None
    members: Optional[List[Dict[str, Any]]] = []
    class Config:
        from_attributes = True

# Event
class EventBase(BaseModel):
    name: str
    date: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = "conference"
    raw_source_file_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str
    tenant_id: str
    created_at: datetime
    participant_count: Optional[int] = 0
    participants: Optional[List[Dict[str, Any]]] = []
    class Config:
        from_attributes = True

# Resolution Log
class ResolutionLogResponse(BaseModel):
    id: str
    entity_type: str
    source_name: str
    matched_candidate_id: Optional[str] = None
    matched_candidate_name: Optional[str] = None
    similarity_score: float
    matched_rule: Optional[str] = None
    decision: str
    explanation: Optional[str] = None
    payload_data: Optional[str] = None
    tenant_id: str
    created_at: datetime
    class Config:
        from_attributes = True

class ResolutionDecisionRequest(BaseModel):
    decision: str  # "merge" or "create_new" or "reject"
    merge_into_id: Optional[str] = None

# Ingestion Requests & Responses
class CardScanResponse(BaseModel):
    success: bool
    raw_text: Optional[str] = None
    extracted_data: Dict[str, Any]
    language: str
    resolution_status: str  # "auto_merged", "pending_review", "created_new"
    resolution_log: Optional[Dict[str, Any]] = None
    person: Optional[Dict[str, Any]] = None
    company: Optional[Dict[str, Any]] = None

class CompanyEnrichmentRequest(BaseModel):
    company_name: str
    domain: Optional[str] = None

class CompanyEnrichmentResponse(BaseModel):
    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size_range: Optional[str] = None
    description: Optional[str] = None
    headquarters: Optional[str] = None
    founded_year: Optional[str] = None
    key_products: Optional[List[str]] = []
    sources: Optional[List[Dict[str, str]]] = []
    confidence_score: float = 0.95

class ExcelColumnMapping(BaseModel):
    full_name_col: str
    title_col: Optional[str] = None
    company_col: Optional[str] = None
    email_col: Optional[str] = None
    phone_col: Optional[str] = None
    role_col: Optional[str] = None
    event_name: str
    event_date: Optional[str] = None
    event_location: Optional[str] = None

class ExcelBatchImportResponse(BaseModel):
    total_rows: int
    processed_rows: int
    new_persons: int
    new_companies: int
    auto_merged: int
    pending_reviews: int
    event_id: str
    event_name: str

# Graph Topology
class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "person", "company", "event"
    subtitle: Optional[str] = None
    details: Optional[Dict[str, Any]] = {}

class GraphLink(BaseModel):
    source: str
    target: str
    label: str  # "affiliated_with", "participated_in", "referred_by"
    type: str

class GraphDataResponse(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]
    stats: Dict[str, int]

# Insight & Recommendation
class InsightRequest(BaseModel):
    event_name: str
    event_type: Optional[str] = "networking"
    target_industry: Optional[str] = None
    topic: Optional[str] = None
    max_recommendations: int = 5

class GuestRecommendation(BaseModel):
    person_id: str
    full_name: str
    title: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    relevance_score: float
    reasons: List[str]
    past_events: List[str]

class InsightResponse(BaseModel):
    event_name: str
    summary_analysis: str
    recommendations: List[GuestRecommendation]

# Chat Assistant
class ChatMessage(BaseModel):
    role: str  # "user", "assistant"
    content: str

class ChatRequest(BaseModel):
    query: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str
    entities_cited: List[Dict[str, str]]
    sql_executed: Optional[str] = None
    graph_context_count: int

# User Feedback for Gold Tier Proof
class FeedbackCreate(BaseModel):
    name: str
    email: Optional[str] = None
    role: Optional[str] = None
    rating: int = Field(5, ge=1, le=5)
    comment: Optional[str] = None
