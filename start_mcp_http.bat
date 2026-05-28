@echo off
chcp 65001 >nul
echo ========================================
echo   启动 MCP 服务器 (HTTP/SSE 模式)
echo ========================================
echo.

REM 设置环境变量
set SILICONFLOW_API_KEY=your_api_key_here
set LLM_MODEL=Qwen/Qwen2.5-VL-72B-Instruct
set LLM_BASE_URL=https://api.siliconflow.cn/v1

echo [提示] 请确保已设置环境变量:
echo   - SILICONFLOW_API_KEY
echo   - LLM_MODEL
echo   - LLM_BASE_URL
echo.

echo 正在启动 MCP 服务器...
echo 服务地址: http://localhost:8004/mcp
echo SSE 端点: http://localhost:8004/mcp/sse
echo.
echo ========================================
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

python mcp_server.py

pause
