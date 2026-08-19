import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Building2, Search, Globe, Users, ExternalLink, ShieldCheck, X } from 'lucide-react';

export default function CompaniesView() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, [search]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.getCompanies(search);
      setCompanies(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const detail = await api.getCompanyDetail(id);
      setSelectedCompany(detail);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <Building2 size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Danh Sách Doanh Nghiệp & Startups ({companies.length})
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Đã được làm giàu thông tin và trích xuất thực thể liên kết.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên công ty, ngành nghề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải danh sách doanh nghiệp...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {companies.map((c) => (
            <div
              key={c.id}
              onClick={() => handleOpenDetail(c.id)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.15s, border-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontWeight: '600' }}>
                  {c.industry || 'Doanh nghiệp'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {c.member_count} nhân sự
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{c.name}</h3>
                {c.domain && <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{c.domain}</div>}
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.description || 'Chưa có mô tả chi tiết.'}
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Quy mô: {c.size_range || '20-50 nhân sự'}</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} /> Grounded
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 99
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto', padding: '28px', background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#60A5FA' }}>
                Hồ Sơ Doanh Nghiệp
              </span>
              <button onClick={() => setSelectedCompany(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {selectedCompany.name}
            </h2>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontWeight: '600' }}>
                {selectedCompany.industry}
              </span>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' }}>
                {selectedCompany.size_range}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Mô tả tổng quan:</h4>
              <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.5' }}>
                {selectedCompany.description}
              </p>
            </div>

            {/* Members in Ecosystem */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Nhân sự / Đại diện trong Graph ({selectedCompany.members?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCompany.members?.map((m, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{m.full_name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{m.title}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#60A5FA' }}>{m.email}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
