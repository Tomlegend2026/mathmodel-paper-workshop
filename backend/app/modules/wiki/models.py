from sqlalchemy import Column, Integer, String, Text, JSON
from ...shared.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, index=True)
    competition = Column(String(50))       # 国赛/美赛/研赛
    title = Column(String(200), nullable=False)
    category = Column(String(50))          # 优化/预测/评价/分类
    content = Column(Text)                 # 题目全文
    tags = Column(JSON)                    # ["线性规划","多目标"]
    difficulty = Column(Integer)           # 1-5
