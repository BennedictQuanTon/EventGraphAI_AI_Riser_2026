import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { FileText, Download, Award, Star, MessageSquare, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

export default function ReportsView() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Giám khảo / Khán giả sự kiện');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await api.getFeedbacks();
      setFeedbacks(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.submitFeedback({ name, email, role, rating, comment });
      setSubmitted(true);
      setName('');
      setEmail('');
      setComment('');
      loadFeedbacks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <FileText size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Báo Cáo Xuất Dữ Liệu & Minh Chứng Hạng Vàng
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Xuất dữ liệu chuẩn hóa sang Google Sheets / CSV và thu thập minh chứng người dùng thực tế (Active User Engagement).
            </p>
          </div>
        </div>

        <a
          href={api.getExportCsvUrl()}
          download="eventgraph_export.csv"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '13.5px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Download size={16} />
          <span>Xuất File CSV / Google Sheets</span>
        </a>
      </div>

      {/* Two Column Feedback Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Submit Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={18} color="#F59E0B" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
              Đóng Góp Trải Nghiệm Sản Phẩm
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Phản hồi này được ghi nhận trực tiếp vào cơ sở dữ liệu làm minh chứng cho tiêu chí Hạng Vàng AI Riser Vietnam 2026.
          </p>

          {submitted && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '12.5px', fontWeight: '600', marginBottom: '14px' }}>
              ✓ Cảm ơn bạn! Đóng góp của bạn đã được ghi nhận vào hệ thống.
            </div>
          )}

          <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Họ và tên của bạn *</label>
              <input type="text" required placeholder="VD: Nguyễn Văn B" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email hoặc Đơn vị công tác</label>
              <input type="text" placeholder="VD: b.nguyen@innovate.vn" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Vai trò trải nghiệm</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%' }}>
                <option value="Giám khảo cuộc thi AI Riser 2026">Giám khảo cuộc thi AI Riser 2026</option>
                <option value="Đơn vị tổ chức sự kiện / Coworking Space">Đơn vị tổ chức sự kiện / Coworking Space</option>
                <option value="Khách mời tham dự sự kiện Demo Day">Khách mời tham dự sự kiện Demo Day</option>
                <option value="Founder / AI Developer">Founder / AI Developer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Đánh giá trải nghiệm (1 - 5 sao)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: rating >= s ? '1px solid #F59E0B' : '1px solid var(--border-subtle)',
                      background: rating >= s ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                      color: rating >= s ? '#FCD34D' : 'var(--text-muted)'
                    }}
                  >
                    ★ {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nhận xét / Ý kiến đóng góp</label>
              <textarea rows={3} placeholder="Sản phẩm giải quyết tốt bài toán chuẩn hóa dữ liệu sau sự kiện..." value={comment} onChange={(e) => setComment(e.target.value)} style={{ width: '100%' }} />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Gửi Phản Hồi Trực Tiếp
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
            Nhật Ký Tương Tác Người Dùng ({feedbacks.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
            {feedbacks.map((fb) => (
              <div key={fb.id} style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{fb.name}</span>
                  <span style={{ color: '#FCD34D', fontSize: '12px' }}>{'★'.repeat(fb.rating)}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#60A5FA' }}>{fb.role}</div>
                {fb.comment && <p style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '2px' }}>"{fb.comment}"</p>}
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {new Date(fb.created_at).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
