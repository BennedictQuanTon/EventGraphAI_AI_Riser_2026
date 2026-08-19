# EVENTGRAPH AI — BÁO CÁO TỔNG HỢP & LỘ TRÌNH TRIỂN KHAI TỪ A-Z
### Dành cho: AI Riser Vietnam 2026 · #BuildwithGoogleAI · Mục tiêu Hạng Vàng/Bạch Kim

---

# PHẦN 1 — TỔNG QUAN DỰ ÁN

## 1.1 Branding
- **Tên:** **EventGraph AI** — *"Từ tấm card visit đến bức tranh toàn cảnh hệ sinh thái của bạn."*
- **Định vị:** một **Đồ thị Dữ liệu Doanh nghiệp & Sự kiện (Business & Event Intelligence Graph)** dùng chung cho 3 luồng nhập liệu khác nhau, thay vì 3 công cụ rời rạc.
- **Nhận diện:** node/edge mạng lưới cách điệu từ hình ảnh tấm card visit "mở ra" thành các nút kết nối; bảng màu xanh dương (tin cậy dữ liệu) + cam (kết nối, năng lượng networking).

## 1.2 Lý do kết hợp 3 chủ đề gốc
EventGraph AI kết hợp 3 đề bài tham khảo của chương trình:
- **#2 — Chuyển hoá danh thiếp thành dữ liệu đối tác chuẩn hoá**
- **#4 — Tự động hoá dây chuyền lập hồ sơ doanh nghiệp đối tác**
- **#7 — Chuẩn hoá dữ liệu sự kiện**

Cả ba đều xử lý **cùng loại thực thể cốt lõi: Người – Công ty – Sự kiện**, chỉ khác điểm vào dữ liệu (card visit / doanh nghiệp mới chủ động liên hệ / file Excel lịch sử sự kiện cũ). Gộp chung tạo hiệu ứng mạng lưới thật: mỗi lần có dữ liệu mới từ bất kỳ nguồn nào cũng làm giàu thêm cho toàn bộ graph, và cả 3 module chia sẻ chung 1 tầng chuẩn hoá — không phải xây 3 lần.

## 1.3 Stakeholder
- **Người dùng chính:** bất kỳ đơn vị tổ chức sự kiện/hội thảo/khoá đào tạo thường xuyên — trung tâm đổi mới sáng tạo, coworking space, CLB khởi nghiệp sinh viên, phòng đối ngoại doanh nghiệp.
- **Điểm mạnh khả năng tiếp cận:** đội thi có thể **tự làm case study ngay tại chính sự kiện Demo Day của AI Riser Vietnam** — không cần ký hợp tác với cơ quan nào để có dữ liệu và người dùng thật.

## 1.4 Use case chính
1. Nhập dữ liệu từ 3 nguồn: quét card visit tại sự kiện, thêm doanh nghiệp mới liên hệ, import Excel các sự kiện cũ.
2. Hệ thống tự động chuẩn hoá tất cả về cùng 1 schema (Người, Công ty, Sự kiện, Vai trò/Quan hệ).
3. Làm giàu hồ sơ công ty từ nguồn công khai.
4. Dashboard tìm kiếm/lọc theo ngành, sự kiện, thời gian.
5. Đồ thị quan hệ trực quan cho toàn bộ hệ sinh thái đối tác của đơn vị.
6. **Insight Agent:** gợi ý nên mời ai cho sự kiện tiếp theo dựa trên phân tích đồ thị.

## 1.5 Giá trị mang lại
- Một đơn vị tổ chức hàng trăm sự kiện/năm không còn phải quản lý hàng chục file Excel cấu trúc khác nhau.
- Biến toàn bộ lịch sử tương tác thành tài sản dữ liệu có thể truy vấn và khai thác lâu dài.
- Có đủ 3 nguồn minh chứng sử dụng thật để chứng minh cho vòng chấm Hạng Vàng.

## 1.6 Nghiên cứu tính khả thi
Ngành sự kiện – triển lãm Việt Nam đang được định vị lại thành một ngành kinh tế thực thụ (VEEW 2026 lần đầu tổ chức quy mô lớn để tạo "điểm tụ" cho toàn ngành), trong khi ở quy mô một hội nghị quốc tế đơn lẻ, MICE toàn cầu 2025 đã tạo ra hơn 8.000 cuộc gặp B2B chỉ trong vài ngày với hơn 2.500 khách thương mại từ 37 quốc gia. Khối lượng dữ liệu người-công ty-sự kiện sinh ra từ hoạt động MICE tại Việt Nam là rất lớn và đang tăng, trong khi hiện tại gần như không đơn vị nào chuẩn hoá được — đúng "nỗi đau" mô tả trong cả 3 đề bài gốc.

**Hướng kiếm tiền:** license nền tảng theo mô hình SaaS cho trung tâm đổi mới sáng tạo/coworking space (tính phí theo số sự kiện/năm hoặc số hồ sơ quản lý), gói miễn phí giới hạn cho CLB sinh viên/tổ chức phi lợi nhuận (kênh viral + lấy minh chứng), phí premium cho tính năng Insight Agent.

## 1.7 Yêu cầu phi chức năng (NFR)
- Xử lý nhập liệu batch lớn (Excel hàng nghìn dòng) < 5 phút.
- Entity resolution có thể audit (giải thích được lý do gộp/không gộp).
- Multi-tenant: phân quyền dữ liệu theo từng đơn vị tổ chức, không rò rỉ chéo.
- Thiết kế schema mở để dễ bổ sung nguồn dữ liệu mới trong tương lai.
- Thời gian phản hồi Chat Assistant < 4s.
- Chi phí vận hành = 0 trong giai đoạn thi (gói Starter Tier: 2 Cloud Run app, Firestore/Cloud SQL free, 1.000 request Gemini/ngày).

## 1.8 Yêu cầu chức năng (FR)
1. Nhập liệu 3 nguồn (scan card, thêm DN mới, import Excel).
2. Hàng đợi xác nhận chuẩn hoá (review kết quả entity resolution trước khi lưu chính thức).
3. Danh sách & tìm kiếm Người / Công ty / Sự kiện.
4. Hồ sơ chi tiết (lịch sử tương tác qua các sự kiện).
5. Đồ thị quan hệ trực quan toàn hệ sinh thái.
6. Gợi ý kết nối cho sự kiện sắp tới (Insight Agent).
7. Trợ lý chat hỏi đáp tự do trên toàn bộ dữ liệu.
8. Báo cáo & xuất dữ liệu, quản lý người dùng đa đơn vị (multi-tenant).

## 1.9 Danh sách trang (14 trang)
| # | Trang | Chức năng |
|---|-------|-----------|
| 1 | Đăng nhập | Chọn đơn vị tổ chức (multi-tenant) |
| 2 | Trang chủ tổng quan | Số liệu: Người/Công ty/Sự kiện đã quản lý |
| 3 | Nhập liệu — Scan card visit | Camera batch |
| 4 | Nhập liệu — Thêm doanh nghiệp mới | Form + auto-enrichment |
| 5 | Nhập liệu — Import Excel sự kiện cũ | Upload + mapping cột |
| 6 | Hàng đợi xác nhận chuẩn hoá | Review entity resolution |
| 7 | Danh sách Người | Tìm kiếm/lọc |
| 8 | Danh sách Công ty | Tìm kiếm/lọc |
| 9 | Danh sách Sự kiện | Timeline |
| 10 | Chi tiết hồ sơ | Lịch sử tương tác qua các sự kiện |
| 11 | Đồ thị quan hệ | Trực quan hoá toàn hệ sinh thái |
| 12 | Gợi ý kết nối | Insight Agent cho sự kiện sắp tới |
| 13 | Trợ lý Chat | Hỏi đáp tự do trên Graph |
| 14 | Báo cáo & Cài đặt | Xuất dữ liệu, quản lý người dùng |

---

# PHẦN 2 — KIẾN TRÚC & TOPOLOGY CHI TIẾT

## 2.1 Sơ đồ tổng thể
```
   3 nguồn nhập liệu: Card visit │ Doanh nghiệp mới │ Excel sự kiện cũ
                          │
                          ▼
        ┌───────────────────────────────┐
        │ 3 Ingestion Agent song song      │  Mỗi nhánh 1 Agent chuyên biệt:
        │  - Vision/OCR Agent (card)       │  - Vision cho ảnh
        │  - Web Enrichment Agent (DN mới) │  - RAG + Search grounding cho DN
        │  - Excel Parser Agent (sự kiện)  │  - Structured parsing cho Excel
        │  → cùng xuất ra 1 schema chuẩn   │
        └────────────────┬──────────────────┘
                          ▼
        ┌───────────────────────────────┐
        │ Standardization & Entity          │  Embedding similarity + business
        │ Resolution Agent (dùng chung)     │  rules → gộp trùng có thể audit
        └────────────────┬──────────────────┘
                          ▼
        ┌─────────────────────────────────────────────┐
        │      Business & Event Intelligence Graph        │  ← DÙNG CHUNG
        │      Node: Người – Công ty – Sự kiện              │
        │      Edge: tham dự / thuộc về / giới thiệu bởi    │
        └───┬─────────────────┬─────────────────┬──────────┘
            ▼                 ▼                 ▼
   ┌────────────────┐ ┌─────────────────┐ ┌───────────────────┐
   │ Dashboard Search  │ │ Insight Agent      │ │ RAG Chat Assistant   │
   │ /Filter            │ │ (gợi ý kết nối)    │ │ (hỏi đáp trên Graph)  │
   └────────────────┘ └─────────────────┘ └───────────────────┘
```

## 2.2 Mô hình dữ liệu (Entity Graph Schema)
```
BẢNG: person
  id (uuid, PK)
  full_name, title, phone, email, language_detected
  source_type ENUM('card_scan','manual_new_biz','excel_import')
  source_ref_id (liên kết về nguồn gốc — ảnh card / dòng excel gốc)
  tenant_id (multi-tenant)
  embedding_vector (pgvector, cho entity resolution)
  created_at, updated_at

BẢNG: company
  id (uuid, PK)
  name, domain, industry, size_range, description
  enrichment_data (JSONB — lĩnh vực, sản phẩm, nguồn trích dẫn)
  tenant_id
  embedding_vector
  created_at, updated_at

BẢNG: event
  id (uuid, PK)
  name, date, location, type, tenant_id
  raw_source_file_url (Excel gốc nếu có)

BẢNG: participation (EDGE — Người ↔ Sự kiện)
  id, person_id (FK), event_id (FK), role ENUM('speaker','attendee','sponsor','organizer')

BẢNG: affiliation (EDGE — Người ↔ Công ty)
  id, person_id (FK), company_id (FK), title, is_current (bool)

BẢNG: referral (EDGE — Người ↔ Người, tuỳ chọn nâng cao)
  id, from_person_id, to_person_id, event_id, note

BẢNG: resolution_log (audit trail cho Entity Resolution Agent)
  id, entity_type, entity_id, matched_candidate_id, similarity_score,
  matched_rule (vd: 'same_email_domain', 'embedding_similarity'), decision, created_at
```
Ghi chú: dùng PostgreSQL với extension `pgvector` để lưu `embedding_vector` ngay trong Cloud SQL — tránh phải dựng thêm Vertex AI Vector Search riêng cho MVP (giảm độ phức tạp hạ tầng, vẫn đủ nhanh với vài nghìn bản ghi).

## 2.3 Luồng xử lý chi tiết (Sequence Flow)

**A. Luồng "Scan card visit"**
1. Người dùng chụp 1-nhiều ảnh card → Frontend gửi ảnh lên `POST /api/ingest/card`.
2. `ocr-service` (Cloud Run) gọi Gemini 3 Pro (Vision) → trả JSON có cấu trúc (tên, chức danh, công ty, SĐT, email).
3. `enrichment-service` nhận tên công ty → gọi Gemini với Google Search Grounding để bổ sung field còn thiếu (lĩnh vực, quy mô) kèm nguồn trích dẫn.
4. Kết quả tạm được lưu ở trạng thái `pending_review` — chưa ghi chính thức vào Graph.
5. `standardization-service` tính embedding cho tên người/công ty, so khớp với dữ liệu hiện có trong Graph → nếu độ tương đồng > ngưỡng, đề xuất gộp; đẩy toàn bộ vào **Hàng đợi xác nhận** (trang #6) để người dùng duyệt.
6. Người dùng xác nhận → ghi chính thức vào `person`, `company`, `affiliation`, `participation`.

**B. Luồng "Thêm doanh nghiệp mới"**
1. Người dùng nhập tên công ty (+ optional website) trong form.
2. `enrichment-service` tự động tra cứu công khai, trả về hồ sơ nháp.
3. Qua cùng `standardization-service` → Hàng đợi xác nhận → ghi vào Graph.

**C. Luồng "Import Excel sự kiện cũ"**
1. Người dùng upload file `.xlsx`, hệ thống hiển thị bảng mapping cột (VD: cột "Họ tên" → field `full_name`).
2. `excel-parser-service` đọc từng dòng, chuẩn hoá theo mapping đã chọn.
3. Qua cùng `standardization-service` (batch mode) → Hàng đợi xác nhận (hiển thị dạng tổng hợp: "1.240 dòng, phát hiện 87 trùng với dữ liệu hiện có") → xác nhận hàng loạt hoặc xem chi tiết từng trường hợp nghi vấn.

**D. Luồng "Hỏi Trợ lý Chat"**
1. Người dùng gõ câu hỏi tự nhiên (VD: "Ai từng tham dự cả 2 sự kiện Tech Summit và Demo Day?").
2. `chat-service` chuyển câu hỏi thành truy vấn kết hợp: (a) query SQL trực tiếp trên Graph cho phần cấu trúc rõ ràng, (b) RAG semantic search (embedding) cho phần mô tả mờ ("ai làm về AI").
3. Gemini 3 Pro tổng hợp kết quả truy vấn thành câu trả lời tự nhiên, luôn kèm danh sách thực thể cụ thể (không bịa tên).

**E. Luồng "Insight Agent — gợi ý kết nối"**
1. Kích hoạt khi người dùng tạo sự kiện mới và bấm "Gợi ý khách mời".
2. Agent truy vấn Graph: những Người/Công ty có liên kết gần (cùng ngành, từng được giới thiệu bởi khách VIP hiện tại) nhưng chưa từng được mời.
3. Gemini tổng hợp lý do đề xuất bằng ngôn ngữ tự nhiên, xếp hạng theo độ liên quan.

## 2.4 Mô hình bảo mật đa tenant
- Mỗi request qua Cloud Run backend đều mang `tenant_id` lấy từ Firebase custom claims (gán khi đăng ký đơn vị tổ chức).
- Mọi câu truy vấn SQL đều `WHERE tenant_id = :current_tenant` ở tầng service (không dựa vào frontend lọc) để tránh rò rỉ chéo dữ liệu.
- Row-Level Security (RLS) của PostgreSQL có thể bật thêm ở tầng Cloud SQL cho lớp bảo vệ thứ 2.

---

# PHẦN 3 — LỘ TRÌNH TRIỂN KHAI TỪNG BƯỚC (A-Z)

## Giai đoạn 0 — Chuẩn bị (0.5–1 ngày)
- [ ] Tạo Google Cloud Project mới, kích hoạt Billing (dùng gói Starter Tier miễn phí của chương trình).
- [ ] Kích hoạt các API cần: Cloud Run, Cloud SQL Admin, Cloud Storage, Firebase, Vertex AI (nếu dùng), Cloud Scheduler.
- [ ] Tạo project trên Google AI Studio, lấy API Key Gemini.
- [ ] Vẽ lại sơ đồ Entity Graph (Phần 2.2) trên giấy/Miro cùng cả team để thống nhất trước khi code — bước này quan trọng nhất, sai ở đây sẽ phải sửa lại toàn bộ sau.

## Giai đoạn 1 — Dựng khung dữ liệu (1 ngày)
- [ ] Khởi tạo Cloud SQL PostgreSQL instance, bật extension `pgvector`.
- [ ] Tạo schema theo Phần 2.2 (person, company, event, participation, affiliation, resolution_log).
- [ ] Seed dữ liệu mẫu (mock data — xem Phần 5) để có gì đó trực quan ngay từ đầu.

## Giai đoạn 2 — Ingestion Agents (2 ngày)
- [ ] Xây `ocr-service`: nhận ảnh → gọi Gemini Vision → trả JSON chuẩn.
- [ ] Xây `enrichment-service`: nhận tên công ty → gọi Gemini + Google Search Grounding → trả hồ sơ nháp có trích nguồn.
- [ ] Xây `excel-parser-service`: nhận file `.xlsx` → giao diện mapping cột → chuẩn hoá batch.
- [ ] Test riêng từng service bằng Postman/curl trước khi nối frontend.

## Giai đoạn 3 — Standardization & Entity Resolution (1.5 ngày)
- [ ] Viết hàm tính embedding (Gemini Embedding API hoặc Vertex AI Embeddings) cho tên người/công ty.
- [ ] Viết logic so khớp: `similarity_score = cosine(embedding_a, embedding_b)`, kết hợp rule cứng (cùng domain email → tăng điểm chắc chắn).
- [ ] Đặt ngưỡng (VD: >0.85 auto-suggest gộp, 0.6–0.85 đưa vào hàng đợi xác nhận, <0.6 coi là thực thể mới).
- [ ] Ghi log vào `resolution_log` để có thể audit khi demo.

## Giai đoạn 4 — Dashboard & Danh sách (1.5 ngày)
- [ ] Trang chủ tổng quan (số liệu tổng hợp).
- [ ] Trang danh sách Người/Công ty/Sự kiện với tìm kiếm/lọc.
- [ ] Trang chi tiết hồ sơ (timeline lịch sử tương tác).
- [ ] Hàng đợi xác nhận chuẩn hoá (UI duyệt/từ chối gộp).

## Giai đoạn 5 — Trực quan hoá đồ thị (1 ngày)
- [ ] Tích hợp `d3.js` hoặc `react-force-graph` để vẽ node/edge.
- [ ] Cho phép click vào node → mở trang chi tiết tương ứng.
- [ ] Bộ lọc trên graph (theo ngành, theo sự kiện, theo khoảng thời gian).

## Giai đoạn 6 — Insight Agent & Chat Assistant (1.5 ngày)
- [ ] Viết prompt cho Insight Agent (input: sự kiện mới + tiêu chí; output: danh sách gợi ý + lý do).
- [ ] Viết `chat-service`: kết hợp SQL query có cấu trúc + RAG semantic search + Gemini tổng hợp câu trả lời.
- [ ] Đảm bảo mọi câu trả lời chat đều trích dẫn thực thể cụ thể trong Graph (không để Gemini tự bịa tên người/công ty).

## Giai đoạn 7 — Auth, Multi-tenant, Bảo mật (0.5 ngày)
- [ ] Cấu hình Firebase Authentication (Email/Google Sign-in).
- [ ] Gán `tenant_id` vào custom claims khi user đăng ký đơn vị tổ chức.
- [ ] Kiểm tra mọi endpoint đều lọc theo `tenant_id`.

## Giai đoạn 8 — Deploy & Kiểm thử (1 ngày)
- [ ] Đóng gói từng service thành container, deploy lên Cloud Run.
- [ ] Deploy frontend (Cloud Run hoặc Firebase Hosting).
- [ ] Chạy toàn bộ Test Case ở Phần 5.
- [ ] Kiểm tra tốc độ phản hồi, sửa lỗi phát sinh.

## Giai đoạn 9 — Chuẩn bị Demo (0.5–1 ngày)
- [ ] Seed bộ mock data "đẹp" chuyên cho video demo (xem Phần 5).
- [ ] Viết kịch bản quay video theo Phần 5.4.
- [ ] Quay, dựng video ≤ 2 phút, đăng YouTube (theo yêu cầu Hạng Đồng của BTC).
- [ ] Chuẩn bị link Google AI Studio project + link Cloud Run demo thật (không chỉ mockup) cho tiêu chí Deployment (+10 điểm).

**Tổng thời gian ước tính: ~10–11 ngày làm việc tập trung** (có thể rút ngắn nếu chia việc song song theo từng service cho từng thành viên team).

---

# PHẦN 4 — MEGA ONE-SHOT PROMPT CHO GOOGLE AI STUDIO

Dán nguyên khối dưới đây vào Google AI Studio (chế độ Build/App) để AI Studio hiểu đầy đủ ngữ cảnh và "vibe" ra đúng dự án đã thiết kế. Prompt được viết theo cấu trúc: Vai trò → Bài toán → Kiến trúc → Dữ liệu → Trang & luồng → Yêu cầu kỹ thuật → Ràng buộc → Dữ liệu mẫu.

```
Bạn là một kỹ sư phần mềm full-stack cấp cao, hãy xây dựng cho tôi một ứng dụng
web hoàn chỉnh tên là "EventGraph AI".

# 1. BỐI CẢNH & BÀI TOÁN
EventGraph AI là nền tảng giúp các đơn vị tổ chức sự kiện/hội thảo (trung tâm đổi
mới sáng tạo, coworking space, CLB khởi nghiệp) chuẩn hoá và khai thác dữ liệu
Người – Công ty – Sự kiện từ 3 nguồn khác nhau:
(a) quét danh thiếp (card visit) thu được tại sự kiện,
(b) nhập tay doanh nghiệp mới chủ động liên hệ,
(c) import file Excel dữ liệu các sự kiện cũ.
Cả 3 nguồn phải được chuẩn hoá về CHUNG một đồ thị dữ liệu (Entity Graph) duy
nhất, không phải 3 kho dữ liệu tách rời.

# 2. KIẾN TRÚC HỆ THỐNG (bắt buộc tuân thủ)
- Frontend: React + TailwindCSS, giao diện dashboard đa trang, responsive, hỗ
  trợ mobile-web vì người dùng có thể scan card ngay tại sự kiện bằng điện thoại.
- Backend: microservices Python (FastAPI), gồm các service:
  1. ocr-service — nhận ảnh danh thiếp, gọi Gemini Vision multimodal để trích
     xuất: full_name, title, company_name, phone, email, ngôn ngữ phát hiện.
  2. enrichment-service — nhận tên công ty, dùng Gemini kèm Google Search
     Grounding để bổ sung: industry, size_range, description, kèm nguồn trích
     dẫn cho từng field bổ sung (không được bịa nếu không tìm thấy).
  3. excel-parser-service — nhận file .xlsx, cho phép người dùng map cột tuỳ ý
     sang schema chuẩn, xử lý batch hàng nghìn dòng.
  4. standardization-service — với MỌI bản ghi mới (từ cả 3 nguồn trên), tính
     vector embedding tên người/tên công ty, so khớp với dữ liệu đã có trong
     Graph bằng cosine similarity KẾT HỢP rule cứng (cùng domain email = tăng
     độ tin cậy gộp). Ngưỡng: similarity > 0.85 => tự đề xuất gộp; 0.6–0.85 =>
     đưa vào hàng đợi xác nhận thủ công; < 0.6 => tạo thực thể mới. Toàn bộ
     quyết định phải ghi log (entity nào, so khớp với candidate nào, điểm số,
     rule áp dụng) để có thể audit/giải thích được, KHÔNG được là hộp đen.
  5. insight-service — khi người dùng tạo sự kiện mới, truy vấn Graph để gợi ý
     danh sách Người/Công ty nên mời (liên kết gần với khách VIP hiện tại,
     cùng ngành, chưa từng được mời trước đó), kèm giải thích lý do bằng
     Gemini.
  6. chat-service — trợ lý hỏi đáp tự nhiên. Với mỗi câu hỏi: (a) nếu câu hỏi
     có cấu trúc rõ ràng (VD: "ai tham dự sự kiện X") => sinh truy vấn SQL trực
     tiếp trên Graph; (b) nếu câu hỏi mờ về ngữ nghĩa (VD: "ai làm về AI") =>
     dùng semantic search trên embedding. Gemini tổng hợp câu trả lời cuối
     cùng NHƯNG PHẢI liệt kê tên thực thể có thật trong Graph, TUYỆT ĐỐI
     KHÔNG được bịa tên người/công ty không tồn tại trong dữ liệu.
- Database: PostgreSQL (Cloud SQL) có bật extension pgvector để lưu embedding
  ngay trong bảng, tránh phải dựng thêm hạ tầng vector riêng.
- Lưu trữ file: Cloud Storage cho ảnh card gốc và file Excel gốc.
- Xác thực: Firebase Authentication (email + Google Sign-in), có custom claim
  "tenant_id" để phân quyền đa đơn vị tổ chức (multi-tenant) — MỌI truy vấn
  backend đều phải lọc theo tenant_id ở tầng service, không tin tưởng frontend.

# 3. MÔ HÌNH DỮ LIỆU (Entity Graph Schema) — tạo đúng các bảng sau
- person(id, full_name, title, phone, email, language_detected, source_type,
  source_ref_id, tenant_id, embedding_vector, created_at, updated_at)
- company(id, name, domain, industry, size_range, description,
  enrichment_data JSONB, tenant_id, embedding_vector, created_at, updated_at)
- event(id, name, date, location, type, tenant_id, raw_source_file_url)
- participation(id, person_id FK, event_id FK, role)
- affiliation(id, person_id FK, company_id FK, title, is_current)
- resolution_log(id, entity_type, entity_id, matched_candidate_id,
  similarity_score, matched_rule, decision, created_at)

# 4. DANH SÁCH TRANG CẦN DỰNG (14 trang, đúng thứ tự điều hướng)
1. Đăng nhập (chọn/tạo đơn vị tổ chức)
2. Trang chủ tổng quan (thẻ số liệu: tổng số Người/Công ty/Sự kiện)
3. Nhập liệu — Scan card visit (chụp/upload ảnh, hỗ trợ nhiều ảnh 1 lượt)
4. Nhập liệu — Thêm doanh nghiệp mới (form + xem trước enrichment tự động)
5. Nhập liệu — Import Excel (upload + giao diện mapping cột + xem trước)
6. Hàng đợi xác nhận chuẩn hoá (danh sách đề xuất gộp/thực thể mới, nút
   Duyệt/Từ chối, hiển thị lý do đề xuất — similarity score + rule)
7. Danh sách Người (bảng có tìm kiếm, lọc theo công ty/sự kiện/ngành)
8. Danh sách Công ty (bảng có tìm kiếm, lọc theo ngành/quy mô)
9. Danh sách Sự kiện (dạng timeline theo thời gian)
10. Chi tiết hồ sơ (Người hoặc Công ty) — hiển thị toàn bộ lịch sử tương tác
    qua các sự kiện, các mối liên kết liên quan
11. Đồ thị quan hệ trực quan (dùng d3.js hoặc react-force-graph, node = Người/
    Công ty, click vào node mở trang chi tiết, có bộ lọc theo ngành/sự kiện)
12. Gợi ý kết nối (Insight Agent) — chọn 1 sự kiện sắp tới, hệ thống gợi ý
    danh sách nên mời kèm lý do
13. Trợ lý Chat — giao diện chat hỏi đáp tự do trên toàn bộ Graph
14. Báo cáo & Cài đặt — xuất CSV/Excel, quản lý người dùng trong tenant

# 5. YÊU CẦU PHI CHỨC NĂNG
- Xử lý import Excel hàng nghìn dòng trong dưới 5 phút (hiển thị progress bar).
- Toàn bộ quyết định gộp/tách thực thể phải giải thích được (không hộp đen).
- Giao diện tiếng Việt, responsive, ưu tiên trải nghiệm mobile cho trang Scan
  card vì người dùng thao tác ngay tại sự kiện bằng điện thoại.
- Thời gian phản hồi Trợ lý Chat dưới 4 giây.

# 6. DỮ LIỆU MẪU ĐỂ SEED SẴN (để demo ngay khi vừa build xong)
Hãy tạo sẵn dữ liệu mẫu tiếng Việt cho 1 tenant tên "Demo Innovation Hub" gồm:
- 3 sự kiện: "AI Riser Vietnam Demo Day 2026", "Tech Networking Night Q2/2026",
  "Startup Mixer Đà Nẵng 2025"
- 15 người với tên Việt Nam đa dạng, chức danh (Founder, BD Manager, CEO...),
  thuộc khoảng 8 công ty khác nhau (mix công nghệ, F&B, giáo dục, fintech)
- Một vài trường hợp CỐ Ý trùng lặp nhẹ giữa các sự kiện (VD: 1 người tham dự
  cả 3 sự kiện, tên viết hoa/thường khác nhau giữa các nguồn) để minh hoạ tính
  năng Entity Resolution hoạt động thật khi demo.

# 7. RÀNG BUỘC QUAN TRỌNG
- KHÔNG tự ý thêm tính năng ngoài phạm vi mô tả trên (không thêm thanh toán,
  không thêm mạng xã hội, không thêm chatbot ngoài phạm vi dữ liệu Graph).
- Component Standardization phải luôn hiển thị được "lý do" khi gộp/không gộp
  — đây là yêu cầu bắt buộc, không được bỏ qua vì đây là điểm chấm kỹ thuật
  quan trọng nhất của giám khảo.
- Ưu tiên code sạch, tách rõ từng service theo đúng Phần 2, để có thể trình
  bày kiến trúc multi-agent rõ ràng khi demo trước hội đồng chấm thi.
```

**Mẹo khi dùng prompt trên:** nếu Google AI Studio giới hạn độ dài 1 lần nhập, hãy tách thành 2-3 lượt gửi theo thứ tự: (1) Mục 1-3 [Bối cảnh + Kiến trúc + Data model] trước để AI Studio dựng khung, (2) Mục 4-5 [Trang + NFR] để hoàn thiện UI, (3) Mục 6-7 [Dữ liệu mẫu + Ràng buộc] để tinh chỉnh và seed demo data.

---

# PHẦN 5 — TEST CASE, MVP & KỊCH BẢN DEMO QUAY VIDEO

## 5.1 Định nghĩa MVP (tối thiểu để chứng minh giá trị lõi)
MVP **không cần đủ 14 trang hoàn chỉnh** — cần đủ để chứng minh **vòng lặp giá trị cốt lõi**: dữ liệu từ nhiều nguồn → chuẩn hoá thông minh → graph hữu ích → khai thác được (chat + insight). Ưu tiên theo thứ tự:

| Mức độ | Bao gồm |
|---|---|
| **MVP lõi (bắt buộc)** | Trang 3 (Scan card) hoạt động thật với Gemini Vision, Trang 6 (Hàng đợi xác nhận — thể hiện rõ logic gộp/không gộp), Trang 7-8 (Danh sách), Trang 11 (Đồ thị quan hệ) |
| **MVP mở rộng (nên có)** | Trang 5 (Import Excel), Trang 12 (Insight Agent), Trang 13 (Chat Assistant) |
| **Có thể mock/demo bằng dữ liệu tĩnh nếu thiếu thời gian** | Trang 4 (Thêm DN mới — có thể demo bằng 1-2 ví dụ tay), Trang 14 (Báo cáo/Cài đặt) |

## 5.2 Bảng Test Case
| # | Test case | Input | Kết quả mong đợi | Mục đích chứng minh |
|---|-----------|-------|-------------------|---------------------|
| TC1 | OCR card visit tiếng Việt | Ảnh card rõ nét, tiếng Việt có dấu | Trích đúng ≥90% field | Vision Agent hoạt động |
| TC2 | OCR card visit đa ngôn ngữ | Ảnh card tiếng Anh/Hàn | Trích đúng field, nhận diện đúng ngôn ngữ | Đa ngôn ngữ theo đề bài gốc #2 |
| TC3 | Entity Resolution — trùng thật | 2 bản ghi cùng người, tên viết khác nhau ("Nguyễn Văn A" vs "NGUYEN VAN A"), cùng email domain | Hệ thống đề xuất gộp, hiển thị lý do (similarity + cùng domain email) | Điểm kỹ thuật cốt lõi — có thể audit |
| TC4 | Entity Resolution — không trùng | 2 người trùng tên nhưng khác công ty/email hoàn toàn | Hệ thống KHÔNG gộp, tạo 2 thực thể riêng | Tránh gộp sai (false positive) |
| TC5 | Import Excel 500+ dòng | File Excel mẫu sự kiện cũ | Xử lý xong < 5 phút, hiển thị số dòng trùng phát hiện được | Đúng NFR về hiệu năng |
| TC6 | Enrichment doanh nghiệp mới | Tên công ty có thông tin công khai | Trả về hồ sơ có nguồn trích dẫn rõ ràng | Không bịa dữ liệu (grounded) |
| TC7 | Chat Assistant — câu hỏi cấu trúc | "Ai tham dự cả Demo Day và Tech Networking Night?" | Trả lời đúng tên cụ thể có trong Graph | Chat dùng SQL query thật, không bịa |
| TC8 | Chat Assistant — câu hỏi ngữ nghĩa mờ | "Ai làm về AI trong hệ sinh thái của tôi?" | Trả lời dựa trên semantic search trên field industry/description | RAG hoạt động đúng |
| TC9 | Insight Agent | Tạo sự kiện mới, bấm "Gợi ý khách mời" | Trả về danh sách kèm lý do cụ thể (VD: "cùng ngành Fintech với 3 khách VIP đã mời") | Insight có căn cứ, không ngẫu nhiên |
| TC10 | Multi-tenant | 2 tài khoản thuộc 2 đơn vị tổ chức khác nhau | Không thấy dữ liệu của nhau | Bảo mật đa tenant |

## 5.3 Bộ dữ liệu mock (Mock Data Set) để demo
Chuẩn bị trước khi quay video:
- **5-6 ảnh card visit thật hoặc dựng mẫu** (có thể tự thiết kế bằng Canva): 3 tiếng Việt, 1-2 tiếng Anh, cố ý để 1 người xuất hiện lặp ở 2 card khác nhau với cách viết tên khác nhau (để demo TC3 sống động).
- **1 file Excel mẫu ~50-100 dòng** mô phỏng dữ liệu 1 sự kiện cũ (cột: Họ tên, Công ty, Chức danh, Email, SĐT) — có thể lấy cảm hứng từ danh sách khách mời một sự kiện công khai (ẩn danh hoá tên thật nếu cần).
- **3 sự kiện mẫu** với tên gợi nhớ đến hệ sinh thái đổi mới sáng tạo (VD: "AI Riser Vietnam Demo Day 2026", "Startup Mixer Đà Nẵng").
- **1 kịch bản câu hỏi chat mẫu** đã kiểm tra trước để chắc chắn trả lời đúng khi quay (tránh rủi ro AI trả lời sai ngay lúc quay).

## 5.4 Kịch bản quay video demo (≤ 2 phút, theo yêu cầu Hạng Đồng)
| Thời lượng | Nội dung quay | Ghi chú |
|---|---|---|
| 0:00–0:15 | Mở đầu: nêu vấn đề — "Sau mỗi sự kiện, hàng chục card visit nằm quên, dữ liệu cũ nằm rải rác trong Excel..." | Giọng đọc + hình ảnh minh hoạ (đống card visit thật) |
| 0:15–0:40 | Demo Scan card visit trực tiếp bằng điện thoại → xem kết quả OCR + enrichment tự động | Quay màn hình điện thoại thật |
| 0:40–1:00 | Demo Hàng đợi xác nhận — chỉ rõ hệ thống phát hiện 1 người trùng ở 2 nguồn khác nhau và giải thích lý do gộp | Đây là điểm kỹ thuật cần nhấn mạnh nhất |
| 1:00–1:20 | Demo Đồ thị quan hệ — click vào 1-2 node để show tương tác | Quay màn hình desktop, phóng to đồ thị |
| 1:20–1:45 | Demo Trợ lý Chat — gõ câu hỏi đã chuẩn bị trước, show câu trả lời đúng kèm tên thực thể thật | Chọn câu hỏi ấn tượng, dễ hiểu với người xem |
| 1:45–2:00 | Kết: nêu tác động ("giảm thời gian nhập liệu từ hàng giờ xuống vài phút") + link Cloud Run demo thật + kêu gọi hành động | Chèn logo #BuildwithGoogleAI theo yêu cầu branding |

**Lưu ý khi nộp bài:** vì tiêu chí Hạng Bạc yêu cầu điểm thưởng Deployment (+10 điểm) cho Live Cloud Run URL, hãy đảm bảo link Cloud Run trong phần mô tả video là **link thật đang chạy**, không phải chỉ ảnh chụp màn hình — giám khảo có thể bấm vào thử trực tiếp.

---

# PHẦN 6 — TECH STACK: LÝ DO CHỌN & LỢI ÍCH MANG LẠI

### Frontend: React + TailwindCSS
- Dựng nhanh trên chính Google AI Studio (được hỗ trợ native trong chế độ Build).
- Component hoá dễ dàng để tái sử dụng UI giữa 14 trang (VD: 1 component "EntityCard" dùng chung cho cả trang Người và Công ty).
- Tailwind giúp responsive nhanh — quan trọng vì trang Scan card phải dùng tốt trên điện thoại ngay tại sự kiện thật.

### Backend: Python FastAPI trên Cloud Run
- FastAPI có type-hint mạnh, tự sinh API docs (Swagger) — tiện để test riêng từng service (Giai đoạn 2 trong lộ trình) trước khi nối frontend, giảm rủi ro debug muộn.
- Cloud Run tự động scale về 0 khi không có traffic → chi phí gần như 0 trong lúc thi, nhưng vẫn scale lên được nếu giám khảo truy cập nhiều cùng lúc lúc chấm bài.
- Kiến trúc microservices (6 service tách riêng) giúp **trình bày kiến trúc multi-agent rõ ràng, dễ giải thích với giám khảo** — mỗi service = 1 Agent có trách nhiệm riêng, không phải "1 file main.py làm hết".

### AI Core: Gemini 3 Pro (Google AI Studio API)
- Multimodal (Vision) xử lý được ảnh card visit trực tiếp, không cần thêm thư viện OCR riêng (Tesseract...) — giảm độ phức tạp hạ tầng.
- Google Search Grounding tích hợp sẵn cho Enrichment Agent — đảm bảo dữ liệu bổ sung có nguồn, tránh hallucination, đúng tinh thần "tránh AI Slop".
- Nằm trong hạn ngạch miễn phí của chương trình (1.000 request/ngày) — đủ cho giai đoạn thử nghiệm và cả giai đoạn chấm thi.

### Database: PostgreSQL (Cloud SQL) + pgvector
- Vừa lưu dữ liệu quan hệ (bảng person/company/event/participation) vừa lưu vector embedding trong CÙNG một database — tránh phải đồng bộ giữa 2 hệ thống riêng (SQL DB + Vector DB), giảm độ phức tạp và độ trễ.
- SQL truyền thống cho phép viết truy vấn Graph dạng JOIN rõ ràng, dễ audit — phù hợp với yêu cầu "mọi quyết định phải giải thích được" của dự án.
- Cloud SQL nằm trong gói Starter Tier miễn phí của chương trình.

### Lưu trữ file: Cloud Storage
- Lưu ảnh card gốc và file Excel gốc — cho phép truy xuất lại nguồn nếu cần kiểm tra/sửa lỗi OCR sau này (traceability).
- Tích hợp signed URL để frontend upload trực tiếp mà không phải qua backend trung gian, giảm tải cho Cloud Run.

### Xác thực & phân quyền: Firebase Authentication
- Hỗ trợ sẵn custom claims — cách chuẩn để làm multi-tenant (gán `tenant_id` cho mỗi user) mà không cần tự viết hệ thống phân quyền từ đầu.
- Tích hợp SDK frontend rất nhanh (vài dòng code), tiết kiệm thời gian cho phần không phải giá trị cốt lõi của sản phẩm.

### Trực quan hoá đồ thị: d3.js (hoặc react-force-graph)
- Là thư viện chuẩn công nghiệp cho network graph, có khả năng tuỳ biến sâu (màu theo ngành, kích thước node theo số lần tham dự sự kiện) — tạo hiệu ứng thị giác ấn tượng khi demo trước giám khảo.

### Xử lý Excel phía frontend: SheetJS / Papaparse
- Cho phép xem trước (preview) dữ liệu Excel ngay trên trình duyệt trước khi gửi lên server — cải thiện trải nghiệm mapping cột ở Trang 5.

### Tác vụ định kỳ: Cloud Scheduler + Cloud Functions
- Dùng để làm mới dữ liệu enrichment công ty theo chu kỳ (VD: mỗi quý) — đảm bảo hồ sơ công ty không bị lỗi thời, một điểm cộng khi giám khảo hỏi về "khả năng duy trì dữ liệu sống" của hệ thống.

---

# PHẦN 7 — HƯỚNG DẪN TRIỂN KHAI HỆ SINH THÁI GOOGLE TỪ A-Z

## 7.1 Google AI Studio (thiết kế & vibe-code khung ứng dụng)
1. Truy cập `aistudio.google.com`, đăng nhập bằng tài khoản Google.
2. Tạo **API Key** mới (mục Get API Key) — lưu lại dùng cho backend gọi Gemini.
3. Vào chế độ **Build/App** (không phải chế độ Chat thường) để dùng tính năng vibe-code full-stack.
4. Dán **Mega Prompt ở Phần 4** vào khung nhập, chia làm 2-3 lượt nếu prompt bị giới hạn độ dài.
5. Xem preview ứng dụng được sinh ra, yêu cầu chỉnh sửa từng phần nếu chưa đúng (VD: "sửa lại Trang 6 để hiển thị rõ similarity score dạng phần trăm").
6. Khi hài lòng, dùng chức năng **Export/Connect to Cloud Run** (nếu AI Studio hỗ trợ trực tiếp) hoặc tải mã nguồn về để tự deploy theo hướng dẫn 7.2.

## 7.2 Google Cloud Run (deploy backend & frontend)
1. Cài `gcloud CLI` trên máy: `curl https://sdk.cloud.google.com | bash`.
2. Đăng nhập: `gcloud auth login` và chọn project: `gcloud config set project <PROJECT_ID>`.
3. Kích hoạt API: `gcloud services enable run.googleapis.com`.
4. Với mỗi service (VD `ocr-service`), viết `Dockerfile` đơn giản (base image `python:3.11-slim`, copy code, cài `requirements.txt`, chạy bằng `uvicorn`).
5. Build & deploy trực tiếp bằng 1 lệnh:
   `gcloud run deploy ocr-service --source . --region asia-southeast1 --allow-unauthenticated`
6. Lặp lại cho từng service (`enrichment-service`, `excel-parser-service`, `standardization-service`, `insight-service`, `chat-service`) và cho `frontend`.
7. Lấy URL public mỗi service sau khi deploy xong, cập nhật vào biến môi trường của frontend.
8. (Tuỳ chọn) Gộp các service phụ vào 1 Cloud Run app dùng router nội bộ nếu muốn tuân thủ đúng giới hạn "2 ứng dụng Full-stack" của gói Starter Tier.

## 7.3 Firebase Authentication (đăng nhập & multi-tenant)
1. Vào `console.firebase.google.com`, chọn **Add project**, liên kết với cùng Google Cloud Project đã tạo ở 7.1.
2. Vào **Authentication → Sign-in method**, bật **Email/Password** và **Google**.
3. Vào **Project Settings → Service accounts**, tạo Service Account Key (JSON) để backend xác thực token.
4. Trong code backend (Python), dùng thư viện `firebase-admin` để verify ID token gửi từ frontend.
5. Khi user đăng ký đơn vị tổ chức lần đầu, backend gọi `auth.set_custom_user_claims(uid, {"tenant_id": "..."})` để gắn quyền multi-tenant.
6. Frontend dùng Firebase JS SDK (`firebase/auth`) để đăng nhập, lấy ID token gửi kèm mỗi request API (header `Authorization: Bearer <token>`).

## 7.4 Cloud SQL (PostgreSQL + pgvector)
1. `gcloud sql instances create eventgraph-db --database-version=POSTGRES_15 --tier=db-f1-micro --region=asia-southeast1` (tier micro đủ dùng giai đoạn thi, miễn/giá rẻ).
2. Tạo database: `gcloud sql databases create eventgraph --instance=eventgraph-db`.
3. Kết nối qua **Cloud SQL Auth Proxy** để dev local an toàn: tải proxy, chạy `./cloud-sql-proxy <INSTANCE_CONNECTION_NAME>`.
4. Bật extension vector: chạy lệnh SQL `CREATE EXTENSION IF NOT EXISTS vector;`.
5. Chạy script tạo bảng theo schema Phần 2.2 (dùng Alembic hoặc SQL thuần).
6. Trên Cloud Run, kết nối Cloud SQL bằng cách thêm flag `--add-cloudsql-instances=<INSTANCE_CONNECTION_NAME>` khi deploy.

## 7.5 Cloud Storage (lưu ảnh card & file Excel gốc)
1. `gcloud storage buckets create gs://eventgraph-uploads --location=asia-southeast1`.
2. Cấu hình CORS để frontend upload trực tiếp: tạo file `cors.json` cho phép origin của frontend, chạy `gcloud storage buckets update gs://eventgraph-uploads --cors-file=cors.json`.
3. Backend sinh **Signed URL** (dùng `google-cloud-storage` SDK) để frontend upload file thẳng lên bucket, không qua Cloud Run trung gian — nhanh hơn và giảm tải.
4. Sau khi upload xong, frontend gửi `file_url` về backend để service tương ứng (OCR/Excel Parser) xử lý.

## 7.6 Vertex AI Embeddings (nếu muốn nâng cấp thay vì chỉ dùng pgvector cơ bản)
1. Kích hoạt API: `gcloud services enable aiplatform.googleapis.com`.
2. Gọi model embedding qua REST API hoặc SDK `google-cloud-aiplatform` (Python) — truyền vào tên người/công ty, nhận về vector.
3. Lưu vector trực tiếp vào cột `embedding_vector` (kiểu `vector` của pgvector) trong Cloud SQL — không cần dựng riêng Vertex AI Vector Search cho quy mô MVP (chỉ cần khi dữ liệu lên tới hàng trăm nghìn bản ghi).
4. Với truy vấn similarity: dùng toán tử `<=>` (cosine distance) của pgvector ngay trong câu lệnh SQL — vừa nhanh vừa đơn giản để demo.

## 7.7 Cloud Scheduler + Cloud Functions (làm mới enrichment định kỳ)
1. Viết 1 Cloud Function nhỏ gọi lại `enrichment-service` cho các công ty đã cũ hơn 90 ngày.
2. Deploy: `gcloud functions deploy refresh-enrichment --runtime python311 --trigger-http --region asia-southeast1`.
3. Tạo lịch chạy: `gcloud scheduler jobs create http refresh-job --schedule="0 2 1 * *" --uri=<function-url> --http-method=POST` (chạy 2h sáng ngày 1 mỗi tháng).

## 7.8 Google Sheets API (tuỳ chọn — xuất báo cáo trực tiếp ra Google Sheets)
1. Kích hoạt API: `gcloud services enable sheets.googleapis.com`.
2. Dùng Service Account đã tạo ở 7.3, cấp quyền chỉnh sửa file Sheet đích.
3. Trong `chat-service`/Trang 14, dùng thư viện `gspread` (Python) để ghi dữ liệu Graph đã lọc trực tiếp vào 1 Google Sheet, tiện cho người dùng không quen dashboard vẫn thao tác được bằng công cụ quen thuộc.

## 7.9 Giám sát & Log (Cloud Logging/Monitoring)
1. Cloud Run tự động đẩy log vào Cloud Logging — không cần cấu hình thêm.
2. Tạo Dashboard đơn giản trong Cloud Monitoring theo dõi: số request/service, tỷ lệ lỗi, độ trễ trung bình — dùng số liệu này làm minh chứng "hệ thống ổn định" khi trình bày với giám khảo (đặc biệt hữu ích cho tiêu chí Hạng Vàng — Active User Engagement).

---

## Tổng kết nhanh việc cần làm ngay hôm nay
1. Tạo Google Cloud Project + Google AI Studio project (7.1).
2. Vẽ lại schema Entity Graph cùng cả team, thống nhất trước khi code (2.2).
3. Dán Mega Prompt (Phần 4) vào Google AI Studio để có khung ứng dụng đầu tiên.
4. Bắt đầu Giai đoạn 1-2 của lộ trình (Phần 3) ngay trong ngày.
