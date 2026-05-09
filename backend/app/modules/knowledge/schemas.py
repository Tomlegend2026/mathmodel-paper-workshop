from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PaperKnowledgeCreate(BaseModel):
    """创建论文知识条目"""
    title: str = Field(..., description="论文标题")
    year: int = Field(..., description="年份")
    competition: str = Field(..., description="竞赛类型")
    problem_type: Optional[str] = Field(None, description="题目类型")
    category: Optional[str] = Field(None, description="问题类别")
    difficulty: Optional[int] = Field(None, description="难度")
    
    pdf_path: Optional[str] = None
    docx_path: Optional[str] = None
    code_path: Optional[str] = None
    data_path: Optional[str] = None
    
    abstract: Optional[str] = None
    summary: Optional[str] = None
    methods_used: Optional[List[str]] = None
    models_used: Optional[List[str]] = None
    key_points: Optional[Dict[str, Any]] = None
    
    tags: Optional[List[str]] = None
    award_level: Optional[str] = None
    source: Optional[str] = None
    search_keywords: Optional[str] = None

class PaperKnowledgeUpdate(BaseModel):
    """更新论文知识条目"""
    title: Optional[str] = None
    year: Optional[int] = None
    competition: Optional[str] = None
    problem_type: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[int] = None
    
    pdf_path: Optional[str] = None
    docx_path: Optional[str] = None
    code_path: Optional[str] = None
    data_path: Optional[str] = None
    
    abstract: Optional[str] = None
    summary: Optional[str] = None
    methods_used: Optional[List[str]] = None
    models_used: Optional[List[str]] = None
    key_points: Optional[Dict[str, Any]] = None
    
    tags: Optional[List[str]] = None
    award_level: Optional[str] = None
    source: Optional[str] = None
    search_keywords: Optional[str] = None

class PaperSearchRequest(BaseModel):
    """检索请求"""
    query: str = Field(..., description="查询文本（题目或关键词）")
    competition: Optional[str] = Field(None, description="竞赛类型过滤")
    year: Optional[int] = Field(None, description="年份过滤")
    category: Optional[str] = Field(None, description="问题类别过滤")
    methods: Optional[List[str]] = Field(None, description="方法过滤")
    top_k: int = Field(5, description="返回结果数量", ge=1, le=20)
    use_semantic: bool = Field(True, description="是否使用语义检索")
    use_keyword: bool = Field(True, description="是否使用关键词检索")

class PaperSearchResponse(BaseModel):
    """检索响应"""
    papers: List[Dict[str, Any]]
    total: int
    query: str
    search_method: str  # "keyword", "semantic", "hybrid"

class PaperKnowledgeResponse(BaseModel):
    """论文知识响应"""
    id: int
    title: str
    year: int
    competition: str
    problem_type: Optional[str]
    category: Optional[str]
    difficulty: Optional[int]
    pdf_path: Optional[str]
    docx_path: Optional[str]
    code_path: Optional[str]
    data_path: Optional[str]
    abstract: Optional[str]
    summary: Optional[str]
    methods_used: Optional[List[str]] = []
    models_used: Optional[List[str]] = []
    key_points: Optional[Dict[str, Any]] = {}
    tags: Optional[List[str]] = []
    award_level: Optional[str]
    source: Optional[str]
    created_at: Optional[str]
