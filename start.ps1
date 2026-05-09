# ========================================
#   数模论文工坊 - PowerShell 启动脚本
# ========================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  数模论文工坊 - 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 停止旧的 Python 和 Node 进程
Write-Host "[1/3] 停止旧进程..." -ForegroundColor Yellow
Stop-Process -Name "python" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "  ✓ 旧进程已清理" -ForegroundColor Green

# 2. 启动后端
Write-Host ""
Write-Host "[2/3] 启动后端服务..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PSScriptRoot\backend"
    python -m uvicorn app.main:app --reload --port 8000
}
Write-Host "  ✓ 后端正在启动 (端口 8000)" -ForegroundColor Green

# 等待后端启动
Start-Sleep -Seconds 3

# 3. 启动前端
Write-Host ""
Write-Host "[3/3] 启动前端服务..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PSScriptRoot\frontend"
    npm run dev
}
Write-Host "  ✓ 前端正在启动 (端口 5173)" -ForegroundColor Green

# 等待前端启动
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 前端地址: http://localhost:5173" -ForegroundColor White
Write-Host "  🔧 后端地址: http://localhost:8000" -ForegroundColor White
Write-Host "  📚 API文档:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "  💡 提示: 关闭此窗口不会影响服务运行" -ForegroundColor Gray
Write-Host "  💡 停止服务: Stop-Job -Id $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""

# 保持窗口打开
Read-Host "按 Enter 键关闭此窗口"
