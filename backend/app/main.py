from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import Base, engine
from app.api.v1.api import api_router

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f'{settings.API_V1_STR}/openapi.json')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event('startup')
async def startup():
    Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get('/api/health')
async def health_check():
    return {'status': 'ok', 'environment': settings.ENVIRONMENT}
