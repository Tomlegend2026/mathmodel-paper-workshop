from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from ...shared.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=True)
    status = Column(String(20), default="created")  # created/in_progress/completed
    current_step = Column(Integer, default=1)

    # 每个步骤的进度和数据
    step_progress = Column(JSON, default={})  # {1: 80, 2: 60, ...}
    step_data = Column(JSON, default={})      # {step1: {...}, step2: {...}, ...}

    completion_rate = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="projects")
