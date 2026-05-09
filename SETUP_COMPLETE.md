# Website Setup Complete! ✅

## 🎉 Your Mathematical Modeling Paper Workshop is Ready!

### Current Status
- ✅ **Backend Server**: Running on http://localhost:8000
- ✅ **Frontend Server**: Running on http://localhost:5173
- ✅ **Database**: SQLite initialized (backend/mathmodel.db)
- ✅ **Dependencies**: All installed

---

## 🌐 Access Your Application

### Main Interface
**Open your browser and visit:** http://localhost:5173

### API Documentation
**View API docs:** http://localhost:8000/docs

### Health Check
**Backend status:** http://localhost:8000/health

---

## 📝 Quick Start Guide

### 1. Register an Account
- Visit http://localhost:5173
- Click the "注册" (Register) tab
- Fill in:
  - Username
  - Email
  - Password (min 6 characters)
  - School (optional)
- Click "注册"

### 2. Login
- Switch to "登录" (Login) tab
- Enter your username and password
- Click "登录"

### 3. Configure AI (Optional but Recommended)
- Click your username in the top-right corner
- Select "AI 设置" (AI Settings)
- Choose one of:
  - **OpenAI**: Enter your API key
  - **Ollama**: Set local endpoint (default: http://localhost:11434)
  - **WebLLM**: Uses browser-based models (no setup needed)

### 4. Create Your First Project
- Click "创建新项目" (Create New Project)
- Enter a project name
- Optionally select a problem from the wiki
- Click "开始建模" (Start Modeling)

### 5. Follow the 5-Step Workflow

#### Step 1: 选题与解读 (Problem Reading)
- Enter the problem title
- Paste the complete problem description
- Click "AI 分析题目" for AI-powered analysis
- Click "提取关键词" to extract keywords
- Click "下一步" to continue

#### Step 2: 问题分析 (Problem Analysis)
- Define objectives (what you want to achieve)
- List constraints (limitations)
- State assumptions
- Use "AI 分析目标与约束" for assistance
- Click "下一步"

#### Step 3: 建模求解 (Model Building)
- Select model type (linear programming, optimization, etc.)
- Describe your model approach
- Click "AI 推荐模型" for suggestions
- Generate equations with "AI 生成方程"
- Generate code with "AI 生成代码"
- Edit code in the Monaco editor
- Click "下一步"

#### Step 4: 论文写作 (Paper Writing)
- Write each section:
  - Abstract (摘要)
  - Introduction (引言)
  - Model Establishment (模型建立)
  - Results Analysis (结果分析)
  - Conclusion (结论)
  - References (参考文献)
- Use AI buttons to generate content
- Click "下一步"

#### Step 5: 结果优化 (Result Optimization)
- Summarize results
- Perform sensitivity analysis
- List improvement directions
- Preview your paper
- Click "下载论文" to download as Markdown
- Click "完成项目" to finish

---

## 🛠️ Managing the Servers

### Current Running Servers
Both servers are currently running in separate terminal windows:
- **Backend Terminal**: Shows FastAPI logs
- **Frontend Terminal**: Shows Vite dev server logs

**Keep these terminals open!** Closing them will stop the servers.

### To Restart Servers

If you close the terminals or need to restart:

**Option 1: Use the startup script**
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

**Option 2: Manual restart**

Terminal 1 - Backend:
```bash
cd d:\MathematicModeling\mathmodel_workshop\backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```bash
cd d:\MathematicModeling\mathmodel_workshop\frontend
npm run dev
```

### To Stop Servers
Press `Ctrl+C` in each terminal window.

---

## 📁 Important Files Created

1. **STARTUP_GUIDE.md** - Comprehensive Chinese guide
2. **README.md** - Project overview and documentation
3. **start.bat** - Windows startup script
4. **start.sh** - Linux/Mac startup script
5. **check_status.ps1** - PowerShell status checker

---

## 🔧 Configuration Files

### Backend (.env)
Located at: `backend/.env`

Current settings:
```env
DATABASE_URL=sqlite+aiosqlite:///./mathmodel.db
SECRET_KEY=your-super-secret-key-change-in-production-must-be-at-least-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
APP_NAME=数模论文工坊
DEBUG=true
```

### Frontend (.env)
Located at: `frontend/.env`

Current settings:
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🐛 Troubleshooting

### Problem: Can't access http://localhost:5173
**Solution:**
1. Check if frontend terminal is running
2. Look for errors in the terminal
3. Restart with: `cd frontend && npm run dev`

### Problem: Can't access http://localhost:8000
**Solution:**
1. Check if backend terminal is running
2. Verify port 8000 is not in use
3. Restart with: `cd backend && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

### Problem: Database errors
**Solution:**
```bash
# Delete and recreate database
cd backend
del mathmodel.db
# Restart backend - it will recreate automatically
```

### Problem: AI features not working
**Solution:**
1. Make sure AI is configured in settings
2. For OpenAI: Verify API key is valid
3. For Ollama: Ensure Ollama is running locally
4. Check browser console (F12) for errors

### Problem: Port already in use
**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

---

## 📊 System Requirements Met

✅ Python 3.13.9 installed
✅ Node.js v24.15.0 installed
✅ npm 11.12.1 installed
✅ All Python dependencies installed
✅ All Node.js dependencies installed
✅ @mlc-ai/web-llm package added

---

## 🎯 Next Steps

1. **Explore the interface** - Familiarize yourself with all features
2. **Create a test project** - Try the complete workflow
3. **Configure AI** - Set up your preferred AI provider
4. **Add problems to wiki** - Populate the problem library
5. **Customize** - Modify themes, add features as needed

---

## 💡 Tips

- **Save frequently** - The system auto-saves, but manual saves are good practice
- **Use AI wisely** - Review and edit AI-generated content
- **Export regularly** - Download your paper periodically as backup
- **Experiment** - Try different model types to see what works best
- **Check API docs** - Visit http://localhost:8000/docs for API details

---

## 📞 Need Help?

- **API Documentation**: http://localhost:8000/docs
- **Startup Guide**: See STARTUP_GUIDE.md
- **Project README**: See README.md
- **Browser Console**: Press F12 to check for frontend errors
- **Terminal Logs**: Check terminal output for backend errors

---

## ✨ You're All Set!

Your Mathematical Modeling Paper Workshop is fully operational. 

**Start creating amazing mathematical modeling papers now!** 🚀

Visit: **http://localhost:5173**

---

*Setup completed on: Saturday, May 9, 2026*
