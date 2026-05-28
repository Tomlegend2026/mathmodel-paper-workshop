from .database import engine, Base
from .modules.auth.models import User
from .modules.project.models import Project
from .modules.wiki.models import Problem

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("数据库表创建完成")

if __name__ == "__main__":
    import asyncio
    asyncio.run(create_tables())
