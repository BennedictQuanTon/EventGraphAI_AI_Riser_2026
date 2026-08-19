import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Users, Search, Mail, Phone, Calendar, Building2, User, X } from 'lucide-react';

export default function PersonsView() {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersons();
  }, [search]);

  const loadPersons = async () => {
    setLoading(true);
    try {
      const res = await api.getPersons(search);
      setPersons(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const detail = await api.getPersonDetail(id);
      setSelectedPerson(detail);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Danh Bạ Nhân Sự & Đối Tác ({persons.length})
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Dữ liệu chuẩn hóa từ Card Visit, Excel và Doanh nghiệp đối tác.
            </p>
          </div>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên, email, chức danh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>
      </div>

      {/* Grid of Person Cards */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải danh bạ...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {persons.map((p) => {
            const primaryCompany = p.companies[0]?.company_name || 'Độc lập';
            const industry = p.companies[0]?.industry || 'Chưa phân loại';
            return (
              <div
                key={p.id}
                onClick={() => handleOpenDetail(p.id)}
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
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', fontWeight: '600' }}>
                    {p.source_type === 'card_scan' ? '📷 Quét Card' : '📑 Excel Import'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {p.events.length} Sự kiện
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{p.full_name}</h3>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{p.title || 'Chuyên gia'}</div>
                  <div style={{ fontSize: '13px', color: '#60A5FA', fontWeight: '600', marginTop: '2px' }}>{primaryCompany}</div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {p.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={13} color="var(--text-muted)" />
                      <span>{p.email}</span>
                    </div>
                  )}
                  {p.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="var(--text-muted)" />
                      <span>{p.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPerson && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', padding: '28px', background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#60A5FA' }}>
                Chi Tiết Hồ Sơ Đối Tác
              </span>
              <button onClick={() => setSelectedPerson(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {selectedPerson.full_name}
            </h2>
            <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '16px' }}>
              {selectedPerson.title}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email liên hệ:</span>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{selectedPerson.email || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Số điện thoại:</span>
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{selectedPerson.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Companies Affiliated */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Doanh nghiệp trực thuộc</h4>
              {selectedPerson.companies?.map((c, i) => (
                <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '6px' }}>
                  <div style={{ fontWeight: '600', color: '#60A5FA', fontSize: '13px' }}>{c.company_name}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.industry}</div>
                </div>
              ))}
            </div>

            {/* Event Timeline History */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>Lịch sử tham gia sự kiện</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedPerson.events?.map((ev, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#FCD34D', fontSize: '13px' }}>{ev.event_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ev.event_date}</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {ev.role}
                    </span>
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
