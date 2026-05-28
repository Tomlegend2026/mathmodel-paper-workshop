# 数模论文工坊 - 论文评审助手集成

一个集成了 **华为 ModelEngine Nexent** 零代码平台智能体的数学建模论文写作辅助系统，可用于**华为AI训练营**。

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Git
- SiliconFlow API Key

### 安装

```bash
# 克隆仓库
git clone https://github.com/Tomlegend2026/mathmodel-paper-workshop.git
cd mathmodel-paper-workshop

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
pip install -r requirements.txt

# 安装 MCP Server 依赖
pip install fastmcp uvicorn python-docx PyPDF2 requests pyyaml
```

### 运行

```bash
# 启动后端（终端 1）
cd backend
uvicorn app.main:app --reload --port 8000

# 启动 MCP Server（终端 2）- 端口 8004
python mcp_server.py

# 启动前端（终端 3）
cd frontend
npm run dev
```

访问 http://localhost:5173

---

## 📋 功能模块

### 1. 五步引导式写作流程

1. **选题与解读** - 理解题目要求
2. **问题分析** - 分析问题结构
3. **建模求解** - 建立数学模型
4. **论文写作** - 撰写完整论文
5. **结果优化** - 优化和改进

### 2. 论文评审助手 ✨

基于 **Nexent 零代码平台**的智能评审系统：

- ✅ 自动识别论文类型（数模/学术/学位/课程）
- ✅ 多维度评审（5 个维度，100 分制）
- ✅ 自动生成评审报告
- ✅ 按优先级分类改进建议

**访问路径**：登录后点击左侧菜单 "论文评审"

### 3. MCP 服务器 - 文档解析 ✨

支持读取 **PDF**、**Word (.docx)** 和 **纯文本 (.txt)** 格式的论文文件：

- ✅ PDF 文件解析（PyPDF2）
- ✅ Word 文档解析（python-docx）
- ✅ 纯文本文件解析
- ✅ 与 Nexent/AI 客户端集成

---

## 🔧 华为AI训练营集成

本项目支持与**华为AI训练营**结合使用，通过 Nexent 平台部署论文评审智能体。

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    华为AI训练营 / Nexent                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              论文评审助手 (Nexent Agent)                │   │
│  │  - 智能体编排                                          │   │
│  │  - MCP 工具调用                                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │ SSE
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  MCP Server (FastMCP)                        │
│  - upload_and_parse_paper    # 论文解析                      │
│  - comprehensive_review      # 多维度评审                    │
│  - generate_solution_code    # 代码生成                      │
│  - generate_visualization_code  # 图表生成                  │
│  - suggest_structure_optimization  # 结构优化               │
│  - generate_review_report_docx  # Word报告                  │
└─────────────────────────────────────────────────────────────┘
```

### 配置步骤

详细配置指南请查看 [HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md](./HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md)

快速配置：

1. 启动 MCP Server：`python mcp_server.py`
2. 在 Nexent 中添加 MCP 服务器
3. 导入 `nexent/paper_review_assistant.json` 智能体配置

---

## 🛠️ 可用 MCP 工具

| 工具名称 | 功能 | 参数 |
|---------|------|------|
| `upload_and_parse_paper` | 解析论文文件 | file_path, paper_type |
| `comprehensive_review` | 多维度评审 | paper_id, review_aspects |
| `generate_solution_code` | 生成代码方案 | problem_description, algorithm_type |
| `generate_visualization_code` | 建议图表 | data_description, chart_type |
| `suggest_structure_optimization` | 结构优化建议 | paper_id |
| `generate_review_report_docx` | 生成 Word 报告 | paper_id, output_dir |

---

## ⚙️ 环境变量

MCP Server 环境变量：

```env
SILICONFLOW_API_KEY=your_api_key_here
LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
LLM_BASE_URL=https://api.siliconflow.cn/v1
```

---

## 📁 项目结构

```
mathmodel_workshop/
├── mcp_server.py                    # MCP Server 入口
├── nexent/
│   └── paper_review_assistant.json  # Nexent 智能体配置
├── backend/                          # FastAPI 后端
│   ├── app/
│   │   ├── modules/                # 业务模块
│   │   └── main.py                 # 入口
│   └── requirements.txt
├── frontend/                        # React 前端
│   ├── src/
│   │   └── modules/
│   │       ├── ai-engine/          # AI 引擎
│   │       ├── review/             # 评审页面
│   │       └── steps/              # 写作流程
│   └── package.json
├── docs/                            # 文档
└── HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md  # 华为AI训练营集成指南
```

---

## 📚 相关文档

- [华为AI训练营集成指南](./HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md)
- [Nexent MCP 配置指南](./NEXENT_MCP_CONFIG_GUIDE.md)
- [本地 Nexent MCP 解决方案](./LOCAL_NEXENT_MCP_SOLUTION.md)
- [MCP 服务器更新说明](./MCP_SERVER_UPDATE.md)

---

## 📄 许可证

MIT License

---

## 👤 作者

Tom - [GitHub](https://github.com/Tomlegend2026)

## 🙏 致谢

- [Nexent (ModelEngine)](https://github.com/ModelEngine-Group/nexent) - 零代码智能体平台
- [SiliconFlow](https://siliconflow.cn) - LLM API
