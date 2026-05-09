@echo off
echo ========================================
echo   数模论文工坊 - 启动脚本
echo ========================================
echo.

REM 启动后端
echo [1/2] 启动后端服务...
cd backend
start cmd /k "python -m uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

REM 启动前端
echo [2/2] 启动前端服务...
cd ../frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo   启动完成！
echo   前端: http://localhost:5173
echo   后端: http://localhost:8000
echo   API文档: http://localhost:8000/docs
echo ========================================
echo.
echo 提示: 按任意键关闭此窗口（不会影响已启动的服务）
pause >nul
