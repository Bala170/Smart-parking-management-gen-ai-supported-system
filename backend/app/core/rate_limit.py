from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request, Depends, HTTPException
from typing import Optional

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

def get_rate_limiter() -> Limiter:
    return limiter

# Rate limit dependencies for sensitive endpoints
async def rate_limit_auth(request: Request, limiter: Limiter = Depends(get_rate_limiter)):
    '''Rate limit for auth endpoints: 10 requests per minute'''
    await limiter.check_request_limit(request, limit='10/minute')

async def rate_limit_recovery(request: Request, limiter: Limiter = Depends(get_rate_limiter)):
    '''Rate limit for recovery: 3 requests per hour'''
    await limiter.check_request_limit(request, limit='3/hour')

async def rate_limit_delegation(request: Request, limiter: Limiter = Depends(get_rate_limiter)):
    '''Rate limit for delegation: 20 requests per hour'''
    await limiter.check_request_limit(request, limit='20/hour')

async def rate_limit_retrieval(request: Request, limiter: Limiter = Depends(get_rate_limiter)):
    '''Rate limit for retrieval validation: 30 requests per minute'''
    await limiter.check_request_limit(request, limit='30/minute')

async def rate_limit_payment(request: Request, limiter: Limiter = Depends(get_rate_limiter)):
    '''Rate limit for payment: 10 requests per minute'''
    await limiter.check_request_limit(request, limit='10/minute')
