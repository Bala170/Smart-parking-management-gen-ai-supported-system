from pydantic import BaseModel
from typing import Optional

class SlotCreate(BaseModel):
    slot_code: str
    zone: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = "AVAILABLE"
    note: Optional[str] = None

class SlotResponse(BaseModel):
    id: int
    slot_code: str
    zone: Optional[str]
    type: Optional[str]
    status: Optional[str]
    vehicle_id: Optional[int]
    session_id: Optional[int]
    note: Optional[str]
    is_current_users: Optional[bool]

    class Config:
        from_attributes = True
