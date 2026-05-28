# MCP 服务器配置指南

## 📋 概述

MCP (Model Context Protocol) 服务器已配置完成，支持读取 **PDF**、**Word (.docx)** 和 **纯文本 (.txt)** 格式的论文文件。

---

## 🚀 快速开始

### 1. 启动 MCP 服务器

```bash
cd d:\MathematicModeling\mathmodel_workshop
python mcp_server.py
```

### 2. 配置 AI 客户端连接到 MCP

根据你的 AI 客户端类型，选择对应的配置方式：

---

## 🔧 配置示例

### Claude Desktop 配置

编辑 Claude Desktop 配置文件（位置因系统而异）：

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "math-modeling-paper-reviewer": {
      "command": "python",
      "args": [
        "d:\\MathematicModeling\\mathmodel_workshop\\mcp_server.py"
      ],
      "env": {
        "SILICONFLOW_API_KEY": "your_api_key_here",
        "LLM_MODEL": "Qwen/Qwen2.5-VL-72B-Instruct",
        "LLM_BASE_URL": "https://api.siliconflow.cn/v1"
      }
    }
  }
}
```

### Cursor 配置

在 Cursor 设置中添加 MCP 服务器：

1. 打开 Cursor → Settings → Features → MCP
2. 点击 "Add New MCP Server"
3. 配置如下：
   - **Name**: Math Modeling Paper Reviewer
   - **Type**: Command
   - **Command**: `python d:\MathematicModeling\mathmodel_workshop\mcp_server.py`
   - **Environment Variables**:
     ```
     SILICONFLOW_API_KEY=your_api_key_here
     LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
     LLM_BASE_URL=https://api.siliconflow.cn/v1
     ```

### VS Code + Continue 配置

编辑 `.continue/config.json`:

```json
{
  "mcpServers": {
    "math-modeling-paper-reviewer": {
      "command": "python",
      "args": ["d:\\MathematicModeling\\mathmodel_workshop\\mcp_server.py"],
      "env": {
        "SILICONFLOW_API_KEY": "your_api_key_here",
        "LLM_MODEL": "Qwen/Qwen2.5-VL-72B-Instruct",
        "LLM_BASE_URL": "https://api.siliconflow.cn/v1"
      }
    }
  }
}
```

---

## 📝 可用的 MCP 工具

配置完成后，你的 AI 助手将能够使用以下工具：

### 1. `upload_and_parse_paper`
**功能**: 上传并解析论文文件  
**支持格式**: PDF, DOCX, TXT  
**参数**:
- `file_path`: 文件路径
- `paper_type`: 论文类型（默认: math_modeling）

**示例**:
```
请帮我解析这篇论文: C:\papers\traffic_optimization.pdf
```

### 2. `comprehensive_review`
**功能**: 对已上传的论文进行多维度评审  
**参数**:
- `paper_id`: 论文ID
- `review_aspects`: 评审维度列表（可选）

**示例**:
```
请评审论文 paper_0001，重点关注模型建立和求解方法
```

### 3. `generate_code_solution`
**功能**: 根据论文问题生成代码解决方案  
**参数**:
- `paper_id`: 论文ID
- `problem_description`: 问题描述

### 4. `suggest_charts`
**功能**: 建议适合的图表类型  
**参数**:
- `paper_id`: 论文ID
- `data_description`: 数据描述

### 5. `generate_review_report_docx`
**功能**: 生成 Word 格式的评审报告  
**参数**:
- `paper_id`: 论文ID

---

## ✅ 测试配置

### 测试步骤

1. **启动 MCP 服务器**
   ```bash
   python mcp_server.py
   ```

2. **在 AI 客户端中测试**
   
   发送以下消息测试 PDF 解析：
   ```
   请帮我解析这个 PDF 文件: test_paper.pdf
   ```
   
   或测试 Word 文档：
   ```
   请读取这个 Word 文档: example.docx
   ```

3. **验证功能**
   
   如果配置正确，AI 应该能够：
   - ✅ 读取 PDF 文件内容
   - ✅ 读取 Word (.docx) 文件内容
   - ✅ 读取 TXT 文件内容
   - ✅ 提取文本并进行分析

---

## 🔍 故障排除

### 问题 1: PyPDF2 未安装

**错误信息**: 
```
警告: PyPDF2 未安装，PDF 解析功能不可用
```

**解决方案**:
```bash
pip install PyPDF2
```

### 问题 2: 文件路径错误

**错误信息**:
```
文件不存在: xxx
```

**解决方案**:
- 使用绝对路径
- 确保文件确实存在
- 检查路径中的反斜杠是否需要转义

### 问题 3: MCP 服务器无法连接

**解决方案**:
1. 确认 Python 环境正确
2. 检查所有依赖是否安装：
   ```bash
   pip install fastmcp PyYAML python-docx PyPDF2 requests
   ```
3. 查看控制台输出是否有错误信息

### 问题 4: PDF 解析失败

**可能原因**:
- PDF 是扫描版（图片格式），需要 OCR
- PDF 加密或损坏

**解决方案**:
- 对于扫描版 PDF，需要使用 OCR 工具（如 pytesseract）
- 尝试用其他 PDF 阅读器打开文件验证完整性

---

## 📦 依赖清单

已安装的 Python 包：

```
fastmcp>=2.0.0
PyYAML>=6.0
python-docx>=1.1.0
PyPDF2>=3.0.0
requests>=2.31.0
```

---

## 💡 使用技巧

### 1. 批量处理论文

```python
# 可以编写脚本批量处理多个论文
import subprocess

papers = ["paper1.pdf", "paper2.docx", "paper3.txt"]
for paper in papers:
    # 调用 MCP 工具解析
    pass
```

### 2. 自定义评审维度

在调用 `comprehensive_review` 时，可以指定特定的评审维度：

```json
{
  "paper_id": "paper_0001",
  "review_aspects": [
    "选题与假设",
    "模型建立",
    "创新性"
  ]
}
```

### 3. 导出评审报告

使用 `generate_review_report_docx` 生成专业的 Word 格式评审报告，包含：
- 封面
- 总体评分
- 各维度详细评审
- 改进建议
- 参考文献建议

---

## 📞 支持

如有问题，请检查：
1. MCP 服务器日志输出
2. AI 客户端的连接状态
3. 环境变量是否正确配置

---

**最后更新**: 2026-05-28  
**版本**: v1.0
