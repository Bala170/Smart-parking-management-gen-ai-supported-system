from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, Enum, text
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class SlotStatusEnum(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    RESERVED = "RESERVED"
    MAINTENANCE = "MAINTENANCE"

class ParkingSlot(Base):
    __tablename__ = "parking_slots"
    id = Column(Integer, primary_key=True, index=True)
    slot_code = Column(String(20), unique=True, nullable=False)
    zone = Column(String(10))
    type = Column(String(50))
    status = Column(String(50), default="AVAILABLE")
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("parking_sessions.id"), nullable=True)
    note = Column(Text, nullable=True)
    is_current_users = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
