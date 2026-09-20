@echo off
TITLE GeoShield AI — Polyglot Microservices Launcher

echo ===================================================
echo     GeoShield AI — Polyglot Microservices
echo ===================================================
echo.
echo Launching:
echo   1. Node.js API Gateway + WS Telemetry Stream (Port 5000)
echo   2. Python FastAPI AI Engine + SQLite DB (Port 8000)
echo   3. React / Vite Frontend (Port 3000)
echo.

cd /d "%~dp0.."

echo Starting Node.js API Gateway (Port 5000)...
start "GeoShield Node.js Gateway (5000)" cmd /k "cd backend\api-gateway && npm run dev"

echo Starting Python FastAPI AI Engine (Port 8000)...
start "GeoShield Python AI Engine (8000)" cmd /k "cd backend\ai-engine && python -m uvicorn main:app --reload --port 8000"

echo Starting React Frontend (Port 3000)...
start "GeoShield React Frontend (3000)" cmd /k "cd frontend && npm run dev"

echo.
echo All microservices are launching in separate windows!
echo Access GeoShield AI at: http://localhost:3000
echo.
pause
