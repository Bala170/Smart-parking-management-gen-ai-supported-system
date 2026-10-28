from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.db import get_db
from app.models.parking_session import ParkingSession
from app.models.vehicle import Vehicle
from app.models.parking_slot import ParkingSlot
from app.models.digital_token import DigitalParkingToken
from app.models.payment import Payment
from app.models.retrieval import RetrievalRequest
from app.models.audit import AuditEvent
from app.schemas.parking_session import SessionCreate, SessionResponse, SessionEndRequest
from app.schemas.history import HistoryResponse
from app.deps import get_current_user

router = APIRouter()

@router.post("", response_model=SessionResponse)
async def create_session(data: SessionCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == data.vehicle_id, Vehicle.owner_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(404, "Vehicle not found or not owned by user")
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == data.slot_id).first()
    if not slot:
        raise HTTPException(404, "Slot not found")
    if slot.status != "AVAILABLE":
        raise HTTPException(400, "Slot not available")
    
    session_code = f"PS-{datetime.utcnow().year}-{db.query(ParkingSession).count()+1:05d}"
    session = ParkingSession(
        session_code=session_code,
        vehicle_id=vehicle.id,
        slot_id=slot.id,
        user_id=current_user.id,
        entry_gate=data.entry_gate,
        exit_gate_assigned=data.exit_gate_assigned,
        entry_time=datetime.utcnow(),
        hourly_rate=data.hourly_rate,
        current_fee=0.0,
        status="ACTIVE",
        payment_status="Unpaid",
    )
    db.add(session)
    db.flush()
    slot.status = "OCCUPIED"
    slot.vehicle_id = vehicle.id
    slot.session_id = session.id
    vehicle.parking_status = "Parked"
    vehicle.active_session_id = session.id
    vehicle.slot_id = slot.id
    db.commit()
    db.refresh(session)

    audit = AuditEvent(event="VEHICLE_ENTRY", user_id=current_user.id, vehicle_id=vehicle.id, 
                       action="RFID_ENTRY_VERIFIED", status="SUCCESS", 
                       gate_node=data.entry_gate or "Gate 1", details=f"Session {session_code} created")
    db.add(audit)
    db.commit()
    return session

@router.get("/my", response_model=list[SessionResponse])
async def my_sessions(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(ParkingSession).filter(ParkingSession.user_id == current_user.id).order_by(ParkingSession.entry_time.desc()).all()

@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    return session

@router.post("/{session_id}/end", response_model=SessionResponse)
async def end_session(session_id: int, data: SessionEndRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    if session.status != "ACTIVE":
        raise HTTPException(400, "Session not active")
    
    exit_time = datetime.utcnow()
    duration = int((exit_time - session.entry_time).total_seconds() / 60)
    fee = round((duration / 60) * session.hourly_rate, 2)
    
    session.exit_time = exit_time
    session.duration_minutes = duration
    session.current_fee = fee
    session.status = "COMPLETED"
    session.retrieval_method = data.retrieval_method
    session.payment_status = "Pending"
    
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == session.slot_id).first()
    if slot:
        slot.status = "AVAILABLE"
        slot.vehicle_id = None
        slot.session_id = None
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == session.vehicle_id).first()
    if vehicle:
        vehicle.parking_status = "Idle"
        vehicle.active_session_id = None
        vehicle.slot_id = None
    
    db.commit()
    db.refresh(session)
    
    audit = AuditEvent(event="VEHICLE_EXIT", user_id=current_user.id, vehicle_id=vehicle.id if vehicle else None,
                       action="RETRIEVAL_" + data.retrieval_method.upper(), status="SUCCESS",
                       gate_node=session.exit_gate_assigned or "Gate 2",
                       details=f"Session {session.session_code} ended, fee {fee}")
    db.add(audit)
    db.commit()
    return session

@router.get("/{session_id}/fee")
async def calculate_fee(session_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, "Session not found")
    now = datetime.utcnow()
    duration = int((now - session.entry_time).total_seconds() / 60)
    fee = round((duration / 60) * session.hourly_rate, 2)
    return {"duration_minutes": duration, "current_fee": fee, "hourly_rate": session.hourly_rate}

@router.get("", response_model=list[HistoryResponse])
async def get_history(
    status: str = None,
    retrieval_method: str = None,
    search: str = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    q = db.query(ParkingSession).filter(ParkingSession.user_id == current_user.id)
    if status:
        q = q.filter(ParkingSession.status == status)
    if retrieval_method:
        q = q.filter(ParkingSession.retrieval_method == retrieval_method)
    sessions = q.order_by(ParkingSession.entry_time.desc()).all()
    
    result = []
    for s in sessions:
        vehicle = db.query(Vehicle).filter(Vehicle.id == s.vehicle_id).first()
        slot = db.query(ParkingSlot).filter(ParkingSlot.id == s.slot_id).first()
        duration = f"{s.duration_minutes // 60}h {s.duration_minutes % 60}m" if s.duration_minutes else "Ongoing"
        result.append(HistoryResponse(
            id=s.id,
            session_code=s.session_code,
            vehicle_number=vehicle.vehicle_number if vehicle else "Unknown",
            vehicle_model=vehicle.model if vehicle else "Unknown",
            slot=slot.slot_code if slot else "Unknown",
            entry_time=s.entry_time,
            exit_time=s.exit_time,
            duration=duration,
            amount=s.current_fee,
            retrieval_method=s.retrieval_method,
            status=s.status,
            payment_status=s.payment_status
        ))
    return result
