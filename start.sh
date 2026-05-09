#!/bin/bash

echo "========================================"
echo "  数模论文工坊 - 启动脚本"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到 Python，请先安装 Python 3.10+"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

echo "[1/4] 检查后端依赖..."
cd backend
if [ ! -d "venv" ]; then
    echo "安装 Python 依赖..."
    pip install -r requirements.txt
else
    echo "Python 依赖已安装"
fi

echo ""
echo "[2/4] 检查前端依赖..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "安装 Node.js 依赖..."
    npm install
else
    echo "Node.js 依赖已安装"
fi

echo ""
echo "[3/4] 启动后端服务器..."
cd ../backend
gnome-terminal --title="数模论文工坊 - 后端" -- bash -c "python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; exec bash" &

echo "等待后端启动..."
sleep 3

echo ""
echo "[4/4] 启动前端服务器..."
cd ../frontend
gnome-terminal --title="数模论文工坊 - 前端" -- bash -c "npm run dev; exec bash" &

echo ""
echo "========================================"
echo "  启动完成！"
echo "========================================"
echo ""
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:8000"
echo "API 文档: http://localhost:8000/docs"
echo ""
echo "两个终端窗口已打开，请勿关闭"
