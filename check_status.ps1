# System Status Check Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MathModel Workshop - Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check backend
Write-Host "[1/3] Checking Backend Service..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get -ErrorAction Stop
    if ($response.status -eq "healthy") {
        Write-Host "OK - Backend is running (http://localhost:8000)" -ForegroundColor Green
    } else {
        Write-Host "ERROR - Backend service abnormal" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR - Backend is not running or inaccessible" -ForegroundColor Red
    Write-Host "  Run: cd backend; python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Yellow
}

Write-Host ""

# Check frontend
Write-Host "[2/3] Checking Frontend Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/" -Method Head -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "OK - Frontend is running (http://localhost:5173)" -ForegroundColor Green
    } else {
        Write-Host "ERROR - Frontend service abnormal" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR - Frontend is not running or inaccessible" -ForegroundColor Red
    Write-Host "  Run: cd frontend; npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Check API docs
Write-Host "[3/3] Checking API Documentation..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -Method Head -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "OK - API Docs accessible (http://localhost:8000/docs)" -ForegroundColor Green
    } else {
        Write-Host "ERROR - API Docs abnormal" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR - API Docs inaccessible" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Access URLs:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Happy Modeling!" -ForegroundColor Green
Write-Host ""
