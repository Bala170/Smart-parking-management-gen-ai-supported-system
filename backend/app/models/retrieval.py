from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class RetrievalRequest(Base):
    __tablename__ = "retrieval_requests"
    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(100), unique=True, index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("parking_sessions.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    method = Column(String(50))
    auth_status = Column(String(50), default="PENDING")
    payment_status = Column(String(50), default="PENDING")
    gate_status = Column(String(50), default="LOCKED")
    delegation_id = Column(Integer, ForeignKey("delegation_authorizations.id"), nullable=True)
    processed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
