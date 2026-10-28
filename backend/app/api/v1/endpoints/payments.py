from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import secrets
from app.core.db import get_db
from app.models.payment import Payment
from app.models.parking_session import ParkingSession
from app.models.vehicle import Vehicle
from app.models.audit import AuditEvent
from app.schemas.payment import PaymentCreate, PaymentResponse, PaymentVerify
from app.deps import get_current_user

router = APIRouter()

@router.post('', response_model=PaymentResponse)
async def create_payment(data: PaymentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == data.session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    if session.payment_status == 'Paid':
        raise HTTPException(400, 'Already paid')
    
    txn_code = 'TXN-' + str(datetime.utcnow().year) + '-' + str(secrets.randbelow(100000)).zfill(5)
    receipt_no = 'RCP-' + str(secrets.randbelow(100000)).zfill(5) + '-' + data.method[0].upper()
    
    payment = Payment(
        txn_code=txn_code,
        session_id=session.id,
        user_id=current_user.id,
        vehicle_id=session.vehicle_id,
        amount=data.amount,
        method=data.method,
        status='SUCCESS',  # SIMULATED - in production integrate with payment gateway
        receipt_no=receipt_no,
        paid_at=datetime.utcnow(),
    )
    db.add(payment)
    session.payment_status = 'Paid'
    db.commit()
    db.refresh(payment)
    
    audit = AuditEvent(event='PAYMENT_COMPLETED', user_id=current_user.id, vehicle_id=session.vehicle_id,
                       action='PAYMENT_PROCESSING', status='SUCCESS',
                       gate_node='Payment Gateway (SIMULATED)', details='Txn ' + txn_code + ' for session ' + session.session_code + ', amount ' + str(data.amount))
    db.add(audit)
    db.commit()
    return payment

@router.get('/my', response_model=list[PaymentResponse])
async def my_payments(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Payment).filter(Payment.user_id == current_user.id).order_by(Payment.created_at.desc()).all()

@router.post('/verify')
async def verify_payment(data: PaymentVerify, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.txn_code == data.txn_code).first()
    if not payment:
        raise HTTPException(404, 'Payment not found')
    return {'verified': payment.status == 'SUCCESS', 'payment': {'txn_code': payment.txn_code, 'amount': payment.amount, 'status': payment.status}}

@router.get('/session/{session_id}')
async def get_payment_for_session(session_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    session = db.query(ParkingSession).filter(ParkingSession.id == session_id, ParkingSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(404, 'Session not found')
    payment = db.query(Payment).filter(Payment.session_id == session_id).first()
    if not payment:
        return {'paid': False, 'amount_due': session.current_fee}
    return {'paid': payment.status == 'SUCCESS', 'payment': payment}
