from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError, jwt
from datetime import datetime
from typing import Optional

from .database import get_db
from .config import get_settings
from app.modules.auth.models import User

settings = get_settings()

# OAuth2 密码流依赖 - 设置为可选，不自动返回401错误
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """从 JWT token 中获取当前用户（可选认证）"""
    if not token:
        return None
    
    try:
        # 解码 JWT token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None

    # 从数据库查询用户
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()

    return user

async def get_current_user_optional(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    """可选的用户认证 - 如果没有token或token无效，返回None而不是抛出错误"""
    if not token:
        return None
    
    try:
        # 解码 JWT token
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("sub")
        if username is None:
            return None
        
        # 从数据库查询用户
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
        return user
    except JWTError:
        return None
