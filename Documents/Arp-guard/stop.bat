@echo off
echo Stopping ARP Guard Application...
echo.

REM Kill Backend process
echo [1/3] Stopping Backend Server...
taskkill /FI "WindowTitle eq ARP Guard Backend*" /T /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Backend server stopped
) else (
    echo Backend server was not running
)
echo.

REM Kill Frontend process
echo [2/3] Stopping Frontend Server...
taskkill /FI "WindowTitle eq ARP Guard Frontend*" /T /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Frontend server stopped
) else (
    echo Frontend server was not running
)
echo.

REM Stop MongoDB (optional - comment out if you want MongoDB to keep running)
echo [3/3] Stopping MongoDB...
net stop MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB stopped
) else (
    echo MongoDB was not running or requires Administrator privileges
)
echo.

echo ========================================
echo ARP Guard has been stopped!
echo ========================================
pause
