from pydantic import BaseModel
from typing import Optional

class AdminKPIs(BaseModel):
    total_vehicles_registered: int
    active_parking_sessions: int
    total_slots: int
    available_slots: int
    occupied_slots: int
    reserved_slots: int
    maintenance_slots: int
    today_revenue: int
    active_delegations: int
    recovery_requests_today: int
    security_alerts_active: int
    rfid_reader_health: str
