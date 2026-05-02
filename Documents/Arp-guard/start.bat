@echo off
echo Starting ARP Guard Application...
echo.

REM Start MongoDB
echo [1/3] Starting MongoDB...
net start MongoDB
if %errorlevel% neq 0 (
    echo ERROR: Failed to start MongoDB. Please run this script as Administrator.
    pause
    exit /b 1
)
echo MongoDB started successfully!
echo.

REM Start Backend
echo [2/3] Starting Backend Server...
start "ARP Guard Backend" cmd /k "cd /d %~dp0app\backend && python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak >nul
echo Backend server started on port 8000
echo.

REM Start Frontend
echo [3/3] Starting Frontend Server...
start "ARP Guard Frontend" cmd /k "cd /d %~dp0app\frontend && npm start"
timeout /t 2 /nobreak >nul
echo Frontend server started on port 3000
echo.

echo ========================================
echo ARP Guard is now running!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Login with:
echo   Email: admin@example.com
echo   Password: admin123
echo.
echo To stop the application, run: stop.bat
echo ========================================
pause
