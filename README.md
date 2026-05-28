# 数模论文工坊 - 论文评审助手集成

一个集成了 Nexent 零代码平台智能体的数学建模论文写作辅助系统。

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Python 3.10+
- Git

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
```

### 运行

```bash
# 启动后端（终端 1）
cd backend
uvicorn app.main:app --reload --port 8000

# 启动前端（终端 2）
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

### 2. 论文评审助手  NEW

基于 Nexent 零代码平台的智能评审系统：

- ✅ 自动识别论文类型（数模/学术/学位/课程）
- ✅ 多维度评审（5 个维度，100 分制）
- ✅ 自动生成评审报告
- ✅ 按优先级分类改进建议

**访问路径**：登录后点击左侧菜单 "论文评审"

---

## ️ 技术架构

### 前端

- **框架**：React 19 + TypeScript
- **UI 库**：Ant Design
- **构建工具**：Vite
- **路由**：React Router v6
- **状态管理**：Zustand

### 后端

- **框架**：FastAPI
- **数据库**：SQLite + SQLAlchemy
- **认证**：JWT

### AI 集成

- **平台**：Nexent 零代码平台
- **模型**：DeepSeek-V4-Flash
- **配置**：JSON 导出导入

---

## 📂 项目结构

```
mathmodel-paper-workshop/
├── frontend/                    # 前端应用
│   ├── src/
│   │   ├── app/                 # 应用配置
│   │   │   ├── layout/          # 布局组件
│   │   │   └── routes.tsx       # 路由配置
│   │   ── modules/             # 功能模块
│   │       ├── review/          # 论文评审 
│   │       │   ├── PaperReviewPage.tsx
│   │       │   └── index.ts
│   │       ├── steps/           # 五步写作流程
│   │       ├── ai-engine/       # AI 引擎
│   │       └── ...
│   ── package.json
├── backend/                     # 后端服务
│   ├── app/
│   │   ├── modules/
│   │   │   ├── review/          # 评审 API ⭐
│   │   │   │   ├── router.py
│   │   │   │   └── schemas.py
│   │   │   └── ...
│   │   └── main.py
│   └── requirements.txt
├── nexent/                      # Nexent 配置 ⭐
│   └── paper_review_assistant.json
├── NEXENT_SUBMISSION.md         # 提交文档 ⭐
└── README.md
```

---

## 📝 Nexent 智能体集成

### 配置说明

本项目的论文评审功能基于 Nexent 零代码平台配置的智能体：

- **配置文件**：`nexent/paper_review_assistant.json`
- **智能体名称**：论文评审助手
- **使用模型**：deepseek-ai/DeepSeek-V4-Flash
- **最大步骤数**：10

### 业务逻辑

智能体采用系统化的评审流程：

1. 接收论文（支持纯文本、PDF、DOCX）
2. 识别论文类型
3. 选择评审标准
4. 逐维度评审
5. 计算总分
6. 生成改进建议
7. 输出评审报告

### 评审维度

**数学建模论文**（100分）
- 问题分析（20分）
- 模型建立（30分）
- 求解方法（20分）
- 结果分析（15分）
- 论文写作（15分）

**学术论文**（100分）
- 创新性（25分）
- 方法论（25分）
- 实验与结果（20分）
- 文献综述（15分）
- 写作质量（15分）

**学位论文**（100分）
- 研究意义（15分）
- 文献综述（20分）
- 研究方法（20分）
- 研究结果（25分）
- 论文规范（20分）

**课程论文**（100分）
- 问题理解（20分）
- 内容质量（30分）
- 分析能力（20分）
- 结构组织（15分）
- 格式规范（15分）

---

##  开发指南

### 前端开发

```bash
cd frontend
npm run dev        # 开发模式
npm run build      # 构建生产版本
npm run lint       # 代码检查
```

### 后端开发

```bash
cd backend
uvicorn app.main:app --reload    # 开发服务器
pytest                            # 运行测试
```

---

## 📚 文档

- [Nexent 提交文档](NEXENT_SUBMISSION.md)
- [GitHub 提交指南](GITHUB_SUBMISSION_GUIDE.md)
- [智能体配置说明](nexent/)

---

## 👨‍💻 作者

- **学号**：20240962
- **姓名**：Tom
- **GitHub**：https://github.com/Tomlegend2026

---

## 📄 许可证

MIT License

---

##  致谢

- [Nexent](https://github.com/ModelEngine-Group/nexent) - 零代码智能体开发平台
- [Ant Design](https://ant.design/) - UI 组件库
- [FastAPI](https://fastapi.tiangolo.com/) - 后端框架
