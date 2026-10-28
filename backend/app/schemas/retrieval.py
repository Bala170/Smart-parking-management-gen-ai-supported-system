from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RetrievalValidate(BaseModel):
    session_id: int
    method: str  # RFID, TOKEN, DELEGATION, RECOVERY
    token_code: Optional[str] = None
    delegation_code: Optional[str] = None
    otp: Optional[str] = None

class RetrievalResponse(BaseModel):
    id: int
    request_code: str
    session_id: int
    vehicle_id: int
    method: str
    auth_status: str
    payment_status: str
    gate_status: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
