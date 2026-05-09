from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ...shared.database import Base

class PaperKnowledge(Base):
    """优秀论文知识库"""
    __tablename__ = "paper_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    
    # 基本信息
    title = Column(String(500), nullable=False)  # 论文标题
    year = Column(Integer, index=True)           # 年份
    competition = Column(String(50), index=True) # 国赛/美赛/研赛
    problem_type = Column(String(20))            # A/B/C/D/E题
    category = Column(String(50))                # 优化/预测/评价/分类等
    difficulty = Column(Integer)                 # 难度 1-5
    
    # 文件路径
    pdf_path = Column(String(500))               # PDF文件路径
    docx_path = Column(String(500))              # Word文件路径
    code_path = Column(String(500))              # 代码文件夹路径
    data_path = Column(String(500))              # 数据文件夹路径
    
    # 提取的文本内容（用于检索）
    abstract = Column(Text)                      # 摘要
    summary = Column(Text)                       # 内容总结
    methods_used = Column(JSON)                  # 使用的方法 ["线性规划", "遗传算法"]
    models_used = Column(JSON)                   # 使用的模型 ["整数规划", "网络流"]
    key_points = Column(JSON)                    # 关键要点
    
    # 向量嵌入（用于语义检索）
    embedding = Column(JSON)                     # 向量嵌入（512维或768维）
    
    # 元数据
    tags = Column(JSON)                          # 标签列表
    award_level = Column(String(50))             # 获奖等级（国一/国二/美赛O奖等）
    source = Column(String(200))                 # 来源（知网/自整理等）
    
    # 检索相关
    search_keywords = Column(Text)               # 搜索关键词（用于关键词匹配）
    similarity_score = Column(Float)             # 相似度分数（检索时使用）
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "competition": self.competition,
            "problem_type": self.problem_type,
            "category": self.category,
            "difficulty": self.difficulty,
            "pdf_path": self.pdf_path,
            "docx_path": self.docx_path,
            "code_path": self.code_path,
            "data_path": self.data_path,
            "abstract": self.abstract,
            "summary": self.summary,
            "methods_used": self.methods_used or [],
            "models_used": self.models_used or [],
            "key_points": self.key_points or {},
            "tags": self.tags or [],
            "award_level": self.award_level,
            "source": self.source,
            "search_keywords": self.search_keywords,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
