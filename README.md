# 数模论文工坊 (Mathematical Modeling Paper Workshop)

一个智能化的数学建模论文写作辅助平台，提供从问题分析到论文生成的完整工作流程。

## ✨ 主要特性

- 🎯 **五步引导式流程**: 选题解读 → 问题分析 → 建模求解 → 论文写作 → 结果优化
- 🤖 **多模型 AI 支持**: 支持 DeepSeek、通义千问、Kimi、智谱 AI、OpenAI、Ollama、WebLLM 等 7+ 种 AI 模型
- 📚 **题目库管理**: 内置历年竞赛题目，支持自定义添加
- 📝 **自动生成论文**: AI 辅助生成摘要、引言、结论等章节
- 💾 **项目管理系统**: 保存进度，随时继续
- 📥 **导出功能**: 支持 Markdown 格式论文下载
- 🎨 **现代化 UI**: 基于 Ant Design 的深色主题界面

## 🚀 快速开始

### Windows 用户
双击运行 `start.bat` 文件

### Linux/Mac 用户
```bash
chmod +x start.sh
./start.sh
```

### 手动启动

**后端:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**前端:**
```bash
cd frontend
npm run dev
```

访问 http://localhost:5173 开始使用

## 📖 详细文档

查看 [STARTUP_GUIDE.md](STARTUP_GUIDE.md) 获取完整的安装和使用指南。

## 🛠️ 技术栈

### 后端
- FastAPI - 高性能 Python Web 框架
- SQLAlchemy - ORM 数据库操作
- SQLite/PostgreSQL - 数据库
- JWT - 身份认证

### 前端
- React 19 - 现代 JavaScript 框架
- TypeScript - 类型安全
- Ant Design 6 - UI 组件库
- Vite - 构建工具
- Zustand - 状态管理
- React Router - 路由管理

### AI 集成
- **云端 API**: DeepSeek、通义千问、Kimi、智谱 AI、OpenAI
- **本地部署**: Ollama（完全免费，数据私密）
- **浏览器运行**: WebLLM（无需服务器）
- 详见 [AI_MULTI_MODEL_SUPPORT.md](docs/AI_MULTI_MODEL_SUPPORT.md)

## 📁 项目结构

```
```mathmodel_workshop/
├── backend/              # FastAPI 后端服务
│   ├── app/
│   │   ├── modules/     # 功能模块 (auth, project, wiki, knowledge)
│   │   ├── shared/      # 共享工具
│   │   └── main.py      # 应用入口
│   └── requirements.txt
├── frontend/             # React 前端应用
│   ├── src/
│   │   ├── modules/     # 功能模块 (auth, project, wiki, knowledge, steps)
│   │   ├── app/         # 应用配置
│   │   └── App.tsx
│   └── package.json
── docker-compose.yml    # Docker 配置
── start.bat             # Windows 启动脚本
── start.sh              # Linux/Mac 启动脚本
├── start.ps1             # PowerShell 启动脚本
└── README.md             # 项目说明
```

## 🎯 使用流程

1. **注册/登录** - 创建账号并登录系统
2. **配置 AI** - 选择偏好的 AI 提供商（推荐 DeepSeek）
   - 查看 [AI 配置指南](docs/AI_CONFIG_GUIDE.md) 获取 API Key
   - 支持 7+ 种主流模型，详见 [多模型支持说明](docs/AI_MULTI_MODEL_SUPPORT.md)
3. **创建项目** - 新建建模项目，可选择从题库选题
4. **五步流程**:
   - Step 1: 输入题目，AI 分析题意和关键词
   - Step 2: 定义目标、约束和假设
   - Step 3: 选择模型，生成方程和代码
   - Step 4: 撰写论文各章节
   - Step 5: 结果分析和优化
5. **导出论文** - 下载完整的 Markdown/PDF/Word 格式论文

## 🔧 配置说明

### 环境变量

**后端 (backend/.env):**
```env
DATABASE_URL=sqlite+aiosqlite:///./mathmodel.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

**前端 (frontend/.env):**
```env
VITE_API_URL=http://localhost:8000/api
```

## 🐳 Docker 部署

使用 PostgreSQL 数据库：
```bash
docker-compose up -d
```

然后修改 `backend/.env` 中的数据库配置。

## 📝 API 文档

启动后端后访问 http://localhost:8000/docs 查看完整的 API 文档。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 联系方式

如有问题或建议，请提交 Issue。

---

**祝您在数学建模竞赛中取得优异成绩！** 🏆
