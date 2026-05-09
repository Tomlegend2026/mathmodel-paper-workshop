"""
检索功能测试脚本

测试论文知识库的检索功能是否正常工作
"""

import asyncio
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import select, or_, and_
from datetime import datetime

# 配置数据库连接
DATABASE_URL = "sqlite+aiosqlite:///./mathmodel.db"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class PaperKnowledge(Base):
    """论文知识库模型"""
    __tablename__ = "paper_knowledge"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    year = Column(Integer, index=True)
    competition = Column(String(50), index=True)
    problem_type = Column(String(20))
    category = Column(String(50))
    difficulty = Column(Integer)
    pdf_path = Column(String(500))
    docx_path = Column(String(500))
    code_path = Column(String(500))
    data_path = Column(String(500))
    abstract = Column(Text)
    summary = Column(Text)
    methods_used = Column(JSON)
    models_used = Column(JSON)
    key_points = Column(JSON)
    embedding = Column(JSON)
    tags = Column(JSON)
    award_level = Column(String(50))
    source = Column(String(200))
    search_keywords = Column(Text)
    similarity_score = Column(Float)
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
            "abstract": self.abstract,
            "summary": self.summary,
            "methods_used": self.methods_used or [],
            "models_used": self.models_used or [],
            "tags": self.tags or [],
            "award_level": self.award_level,
            "source": self.source,
        }


async def test_keyword_search(query: str):
    """测试关键词检索"""
    print(f"\n{'='*60}")
    print(f"🔍 关键词检索：'{query}'")
    print(f"{'='*60}")
    
    query_terms = query.lower().split()
    
    async with async_session() as db:
        result = await db.execute(select(PaperKnowledge))
        papers = result.scalars().all()
        
        if not papers:
            print("❌ 数据库中还没有论文")
            return []
        
        # 关键词匹配
        scored_papers = []
        for paper in papers:
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''} {paper.search_keywords or ''}".lower()
            score = sum(1 for term in query_terms if term in paper_text)
            if score > 0:
                scored_papers.append((score, paper))
        
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        if scored_papers:
            print(f"✅ 找到 {len(scored_papers)} 篇相关论文：\n")
            for i, (score, paper) in enumerate(scored_papers, 1):
                print(f"{i}. {paper.title}")
                print(f"   匹配分数：{score}")
                print(f"   竞赛：{paper.competition} {paper.problem_type}题 | 类别：{paper.category}")
                print(f"   方法：{', '.join(paper.methods_used or [])}")
                print(f"   摘要：{paper.abstract[:100]}...\n")
        else:
            print("❌ 未找到相关论文")
        
        return [paper for _, paper in scored_papers]


async def test_semantic_search(query: str):
    """测试语义相似度检索"""
    print(f"\n{'='*60}")
    print(f" 语义相似度检索：'{query}'")
    print(f"{'='*60}")
    
    query_terms = set(query.lower().split())
    
    async with async_session() as db:
        result = await db.execute(select(PaperKnowledge))
        papers = result.scalars().all()
        
        if not papers:
            print("❌ 数据库中还没有论文")
            return []
        
        # 语义相似度计算（简化版）
        scored_papers = []
        for paper in papers:
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''}".lower()
            paper_terms = set(paper_text.split())
            
            # Jaccard相似度
            intersection = query_terms & paper_terms
            union = query_terms | paper_terms
            similarity = len(intersection) / len(union) if len(union) > 0 else 0
            
            # 标题加权
            title_bonus = 1.5 if any(term in paper.title.lower() for term in query_terms) else 1.0
            final_score = similarity * title_bonus
            
            if final_score > 0:
                scored_papers.append((final_score, paper))
        
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        if scored_papers:
            print(f"✅ 找到 {len(scored_papers)} 篇相关论文：\n")
            for i, (score, paper) in enumerate(scored_papers, 1):
                print(f"{i}. {paper.title}")
                print(f"   相似度：{score:.3f}")
                print(f"   竞赛：{paper.competition} {paper.problem_type}题 | 类别：{paper.category}")
                print(f"   方法：{', '.join(paper.methods_used or [])}\n")
        else:
            print("❌ 未找到相关论文")
        
        return [paper for _, paper in scored_papers]


async def test_hybrid_search(query: str):
    """测试混合检索"""
    print(f"\n{'='*60}")
    print(f"🎯 混合检索（关键词+语义）：'{query}'")
    print(f"{'='*60}")
    
    query_terms = set(query.lower().split())
    
    async with async_session() as db:
        result = await db.execute(select(PaperKnowledge))
        papers = result.scalars().all()
        
        if not papers:
            print("❌ 数据库中还没有论文")
            return []
        
        scored_papers = []
        for paper in papers:
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''} {paper.search_keywords or ''}".lower()
            
            # 关键词分数
            keyword_score = sum(1 for term in query_terms if term in paper_text)
            
            # 语义分数
            paper_terms = set(paper_text.split())
            semantic_score = len(paper_terms & query_terms) / len(paper_terms | query_terms) if len(paper_terms | query_terms) > 0 else 0
            
            # 标题加权
            title_bonus = 1.5 if any(term in paper.title.lower() for term in query_terms) else 1.0
            
            # 综合分数：关键词40% + 语义60%
            final_score = (0.4 * keyword_score + 0.6 * semantic_score) * title_bonus
            
            if final_score > 0:
                scored_papers.append((final_score, paper))
        
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        if scored_papers:
            print(f"✅ 找到 {len(scored_papers)} 篇相关论文：\n")
            for i, (score, paper) in enumerate(scored_papers, 1):
                print(f"{i}. {paper.title}")
                print(f"   综合分数：{score:.3f}")
                print(f"   竞赛：{paper.competition} {paper.problem_type}题 | 类别：{paper.category}")
                print(f"   方法：{', '.join(paper.methods_used or [])}")
                print(f"   摘要：{paper.abstract[:100]}...\n")
        else:
            print("❌ 未找到相关论文")
        
        return [paper for _, paper in scored_papers]


async def main():
    """运行所有测试"""
    print("🚀 开始测试论文检索功能")
    print("="*60)
    
    # 测试用例
    test_cases = [
        "共享单车 调度",
        "交通 预测 LSTM",
        "城市 风险 评价",
        "优化 算法",
        "2024 国赛",
        "深度学习 神经网络",
        "多目标 遗传",
    ]
    
    for query in test_cases:
        print(f"\n\n")
        await test_keyword_search(query)
        await test_semantic_search(query)
        await test_hybrid_search(query)
    
    print("\n\n" + "="*60)
    print("✅ 检索功能测试完成！")
    print("="*60)


if __name__ == "__main__":
    asyncio.run(main())
