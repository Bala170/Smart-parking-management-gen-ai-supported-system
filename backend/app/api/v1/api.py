from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, vehicles, parking_slots, parking_sessions, tokens, payments, recovery, delegation, admin, audit, retrieval, monitoring

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(parking_slots.router, prefix="/parking-slots", tags=["parking-slots"])
api_router.include_router(parking_sessions.router, prefix="/parking-sessions", tags=["parking-sessions"])
api_router.include_router(tokens.router, prefix="/tokens", tags=["tokens"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(recovery.router, prefix="/recovery", tags=["recovery"])
api_router.include_router(delegation.router, prefix="/delegation", tags=["delegation"])
api_router.include_router(retrieval.router, prefix="/retrieval", tags=["retrieval"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["monitoring"])
