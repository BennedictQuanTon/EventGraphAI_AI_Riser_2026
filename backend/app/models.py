import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Person(Base):
    __tablename__ = "persons"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    full_name = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    phone = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    language_detected = Column(String(50), default="vi")
    source_type = Column(String(50), default="card_scan")  # card_scan, manual_new_biz, excel_import
    source_ref_id = Column(String(255), nullable=True)
    tenant_id = Column(String(64), nullable=False, default="tenant-demo-hub", index=True)
    embedding_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    participations = relationship("Participation", back_populates="person", cascade="all, delete-orphan")
    affiliations = relationship("Affiliation", back_populates="person", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    domain = Column(String(255), nullable=True, index=True)
    industry = Column(String(255), nullable=True)
    size_range = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    enrichment_data = Column(Text, nullable=True)  # JSON string with citations & fields
    tenant_id = Column(String(64), nullable=False, default="tenant-demo-hub", index=True)
    embedding_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    affiliations = relationship("Affiliation", back_populates="company", cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    date = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    type = Column(String(100), default="conference")
    tenant_id = Column(String(64), nullable=False, default="tenant-demo-hub", index=True)
    raw_source_file_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    participations = relationship("Participation", back_populates="event", cascade="all, delete-orphan")

class Participation(Base):
    __tablename__ = "participations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    person_id = Column(String(64), ForeignKey("persons.id"), nullable=False, index=True)
    event_id = Column(String(64), ForeignKey("events.id"), nullable=False, index=True)
    role = Column(String(100), default="attendee")  # speaker, attendee, sponsor, organizer, vip
    created_at = Column(DateTime, default=datetime.utcnow)
    
    person = relationship("Person", back_populates="participations")
    event = relationship("Event", back_populates="participations")

class Affiliation(Base):
    __tablename__ = "affiliations"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    person_id = Column(String(64), ForeignKey("persons.id"), nullable=False, index=True)
    company_id = Column(String(64), ForeignKey("companies.id"), nullable=False, index=True)
    title = Column(String(255), nullable=True)
    is_current = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    person = relationship("Person", back_populates="affiliations")
    company = relationship("Company", back_populates="affiliations")

class ResolutionLog(Base):
    __tablename__ = "resolution_logs"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    entity_type = Column(String(50), nullable=False)  # person, company
    source_name = Column(String(255), nullable=False)
    matched_candidate_id = Column(String(64), nullable=True)
    matched_candidate_name = Column(String(255), nullable=True)
    similarity_score = Column(Float, default=0.0)
    matched_rule = Column(String(255), nullable=True)  # e.g., same_email_domain, high_embedding_similarity, exact_phone_match
    decision = Column(String(50), default="pending")  # pending, merged, rejected_as_new
    explanation = Column(Text, nullable=True)
    payload_data = Column(Text, nullable=True)  # JSON raw candidate data
    tenant_id = Column(String(64), nullable=False, default="tenant-demo-hub", index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedbacks"
    
    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    role = Column(String(100), nullable=True)
    rating = Column(Integer, default=5)
    comment = Column(Text, nullable=True)
    tenant_id = Column(String(64), nullable=False, default="tenant-demo-hub")
    created_at = Column(DateTime, default=datetime.utcnow)
