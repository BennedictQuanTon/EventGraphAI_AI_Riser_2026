import React, { useState } from 'react';
import { api } from '../api';
import { Building2, Sparkles, CheckCircle2, Globe, ShieldCheck, Tag, ExternalLink } from 'lucide-react';

export default function AddCompanyView({ onAdded }) {
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleEnrichAndSave = async (e) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setSuccessMsg('');
    setEnrichedData(null);

    try {
      const res = await api.enrichCompany({
        company_name: companyName.trim(),
        domain: domain.trim() || undefined
      });
      setEnrichedData(res);
      setSuccessMsg(`Đã làm giàu và lưu thành công doanh nghiệp "${res.name}" vào Graph!`);
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <Building2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Thêm Doanh Nghiệp & Tự Động Làm Giàu (Google Search Grounding)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Nhập tên doanh nghiệp mới, Gemini tự động tra cứu dữ liệu công khai, quy mô, mã ngành và gắn trích dẫn nguồn uy tín.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Input Form */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <form onSubmit={handleEnrichAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Thông tin cơ bản</h3>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tên Doanh Nghiệp / Tổ chức <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: VinAI Research, MoMo, VNPT..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Domain / Website (Không bắt buộc)
              </label>
              <input
                type="text"
                placeholder="VD: vinai.io"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !companyName.trim()}
              style={{
                marginTop: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: loading ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Đang tra cứu dữ liệu...' : 'Làm giàu & Lưu vào Graph'}</span>
            </button>
          </form>
        </div>

        {/* Enrichment Preview */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Hồ Sơ Đã Được Grounding</h3>

          {loading && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px' }}>Gemini đang gọi Google Search Grounding để bổ sung dữ liệu...</p>
            </div>
          )}

          {!loading && !enrichedData && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Nhập tên doanh nghiệp bên cạnh để xem kết quả tự động làm giàu.
            </div>
          )}

          {enrichedData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              {successMsg && (
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '12px', fontWeight: '600' }}>
                  {successMsg}
                </div>
              )}

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lĩnh vực & Quy mô:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontSize: '11px', fontWeight: '600' }}>
                    {enrichedData.industry}
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D', fontSize: '11px' }}>
                    {enrichedData.size_range}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mô tả tổng quan:</span>
                <p style={{ color: '#E2E8F0', marginTop: '2px', lineHeight: '1.4' }}>
                  {enrichedData.description}
                </p>
              </div>

              {enrichedData.key_products && enrichedData.key_products.length > 0 && (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sản phẩm / Dịch vụ nổi bật:</span>
                  <ul style={{ paddingLeft: '18px', color: '#94A3B8', marginTop: '4px' }}>
                    {enrichedData.key_products.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {enrichedData.sources && enrichedData.sources.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} color="#10B981" /> Nguồn trích dẫn xác thực:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {enrichedData.sources.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#60A5FA', fontSize: '11px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span>{s.title}</span>
                        <ExternalLink size={10} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
