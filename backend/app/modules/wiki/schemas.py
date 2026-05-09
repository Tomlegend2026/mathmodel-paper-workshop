from pydantic import BaseModel
from typing import Optional, List

class ProblemBase(BaseModel):
    year: int
    competition: str
    title: str
    category: str
    content: str
    tags: List[str]
    difficulty: int

class ProblemCreate(ProblemBase):
    pass

class ProblemOut(ProblemBase):
    id: int

    class Config:
        from_attributes = True
