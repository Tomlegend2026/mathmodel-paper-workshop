"""
论文知识库批量导入脚本

使用方法：
1. 准备好论文数据（可以是 Excel/CSV 或直接编辑此脚本）
2. 运行: python seed_papers.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime

# 直接配置数据库连接
DATABASE_URL = "sqlite+aiosqlite:///./mathmodel.db"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class PaperKnowledge(Base):
    """优秀论文知识库"""
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


async def create_sample_papers():
    """创建示例论文数据"""
    
    sample_papers = [
        {
            "title": "2024年高教社杯全国大学生数学建模竞赛A题 - 单车共享调度优化模型",
            "year": 2024,
            "competition": "国赛",
            "problem_type": "A",
            "category": "优化",
            "difficulty": 4,
            "abstract": "本文针对共享单车调度问题，建立了多目标优化模型。首先分析了共享单车的时空分布特征，提出了基于用户需求的预测模型。然后通过遗传算法求解最优调度方案，实现了运营成本最小化和用户满意度最大化的双重目标。",
            "summary": "问题：共享单车调度优化。方法：多目标规划、遗传算法、时空预测模型。结果：运营成本降低15%，用户满意度提升20%。",
            "methods_used": ["多目标规划", "遗传算法", "时空预测", "聚类分析"],
            "models_used": ["整数规划", "网络流模型", "时间序列"],
            "key_points": {
                "问题分析": "从供需平衡角度分析调度需求",
                "模型建立": "建立双层规划模型，上层为调度中心，下层为用户选择",
                "求解算法": "采用NSGA-II多目标遗传算法",
                "结果验证": "通过历史数据验证模型有效性"
            },
            "tags": ["共享单车", "调度优化", "多目标", "遗传算法", "时空分布"],
            "award_level": "国一",
            "source": "自整理",
            "search_keywords": "共享单车 调度 优化 多目标 遗传算法 时空分布 网络流"
        },
        {
            "title": "2023年全国大学生数学建模竞赛B题 - 城市交通流量预测与控制",
            "year": 2023,
            "competition": "国赛",
            "problem_type": "B",
            "category": "预测",
            "difficulty": 3,
            "abstract": "本文针对城市交通流量预测问题，提出了基于深度学习的时空预测模型。通过整合多源数据（天气、节假日、历史流量等），构建了LSTM-Attention混合模型，实现了对未来24小时交通流量的精准预测。",
            "summary": "问题：交通流量预测。方法：LSTM神经网络、Attention机制、特征工程。结果：预测准确率达到92%。",
            "methods_used": ["深度学习", "LSTM", "Attention机制", "特征工程"],
            "models_used": ["神经网络", "时间序列", "回归分析"],
            "key_points": {
                "数据预处理": "处理缺失值和异常值，构建时空特征",
                "模型设计": "LSTM捕获时序依赖，Attention捕获空间依赖",
                "参数调优": "使用网格搜索和交叉验证",
                "对比实验": "与ARIMA、SVM等baseline对比"
            },
            "tags": ["交通流量", "预测", "深度学习", "LSTM", "时空数据"],
            "award_level": "国二",
            "source": "知网",
            "search_keywords": "交通流量 预测 深度学习 LSTM 时空数据 神经网络"
        },
        {
            "title": "2024年美国大学生数学建模竞赛C题 - 基于多源数据的城市内涝风险评估",
            "year": 2024,
            "competition": "美赛",
            "problem_type": "C",
            "category": "评价",
            "difficulty": 4,
            "abstract": "本文针对城市内涝风险评估问题，构建了多层次综合评价体系。从气象、地形、排水系统三个维度提取评价指标，采用AHP-权法确定权重，通过模糊综合评价得到各区域的内涝风险等级。",
            "summary": "问题：城市内涝风险评估。方法：AHP层次分析法、熵权法、模糊综合评价。结果：识别出15个高风险区域。",
            "methods_used": ["层次分析法", "熵权法", "模糊综合评价", "GIS空间分析"],
            "models_used": ["多指标评价", "权重分配", "风险分级"],
            "key_points": {
                "指标体系": "构建3个一级指标、12个二级指标",
                "权重确定": "主观AHP与客观熵权法结合",
                "评价模型": "模糊综合评价确定风险等级",
                "可视化": "使用GIS绘制风险分布图"
            },
            "tags": ["城市内涝", "风险评估", "综合评价", "AHP", "GIS"],
            "award_level": "M奖",
            "source": "自整理",
            "search_keywords": "城市内涝 风险评估 综合评价 AHP 熵权法 模糊评价 GIS"
        }
    ]
    
    async with async_session() as db:
        try:
            for paper_data in sample_papers:
                paper = PaperKnowledge(**paper_data)
                db.add(paper)
            
            await db.commit()
            print(f"✅ 成功导入 {len(sample_papers)} 篇论文")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ 导入失败：{str(e)}")
            raise


if __name__ == "__main__":
    print("开始导入论文数据...")
    asyncio.run(create_sample_papers())
    print("导入完成！")
