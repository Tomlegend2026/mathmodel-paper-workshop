from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from . import schemas, service
from app.shared.database import get_db
from app.shared.deps import get_current_user
from .models import User

router = APIRouter()

@router.post("/register", response_model=schemas.Token)
async def register(
    user_data: schemas.UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """用户注册"""
    user = await service.register_user(db, user_data)

    # 注册成功后自动登录，返回 token
    access_token = service.create_access_token(
        data={"sub": user.username}
    )

    return schemas.Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id
    )

@router.post("/login", response_model=schemas.Token)
async def login(
    login_data: schemas.UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """用户登录"""
    return await service.login_user(db, login_data)

@router.get("/me", response_model=schemas.UserOut)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """获取当前用户信息"""
    return current_user

@router.put("/me", response_model=schemas.UserOut)
async def update_user_info(
    user_update: schemas.UserBase,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """更新用户信息"""
    # 更新用户信息
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return current_user
