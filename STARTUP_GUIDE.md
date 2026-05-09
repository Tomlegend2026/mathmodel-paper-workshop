# 数模论文工坊 - 启动指南

## 🚀 快速启动

### 方式一：使用启动脚本（推荐）

#### Windows 用户
双击运行 `start.bat` 文件，或在中执行：
```bash
start.bat
```

#### Linux/Mac 用户
```bash
chmod +x start.sh
./start.sh
```

### 方式二：手动启动

#### 1. 启动后端服务器

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端将在 http://localhost:8000 运行
API 文档：http://localhost:8000/docs

#### 2. 启动前端服务器（新终端窗口）

```bash
cd frontend
npm run dev
```

前端将在 http://localhost:5173 运行

---

## 📋 系统要求

- Python 3.10+ 
- Node.js 16+ 
- npm 8+

---

## 🔧 首次安装

如果这是第一次运行项目，需要先安装依赖：

### 后端依赖
```bash
cd backend
pip install -r requirements.txt
```

### 前端依赖
```bash
cd frontend
npm install
```

---

## 🌐 访问地址

- **前端界面**: http://localhost:5173
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

---

## 📝 使用说明

### 1. 注册账号
- 打开 http://localhost:5173
- 点击"注册"标签
- 填写用户名、邮箱、密码
- 点击"注册"按钮

### 2. 登录系统
- 使用注册的账号登录

### 3. 配置 AI（可选但推荐）
- 点击右上角用户名
- 选择"AI 设置"
- 配置以下任一 AI 提供商：
  - **OpenAI**: 输入 API Key
  - **Ollama**: 设置本地端点
  - **WebLLM**: 使用浏览器内置模型

### 4. 创建项目
- 点击"创建新项目"
- 输入项目名称
- 可选择从题库中选择题目
- 点击"开始建模"

### 5. 完成五步流程
按照引导完成：
1. 选题与解读
2. 问题分析
3. 建模求解
4. 论文写作
5. 结果优化

### 6. 导出论文
- 在第 5 步完成后，可下载 Markdown 格式的论文

---

## 🗄️ 数据库配置

项目默认使用 SQLite 数据库（适合本地开发）：
- 数据库文件：`backend/mathmodel.db`
- 自动创建，无需手动配置

如需使用 PostgreSQL：
1. 修改 `backend/.env` 文件
2. 设置 `DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/dbname`
3. 启动 PostgreSQL 服务

---

## ⚙️ 环境变量

### 后端 (backend/.env)
```env
DATABASE_URL=sqlite+aiosqlite:///./mathmodel.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
APP_NAME=数模论文工坊
DEBUG=true
```

### 前端 (frontend/.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🐛 常见问题

### 问题 1：端口被占用
**错误**: Port 8000 or 5173 is already in use

**解决**:
```bash
# Windows - 查找并关闭占用端口的进程
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# 或者修改端口
# 后端：uvicorn app.main:app --port 8001
# 前端：修改 vite.config.ts 中的 port
```

### 问题 2：前端无法连接后端
**检查**:
1. 后端是否在运行？访问 http://localhost:8000/health
2. CORS 配置是否正确（已在代码中配置）
3. 前端 .env 中的 VITE_API_URL 是否正确

### 问题 3：数据库错误
**解决**:
```bash
# 删除旧数据库，重新启动后端会自动创建
rm backend/mathmodel.db
# 重启后端
```

### 问题 4：AI 功能不工作
**检查**:
1. 是否已配置 AI 设置
2. API Key 是否正确
3. 网络连接是否正常
4. 对于 Ollama，确保本地服务正在运行

---

## 📁 项目结构

```
mathmodel_workshop/
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── modules/           # 功能模块
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── project/       # 项目管理
│   │   │   └── wiki/          # 题目库
│   │   ├── shared/            # 共享工具
│   │   └── main.py            # 应用入口
│   ├── requirements.txt       # Python 依赖
│   └── .env                   # 环境变量
│
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # 登录注册
│   │   │   ├── project/       # 项目页面
│   │   │   ├── steps/         # 五步流程
│   │   │   ├── ai-engine/     # AI 集成
│   │   │   └── wiki/          # 题目库
│   │   ├── app/               # 应用布局
│   │   └── App.tsx            # 根组件
│   └── package.json           # Node 依赖
│
├── docker-compose.yml         # Docker 配置
├── start.bat                  # Windows 启动脚本
└── start.sh                   # Linux/Mac 启动脚本
```

---

## 🎯 主要功能

### ✅ 已完成功能
- 用户注册/登录系统
- JWT 身份验证
- 项目 CRUD 操作
- 五步建模流程
- AI 辅助分析
- 题目库管理
- 论文导出（Markdown）
- 响应式深色主题 UI

### 🔮 未来扩展
- PDF 导出
- 实时协作
- 图表可视化
- 更多 AI 模型支持
- 模板系统
- 版本控制

---

## 📞 技术支持

如遇问题，请检查：
1. 终端输出的错误信息
2. 浏览器控制台（F12）
3. API 文档：http://localhost:8000/docs

---

## 🎉 开始使用

现在您的网站已经搭建完成！

访问 http://localhost:5173 开始使用数模论文工坊。

祝您使用愉快！
