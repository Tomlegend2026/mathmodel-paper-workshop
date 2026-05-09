from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    problem_id: Optional[int] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    current_step: Optional[int] = None
    step_progress: Optional[Dict[str, int]] = None
    step_data: Optional[Dict[str, Any]] = None
    completion_rate: Optional[float] = None

class ProjectOut(ProjectBase):
    id: int
    user_id: int
    status: str
    current_step: int
    step_progress: Dict[str, int]
    step_data: Dict[str, Any]
    completion_rate: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StepDataSave(BaseModel):
    data: Dict[str, Any]
    progress: int
