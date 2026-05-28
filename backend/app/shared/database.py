from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from .config import get_settings

settings = get_settings()

# 创建异步数据库引擎
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # 开发时打印 SQL 语句
    future=True
)

# 创建异步会话工厂
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# ORM 模型基类
class Base(DeclarativeBase):
    pass

# 获取数据库会话的依赖函数
async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

# 初始化数据库（创建表）
async def init_db():
    async with engine.begin() as conn:
        # 导入所有模型，这样 SQLAlchemy 才知道要创建哪些表
        from ..modules.auth.models import User
        from ..modules.project.models import Project
        # 在这里导入其他模型...

        await conn.run_sync(Base.metadata.create_all)
