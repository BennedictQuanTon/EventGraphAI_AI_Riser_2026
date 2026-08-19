#!/usr/bin/env bash

# ==============================================================================
# Script Triển Khai 1-Lệnh Lên Google Cloud Run (AI Riser Vietnam 2026)
# ==============================================================================

set -e

echo "🚀 Bắt đầu quá trình đóng gói và triển khai EventGraph AI lên Google Cloud Run..."

# 1. Kiểm tra gcloud CLI
if ! command -v gcloud &> /dev/null
then
    echo "❌ Lỗi: gcloud CLI chưa được cài đặt. Vui lòng cài đặt Google Cloud SDK."
    exit 1
fi

# 2. Thiết lập thông số dự án
PROJECT_ID=$(gcloud config get-value project)
REGION="asia-southeast1"
SERVICE_NAME="eventgraph-ai"

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️ Chưa chọn Project ID. Vui lòng nhập Google Cloud Project ID:"
    read -r PROJECT_ID
    gcloud config set project "$PROJECT_ID"
fi

echo "📦 Project ID: $PROJECT_ID | Region: $REGION | Service: $SERVICE_NAME"

# 3. Kích hoạt các API cần thiết
echo "⚙️ Kích hoạt các Google Cloud Services (Cloud Run, Cloud Build)..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com

# 4. Triển khai Cloud Run từ mã nguồn trực tiếp
echo "🚢 Đang build container và deploy lên Cloud Run (Starter Tier - Zero Cost)..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 2 \
    --set-env-vars ENVIRONMENT=production

# 5. Lấy URL công khai
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)')

echo "=============================================================================="
echo "🎉 CHÚC MỪNG! Triển khai thành công EventGraph AI lên Google Cloud Run!"
echo "🌐 URL Công Khai (+10 Điểm Thưởng Deployment): $SERVICE_URL"
echo "=============================================================================="
