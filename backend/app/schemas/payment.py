from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    session_id: int
    amount: float
    method: str  # UPI, CARD, WALLET, FASTAG

class PaymentResponse(BaseModel):
    id: int
    txn_code: str
    session_id: int
    user_id: int
    vehicle_id: int
    amount: float
    method: str
    status: str
    receipt_no: Optional[str]
    paid_at: Optional[datetime]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class PaymentVerify(BaseModel):
    txn_code: str
