from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, Text, Enum, text
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class VehicleTypeEnum(str, enum.Enum):
    two_wheeler = "Two-Wheeler"
    four_wheeler = "Four-Wheeler"
    four_wheeler_ev = "Four-Wheeler (EV)"
    ev_charging = "EV Charging"
    delegated_pickup = "Delegated Pickup"
    standard = "Standard"

class VehicleStatusEnum(str, enum.Enum):
    active = "Active"
    pending = "Pending Verification"
    inactive = "Inactive"

class ParkingStatusEnum(str, enum.Enum):
    idle = "Idle"
    parked = "Parked"

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String(50), unique=True, index=True, nullable=False)
    model = Column(String(100))
    type = Column(String(50))
    color = Column(String(50))
    rfid_tag = Column(String(100), unique=True, nullable=True)
    rfid_status = Column(String(50), default="Pending Verification")
    registration_date = Column(DateTime(timezone=True), nullable=True)
    parking_status = Column(String(50), default="Idle")
    active_session_id = Column(Integer, ForeignKey("parking_sessions.id"), nullable=True)
    slot_id = Column(Integer, ForeignKey("parking_slots.id"), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text('(CURRENT_TIMESTAMP)'))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
