@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo Pushing Verbilo AI to GitHub...
echo Target: https://github.com/roylearning/verbilo.git
echo ===================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/roylearning/verbilo.git
git branch -M main

echo Running git push...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo SUCCESS: Pushed to https://github.com/roylearning/verbilo !
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo PUSH FAILED:
    echo 1. Make sure you clicked 'Create repository' at:
    echo    https://github.com/new (Repository name: verbilo)
    echo 2. If prompted, complete the GitHub login in your browser.
    echo ===================================================
)

echo.
pause
