from sqlalchemy import Column, DateTime, Integer, String, text
from sqlalchemy.sql import func

from app.core.db import Base


class ParkingZone(Base):
    __tablename__ = "parking_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    zone_code = Column(String(20), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("(CURRENT_TIMESTAMP)"))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
