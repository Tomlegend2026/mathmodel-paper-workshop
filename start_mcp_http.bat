@echo off
chcp 65001 >nul
echo ========================================
echo   启动 MCP 服务器 (SSE 模式)
echo ========================================
echo.

REM 从 .env 文件加载环境变量（如果存在）
if exist .env (
    echo [提示] 正在加载 .env 配置...
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        set %%a=%%b
    )
)

echo [提示] 请确保已设置环境变量:
echo   - SILICONFLOW_API_KEY (在 .env 文件中设置)
echo   - LLM_MODEL
echo   - LLM_BASE_URL
echo.

echo 正在启动 MCP 服务器...
echo SSE 端点: http://localhost:8004/sse
echo 服务地址: http://0.0.0.0:8004
echo.
echo ========================================
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

python mcp_server.py

pause
