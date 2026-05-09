from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from .models import Project
from .schemas import ProjectCreate, ProjectUpdate, StepDataSave

async def get_user_projects(db: AsyncSession, user_id: int) -> List[Project]:
    """获取用户的所有项目"""
    result = await db.execute(
        select(Project).where(Project.user_id == user_id)
    )
    return result.scalars().all()

async def get_project(db: AsyncSession, project_id: int, user_id: int) -> Optional[Project]:
    """获取单个项目"""
    result = await db.execute(
        select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id
        )
    )
    return result.scalar_one_or_none()

async def create_project(db: AsyncSession, user_id: int, data: ProjectCreate) -> Project:
    """创建新项目"""
    project = Project(
        user_id=user_id,
        title=data.title,
        problem_id=data.problem_id,
        status="created",
        current_step=1,
        step_progress={},
        step_data={},
        completion_rate=0.0
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    return project

async def update_project(
    db: AsyncSession,
    project_id: int,
    user_id: int,
    data: ProjectUpdate
) -> Optional[Project]:
    """更新项目信息"""
    project = await get_project(db, project_id, user_id)
    if not project:
        return None

    # 更新字段
    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    # 重新计算完成率
    if project.step_progress:
        total_progress = sum(project.step_progress.values())
        project.completion_rate = total_progress / 500.0  # 5个步骤，每个100分

    await db.commit()
    await db.refresh(project)

    return project

async def save_step_data(
    db: AsyncSession,
    project_id: int,
    user_id: int,
    step: int,
    data: StepDataSave
) -> Optional[Project]:
    """保存步骤数据"""
    project = await get_project(db, project_id, user_id)
    if not project:
        return None

    # 更新步骤数据
    step_key = f"step{step}"
    if not project.step_data:
        project.step_data = {}

    project.step_data[step_key] = {
        **(project.step_data.get(step_key) or {}),
        **data.data
    }

    # 更新步骤进度
    if not project.step_progress:
        project.step_progress = {}
    project.step_progress[str(step)] = data.progress

    # 重新计算完成率
    total_progress = sum(project.step_progress.values())
    project.completion_rate = total_progress / 500.0

    # 更新当前步骤
    if data.progress == 100 and step < 5:
        project.current_step = step + 1

    # 更新状态
    if project.completion_rate == 1.0:
        project.status = "completed"
    elif project.completion_rate > 0:
        project.status = "in_progress"

    await db.commit()
    await db.refresh(project)

    return project
