# 🌐 EventGraph AI — Đồ Thị Dữ Liệu Doanh Nghiệp & Sự Kiện

> *"Từ tấm card visit đến bức tranh toàn cảnh hệ sinh thái của bạn."*  
> **Dự án tham dự cuộc thi AI Riser Vietnam 2026** · `#BuildwithGoogleAI` `#AIRiserVietnam2026` `#VibeCoding`  
> **Mục tiêu:** Hạng Vàng (Top 50) — Hạng Bạch Kim (Top 10)

---

## 📌 1. Giới Thiệu & Bối Cảnh Bài Toán

Trong các hoạt động kết nối giao thương B2B, hội thảo đổi mới sáng tạo, sự kiện triển lãm MICE và không gian ươm tạo, hàng nghìn dữ liệu đối tác sinh ra mỗi ngày nhưng thường bị phân mảnh và lãng phí:
- Hàng trăm tấm card visit thu được sau sự kiện bị lãng quên hoặc nhập tay sai lệch.
- Thông tin doanh nghiệp mới liên hệ thiếu hồ sơ lĩnh vực, quy mô, mã ngành.
- Lịch sử khách mời các sự kiện cũ nằm rải rác trong hàng chục file Excel với cấu trúc cột khác nhau.

**EventGraph AI** hợp nhất **3 đề bài cốt lõi** (#2 Chuẩn hóa danh thiếp, #4 Tự động lập hồ sơ doanh nghiệp, #7 Chuẩn hóa dữ liệu sự kiện) vào chung **một Đồ thị Dữ liệu Quan hệ Doanh nghiệp & Sự kiện (Business & Event Intelligence Graph)** duy nhất:
1. **Mọi nguồn dữ liệu đều làm giàu cho chung một Graph:** Mỗi khi có card mới hoặc file Excel cũ, hệ thống tự động liên kết Người ↔ Công ty ↔ Sự kiện.
2. **Entity Resolution minh bạch (Audit Trail):** Thuật toán kết hợp Vector Embedding (Gemini) và Rule-based logic tự động phát hiện gộp trùng với giải thích lý do rõ ràng, tuyệt đối không phải "hộp đen".
3. **Khai thác thông minh:** Trực quan hóa mạng lưới Interactive Graph 60fps, Insight Agent gợi ý khách mời mục tiêu, và Trợ lý Chatbot Graph RAG chống ảo giác.

---

## 🚀 2. Tối Ưu Hóa Khung Tiêu Chí AI Riser Vietnam 2026

| Hạng mục | Tiêu chí cuộc thi | Giải pháp & Công nghệ trong EventGraph AI |
|---|---|---|
| **Hạng Đồng** | 3 Links bắt buộc | • Link Google AI Studio project<br>• Link Video Demo YouTube (≤ 2 phút)<br>• Link bài đăng LinkedIn công khai |
| **+10 Điểm Thưởng** | Deployment Live URL | Deploy container Full-stack 1-lệnh lên **Google Cloud Run**, chạy live thực tế. |
| **+10 Điểm Thưởng** | Tích hợp sâu Google Tech | • **Gemini 2.5/3 Pro Multimodal (Vision):** OCR danh thiếp tiếng Việt & đa ngôn ngữ.<br>• **Google Search Grounding:** Tự động tra cứu, bổ sung lĩnh vực và trích nguồn công ty.<br>• **Gemini Embeddings:** Chuẩn hóa và so khớp độ tương đồng thực thể.<br>• **Firebase Auth:** Phân quyền Multi-tenant an toàn.<br>• **Google Maps API:** Định vị không gian sự kiện và điểm hẹn đối tác.<br>• **Google Workspace (Sheets API):** Xuất/nhập dữ liệu trực tiếp 2 chiều. |
| **Zero-Cost Execution** | Gói Cloud Starter Tier | Đóng gói Unified Container (FastAPI + React SPA) chỉ tốn **1 Cloud Run Service** (trong hạn mức 2 apps), không phát sinh bất kỳ chi phí nào. |
| **Hạng Vàng** | Active User Engagement | Tích hợp sẵn form thu thập đánh giá & nhật ký tương tác người dùng thật trong app. |

---

## 🏗️ 3. Kiến Trúc Kỹ Thuật (Architecture & Multi-Agent)

```
                       ┌───────────────────────────────┐
                       │       3 INGESTION AGENTS      │
                       │  - Vision OCR Agent (Card)    │
                       │  - Enrichment Agent (Search)  │
                       │  - Excel Batch Parser Agent   │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  ENTITY RESOLUTION AGENT      │
                       │  - Embedding Cosine Sim       │
                       │  - Rule-based Domain Match    │
                       │  - Resolution Audit Log       │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │    BUSINESS & EVENT GRAPH     │
                       │   Person - Company - Event    │
                       └───────┬───────┬───────┬───────┘
                               │       │       │
            ┌──────────────────┘       │       └──────────────────┐
            ▼                          ▼                          ▼
 ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
 │ Interactive D3 Graph │  │ Insight Agent        │  │ Graph RAG Chatbot    │
 │ (Trực quan hóa mạng) │  │ (Gợi ý khách mời AI) │  │ (Hỏi đáp chống ảo)   │
 └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

---

## 💻 4. Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Quickstart)

Hệ thống được thiết kế với chế độ **Zero-Setup Fallback**: Ứng dụng tự động khởi tạo SQLite database và nạp sẵn bộ dữ liệu mẫu hệ sinh thái đổi mới sáng tạo Việt Nam ngay khi chạy!

### Yêu cầu:
- Python 3.10+
- Node.js 18+

### Cách 1: Chạy trực tiếp qua Terminal

```bash
# 1. Clone repository
git clone https://github.com/your-username/EventGrapphAI_AI_Riser_2026.git
cd EventGrapphAI_AI_Riser_2026

# 2. Cài đặt Backend Dependencies
pip install -r backend/requirements.txt

# 3. Cài đặt và Build Frontend
cd frontend
npm install
npm run build
cd ..

# 4. Khởi chạy ứng dụng Full-stack
python -m backend.app.main
```

👉 Mở trình duyệt tại: **`http://localhost:8000`**  
👉 Swagger API Docs tại: **`http://localhost:8000/docs`**

### Cách 2: Chạy qua Docker Compose

```bash
docker-compose up --build
```

---

## ☁️ 5. Hướng Dẫn Triển Khai Lên Google Cloud Run (1-Lệnh)

Hệ thống có sẵn script `deploy.sh` tự động kích hoạt Cloud Run và deploy toàn bộ ứng dụng:

```bash
# Đăng nhập Google Cloud
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>

# Cấp quyền và chạy deploy
chmod +x deploy.sh
./deploy.sh
```

Sau khi hoàn tất, bạn sẽ nhận được **Live Cloud Run URL** để điền vào form dự thi nhận trọn **+10 Điểm Thưởng Deployment**!

---

## 📋 6. Kịch Bản Video Demo 2 Phút (Theo Tiêu Chí BTC)

- **0:00 – 0:15:** Mở đầu nêu nỗi đau dữ liệu sự kiện bị phân mảnh, giới thiệu EventGraph AI.
- **0:15 – 0:40:** Demo Quét Card visit trực tiếp bằng camera điện thoại → Gemini Vision trích xuất và tra cứu Google Search Grounding.
- **0:40 – 1:00:** Demo Hàng đợi chuẩn hóa (Resolution Queue) — nhấn mạnh tính năng tự động phát hiện trùng và giải thích thuật toán rõ ràng (Audit Trail).
- **1:00 – 1:20:** Demo Đồ thị quan hệ Interactive Graph — zoom/pan và click vào các nút liên kết mạng lưới.
- **1:20 – 1:45:** Demo Trợ lý Chatbot Graph RAG — hỏi câu hỏi tự nhiên và kiểm chứng câu trả lời chính xác từ Graph.
- **1:45 – 2:00:** Kết luận tác động kinh tế xã hội, hiển thị link Cloud Run và hashtag `#BuildwithGoogleAI`.

---

## 👥 Tác Giả & Bản Quyền

Dự án được xây dựng và phát triển cho **AI Riser Vietnam 2026** — Tôn vinh tinh thần **#VibeCoding** và sức mạnh hệ sinh thái **Google AI**.
