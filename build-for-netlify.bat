@echo off
REM ============================================================
REM  CSC Reviewer - build for Netlify
REM  Double-click to rebuild the app with the latest changes,
REM  then it opens File Explorer with the "dist" folder selected
REM  so you can drag it onto Netlify to publish the update.
REM ============================================================

cd /d "%~dp0"

REM First-time setup: install dependencies if they are missing.
if not exist "node_modules" (
    echo Installing dependencies for the first time, please wait...
    call npm install
    echo.
)

echo.
echo Building the latest version of CSC Reviewer... please wait.
echo.
call npm run build

REM npm returns a non-zero code if the build failed.
if errorlevel 1 (
    echo.
    echo ============================================================
    echo  BUILD FAILED - the site was NOT updated.
    echo  Copy any red error text above and send it for help.
    echo ============================================================
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  Build complete!
echo.
echo  A File Explorer window will open with the "dist" folder
echo  highlighted. Drag that "dist" folder onto your site's
echo  drag-and-drop box on Netlify to publish the update.
echo ============================================================
echo.

REM Open Explorer with the dist folder selected, ready to drag.
explorer /select,"%~dp0dist"

pause
