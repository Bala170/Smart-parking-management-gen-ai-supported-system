from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HistoryResponse(BaseModel):
    id: int
    session_code: str
    vehicle_number: str
    vehicle_model: str
    slot: str
    entry_time: datetime
    exit_time: Optional[datetime]
    duration: str
    amount: float
    retrieval_method: Optional[str]
    status: str
    payment_status: str

    class Config:
        from_attributes = True
