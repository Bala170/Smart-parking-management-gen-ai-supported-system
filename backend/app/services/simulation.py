"""
Simulation vs Production markers.
All functions/classes marked with @simulated are NOT production-ready.
Production deployment MUST replace these with real implementations.
"""

from functools import wraps
from typing import Callable
import logging

logger = logging.getLogger(__name__)

class SimulatedFunctionality:
    '''Marker class for simulated functionality'''
    pass

def simulated(func: Callable) -> Callable:
    '''Decorator to mark functions as simulated (not production-ready)'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.warning(f'SIMULATED: {func.__name__} called - NOT PRODUCTION READY')
        return func(*args, **kwargs)
    wrapper._is_simulated = True
    return wrapper

def production_ready(func: Callable) -> Callable:
    '''Decorator to mark functions as production-ready'''
    func._is_production_ready = True
    return func

# Environment flag
import os
IS_PRODUCTION = os.getenv('ENVIRONMENT', 'development') == 'production'

def assert_production_ready(func_name: str):
    '''Raise error if called in production but not production-ready'''
    if IS_PRODUCTION:
        raise RuntimeError(f'{func_name} is not production-ready. Implement real integration before production deployment.')

# Simulated service implementations
class SimulatedOTPService:
    '''SIMULATED: OTP delivery via SMS/Email. Replace with Twilio/AWS SNS/etc in production.'''
    
    @staticmethod
    @simulated
    def send_otp(phone: str, otp: str, purpose: str = 'recovery') -> bool:
        '''SIMULATED: Log OTP instead of sending. Production: integrate with SMS gateway.'''
        logger.info(f'SIMULATED OTP SEND: phone={phone}, otp={otp}, purpose={purpose}')
        return True
    
    @staticmethod
    @simulated
    def send_email_otp(email: str, otp: str, purpose: str = 'recovery') -> bool:
        '''SIMULATED: Log email OTP instead of sending.'''
        logger.info(f'SIMULATED EMAIL OTP: email={email}, otp={otp}, purpose={purpose}')
        return True


class SimulatedPaymentGateway:
    '''SIMULATED: Payment processing. Replace with Razorpay/Stripe/PayU/etc in production.'''
    
    @staticmethod
    @simulated
    def process_payment(amount: float, method: str, metadata: dict) -> dict:
        '''SIMULATED: Always returns success. Production: call real payment gateway.'''
        logger.info(f'SIMULATED PAYMENT: amount={amount}, method={method}, metadata={metadata}')
        return {
            'success': True,
            'transaction_id': f'SIM-TXN-{metadata.get("session_id", "unknown")}',
            'gateway_response': {'status': 'SIMULATED_SUCCESS'}
        }
    
    @staticmethod
    @simulated
    def verify_payment(transaction_id: str) -> dict:
        '''SIMULATED: Always returns verified. Production: call gateway verification API.'''
        return {'verified': True, 'transaction_id': transaction_id}


class SimulatedRFIDReader:
    '''SIMULATED: RFID tag reading. Replace with actual RFID hardware integration.'''
    
    @staticmethod
    @simulated
    def read_tag(reader_id: str) -> str | None:
        '''SIMULATED: Returns test tag. Production: read from actual RFID reader hardware.'''
        logger.info(f'SIMULATED RFID READ: reader={reader_id}')
        return 'RFID-TEST-TAG-12345'
    
    @staticmethod
    @simulated
    def verify_tag_at_gate(tag_id: str, gate_id: str) -> bool:
        '''SIMULATED: Always returns True. Production: verify tag at physical gate reader.'''
        logger.info(f'SIMULATED RFID VERIFY: tag={tag_id}, gate={gate_id}')
        return True


class SimulatedGateBarrier:
    '''SIMULATED: Gate barrier control. Replace with actual hardware control.'''
    
    @staticmethod
    @simulated
    def open_barrier(gate_id: str, reason: str) -> bool:
        '''SIMULATED: Logs barrier open. Production: send signal to barrier controller.'''
        logger.info(f'SIMULATED GATE OPEN: gate={gate_id}, reason={reason}')
        return True
    
    @staticmethod
    @simulated
    def close_barrier(gate_id: str) -> bool:
        '''SIMULATED: Logs barrier close.'''
        logger.info(f'SIMULATED GATE CLOSE: gate={gate_id}')
        return True
    
    @staticmethod
    @simulated
    def get_barrier_status(gate_id: str) -> str:
        '''SIMULATED: Returns status. Production: query barrier controller.'''
        return 'CLOSED'


# Export singleton instances for easy import
otp_service = SimulatedOTPService()
payment_gateway = SimulatedPaymentGateway()
rfid_reader = SimulatedRFIDReader()
gate_barrier = SimulatedGateBarrier()
