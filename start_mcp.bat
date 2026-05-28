@echo off
chcp 65001 >nul
echo ========================================
echo   MCP 服务器启动脚本
echo ========================================
echo.

REM 检查 Python 是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到 Python，请先安装 Python 3.10+
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
pip show PyPDF2 >nul 2>&1
if errorlevel 1 (
    echo [警告] PyPDF2 未安装，正在安装...
    pip install PyPDF2 python-docx PyYAML fastmcp requests
) else (
    echo [完成] 依赖已安装
)

echo.
echo [2/3] 运行测试...
python test_mcp_server.py
if errorlevel 1 (
    echo.
    echo [警告] 测试未完全通过，但将继续启动服务器
)

echo.
echo [3/3] 启动 MCP 服务器...
echo.
echo ========================================
echo   MCP 服务器正在运行...
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.

python mcp_server.py

pause
