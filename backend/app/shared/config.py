from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # 数据库配置 - 默认使用高斯数据库（OpenGauss）
    # 格式: postgresql+asyncpg://用户名:密码@主机:端口/数据库名
    DATABASE_URL: str = "postgresql+asyncpg://omm:dev123456@localhost:5432/postgres"

    # JWT 配置
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24小时

    # 应用配置
    APP_NAME: str = "数模论文工坊"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
