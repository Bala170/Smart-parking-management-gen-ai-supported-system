from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import secrets
from app.core.db import get_db
from app.models.vehicle import Vehicle
from app.models.parking_session import ParkingSession
from app.models.digital_token import DigitalParkingToken
from app.models.audit import AuditEvent
from app.schemas.recovery import RecoveryRequest, RecoveryOTPRequest, RecoveryResponse

router = APIRouter()

otp_store = {}

@router.post('/request', response_model=RecoveryResponse)
async def request_recovery(data: RecoveryRequest, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_number == data.vehicle_number).first()
    if not vehicle:
        raise HTTPException(404, 'Vehicle not found')
    
    session = db.query(ParkingSession).filter(ParkingSession.vehicle_id == vehicle.id, ParkingSession.status == 'ACTIVE').first()
    if not session:
        raise HTTPException(400, 'No active session for this vehicle')
    
    otp = f'{secrets.randbelow(900000) + 100000:06d}'
    recovery_id = f'RECOV-{secrets.randbelow(900000) + 100000:06d}'
    otp_store[recovery_id] = {'otp': otp, 'vehicle_id': vehicle.id, 'session_id': session.id, 'expires': datetime.utcnow() + timedelta(minutes=10)}
    
    audit = AuditEvent(event='LOST_TOKEN_RECOVERY', user_id=vehicle.owner_id, vehicle_id=vehicle.id,
                       action='RECOVERY_REQUEST', status='SUCCESS',
                       gate_node='Web Client (Recovery)', details='Recovery ' + recovery_id + ' requested for ' + vehicle.vehicle_number)
    db.add(audit)
    db.commit()
    
    return RecoveryResponse(success=True, recovery_id=recovery_id, message='OTP sent to registered phone (SIMULATED)', new_token_code=otp)

@router.post('/verify-otp', response_model=RecoveryResponse)
async def verify_recovery_otp(data: RecoveryOTPRequest, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_number == data.vehicle_number).first()
    if not vehicle:
        raise HTTPException(404, 'Vehicle not found')
    
    found = None
    for rid, info in otp_store.items():
        if info['vehicle_id'] == vehicle.id and info['expires'] > datetime.utcnow():
            found = (rid, info)
            break
    
    if not found:
        raise HTTPException(400, 'No valid recovery request found')
    
    rid, info = found
    if info['otp'] != data.otp:
        audit = AuditEvent(event='OTP_AUTH_FAILED', user_id=vehicle.owner_id, vehicle_id=vehicle.id,
                           action='OTP_AUTH_FAILED', status='FAILED',
                           gate_node='Web Client (Recovery)', details='Incorrect OTP')
        db.add(audit)
        db.commit()
        raise HTTPException(400, 'Invalid OTP')
    
    session = db.query(ParkingSession).filter(ParkingSession.id == info['session_id']).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    
    token_code = f'DTK-{secrets.token_hex(4).upper()}-{secrets.token_hex(2).upper()}'
    qr_payload = 'SEC-RECOVERY:' + token_code + ':' + session.session_code + ':EXP-' + str(int((datetime.utcnow() + timedelta(hours=2)).timestamp()))
    
    db.query(DigitalParkingToken).filter(DigitalParkingToken.session_id == session.id, DigitalParkingToken.status == 'ACTIVE').update({'status': 'REVOKED'})
    
    new_token = DigitalParkingToken(
        token_code=token_code,
        session_id=session.id,
        vehicle_id=session.vehicle_id,
        user_id=vehicle.owner_id,
        status='ACTIVE',
        valid_until=datetime.utcnow() + timedelta(hours=2),
        qr_payload=qr_payload,
    )
    db.add(new_token)
    del otp_store[rid]
    
    audit = AuditEvent(event='OTP_VERIFICATION', user_id=vehicle.owner_id, vehicle_id=vehicle.id,
                       action='OTP_AUTH', status='SUCCESS',
                       gate_node='Web Client (Recovery)', details='OTP verified, new token ' + token_code + ' issued')
    db.add(audit)
    db.commit()
    
    return RecoveryResponse(success=True, recovery_id=rid, message='Recovery successful, new token generated', new_token_code=token_code)
