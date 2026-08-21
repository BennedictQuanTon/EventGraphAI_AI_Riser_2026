#!/bin/bash

# ==============================================================================
# EventGraph AI — 1-Click Startup Script (macOS / Linux)
# ==============================================================================

set -e

# Change directory to the repository root
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "============================================================"
echo "🚀 Khởi chạy EventGraph AI — Enterprise Knowledge Graph"
echo "============================================================"

# 1. Kill any existing processes holding port 8000 or 5173
echo "🧹 [1/5] Kiểm tra và giải phóng cổng 8000 & 5173..."
lsof -ti:5173,8000 | xargs kill -9 2>/dev/null || true

# 2. Check Python Environment
echo "🐍 [2/5] Kiểm tra môi trường Python..."
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d "env" ]; then
    source env/bin/activate
fi

# Ensure Python dependencies are available
if ! python -c "import fastapi, uvicorn, sqlalchemy" 2>/dev/null; then
    echo "📦 Đang cài đặt thư viện Python (backend/requirements.txt)..."
    pip install -r backend/requirements.txt
fi

# 3. Check Environment Variables
echo "🔑 [3/5] Kiểm tra cấu hình .env..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠️ Đã tạo file .env từ .env.example. Vui lòng kiểm tra GEMINI_API_KEY nếu cần."
    else
        cat <<EOF > .env
GEMINI_API_KEY=
DATABASE_URL=sqlite:///./eventgraph.db
SECRET_KEY=eventgraph-ai-riser-2026-secret-key
ENVIRONMENT=development
EOF
    fi
fi

# 4. Check Frontend Node Modules
echo "⚛️ [4/5] Kiểm tra môi trường Frontend..."
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Đang cài đặt thư viện Node.js (npm install)..."
    (cd frontend && npm install)
fi

# 5. Launch Backend and Frontend in parallel
echo "⚡ [5/5] Đang khởi chạy hệ thống EventGraph AI..."

# Trap SIGINT (Ctrl+C) and SIGTERM to clean up child processes gracefully
cleanup() {
    echo ""
    echo "🛑 Đang tắt toàn bộ tiến trình EventGraph AI..."
    lsof -ti:5173,8000 | xargs kill -9 2>/dev/null || true
    echo "✅ Đã tắt hoàn tất. Hẹn gặp lại!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start Backend Server (Port 8000)
export PYTHONPATH="$PROJECT_DIR"
python -m backend.app.main &
BACKEND_PID=$!

# Wait briefly for backend to bind port
sleep 1.5

# Start Frontend Dev Server (Port 5173)
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "============================================================"
echo "🎉 HỆ THỐNG ĐÃ SẴN SÀNG HOẠT ĐỘNG!"
echo "============================================================"
echo "🌐 Web Dashboard:    http://localhost:5173"
echo "📖 Swagger API Docs: http://localhost:8000/docs"
echo "💡 Nhấn [Ctrl + C] tại cửa sổ này để tắt toàn bộ dự án."
echo "============================================================"
echo ""

# Try opening browser automatically on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    sleep 1.5
    open "http://localhost:5173" 2>/dev/null || true
fi

# Keep script running to maintain child processes and handle Ctrl+C
wait
