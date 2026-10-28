from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SessionCreate(BaseModel):
    vehicle_id: int
    slot_id: int
    entry_gate: Optional[str] = None
    exit_gate_assigned: Optional[str] = None
    hourly_rate: float = 20.0

class SessionResponse(BaseModel):
    id: int
    session_code: str
    vehicle_id: int
    slot_id: int
    user_id: int
    entry_gate: Optional[str]
    exit_gate_assigned: Optional[str]
    entry_time: datetime
    exit_time: Optional[datetime]
    duration_minutes: int
    hourly_rate: float
    current_fee: float
    currency: str
    status: str
    payment_status: str
    retrieval_method: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class SessionEndRequest(BaseModel):
    retrieval_method: str  # RFID, TOKEN, DELEGATION, RECOVERY
