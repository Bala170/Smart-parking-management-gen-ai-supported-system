from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, text
from sqlalchemy.sql import func
from app.core.db import Base

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True)
    event_code = Column(String(100), unique=True, index=True, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    event = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    action = Column(String(100))
    status = Column(String(50))
    ip_address = Column(String(100))
    gate_node = Column(String(100))
    details = Column(Text)
