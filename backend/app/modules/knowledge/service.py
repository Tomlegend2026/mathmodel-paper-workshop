from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from typing import List, Optional, Dict, Any
import numpy as np

from .models import PaperKnowledge
from .schemas import PaperKnowledgeCreate, PaperKnowledgeUpdate, PaperSearchRequest

class PaperKnowledgeService:
    """论文知识库服务"""
    
    @staticmethod
    async def create_paper(db: AsyncSession, data: PaperKnowledgeCreate) -> PaperKnowledge:
        """创建论文知识条目"""
        paper = PaperKnowledge(**data.dict())
        db.add(paper)
        await db.commit()
        await db.refresh(paper)
        return paper
    
    @staticmethod
    async def get_paper(db: AsyncSession, paper_id: int) -> Optional[PaperKnowledge]:
        """获取单篇论文"""
        result = await db.execute(
            select(PaperKnowledge).where(PaperKnowledge.id == paper_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_papers(
        db: AsyncSession,
        competition: Optional[str] = None,
        year: Optional[int] = None,
        category: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[PaperKnowledge]:
        """获取论文列表（带筛选）"""
        query = select(PaperKnowledge)
        
        if competition:
            query = query.where(PaperKnowledge.competition == competition)
        if year:
            query = query.where(PaperKnowledge.year == year)
        if category:
            query = query.where(PaperKnowledge.category == category)
        
        query = query.offset(offset).limit(limit).order_by(PaperKnowledge.year.desc())
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update_paper(
        db: AsyncSession,
        paper_id: int,
        data: PaperKnowledgeUpdate
    ) -> Optional[PaperKnowledge]:
        """更新论文知识条目"""
        paper = await PaperKnowledgeService.get_paper(db, paper_id)
        if not paper:
            return None
        
        update_data = data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(paper, field, value)
        
        await db.commit()
        await db.refresh(paper)
        return paper
    
    @staticmethod
    async def delete_paper(db: AsyncSession, paper_id: int) -> bool:
        """删除论文知识条目"""
        paper = await PaperKnowledgeService.get_paper(db, paper_id)
        if not paper:
            return False
        
        await db.delete(paper)
        await db.commit()
        return True
    
    @staticmethod
    async def search_papers(
        db: AsyncSession,
        request: PaperSearchRequest
    ) -> Dict[str, Any]:
        """
        混合检索：关键词匹配 + 语义相似度
        
        返回按相关性排序的论文列表
        """
        # 1. 构建基础查询
        query = select(PaperKnowledge)
        
        # 2. 应用过滤条件
        filters = []
        if request.competition:
            filters.append(PaperKnowledge.competition == request.competition)
        if request.year:
            filters.append(PaperKnowledge.year == request.year)
        if request.category:
            filters.append(PaperKnowledge.category == request.category)
        
        if filters:
            query = query.where(and_(*filters))
        
        # 3. 执行检索
        papers = []
        search_method = "hybrid"
        
        if request.use_keyword and request.use_semantic:
            # 混合检索
            papers = await PaperKnowledgeService._hybrid_search(
                db, query, request
            )
        elif request.use_keyword:
            # 仅关键词检索
            papers = await PaperKnowledgeService._keyword_search(
                db, query, request
            )
            search_method = "keyword"
        elif request.use_semantic:
            # 仅语义检索
            papers = await PaperKnowledgeService._semantic_search(
                db, query, request
            )
            search_method = "semantic"
        else:
            # 无检索条件，返回所有
            result = await db.execute(query.limit(request.top_k))
            papers = result.scalars().all()
        
        # 4. 转换为字典格式
        papers_dict = [paper.to_dict() for paper in papers[:request.top_k]]
        
        return {
            "papers": papers_dict,
            "total": len(papers_dict),
            "query": request.query,
            "search_method": search_method
        }
    
    @staticmethod
    async def _keyword_search(
        db: AsyncSession,
        base_query,
        request: PaperSearchRequest
    ) -> List[PaperKnowledge]:
        """关键词检索"""
        query_terms = request.query.lower().split()
        
        # 构建关键词匹配条件
        keyword_conditions = []
        for term in query_terms:
            keyword_conditions.append(
                or_(
                    PaperKnowledge.title.ilike(f"%{term}%"),
                    PaperKnowledge.abstract.ilike(f"%{term}%"),
                    PaperKnowledge.summary.ilike(f"%{term}%"),
                    PaperKnowledge.search_keywords.ilike(f"%{term}%"),
                )
            )
            
            # 匹配标签
            if request.methods:
                for method in request.methods:
                    keyword_conditions.append(
                        PaperKnowledge.search_keywords.ilike(f"%{method}%")
                    )
        
        if keyword_conditions:
            base_query = base_query.where(or_(*keyword_conditions))
        
        # 按相关度排序（简单实现：匹配的词越多，排名越前）
        # 这里简化处理，实际可以计算TF-IDF分数
        result = await db.execute(base_query.limit(request.top_k * 3))
        papers = result.scalars().all()
        
        # 计算关键词匹配分数
        scored_papers = []
        for paper in papers:
            score = 0
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''} {paper.search_keywords or ''}".lower()
            for term in query_terms:
                if term in paper_text:
                    score += 1
            scored_papers.append((score, paper))
        
        # 按分数排序
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        return [paper for _, paper in scored_papers]
    
    @staticmethod
    async def _semantic_search(
        db: AsyncSession,
        base_query,
        request: PaperSearchRequest
    ) -> List[PaperKnowledge]:
        """
        语义相似度检索
        
        注意：这里需要实现向量嵌入和相似度计算
        当前版本使用简化实现，后续可以集成sentence-transformers
        """
        # 先获取所有符合条件的论文
        result = await db.execute(base_query)
        papers = result.scalars().all()
        
        if not papers:
            return []
        
        # 简化实现：基于关键词重叠的语义相似度
        # TODO: 集成真实的向量嵌入模型（如 sentence-transformers）
        query_terms = set(request.query.lower().split())
        
        scored_papers = []
        for paper in papers:
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''}".lower()
            paper_terms = set(paper_text.split())
            
            # 计算Jaccard相似度
            intersection = query_terms & paper_terms
            union = query_terms | paper_terms
            
            if len(union) > 0:
                similarity = len(intersection) / len(union)
            else:
                similarity = 0
            
            # 加权：标题匹配权重更高
            if any(term in paper.title.lower() for term in query_terms):
                similarity *= 1.5
            
            scored_papers.append((similarity, paper))
        
        # 按相似度排序
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        return [paper for _, paper in scored_papers]
    
    @staticmethod
    async def _hybrid_search(
        db: AsyncSession,
        base_query,
        request: PaperSearchRequest
    ) -> List[PaperKnowledge]:
        """
        混合检索：关键词 + 语义
        
        策略：
        1. 先用关键词检索缩小范围
        2. 再用语义相似度排序
        """
        # 先用关键词检索获取候选集（扩大范围）
        expanded_request = PaperSearchRequest(
            query=request.query,
            competition=request.competition,
            year=request.year,
            category=request.category,
            methods=request.methods,
            top_k=request.top_k * 3,  # 扩大候选集
            use_semantic=False,
            use_keyword=True
        )
        
        candidates = await PaperKnowledgeService._keyword_search(
            db, base_query, expanded_request
        )
        
        if not candidates:
            # 如果关键词没找到，直接用语义检索
            return await PaperKnowledgeService._semantic_search(
                db, base_query, request
            )
        
        # 对候选集进行语义相似度排序
        query_terms = set(request.query.lower().split())
        
        scored_papers = []
        for paper in candidates:
            # 关键词分数
            paper_text = f"{paper.title} {paper.abstract or ''} {paper.summary or ''}".lower()
            keyword_score = sum(1 for term in query_terms if term in paper_text)
            
            # 语义分数（Jaccard相似度）
            paper_terms = set(paper_text.split())
            if len(paper_terms | query_terms) > 0:
                semantic_score = len(paper_terms & query_terms) / len(paper_terms | query_terms)
            else:
                semantic_score = 0
            
            # 加权标题匹配
            title_bonus = 1.5 if any(term in paper.title.lower() for term in query_terms) else 1.0
            
            # 综合分数：关键词40% + 语义60%
            final_score = (0.4 * keyword_score + 0.6 * semantic_score) * title_bonus
            
            scored_papers.append((final_score, paper))
        
        # 按综合分数排序
        scored_papers.sort(key=lambda x: x[0], reverse=True)
        
        return [paper for _, paper in scored_papers]
