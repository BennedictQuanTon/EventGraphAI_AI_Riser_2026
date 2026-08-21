#!/bin/bash

# ==============================================================================
# EventGraph AI — 1-Click Stop Script
# ==============================================================================

echo "🛑 Đang tắt toàn bộ tiến trình EventGraph AI (Ports 5173, 8000)..."
lsof -ti:5173,8000 | xargs kill -9 2>/dev/null || true
echo "✅ Đã tắt toàn bộ dự án thành công!"
