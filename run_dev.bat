@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Starting Verbilo AI Full-Stack Platform...
echo ===================================================

echo [1/3] Cleaning up any old servers on ports 5173 and 8000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 5173,8000 -ErrorAction SilentlyContinue | ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} }"

echo [2/3] Starting Backend (FastAPI) on http://127.0.0.1:8000 ...
start "Verbilo Backend" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [3/3] Starting Frontend (Vite React) on http://localhost:5173 ...
start "Verbilo Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo Waiting for Vite server to become ready...
powershell -NoProfile -Command "for ($i = 0; $i -lt 30; $i++) { if (Test-NetConnection -ComputerName 127.0.0.1 -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue) { break }; Start-Sleep -Milliseconds 500 }"

echo Opening Verbilo AI in your browser...
start "" "http://localhost:5173"

echo.
echo ===================================================
echo Verbilo AI is now running!
echo Frontend: http://localhost:5173  (or http://127.0.0.1:5173)
echo Backend:  http://127.0.0.1:8000/docs
echo.
echo NOTE: Keep the two black command windows open.
echo If a window gets clicked, press ENTER to resume.
echo To stop all servers, run stop_dev.bat
echo ===================================================
pause
