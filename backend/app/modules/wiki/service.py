from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from .models import Problem
from .schemas import ProblemCreate

async def get_problems(db: AsyncSession) -> List[Problem]:
    """获取所有题目"""
    result = await db.execute(select(Problem))
    return result.scalars().all()

async def create_problem(db: AsyncSession, data: ProblemCreate) -> Problem:
    """添加题目"""
    problem = Problem(**data.dict())
    db.add(problem)
    await db.commit()
    await db.refresh(problem)
    return problem
