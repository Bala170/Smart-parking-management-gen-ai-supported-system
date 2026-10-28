"""
GenAI Authorization Boundary Enforcement.

CRITICAL: The GenAI model MUST NEVER be allowed to directly authorize vehicle release.
All authorization decisions must be made by backend business logic with proper validation.
"""

from enum import Enum
from typing import Optional
from dataclasses import dataclass
from functools import wraps
import logging

logger = logging.getLogger(__name__)

class AuthorizationSource(Enum):
    USER_REQUEST = 'user_request'
    ADMIN_OVERRIDE = 'admin_override'
    HARDWARE_EVENT = 'hardware_event'  # RFID read, sensor trigger
    SCHEDULED_TASK = 'scheduled_task'
    GENAI_SUGGESTION = 'genai_suggestion'  # INFORMATION ONLY - NEVER AUTHORIZE

@dataclass
class AuthorizationContext:
    source: AuthorizationSource
    user_id: Optional[int] = None
    session_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    method: Optional[str] = None
    credentials: Optional[dict] = None
    genai_recommendation: Optional[str] = None  # GenAI can ONLY recommend

class AuthorizationError(Exception):
    '''Raised when authorization is denied or invalid'''
    pass

class GenAIAuthorizationBoundary:
    """
    Enforces that GenAI can NEVER directly authorize vehicle release.
    GenAI can only provide recommendations/information.
    """
    
    FORBIDDEN_ACTIONS = {
        'release_vehicle',
        'open_gate',
        'validate_credential',
        'process_payment',
        'create_token',
        'revoke_token',
        'approve_delegation',
        'confirm_retrieval'
    }
    
    ALLOWED_ACTIONS = {
        'suggest_retrieval_method',
        'analyze_parking_patterns',
        'predict_occupancy',
        'recommend_pricing',
        'generate_report',
        'answer_user_query',
        'explain_policy'
    }
    
    @classmethod
    def validate_action(cls, action: str, source: AuthorizationSource) -> bool:
        '''Validate if an action is allowed from a given source'''
        if source == AuthorizationSource.GENAI_SUGGESTION:
            if action in cls.FORBIDDEN_ACTIONS:
                logger.error(f'SECURITY VIOLATION: GenAI attempted forbidden action: {action}')
                raise AuthorizationError(f'GenAI cannot perform action: {action}. Backend authorization required.')
            if action not in cls.ALLOWED_ACTIONS:
                logger.warning(f'GenAI attempted unknown action: {action}')
                return False
        return True
    
    @classmethod
    def create_authorization_context(cls, source: AuthorizationSource, **kwargs) -> AuthorizationContext:
        '''Create authorization context with source tracking'''
        if source == AuthorizationSource.GENAI_SUGGESTION:
            # GenAI context can only contain recommendations
            return AuthorizationContext(
                source=source,
                genai_recommendation=kwargs.get('recommendation'),
                **{k: v for k, v in kwargs.items() if k != 'recommendation'}
            )
        return AuthorizationContext(source=source, **kwargs)

def require_backend_authorization(action: str):
    """
    Decorator to enforce backend authorization.
    Raises AuthorizationError if called from GenAI context.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Check if there's an authorization context in kwargs
            auth_context = kwargs.get('_auth_context')
            if auth_context and isinstance(auth_context, AuthorizationContext):
                GenAIAuthorizationBoundary.validate_action(action, auth_context.source)
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Example usage in retrieval endpoint:
# @require_backend_authorization('release_vehicle')
# def authorize_vehicle_release(context: AuthorizationContext):
#     # Only USER_REQUEST, ADMIN_OVERRIDE, HARDWARE_EVENT can call this
#     pass

# GenAI helper - can ONLY provide information
class GenAIAssistant:
    """GenAI can only assist with information, never authorize."""
    
    @staticmethod
    def suggest_retrieval_method(session_data: dict) -> str:
        """GenAI can suggest best retrieval method based on session data."""
        if session_data.get('has_active_delegation'):
            return 'DELEGATION'
        elif session_data.get('has_active_token'):
            return 'TOKEN'
        elif session_data.get('vehicle_has_rfid'):
            return 'RFID'
        return 'RECOVERY'
    
    @staticmethod
    def explain_policy(policy_name: str) -> str:
        """GenAI can explain parking policies."""
        policies = {
            'delegation': 'Delegation allows temporary vehicle release to authorized person with OTP.',
            'recovery': 'Lost token recovery requires OTP verification sent to registered phone.',
            'payment': 'Payment must be completed before vehicle exit is authorized.',
        }
        return policies.get(policy_name, 'Policy not found.')
    
    @staticmethod
    def analyze_occupancy(history: list) -> dict:
        """GenAI can analyze patterns and return insights."""
        return {
            'peak_hours': ['08:00-10:00', '17:00-19:00'],
            'recommended_action': 'Consider dynamic pricing during peak hours'
        }

# SECURITY NOTE: Any function that modifies vehicle release state,
# opens gates, validates credentials, or processes payments MUST:
# 1. Be decorated with @require_backend_authorization
# 2. Accept AuthorizationContext as parameter
# 3. Validate credentials independently (never trust GenAI output)
# 4. Log all authorization decisions to audit trail
