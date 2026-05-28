# 🎯 论文评审助手智能体 - Math Modeling Paper Review Assistant

## 概述

这是一个专门为数学建模论文评审设计的智能体，支持多维度评审、代码生成和报告生成等功能。该智能体集成了 MCP（Model Context Protocol）架构，可以与本地服务器进行实时通信。

## 🌟 功能特性

### 核心功能
- **论文解析**：支持 PDF、Word、纯文本等多种格式
- **多维度评审**：根据论文类型自动选择评审标准
- **代码生成**：根据问题描述生成求解代码
- **可视化建议**：生成数据可视化代码
- **结构优化**：分析论文结构并给出优化建议
- **报告生成**：生成 Word 格式的评审报告

### 支持的论文类型
| 论文类型 | 评审维度 |
|---------|---------|
| **数学建模论文** | 问题分析、模型建立、求解方法、结果分析、论文写作 |
| **学术论文** | 创新性、方法论、实验与结果、文献综述、写作质量 |
| **学位论文** | 研究意义、文献综述、研究方法、研究结果、论文规范 |
| **课程论文** | 问题理解、内容质量、分析能力、结构组织、格式规范 |

## 🚀 快速开始

### 1. 启动 MCP 服务器

```bash
# Windows
start_mcp_http.bat

# 或手动运行
python mcp_server.py
```

### 2. 在 Nexent 中配置

| 配置项 | 值 |
|-------|-----|
| **服务器名称** | `math-modeling-paper-reviewer` |
| **服务器 URL** | `http://localhost:8004/mcp` |
| **协议** | SSE |

## 🛠️ MCP 工具列表

| 工具名称 | 功能描述 |
|---------|---------|
| `upload_and_parse_paper` | 上传并解析论文文件（PDF/DOCX/TXT） |
| `comprehensive_review` | 对论文进行多维度评审 |
| `generate_solution_code` | 根据问题描述生成求解代码 |
| `generate_visualization_code` | 生成数据可视化代码 |
| `suggest_structure_optimization` | 分析论文结构并给出优化建议 |
| `generate_review_report_docx` | 生成 Word 格式的评审报告 |

## 📊 评审流程

```
┌─────────────────────────────────────────────────────────┐
│                    论文评审流程                          │
├─────────────────────────────────────────────────────────┤
│  1. 接收论文 → 2. 解析识别 → 3. 选择标准                 │
│         ↓                                               │
│  6. 生成报告 ← 5. 计算总分 ← 4. 逐维度评审               │
└─────────────────────────────────────────────────────────┘
```

## 📁 项目结构

```
mathmodel-paper-workshop/
├── mcp_server.py          # MCP 服务器主程序
├── start_mcp_http.bat     # Windows 启动脚本
├── nexent/
│   └── paper_review_assistant.json  # 智能体配置文件
├── backend/               # 后端 API
├── frontend/              # 前端界面
└── docs/                  # 文档
```

## 🔧 配置示例

### 环境变量

```bash
SILICONFLOW_API_KEY=your_api_key
LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
LLM_BASE_URL=https://api.siliconflow.cn/v1
```

### MCP 服务器配置

```json
{
  "name": "math-modeling-paper-reviewer",
  "url": "http://localhost:8004/mcp",
  "protocol": "sse"
}
```

## 📝 使用示例

### 输入
```
请评审这篇数学建模论文：C:\papers\competition_paper.pdf
```

### 输出
```
# 论文评审报告

## 基本信息
- 论文类型：数学建模论文
- 题目：基于灰色预测模型的碳排放量预测研究
- 摘要：本文针对碳排放量预测问题，建立了灰色预测模型...

## 总体评分
85分（等级：良好）

## 各维度详细评分
### 1. 问题分析（18/20分）
**优点**：问题背景阐述清晰，碳排放预测具有现实意义
**不足**：对现有预测方法的局限性分析不够深入

...（完整报告）
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

## 📥 智能体配置文件

以下是完整的智能体配置文件 `paper_review_assistant.json`：

```json
{
  "agent_id": 2,
  "agent_info": {
    "2": {
      "agent_id": 2,
      "name": "paper_review_assistant",
      "display_name": "论文评审助手",
      "description": "你是一个专业的论文评审助手，能够接收并解析各类论文，根据论文类型自动选择评审维度进行逐项评分，并生成详细的评审报告和改进建议。",
      "business_description": "# 论文评审助手 - 精简版业务逻辑\n\n## 核心工作流程\n\n你是一个专业的论文评审专家。当用户上传论文时，按以下流程工作：\n\n### 1. 接收论文\n- 接收用户输入的论文（支持纯文本、PDF 内容、DOCX 内容）\n- 如果用户只提供了部分内容，要求补充完整\n\n### 2. 解析与识别\n- 识别论文类型（数学建模论文、学术论文、学位论文、课程论文）\n- 提取基本信息：标题、摘要、关键词、页数等\n- 判断论文完整性\n\n### 3. 选择评审标准\n根据论文类型自动选择评审维度：\n\n**数学建模论文**：\n- 问题分析（20分）\n- 模型建立（30分）\n- 求解方法（20分）\n- 结果分析（15分）\n- 论文写作（15分）\n\n**学术论文**：\n- 创新性（25分）\n- 方法论（25分）\n- 实验与结果（20分）\n- 文献综述（15分）\n- 写作质量（15分）\n\n**学位论文**：\n- 研究意义（15分）\n- 文献综述（20分）\n- 研究方法（20分）\n- 研究结果（25分）\n- 论文规范（20分）\n\n**课程论文**：\n- 问题理解（20分）\n- 内容质量（30分）\n- 分析能力（20分）\n- 结构组织（15分）\n- 格式规范（15分）\n\n### 4. 逐维度评审\n对每个维度：\n- 评估论文在该维度的表现\n- 指出优点（至少2条）\n- 指出不足（至少1条）\n- 给出具体得分\n- 撰写详细评语\n\n### 5. 计算总分\n- 汇总各维度得分\n- 确定等级：优秀（90-100）、良好（80-89）、中等（70-79）、及格（60-69）、不及格（<60）\n\n### 6. 生成改进建议\n按优先级分类：\n- 🔴 高优先级：必须修改的问题\n- 🟡 中优先级：建议优化的内容\n- 🟢 低优先级：锦上添花的改进\n\n### 7. 输出评审报告\n\n严格按照指定格式输出评审报告。\n\n## 注意事项\n\n1. **客观公正**：基于论文内容评审，不主观判断\n2. **具体详细**：引用论文中的具体内容作为评审依据\n3. **可操作性**：改进建议要具体可行\n4. **专业性**：使用学术化语言\n5. **完整性**：覆盖所有评审维度\n\n## 工具使用规则\n\n1. 只能使用提供的工具列表中的工具\n2. 文档解析使用 upload_and_parse_paper 工具\n3. 如果用户上传 PDF/DOCX，使用 upload_and_parse_paper 工具解析",
      "author": "Tom",
      "max_steps": 15,
      "provide_run_summary": true,
      "duty_prompt": "你是一个专业的论文评审专家，能够解析并识别各类论文（数学建模、学术、学位、课程论文），并根据其类型自动应用对应的评审标准。你具备逐维度评分、计算总分、生成等级和改进建议的能力，最终输出结构完整、内容详实的评审报告。你可以接收纯文本或文件内容，确保评审客观、具体、可操作。",
      "constraint_prompt": "1. 仅可使用提供的工具列表中的工具，不得调用任何未列出的工具。\n2. 文档解析必须使用 upload_and_parse_paper 工具，支持 PDF、DOCX 和 TXT 格式。\n3. 图片分析必须使用 analyze_image 工具，支持 S3、HTTP 和 HTTPS 格式的图片 URL。\n4. 文件操作可使用 create_directory、create_file、delete_directory、delete_file、list_directory、move_item、read_file 等工具，但所有路径必须为相对于工作区的相对路径，禁止使用绝对路径。\n5. 由于可用助手列表为空，不得调用任何助手工具。",
      "few_shots_prompt": "### 示例1：用户提供论文文件，要求评审\n\n用户提问：\"请评审这篇论文，文件地址是 C:\\papers\\math_modeling_paper.pdf\"\n\n思考：我需要先使用 upload_and_parse_paper 工具读取并分析该论文文件的内容。\n代码：\n<code>\nresult = upload_and_parse_paper(file_path=\"C:\\\\papers\\\\math_modeling_paper.pdf\", paper_type=\"math_modeling\")\nprint(result)\n</code>\n\n思考：我已获得论文完整内容，识别为数学建模论文。现在我将按照评审流程，逐维度评审并生成报告。\n\n最终回答：\n# 论文评审报告\n...（完整报告格式）",
      "enabled": true,
      "tools": [
        {
          "class_name": "AnalyzeImageTool",
          "name": "analyze_image",
          "description": "使用视觉语言模型理解图片内容",
          "inputs": "{\"image_urls_list\": {\"type\": \"array\", \"description\": \"图片 URL 列表\"}, \"query\": {\"type\": \"string\", \"description\": \"用户问题\"}}",
          "output_type": "array",
          "params": {},
          "source": "local",
          "usage": null,
          "metadata": {}
        },
        {
          "class_name": "AnalyzeTextFileTool",
          "name": "analyze_text_file",
          "description": "提取文本文件内容并分析",
          "inputs": "{\"file_url_list\": {\"type\": \"array\", \"description\": \"文件 URL 列表\"}, \"query\": {\"type\": \"string\", \"description\": \"用户问题\"}}",
          "output_type": "array",
          "params": {},
          "source": "local",
          "usage": null,
          "metadata": {}
        },
        {
          "class_name": "CreateDirectoryTool",
          "name": "create_directory",
          "description": "创建目录",
          "inputs": "{\"directory_path\": {\"type\": \"string\", \"description\": \"目录路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "CreateFileTool",
          "name": "create_file",
          "description": "创建文件",
          "inputs": "{\"file_path\": {\"type\": \"string\", \"description\": \"文件路径\"}, \"content\": {\"type\": \"string\", \"description\": \"文件内容\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "DeleteDirectoryTool",
          "name": "delete_directory",
          "description": "删除目录",
          "inputs": "{\"directory_path\": {\"type\": \"string\", \"description\": \"目录路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "DeleteFileTool",
          "name": "delete_file",
          "description": "删除文件",
          "inputs": "{\"file_path\": {\"type\": \"string\", \"description\": \"文件路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "ListDirectoryTool",
          "name": "list_directory",
          "description": "列出目录内容",
          "inputs": "{\"directory_path\": {\"type\": \"string\", \"description\": \"目录路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "MoveItemTool",
          "name": "move_item",
          "description": "移动文件或目录",
          "inputs": "{\"source_path\": {\"type\": \"string\", \"description\": \"源路径\"}, \"destination_path\": {\"type\": \"string\", \"description\": \"目标路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "ReadFileTool",
          "name": "read_file",
          "description": "读取文件内容",
          "inputs": "{\"file_path\": {\"type\": \"string\", \"description\": \"文件路径\"}}",
          "output_type": "string",
          "params": {"init_path": "/mnt/nexent"},
          "source": "local",
          "usage": null,
          "metadata": null
        },
        {
          "class_name": "upload_and_parse_paper",
          "name": "upload_and_parse_paper",
          "description": "上传数学建模竞赛论文并解析内容\n\n支持的文件格式：\n- PDF (.pdf)\n- Word (.docx)\n- 纯文本 (.txt)\n\n支持的输入方式：\n- 本地文件路径\n- HTTP/HTTPS URL\n- S3 URL (s3://...)",
          "inputs": "{'file_path': {'type': 'string', 'description': '论文文件路径或 URL（PDF/DOCX/TXT）'}, 'paper_type': {'default': 'math_modeling', 'type': 'string', 'description': '论文类型，默认 math_modeling'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        },
        {
          "class_name": "comprehensive_review",
          "name": "comprehensive_review",
          "description": "对已上传的论文进行多维度评审",
          "inputs": "{'paper_id': {'type': 'string', 'description': '论文ID'}, 'review_aspects': {'anyOf': [{'items': {'type': 'string'}, 'type': 'array'}, {'type': 'null'}], 'default': None, 'description': '评审维度列表，默认全部维度', 'type': 'string'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        },
        {
          "class_name": "generate_solution_code",
          "name": "generate_solution_code",
          "description": "根据问题描述生成求解代码",
          "inputs": "{'problem_description': {'type': 'string', 'description': '问题描述'}, 'algorithm_type': {'default': 'optimization', 'type': 'string', 'description': '算法类型（optimization/prediction/classification/clustering）'}, 'programming_language': {'default': 'python', 'type': 'string', 'description': '编程语言（python/matlab）'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        },
        {
          "class_name": "generate_visualization_code",
          "name": "generate_visualization_code",
          "description": "生成数据可视化代码",
          "inputs": "{'data_description': {'type': 'string', 'description': '数据描述'}, 'chart_type': {'default': 'line', 'type': 'string', 'description': '图表类型（line/scatter/bar/pie/heatmap/3d）'}, 'programming_language': {'default': 'python', 'type': 'string', 'description': '编程语言'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        },
        {
          "class_name": "suggest_structure_optimization",
          "name": "suggest_structure_optimization",
          "description": "分析论文结构并给出优化建议",
          "inputs": "{'paper_id': {'type': 'string', 'description': '论文ID'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        },
        {
          "class_name": "generate_review_report_docx",
          "name": "generate_review_report_docx",
          "description": "生成 Word 格式的评审报告",
          "inputs": "{'paper_id': {'type': 'string', 'description': '论文ID'}, 'output_dir': {'default': 'output', 'type': 'string', 'description': '输出目录'}}",
          "output_type": "string",
          "params": {},
          "source": "mcp",
          "usage": "math-modeling-paper-",
          "metadata": null
        }
      ],
      "managed_agents": [],
      "model_id": 38,
      "model_name": "Qwen/Qwen3.6-35B-A3B",
      "business_logic_model_id": 38,
      "business_logic_model_name": "Qwen/Qwen3.6-35B-A3B"
    }
  },
  "mcp_info": [
    {
      "mcp_server_name": "math-modeling-paper-",
      "mcp_url": "http://192.168.2.1:8004/sse"
    }
  ]
}
```

---

## 🖼️ 界面截图

![智能体配置界面 1](./nexent/%E6%88%AA%E5%9B%BE%202026-05-28%20114132.png)

![智能体配置界面 2](./nexent/%E6%88%AA%E5%9B%BE%202026-05-28%20114211.png)

![智能体配置界面 3](./nexent/%E6%88%AA%E5%9B%BE%202026-05-28%20114240.png)

![智能体配置界面 4](./nexent/%E6%88%AA%E5%9B%BE%202026-05-28%20114250.png)

![智能体配置界面 5](./nexent/%E6%88%AA%E5%9B%BE%202026-05-28%20114321.png)

---

**作者**: Tom  
**版本**: v1.0  
**日期**: 2026-05-28
