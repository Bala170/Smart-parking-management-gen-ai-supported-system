from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ZoneCreate(BaseModel):
    name: str
    zone_code: str = Field(min_length=1, max_length=20)
    description: Optional[str] = None


class ZoneResponse(ZoneCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class CameraCreate(BaseModel):
    name: str
    camera_code: str = Field(min_length=1, max_length=50)
    stream_url: Optional[str] = None
    zone_id: Optional[int] = None
    enabled: bool = True


class CameraResponse(CameraCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    last_seen_at: Optional[datetime] = None


class DetectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    camera_id: int
    slot_id: Optional[int]
    vehicle_plate: Optional[str]
    vehicle_type: Optional[str]
    confidence: float
    detected_at: datetime
    source: str


class MonitoringSummary(BaseModel):
    total_slots: int
    occupied_slots: int
    available_slots: int
    stale_slots: int
    online_cameras: int
    total_cameras: int
    last_event_at: Optional[datetime] = None


class DemoIngestRequest(BaseModel):
    camera_id: int
    occupied_slot_codes: list[str] = []
    vehicle_plates: dict[str, str] = {}
    source: str = "demo"
