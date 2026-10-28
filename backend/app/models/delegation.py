from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class DelegationAuthorization(Base):
    __tablename__ = "delegation_authorizations"
    id = Column(Integer, primary_key=True, index=True)
    delegation_code = Column(String(100), unique=True, index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("parking_sessions.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    delegatee_name = Column(String(255))
    delegatee_phone = Column(String(20))
    relation = Column(String(100))
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=False)
    purpose = Column(Text)
    status = Column(String(50), default="ACTIVE")
    otp = Column(String(20))
    qr_payload = Column(Text)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
