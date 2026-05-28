from fastapi import APIRouter, HTTPException
from app.modules.review.schemas import PaperReviewRequest, PaperReviewResponse
import json
import os

router = APIRouter(prefix="/api/review", tags=["论文评审"])

# 加载 Nexent JSON 配置
NEXENT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), '../../../../nexent/paper_review_assistant (2).json')

def load_nexent_config():
    """加载 Nexent 配置"""
    try:
        with open(NEXENT_CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load Nexent config: {e}")
        return None


@router.post("/paper", response_model=PaperReviewResponse)
async def review_paper(request: PaperReviewRequest):
    """
    评审论文
    
    根据 Nexent 配置中的评审逻辑，对论文进行评审
    """
    # 加载 Nexent 配置
    config = load_nexent_config()
    
    if not config:
        raise HTTPException(status_code=500, detail="无法加载评审配置")
    
    # 从配置中提取评审逻辑
    agent_info = config.get('agent_info', {}).get('2', {})
    business_description = agent_info.get('business_description', '')
    
    # 这里简化实现，实际应该调用 LLM API 进行评审
    # 基于 JSON 配置中的业务逻辑进行评审
    
    # 模拟评审过程（实际应该调用 AI 服务）
    review_report = generate_review_report(request.content, business_description)
    
    return PaperReviewResponse(
        paper_type="数学建模论文",  # 实际应该由 AI 识别
        total_score=85,
        grade="良好",
        review_report=review_report,
        dimensions=[
            {"name": "问题分析", "score": 18, "max_score": 20},
            {"name": "模型建立", "score": 26, "max_score": 30},
            {"name": "求解方法", "score": 17, "max_score": 20},
            {"name": "结果分析", "score": 13, "max_score": 15},
            {"name": "论文写作", "score": 11, "max_score": 15},
        ]
    )


def generate_review_report(content: str, business_logic: str) -> str:
    """
    生成评审报告
    
    基于 Nexent 配置中的业务逻辑描述生成评审报告
    """
    # 从 business_logic 中提取评审标准和格式
    # 这里提供一个基础的实现框架
    
    report = """# 论文评审报告

## 基本信息
- 论文类型：数学建模论文
- 题目：基于用户上传内容自动识别
- 摘要：根据论文内容提取

## 总体评分
85分（等级：良好）

## 各维度详细评分

### 1. 问题分析（18/20分）
**优点**：
- 问题背景阐述清晰
- 明确提出了研究目标

**不足**：
- 对现有方法的局限性分析不够深入

**评语**：
问题分析部分较好地界定了研究范围。

### 2. 模型建立（26/30分）
**优点**：
- 模型选择合理
- 推导过程完整

**不足**：
- 未说明模型假设的合理性验证

**评语**：
模型建立扎实，但缺少对模型适用性的论证。

### 3. 求解方法（17/20分）
**优点**：
- 求解步骤详细
- 使用了合适的算法

**不足**：
- 未提供代码实现

**评语**：
求解方法规范，但可读性有待提升。

### 4. 结果分析（13/15分）
**优点**：
- 预测结果以图表形式展示
- 对预测误差进行了分析

**不足**：
- 未与其他模型进行对比验证

**评语**：
结果分析合理，但缺乏横向对比。

### 5. 论文写作（11/15分）
**优点**：
- 语言流畅，逻辑清晰
- 引用格式基本规范

**不足**：
- 部分专业术语未定义

**评语**：
写作质量良好，但细节需完善。

## 优点总结
1. 模型选择合理，推导严谨
2. 求解方法规范，检验充分
3. 结果展示直观，分析到位

## 改进建议

### 🔴 高优先级（必须修改）
1. 缺少模型假设的合理性验证
   - 位置：模型建立部分
   - 建议：增加对模型适用条件的论证

###  中优先级（建议优化）
2. 未与其他模型进行对比
   - 建议：增加与其他方法的对比分析

### 🟢 低优先级（锦上添花）
3. 参考文献数量偏少
   - 建议：补充相关文献

## 参考文献建议
建议补充以下方向的文献：
1. 相关领域的基础理论
2. 最新研究进展
3. 对比方法的相关文献

---
评审完成。
"""
    
    return report
