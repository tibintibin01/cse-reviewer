@echo off
REM ============================================================
REM  CSC Reviewer - start the local server
REM  Double-click this file to run the app on your PC and
REM  share it on your local Wi-Fi network.
REM ============================================================

REM Move into the folder where this .bat file lives.
cd /d "%~dp0"

REM First-time setup: install dependencies if they are missing.
if not exist "node_modules" (
    echo Installing dependencies for the first time, please wait...
    call npm install
    echo.
)

echo.
echo ============================================================
echo  Starting the CSC Reviewer server...
echo.
echo  - On THIS computer, open:   http://localhost:5173
echo  - On phones/other devices, use the "Network" URL shown below
echo    (both must be on the same Wi-Fi).
echo.
echo  Keep this window OPEN while people are using the app.
echo  To stop the server: press Ctrl+C, then close this window.
echo ============================================================
echo.

call npm run dev -- --host

REM If the server stops or fails to start, keep the window open
REM so you can read any message.
echo.
echo The server has stopped.
pause
