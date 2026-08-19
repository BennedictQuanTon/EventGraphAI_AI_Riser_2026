import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Calendar, MapPin, Users, Plus, X, Award, CheckCircle2 } from 'lucide-react';

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('conference');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents();
      setEvents(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const detail = await api.getEventDetail(id);
      setSelectedEvent(detail);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.createEvent({ name, date, location, type });
      setShowCreateModal(false);
      setName('');
      setDate('');
      setLocation('');
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <Calendar size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Danh Sách Sự Kiện & Hội Thảo ({events.length})
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Toàn bộ lịch sử các sự kiện và mối quan hệ đối tác tham dự.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#fff',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          <Plus size={16} />
          <span>Tạo Sự Kiện Mới</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải danh sách sự kiện...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => handleOpenDetail(ev.id)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'transform 0.15s, border-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D', fontWeight: '600' }}>
                  {ev.type || 'Sự kiện'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} /> {ev.participant_count} Khách mời
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{ev.name}</h3>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="var(--text-muted)" />
                  <span>{ev.date}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <MapPin size={14} color="#F59E0B" />
                <span>{ev.location || 'Chưa cập nhật địa điểm'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '28px', background: '#0f172a', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#FCD34D' }}>
                Chi Tiết Sự Kiện & Khách Mời
              </span>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
              {selectedEvent.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              <span>📅 {selectedEvent.date}</span>
              <span>📍 {selectedEvent.location}</span>
            </div>

            {/* Participants */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '10px' }}>
                Danh sách đại diện tham gia ({selectedEvent.participants?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedEvent.participants?.map((p, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>{p.full_name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{p.title} • <strong style={{ color: '#60A5FA' }}>{p.company}</strong></div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#FCD34D', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                      {p.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: '#0f172a', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>Tạo Sự Kiện Mới</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tên sự kiện *</label>
                <input type="text" required placeholder="VD: AI Summit Vietnam 2026" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thời gian tổ chức</label>
                <input type="text" placeholder="VD: 2026-10-15" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Địa điểm</label>
                <input type="text" placeholder="VD: Khách sạn Melia Hà Nội" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%' }} />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Lưu Sự Kiện & Mở Rộng Graph
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
