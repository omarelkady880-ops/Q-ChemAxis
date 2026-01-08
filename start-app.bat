@echo off
echo.
echo 🚀 Starting QChemAxis Application...
echo.
echo This will start both the backend server and frontend development server.
echo.
echo 📁 Backend: Running on http://localhost:3001
echo 🌐 Frontend: Running on http://localhost:5173 (or similar)
echo.
echo 🛠️  Setting up test user automatically...
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Start both servers using concurrently
npx concurrently "node server/server-with-setup.js" "npx vite"

pause