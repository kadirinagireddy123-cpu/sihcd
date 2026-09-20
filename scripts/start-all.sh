#!/bin/bash
# GeoShield AI — Polyglot Microservices Launcher (Linux / macOS)

echo "==================================================="
echo "    GeoShield AI — Polyglot Microservices"
echo "==================================================="
echo ""

cd "$(dirname "$0")/.."

echo "Starting Node.js API Gateway (Port 5000)..."
(cd backend/api-gateway && npm run dev) &

echo "Starting Python FastAPI AI Engine (Port 8000)..."
(cd backend/ai-engine && python3 -m uvicorn main:app --reload --port 8000) &

echo "Starting React Frontend (Port 3000)..."
(cd frontend && npm run dev) &

echo ""
echo "All microservices launched!"
echo "Access GeoShield AI at: http://localhost:3000"
echo ""
wait
