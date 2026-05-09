from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.shared.database import init_db
from app.modules.auth.router import router as auth_router
from app.modules.project.router import router as project_router
from app.modules.wiki.router import router as wiki_router
from app.modules.knowledge.router import router as knowledge_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 应用启动时执行
    await init_db()
    yield
    # 应用关闭时执行（可选）

app = FastAPI(
    title="数模论文工坊 API",
    description="数学建模智能辅助平台后端接口",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth_router, prefix="/api/auth", tags=["认证"])
app.include_router(project_router, prefix="/api/projects", tags=["项目"])
app.include_router(wiki_router, prefix="/api/wiki", tags=["题库"])
app.include_router(knowledge_router, prefix="/api/knowledge", tags=["知识库"])

@app.get("/")
async def root():
    return {
        "message": "数模论文工坊 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
