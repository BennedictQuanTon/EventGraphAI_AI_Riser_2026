import React, { useState } from 'react';
import { api } from '../api';
import { Sparkles, Users, Calendar, Award, CheckCircle2, ArrowRight, Star, Target } from 'lucide-react';

export default function InsightAgentView() {
  const [eventName, setEventName] = useState('AI & Fintech Growth Summit 2026');
  const [eventType, setEventType] = useState('networking');
  const [targetIndustry, setTargetIndustry] = useState('AI');
  const [topic, setTopic] = useState('Đổi mới sáng tạo & Gọi vốn đầu tư');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRecommend = async (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.recommendGuests({
        event_name: eventName,
        event_type: eventType,
        target_industry: targetIndustry || undefined,
        topic: topic || undefined,
        max_recommendations: 6
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Insight Agent — Gợi Ý Khách Mời Mục Tiêu Cho Sự Kiện
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Phân tích cấu trúc đồ thị mạng lưới để gợi ý ai nên được mời dựa trên chuyên môn, lịch sử kết nối VIP và tính tương thích liên ngành.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Setup Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleRecommend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Tiêu chí sự kiện sắp tới</h3>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tên sự kiện mục tiêu *</label>
              <input type="text" required value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Ngành nghề ưu tiên</label>
              <select value={targetIndustry} onChange={(e) => setTargetIndustry(e.target.value)} style={{ width: '100%' }}>
                <option value="">-- Tất cả ngành --</option>
                <option value="AI">Trí tuệ nhân tạo (AI & Big Data)</option>
                <option value="Fintech">Công nghệ Tài chính (FinTech)</option>
                <option value="Venture Capital">Quỹ Đầu tư Khởi nghiệp (VC)</option>
                <option value="GreenTech">Công nghệ Xanh & ESG</option>
                <option value="EdTech">Công nghệ Giáo dục</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Chủ đề hoặc từ khóa trọng tâm</label>
              <input type="text" placeholder="VD: Khởi nghiệp, Gọi vốn, DeepTech..." value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: '100%' }} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '10px',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Insight Agent đang phân tích Graph...' : 'Phân Tích & Gợi Ý Khách Mời'}</span>
            </button>
          </form>
        </div>

        {/* Recommendations Result */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Kết Quả Đề Xuất Từ Graph</h3>

          {loading && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #F59E0B', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px' }}>Đang duyệt qua các node quan hệ và đánh giá điểm liên quan...</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Bấm nút "Phân Tích & Gợi Ý" để nhận danh sách khách mời tiềm năng.
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '12.5px',
                color: '#FCD34D',
                lineHeight: '1.4'
              }}>
                {result.summary_analysis}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {result.recommendations.map((rec, i) => (
                  <div key={i} style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{rec.full_name}</span>
                        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{rec.title} • <strong style={{ color: '#60A5FA' }}>{rec.company_name}</strong></div>
                      </div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34D399',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        Độ tương thích: {Math.round(rec.relevance_score * 100)}%
                      </span>
                    </div>

                    {/* Reasons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '6px' }}>
                      {rec.reasons.map((r, ri) => (
                        <div key={ri} style={{ fontSize: '11.5px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={12} color="#10B981" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
