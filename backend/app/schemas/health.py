from pydantic import BaseModel
from typing import Optional, List

class HealthResponse(BaseModel):
    status: str
    environment: str
