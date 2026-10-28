from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text

from app.core.db import Base


class VehicleDetection(Base):
    __tablename__ = "vehicle_detections"

    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("cameras.id"), nullable=False, index=True)
    slot_id = Column(Integer, ForeignKey("parking_slots.id"), nullable=True, index=True)
    vehicle_plate = Column(String(30), nullable=True)
    vehicle_type = Column(String(30), nullable=True)
    confidence = Column(Float, nullable=False)
    detected_at = Column(DateTime(timezone=True), nullable=False, index=True)
    source = Column(String(30), default="demo", nullable=False)
    frame_reference = Column(Text, nullable=True)
