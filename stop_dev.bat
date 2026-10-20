@echo off
setlocal
echo ===================================================
echo Stopping Verbilo AI Servers (Ports 5173 and 8000)...
echo ===================================================

powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5173,8000 -ErrorAction SilentlyContinue | ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} }"

echo.
echo Servers have been safely stopped!
ping 127.0.0.1 -n 2 >nul
