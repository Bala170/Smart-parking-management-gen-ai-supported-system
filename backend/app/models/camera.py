from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, text
from sqlalchemy.sql import func

from app.core.db import Base


class Camera(Base):
    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    camera_code = Column(String(50), unique=True, nullable=False, index=True)
    stream_url = Column(Text, nullable=True)
    zone_id = Column(Integer, ForeignKey("parking_zones.id"), nullable=True)
    status = Column(String(20), default="OFFLINE", nullable=False)
    last_seen_at = Column(DateTime(timezone=True), nullable=True)
    enabled = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("(CURRENT_TIMESTAMP)"))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
