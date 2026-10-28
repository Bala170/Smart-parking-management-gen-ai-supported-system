from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class DigitalParkingToken(Base):
    __tablename__ = "digital_parking_tokens"
    id = Column(Integer, primary_key=True, index=True)
    token_code = Column(String(100), unique=True, index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("parking_sessions.id"), nullable=False)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="ACTIVE")
    valid_until = Column(DateTime(timezone=True), nullable=False)
    qr_payload = Column(Text, nullable=True)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
