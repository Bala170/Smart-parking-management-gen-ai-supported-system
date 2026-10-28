from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date
from app.core.db import get_db
from app.models.parking_session import ParkingSession
from app.models.vehicle import Vehicle
from app.models.parking_slot import ParkingSlot
from app.models.payment import Payment
from app.models.delegation import DelegationAuthorization
from app.models.audit import AuditEvent
from app.models.user import User
from app.schemas.admin import AdminKPIs
from app.deps import require_admin

router = APIRouter()

@router.get("/stats", response_model=AdminKPIs)
async def admin_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    
    return AdminKPIs(
        total_vehicles_registered=db.query(Vehicle).count(),
        active_parking_sessions=db.query(ParkingSession).filter(ParkingSession.status == "ACTIVE").count(),
        total_slots=db.query(ParkingSlot).count(),
        available_slots=db.query(ParkingSlot).filter(ParkingSlot.status == "AVAILABLE").count(),
        occupied_slots=db.query(ParkingSlot).filter(ParkingSlot.status == "OCCUPIED").count(),
        reserved_slots=db.query(ParkingSlot).filter(ParkingSlot.status == "RESERVED").count(),
        maintenance_slots=db.query(ParkingSlot).filter(ParkingSlot.status == "MAINTENANCE").count(),
        today_revenue=int(db.query(Payment).filter(Payment.paid_at >= today_start, Payment.status == "SUCCESS").with_entities(Payment.amount).all().__len__() or 0),
        active_delegations=db.query(DelegationAuthorization).filter(DelegationAuthorization.status == "ACTIVE").count(),
        recovery_requests_today=db.query(AuditEvent).filter(AuditEvent.event == "LOST_TOKEN_RECOVERY", AuditEvent.timestamp >= today_start).count(),
        security_alerts_active=db.query(AuditEvent).filter(AuditEvent.status == "REJECTED", AuditEvent.timestamp >= today_start).count(),
        rfid_reader_health="99.8% Operational"
    )

@router.get("/slots")
async def admin_slots(zone: str = None, db: Session = Depends(get_db), _=Depends(require_admin)):
    q = db.query(ParkingSlot)
    if zone:
        q = q.filter(ParkingSlot.zone == zone)
    return q.all()

@router.get("/active-sessions")
async def admin_active_sessions(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(ParkingSession).filter(ParkingSession.status == "ACTIVE").all()

@router.get("/retrievals")
async def admin_retrievals(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(ParkingSession).filter(ParkingSession.status.in_(["ACTIVE", "COMPLETED"])).order_by(ParkingSession.entry_time.desc()).limit(50).all()

@router.get("/delegations")
async def admin_delegations(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(DelegationAuthorization).order_by(DelegationAuthorization.created_at.desc()).limit(50).all()

@router.get("/users")
async def admin_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(User).all()

@router.get("/vehicles")
async def admin_vehicles(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Vehicle).all()

@router.get("/payments")
async def admin_payments(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Payment).order_by(Payment.created_at.desc()).limit(100).all()
