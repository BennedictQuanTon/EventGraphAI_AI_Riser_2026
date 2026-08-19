import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Users, Building2, Calendar, Network, Camera, FileSpreadsheet, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OverviewView({ setActiveTab, onOpenScan }) {
  const [stats, setStats] = useState({ total_persons: 0, total_companies: 0, total_events: 0, total_nodes: 0, total_links: 0 });
  const [recentPersons, setRecentPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [topo, pList, eList] = await Promise.all([
        api.getGraphTopology(),
        api.getPersons(),
        api.getEvents()
      ]);
      setStats(topo.stats || {});
      setRecentPersons(pList.slice(0, 5));
      setEvents(eList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FCD34D', background: 'rgba(245, 158, 11, 0.2)', padding: '3px 8px', borderRadius: '6px' }}>
              Hệ Thống Đồ Thị Trí Tuệ Doanh Nghiệp
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Từ tấm danh thiếp đến bức tranh toàn cảnh hệ sinh thái.
          </h2>
          <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.5', marginBottom: '20px' }}>
            Hợp nhất 3 nguồn dữ liệu (Quét Card Visit, Doanh nghiệp mới, Import Excel sự kiện cũ) vào 1 đồ thị liên kết duy nhất với tính năng Entity Resolution tự động và Insight Agent.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('graph')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: '600',
                fontSize: '13.5px',
                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
              }}
            >
              <Network size={16} />
              <span>Khám Phá Đồ Thị 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('insight_agent')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontWeight: '500',
                fontSize: '13.5px'
              }}
            >
              <Sparkles size={16} color="#F59E0B" />
              <span>Gợi ý khách mời AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Tổng Nhân Sự & Đối Tác</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stats.total_persons || 0}</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '4px' }}>✓ Đã chuẩn hóa qua Entity Resolution</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Doanh Nghiệp / Startups</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stats.total_companies || 0}</div>
          <div style={{ fontSize: '11px', color: '#60A5FA', marginTop: '4px' }}>✓ Grounding từ Google Search</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sự Kiện & Hội Thảo</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stats.total_events || 0}</div>
          <div style={{ fontSize: '11px', color: '#FCD34D', marginTop: '4px' }}>✓ Đã lưu trữ toàn bộ lịch sử tham dự</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Mối Liên Kết Trong Graph</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
              <Network size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff' }}>{stats.total_links || 0}</div>
          <div style={{ fontSize: '11px', color: '#A78BFA', marginTop: '4px' }}>✓ Cấu trúc quan hệ mạng lưới đa tầng</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Recent Standardized Partners */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Đối Tác Tiêu Biểu Trong Hệ Sinh Thái</h3>
            <button onClick={() => setActiveTab('persons')} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '12px', fontWeight: '600' }}>
              Xem tất cả →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentPersons.map((p) => {
              const comp = p.companies[0]?.company_name || 'Độc lập';
              const ind = p.companies[0]?.industry || 'Công nghệ';
              return (
                <div key={p.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{p.full_name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.title || 'Chuyên gia'} • <strong style={{ color: '#60A5FA' }}>{comp}</strong></div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.12)', color: '#93C5FD' }}>
                    {p.events.length} sự kiện
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ecosystem Events Timeline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Dòng Thời Gian Sự Kiện</h3>
            <button onClick={() => setActiveTab('events')} style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '12px', fontWeight: '600' }}>
              Xem chi tiết →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((ev) => (
              <div key={ev.id} style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{ev.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ev.date} • {ev.location}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#FCD34D' }}>
                  {ev.participant_count} người tham dự
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
