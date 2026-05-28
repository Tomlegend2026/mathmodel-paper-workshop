# 华为AI训练营 - 数模论文工坊集成部署指南

## 📋 概述

本项目将**数学建模论文工坊**与**华为AI训练营**结合，通过 **Nexent 平台**实现智能化论文评审功能。

### 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                     华为AI训练营 / Nexent 平台                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              论文评审助手 (Nexent Agent)                    │   │
│  │  - 智能体编排                                              │   │
│  │  - 对话界面                                                │   │
│  │  - MCP 工具调用                                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                    SSE 协议 (HTTP)                               │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       本地 MCP Server                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              mcp_server.py (FastMCP)                     │   │
│  │                                                          │   │
│  │  工具集:                                                  │   │
│  │  ├── upload_and_parse_paper    # 论文解析                  │   │
│  │  ├── comprehensive_review      # 多维度评审                │   │
│  │  ├── generate_solution_code    # 代码生成                  │   │
│  │  ├── generate_visualization_code  # 图表生成              │   │
│  │  ├── suggest_structure_optimization  # 结构优化           │   │
│  │  └── generate_review_report_docx  # Word报告              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              SiliconFlow LLM API                          │   │
│  │              (Qwen/Qwen2.5-VL-72B-Instruct)             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 前置要求

- Python 3.10+
- Node.js 18+ (前端)
- SiliconFlow API Key
- Nexent 平台账户

### 1. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 安装 MCP Server 依赖

```bash
pip install fastmcp uvicorn python-docx PyPDF2 requests pyyaml
```

### 3. 配置环境变量

创建 `backend/.env` 文件：

```env
SILICONFLOW_API_KEY=your_api_key_here
LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
LLM_BASE_URL=https://api.siliconflow.cn/v1
```

### 4. 启动 MCP Server

```bash
# Windows
python mcp_server.py

# 或使用启动脚本
start_mcp_http.bat
```

服务器启动后会显示：
```
============================================================
数学建模论文全方位评审助手 - MCP Server
============================================================
API Key: 已配置
LLM Model: Qwen/Qwen2.5-VL-72B-Instruct
LLM Base URL: https://api.siliconflow.cn/v1
Data Directory: D:\MathematicModeling\mathmodel_workshop\data
============================================================
Uvicorn running on http://0.0.0.0:8004
```

---

## 🔧 Nexent 平台配置

### 第 1 步：获取本机 IP 地址

```powershell
ipconfig | findstr "IPv4"
```

记住返回的 IP 地址（如 `192.168.2.1`），将在下一步使用。

### 第 2 步：在 Nexent 中添加 MCP 服务器

1. 打开 Nexent 平台
2. 进入「智能体管理」→ 选择「论文评审助手」
3. 点击「配置智能体能力」

4. 在「MCP 工具」标签页，点击「添加 MCP 服务器」

5. 填写配置：

| 字段 | 值 |
|------|-----|
| **服务器名称** | `math-modeling-paper-reviewer` |
| **服务器 URL** | `http://192.168.2.1:8004/mcp` |
| **服务器 Bearer Token** | （留空）|

6. 点击「添加」并验证连接

### 第 3 步：导入智能体配置

将 `nexent/paper_review_assistant.json` 导入到 Nexent 平台：

1. 在 Nexent 的「智能体市场」或「导入」功能中
2. 选择 `nexent/paper_review_assistant.json` 文件
3. 完成导入

---

## 📁 项目结构说明

```
mathmodel_workshop/
├── mcp_server.py              # MCP Server 入口 (FastMCP + SSE)
├── nexent/
│   └── paper_review_assistant.json  # Nexent 智能体配置
├── backend/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── review/        # 论文评审 API
│   │   │   └── knowledge/    # 知识库 API
│   │   └── main.py           # FastAPI 入口
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── review/        # 评审页面
│   │   │   └── ai-engine/    # AI 引擎
│   │   └── App.tsx
│   └── package.json
└── docs/                      # 文档目录
```

---

## 🛠️ 可用 MCP 工具

### 1. upload_and_parse_paper

解析论文文件（PDF/DOCX/TXT）

```python
result = await upload_and_parse_paper(
    file_path="path/to/paper.pdf",
    paper_type="math_modeling"  # math_modeling/academic/thesis/course
)
```

### 2. comprehensive_review

多维度论文评审

```python
result = await comprehensive_review(
    paper_id="paper_0001",
    review_aspects=["问题分析", "模型建立", "求解方法", "结果分析", "论文写作"]
)
```

### 3. generate_solution_code

生成求解代码

```python
result = await generate_solution_code(
    problem_description="某城市交通优化问题...",
    algorithm_type="optimization",
    programming_language="python"
)
```

### 4. generate_visualization_code

生成可视化代码

```python
result = await generate_visualization_code(
    data_description="某城市2018-2024年GDP数据",
    chart_type="line",
    programming_language="python"
)
```

### 5. suggest_structure_optimization

论文结构优化建议

```python
result = await suggest_structure_optimization(paper_id="paper_0001")
```

### 6. generate_review_report_docx

生成 Word 评审报告

```python
result = await generate_review_report_docx(
    paper_id="paper_0001",
    output_dir="output"
)
```

---

## 🌐 前端集成

前端可以通过两种方式使用 MCP 服务：

### 方式 1：直接调用后端 API

```typescript
// frontend/src/modules/review/api.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const reviewApi = {
  uploadPaper: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE}/review/upload`, formData);
  },

  getReview: (paperId: string) => {
    return axios.get(`${API_BASE}/review/${paperId}`);
  }
};
```

### 方式 2：通过 Agent Service 调用

```typescript
// frontend/src/modules/ai-engine/services/agent-service.ts
import { agentService } from './agent-service';

const response = await agentService.sendMessage(
  '请评审这篇论文：C:\\papers\\math_modeling_paper.pdf'
);
```

---

## 📝 华为AI训练营部署检查清单

### 环境检查

- [ ] Python 3.10+ 已安装
- [ ] Node.js 18+ 已安装
- [ ] SiliconFlow API Key 已配置
- [ ] Nexent 平台账户已创建

### MCP Server 检查

- [ ] 依赖已安装 (`fastmcp`, `uvicorn`, `python-docx`, `PyPDF2`)
- [ ] 服务器能正常启动 (`python mcp_server.py`)
- [ ] 端口 8004 无冲突
- [ ] 本机 IP 已确认

### Nexent 配置检查

- [ ] MCP 服务器添加成功
- [ ] 工具列表显示 6 个工具
- [ ] `upload_and_parse_paper` 可用
- [ ] `comprehensive_review` 可用
- [ ] 论文上传功能正常

### 功能测试

- [ ] PDF 文件解析正常
- [ ] DOCX 文件解析正常
- [ ] 多维度评审返回结果
- [ ] Word 报告生成成功

---

## ❓ 常见问题

### Q1: Nexent 连接 MCP 服务器失败

**原因**: 使用了 `localhost` 地址

**解决**:
1. 获取本机真实 IP: `ipconfig | findstr "IPv4"`
2. 在 Nexent 中使用真实 IP: `http://192.168.x.x:8004/mcp`

### Q2: MCP 服务器启动报错 "Port already in use"

**解决**:
1. 检查端口占用: `netstat -ano | findstr 8004`
2. 关闭占用进程或修改 `mcp_server.py` 中的端口

### Q3: PDF 解析失败

**解决**:
1. 安装 PyPDF2: `pip install PyPDF2`
2. 检查 PDF 是否加密或损坏

### Q4: LLM API 调用失败

**解决**:
1. 确认 `SILICONFLOW_API_KEY` 正确
2. 检查 API 额度是否充足
3. 确认网络能访问 `api.siliconflow.cn`

---

## 📞 技术支持

- **GitHub Issues**: https://github.com/Tomlegend2026/mathmodel-paper-workshop/issues
- **Nexent 文档**: https://github.com/ModelEngine-Group/nexent
- **SiliconFlow**: https://siliconflow.cn
