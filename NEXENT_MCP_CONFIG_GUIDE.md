# Nexent 平台 MCP 服务器配置指南

## 📋 概述

本指南说明如何在 Nexent 平台中配置本地 MCP 服务器，使其能够访问 PDF 和 Word 文件解析功能。

---

## 🔧 配置步骤

### 第 1 步：启动 MCP 服务器

#### 方法 A：使用启动脚本（推荐）

```bash
# Windows
start_mcp_http.bat

# 或手动运行
python mcp_server.py
```

服务器启动后会显示：
```
数学建模论文全方位评审助手 - MCP Server
============================================================
API Key: 已配置
LLM Model: Qwen/Qwen2.5-VL-72B-Instruct
LLM Base URL: https://api.siliconflow.cn/v1
Data Directory: D:\MathematicModeling\mathmodel_workshop\data
============================================================
Uvicorn running on http://0.0.0.0:8004
```

**重要信息**：
- 服务地址：`http://localhost:8004/mcp`
- SSE 端点：`http://localhost:8004/mcp/sse`
- 协议：SSE (Server-Sent Events)

---

### 第 2 步：在 Nexent 平台添加 MCP 服务器

1. **打开 Nexent 平台**
   - 登录你的 Nexent 账户
   - 进入智能体管理页面

2. **选择智能体**
   - 选择"论文评审助手"或"全方位论文评审助手"
   - 点击"配置智能体能力"

3. **添加 MCP 服务器**
   - 点击"MCP 工具"标签
   - 点击"添加 MCP 服务器"按钮

4. **填写配置信息**

根据你的截图，填写以下字段：

| 字段 | 值 | 说明 |
|------|-----|------|
| **服务器名称** | `math-modeling-paper-reviewer` | 自定义名称，建议使用英文 |
| **服务器 URL** | `http://localhost:8004/mcp` | MCP 服务器地址（SSE 协议） |
| **服务器 Bearer Token** | （可选） | 如果需要认证，填写 token |

**示例配置**：
```
服务器名称: math-modeling-paper-reviewer
服务器 URL: http://localhost:8004/mcp
服务器 Bearer Token: （留空）
```

5. **点击"添加"按钮**

6. **验证连接**
   - 如果配置正确，会显示"连接成功"
   - 可以在"已配置的 MCP 服务器"列表中看到你的服务器

---

### 第 3 步：测试 MCP 工具

配置成功后，在智能体的"开始问答"中测试：

#### 测试 1：解析 PDF 文件

```
请帮我解析这个 PDF 文件：C:\papers\example.pdf
```

预期输出：
- ✅ 成功读取 PDF 内容
- ✅ 显示文件元数据（文件名、大小、页数等）
- ✅ 显示文本预览

#### 测试 2：解析 Word 文件

```
请读取这个 Word 文档：C:\papers\paper.docx
```

预期输出：
- ✅ 成功读取 Word 内容
- ✅ 提取段落文本
- ✅ 显示文档信息

#### 测试 3：论文评审

```
请评审这篇论文：C:\papers\thesis.pdf
```

预期输出：
- ✅ 解析论文内容
- ✅ 识别论文类型
- ✅ 生成评审报告

---

## 🌐 远程部署（可选）

如果你的 Nexent 平台在云端运行，需要将 MCP 服务器部署到可访问的地址。

### 方案 1：使用内网穿透

#### 使用 ngrok

```bash
# 安装 ngrok
# 访问 https://ngrok.com 下载

# 启动 MCP 服务器
python mcp_server.py

# 在另一个终端运行 ngrok
ngrok http 8004
```

ngrok 会生成一个公网 URL，例如：
```
https://abc123.ngrok.io -> http://localhost:8004
```

在 Nexent 中配置：
```
服务器 URL: https://abc123.ngrok.io/mcp
```

#### 使用 Cloudflare Tunnel

```bash
# 安装 cloudflared
# 访问 https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# 创建隧道
cloudflared tunnel create mathmodel-mcp

# 运行隧道
cloudflared tunnel run --url http://localhost:8004 mathmodel-mcp
```

---

### 方案 2：部署到云服务器

1. **准备服务器**
   - 阿里云/腾讯云/华为云等
   - Python 3.10+
   - 开放端口 8004

2. **上传代码**
   ```bash
   # 使用 git 或 scp 上传
   git clone https://github.com/Tomlegend2026/mathmodel-paper-workshop.git
   cd mathmodel-paper-workshop

   # 安装依赖
   pip install -r backend/requirements.txt
   pip install fastmcp uvicorn python-docx PyPDF2 requests pyyaml
   ```

3. **配置环境变量**
   ```bash
   # 创建 .env 文件
   echo "SILICONFLOW_API_KEY=your_key" > .env
   echo "LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct" >> .env
   echo "LLM_BASE_URL=https://api.siliconflow.cn/v1" >> .env
   ```

4. **启动服务**
   ```bash
   # 使用 nohup 后台运行
   nohup python mcp_server.py > mcp.log 2>&1 &

   # 或使用 systemd 创建服务
   ```

5. **配置防火墙**
   ```bash
   # 开放 8004 端口
   sudo ufw allow 8004
   ```

6. **在 Nexent 中配置**
   ```
   服务器 URL: http://your_server_ip:8004/mcp
   ```

---

### 方案 3：使用 Docker 容器

1. **创建 Dockerfile**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir fastmcp uvicorn python-docx PyPDF2 requests pyyaml

EXPOSE 8004

CMD ["python", "mcp_server.py"]
```

2. **构建镜像**

```bash
docker build -t mathmodel-mcp .
```

3. **运行容器**

```bash
docker run -d \
  --name mathmodel-mcp \
  -p 8004:8004 \
  -e SILICONFLOW_API_KEY=your_key \
  -e LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct \
  -e LLM_BASE_URL=https://api.siliconflow.cn/v1 \
  mathmodel-mcp
```

4. **在 Nexent 中配置**

```
服务器 URL: http://your_docker_host:8004/mcp
```

---

## 故障排除

### 问题 1：连接失败

**错误信息**：
```
无法连接到服务器
```

**解决方案**：
1. 确认 MCP 服务器正在运行
2. 检查端口是否被占用：`netstat -ano | findstr 8004`
3. 检查防火墙设置
4. 测试本地连接：`curl http://localhost:8004/mcp`

---

### 问题 2：SSE 协议不支持

**错误信息**：
```
不支持的协议
```

**解决方案**：
- 确认 Nexent 支持 SSE 协议（从你的截图看是支持的）
- 检查 MCP 服务器版本：`pip show fastmcp`
- 尝试使用 streamable-http 协议

---

### 问题 3：工具无法调用

**错误信息**：
```
MCP 工具调用失败
```

**解决方案**：
1. 检查 MCP 服务器日志
2. 确认环境变量配置正确
3. 查看 `data/` 目录是否有写入权限
4. 测试 MCP 工具是否注册成功

---

### 问题 4：PDF/Word 解析失败

**错误信息**：
```
文件解析失败
```

**解决方案**：
1. 确认文件路径正确（使用绝对路径）
2. 检查文件格式是否正确
3. 确认依赖已安装：`pip show PyPDF2 python-docx`
4. 查看服务器日志获取详细错误信息

---

## 📊 可用的 MCP 工具

配置成功后，以下工具可在 Nexent 中使用：

| 工具名称 | 功能 | 参数 |
|---------|------|------|
| `upload_and_parse_paper` | 解析论文文件 | file_path, paper_type |
| `comprehensive_review` | 多维度评审 | paper_id, review_aspects |
| `generate_solution_code` | 生成代码方案 | problem_description, algorithm_type |
| `generate_visualization_code` | 建议图表 | data_description, chart_type |
| `suggest_structure_optimization` | 结构优化建议 | paper_id |
| `generate_review_report_docx` | 生成 Word 报告 | paper_id, output_dir |

---

## 配置示例

### Nexent 智能体配置完整示例

**智能体名称**：论文评审助手

**MCP 服务器配置**：
```json
{
  "name": "math-modeling-paper-reviewer",
  "url": "http://localhost:8004/mcp",
  "protocol": "sse"
}
```

**环境变量**：
```
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
LLM_BASE_URL=https://api.siliconflow.cn/v1
```

**系统提示词**：
```markdown
你是一个专业的数学建模论文评审专家。

可用工具：
- upload_and_parse_paper: 解析 PDF/DOCX/TXT 论文文件
- comprehensive_review: 对论文进行多维度评审
- generate_solution_code: 生成代码解决方案
- generate_visualization_code: 建议适合的图表
- suggest_structure_optimization: 论文结构优化
- generate_review_report_docx: 生成 Word 格式评审报告

工作流程：
1. 使用 upload_and_parse_paper 解析用户上传的论文
2. 使用 comprehensive_review 进行多维度评审
3. 使用 generate_review_report_docx 生成评审报告
4. 输出完整的评审结果
```

---

## ✅ 验证清单

- [ ] MCP 服务器已启动（`python mcp_server.py`）
- [ ] 服务器地址可访问（`http://localhost:8004/mcp`）
- [ ] Nexent 中已添加 MCP 服务器
- [ ] 连接测试成功
- [ ] MCP 工具列表可见（6 个工具）
- [ ] 测试解析 PDF 文件成功
- [ ] 测试解析 Word 文件成功
- [ ] 测试论文评审功能成功

---

## 📞 获取帮助

如遇到问题：

1. 查看 MCP 服务器日志输出
2. 检查 `data/` 目录中的文件
3. 参考 [HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md](./HUAWEI_AI_TRAINING_CAMP_INTEGRATION.md)
4. 运行测试脚本：`python test_mcp_server.py`

---

**最后更新**：2026-05-28
**版本**：v2.0（统一端口 8004）
