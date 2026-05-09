import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.shared.database import engine, Base
from app.modules.auth.models import User
from app.modules.project.models import Project
from app.modules.wiki.models import Problem
from app.modules.knowledge.models import PaperKnowledge

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("数据库表创建完成")

if __name__ == "__main__":
    import asyncio
    asyncio.run(create_tables())
