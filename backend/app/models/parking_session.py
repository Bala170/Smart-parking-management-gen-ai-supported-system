from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class ParkingSession(Base):
    __tablename__ = "parking_sessions"
    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String(50), unique=True, index=True, nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("parking_slots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    entry_gate = Column(String(100))
    exit_gate_assigned = Column(String(100))
    entry_time = Column(DateTime(timezone=True), nullable=False)
    exit_time = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=0)
    hourly_rate = Column(Float, default=20.0)
    current_fee = Column(Float, default=0.0)
    currency = Column(String(10), default="INR")
    status = Column(String(50), default="ACTIVE")
    payment_status = Column(String(50), default="Unpaid")
    retrieval_method = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
