# 论文评审助手智能体 — 基于 FastMCP 的多维度论文评审系统

跑在 **Nexent** 平台上的专业论文评审助手 Agent，以 FastMCP Server 的形式在本地运行，通过 SSE 协议与 Nexent 智能体通信。支持数学建模论文、学术论文、学位论文、课程论文四种类型的多维度评审，并自动生成 Word 格式评审报告。

## 架构

```
┌─────────────────────────────────────────┐
│           Nexent 推理面                   │
│    Qwen 大模型 — 分析、评审、评分、报告     │
└──────────────┬──────────────────────────┘
               │ SSE
┌──────────────▼──────────────────────────┐
│         本地 MCP 执行面 (FastMCP)         │
│  ├─ 文档解析引擎 (PDF/DOCX/TXT)          │
│  ├─ 论文类型识别器                        │
│  ├─ 多维度评分引擎                        │
│  ├─ DOCX 报告生成器 (python-docx)         │
│  └─ 代码生成模块 (Python/MATLAB)          │
└─────────────────────────────────────────┘
```

## 支持的论文类型与评审维度

| 论文类型 | 评审维度 | 分值分布 |
|---------|---------|---------|
| 数学建模论文 | 问题分析、模型建立、求解方法、结果分析、论文写作 | 20/30/20/15/15 |
| 学术论文 | 创新性、方法论、实验与结果、文献综述、写作质量 | 25/25/20/15/15 |
| 学位论文 | 研究意义、文献综述、研究方法、研究结果、论文规范 | 15/20/20/25/20 |
| 课程论文 | 问题理解、内容质量、分析能力、结构组织、格式规范 | 20/30/20/15/15 |

## MCP 工具列表

| 工具名称 | 功能描述 |
|---------|---------|
| `upload_and_parse_paper` | 上传并解析论文文件（PDF/DOCX/TXT） |
| `comprehensive_review` | 对论文进行多维度评审，生成评分报告 |
| `generate_solution_code` | 根据问题描述生成求解代码 |
| `generate_visualization_code` | 生成数据可视化代码 |
| `suggest_structure_optimization` | 分析论文结构并给出优化建议 |
| `generate_review_report_docx` | 生成 Word 格式的评审报告 |

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
pip install fastmcp uvicorn python-docx PyPDF2 requests pyyaml

# 配置环境变量
export SILICONFLOW_API_KEY=your_api_key_here
```

### 2. 启动 MCP 服务器

```bash
python mcp_server.py
# 或双击运行
start_mcp_http.bat
```

### 3. 在 Nexent 中配置

1. 打开 Nexent 平台，进入智能体编辑页面
2. 点击「工具」→「添加 MCP 服务器」
3. 选择 SSE 协议，输入地址：`http://<本机IP>:8004/sse`
4. 点击「连通性校验」确认连接成功

## 项目结构

```
mathmodel_workshop/
├── mcp_server.py                     # MCP Server 主程序
├── start_mcp_http.bat               # 一键启动脚本
├── test_mcp_server.py               # 测试脚本
├── nexent/
│   ├── paper_review_assistant.json   # Nexent 智能体配置
│   └── *.png                         # 功能展示截图
├── backend/                          # FastAPI 后端
│   └── app/modules/                  # 业务模块
├── frontend/                         # React 前端
└── skills/                           # AI 技能模块
```

## 许可证

MIT License

## 作者

Tom — [GitHub](https://github.com/Tomlegend2026)

## 致谢

- [Nexent (ModelEngine)](https://github.com/ModelEngine-Group/nexent) - 零代码智能体平台
- [SiliconFlow](https://siliconflow.cn) - LLM API 服务
