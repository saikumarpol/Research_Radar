#!/bin/sh

set -e

echo ""
echo "=================================================="
echo "        RESEARCH RADAR"
echo "=================================================="
echo ""
echo "Starting FastAPI backend..."
echo ""

# ============================================================
# START FASTAPI
# ============================================================

cd /app/backend

/opt/venv/bin/uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --proxy-headers \
    &

BACKEND_PID=$!

echo "FastAPI started with PID: $BACKEND_PID"

# ============================================================
# START NEXT.JS
# ============================================================

cd /app/frontend

echo ""
echo "Starting Next.js frontend..."
echo ""

/usr/local/bin/npm run start -- \
    --hostname 0.0.0.0 \
    --port 3000 \
    &

FRONTEND_PID=$!

echo "Next.js started with PID: $FRONTEND_PID"

echo ""
echo "=================================================="
echo "        RESEARCH RADAR IS RUNNING"
echo "=================================================="
echo ""
echo "Frontend : http://localhost:3000"
echo "Backend  : http://localhost:8000"
echo "API Docs : http://localhost:8000/docs"
echo ""
echo "=================================================="
echo ""

# ============================================================
# HANDLE SHUTDOWN
# ============================================================

cleanup() {
    echo ""
    echo "Stopping Research Radar..."

    kill "$BACKEND_PID" 2>/dev/null || true
    kill "$FRONTEND_PID" 2>/dev/null || true

    wait "$BACKEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM

# ============================================================
# KEEP CONTAINER RUNNING
# ============================================================

wait "$BACKEND_PID" "$FRONTEND_PID"