from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
import os

from ...shared.database import get_db
from ...shared.deps import get_current_user, get_current_user_optional
from .models import PaperKnowledge
from .schemas import (
    PaperKnowledgeCreate,
    PaperKnowledgeUpdate,
    PaperSearchRequest,
    PaperSearchResponse,
    PaperKnowledgeResponse
)
from .service import PaperKnowledgeService

router = APIRouter(tags=["knowledge"])

@router.get("/papers", response_model=list[PaperKnowledgeResponse])
async def list_papers(
    competition: str = None,
    year: int = None,
    category: str = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """获取论文列表"""
    papers = await PaperKnowledgeService.get_papers(
        db,
        competition=competition,
        year=year,
        category=category,
        limit=limit,
        offset=offset
    )
    return [paper.to_dict() for paper in papers]

@router.get("/papers/{paper_id}", response_model=PaperKnowledgeResponse)
async def get_paper(
    paper_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """获取单篇论文详情"""
    paper = await PaperKnowledgeService.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    return paper.to_dict()

@router.post("/papers", response_model=PaperKnowledgeResponse)
async def create_paper(
    data: PaperKnowledgeCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """创建论文知识条目"""
    paper = await PaperKnowledgeService.create_paper(db, data)
    return paper.to_dict()

@router.put("/papers/{paper_id}", response_model=PaperKnowledgeResponse)
async def update_paper(
    paper_id: int,
    data: PaperKnowledgeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """更新论文知识条目"""
    paper = await PaperKnowledgeService.update_paper(db, paper_id, data)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    return paper.to_dict()

@router.delete("/papers/{paper_id}")
async def delete_paper(
    paper_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """删除论文知识条目"""
    success = await PaperKnowledgeService.delete_paper(db, paper_id)
    if not success:
        raise HTTPException(status_code=404, detail="论文不存在")
    return {"message": "删除成功"}

@router.post("/search", response_model=PaperSearchResponse)
async def search_papers(
    request: PaperSearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    检索论文
    
    支持：
    - 关键词检索
    - 语义相似度检索
    - 混合检索（推荐）
    """
    result = await PaperKnowledgeService.search_papers(db, request)
    return result

@router.get("/papers/{paper_id}/download/{file_type}")
async def download_paper(
    paper_id: int,
    file_type: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    下载论文文件
    
    Args:
        paper_id: 论文ID
        file_type: 文件类型 (pdf 或 word)
    """
    paper = await PaperKnowledgeService.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    
    # 确定文件路径
    file_path = None
    filename = f"{paper.title}"
    
    if file_type.lower() == 'pdf':
        file_path = paper.pdf_path
        filename += '.pdf'
    elif file_type.lower() in ['word', 'docx']:
        file_path = paper.docx_path
        filename += '.docx'
    else:
        raise HTTPException(status_code=400, detail="不支持的文件类型，请使用 pdf 或 word")
    
    # 检查文件是否存在
    if not file_path:
        raise HTTPException(status_code=404, detail=f"该论文没有{file_type.upper()}文件")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="文件不存在")
    
    # 设置媒体类型
    media_type = "application/pdf" if file_type.lower() == 'pdf' else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type
    )
