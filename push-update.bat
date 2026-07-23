@echo off
REM ============================================================
REM  CSC Reviewer - push changes to GitHub
REM  Double-click to save your latest changes to the repo:
REM    https://github.com/tibintibin01/cse-reviewer
REM  (Netlify can then auto-build and publish, if connected.)
REM ============================================================

cd /d "%~dp0"

REM First-time only: initialize git and connect to the GitHub repo.
if not exist ".git" (
    echo First-time setup: connecting this folder to GitHub...
    git init
    git branch -M main
    git remote add origin https://github.com/tibintibin01/cse-reviewer.git
    echo.
)

set /p msg=Describe your update (or just press Enter): 
if "%msg%"=="" set msg=Update reviewer app

git add .
git commit -m "%msg%"
git push -u origin main

echo.
echo Done. If a GitHub sign-in window appeared, complete it to finish the push.
echo (If it mentioned setting your name/email, see the notes, then run this again.)
pause
