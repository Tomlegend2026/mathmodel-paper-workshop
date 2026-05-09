from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from . import schemas, service
from app.shared.database import get_db

router = APIRouter()

@router.get("/problems", response_model=List[schemas.ProblemOut])
async def list_problems(db: AsyncSession = Depends(get_db)):
    """获取题目列表"""
    return await service.get_problems(db)

@router.post("/problems", response_model=schemas.ProblemOut)
async def add_problem(
    data: schemas.ProblemCreate,
    db: AsyncSession = Depends(get_db)
):
    """添加题目"""
    return await service.create_problem(db, data)
