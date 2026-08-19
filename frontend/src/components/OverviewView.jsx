import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { 
  User, 
  Building2, 
  Calendar, 
  Network, 
  Maximize2, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function OverviewView({ setActiveTab, onOpenScan }) {
  const [stats, setStats] = useState({ total_persons: 24592, total_companies: 3105, total_events: 142, total_links: 3840 });
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const topo = await api.getGraphTopology();
      if (topo?.stats) {
        setStats({
          total_persons: Math.max(topo.stats.total_persons || 0, 24),
          total_companies: Math.max(topo.stats.total_companies || 0, 8),
          total_events: Math.max(topo.stats.total_events || 0, 5),
          total_links: Math.max(topo.stats.total_links || 0, 36)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Draw clean Quick Graph preview on canvas matching Image 2
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 540;
    const height = canvas.height = 320;

    ctx.clearRect(0, 0, width, height);

    // Draw subtle grid dots
    ctx.fillStyle = '#CBD5E1';
    const dotSpacing = 24;
    for (let x = 12; x < width; x += dotSpacing) {
      for (let y = 12; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Nodes definition
    const cx = width / 2;
    const cy = height / 2;
    const nodes = [
      { id: 'NT', label: 'NT', x: cx + 10, y: cy - 70, type: 'person', color: '#0052CC' },
      { id: 'PM', label: 'PM', x: cx + 110, y: cy - 20, type: 'person', color: '#64748B' },
      { id: 'LV', label: 'LV', x: cx - 90, y: cy + 40, type: 'person', dashed: true, color: '#0052CC' },
      { id: 'Company', label: '🏢', x: cx - 60, y: cy - 40, type: 'company', color: '#A33500' },
      { id: 'Event', label: '📅', x: cx - 10, y: cy + 60, type: 'event', color: '#FF8C00' },
    ];

    const edges = [
      { from: nodes[0], to: nodes[1], dashed: false, color: '#E2E8F0' },
      { from: nodes[1], to: nodes[4], dashed: false, color: '#0052CC' },
      { from: nodes[4], to: nodes[2], dashed: true, color: '#CBD5E1' },
      { from: nodes[2], to: nodes[3], dashed: true, color: '#0052CC' },
      { from: nodes[3], to: nodes[0], dashed: false, color: '#E2E8F0' },
    ];

    // Draw edges
    edges.forEach(edge => {
      ctx.beginPath();
      ctx.moveTo(edge.from.x, edge.from.y);
      ctx.lineTo(edge.to.x, edge.to.y);
      ctx.strokeStyle = edge.color;
      ctx.lineWidth = edge.dashed ? 1.5 : 2;
      if (edge.dashed) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      if (n.type === 'event') {
        // Diamond for event
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2.5;
        ctx.roundRect(-16, -16, 32, 32, 6);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Icon inside
        ctx.fillStyle = '#FF8C00';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📅', n.x, n.y);
      } else if (n.type === 'company') {
        // Double ring for company
        ctx.beginPath();
        ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#A33500';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#A33500';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏢', n.x, n.y);
      } else {
        // Person circular node
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2;
        if (n.dashed) {
          ctx.setLineDash([3, 3]);
        }
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = n.color;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y);
      }
    });

  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
            Ecosystem Overview
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time relational network and enterprise analytics.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '600' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span>Last synced: Just now</span>
        </div>
      </div>

      {/* Top 3 Metric Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Metric 1: Persons */}
        <div className="card-enterprise" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={20} color="#FFFFFF" />
            </div>
            <span className="badge badge-success">
              ↗ +12%
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Total Persons (Person)
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-headline)' }}>
              {stats.total_persons.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metric 2: Companies */}
        <div className="card-enterprise" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={20} color="#FFFFFF" />
            </div>
            <span className="badge badge-success">
              ↗ +5%
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Companies (Company)
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-headline)' }}>
              {stats.total_companies.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Metric 3: Events */}
        <div className="card-enterprise" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={20} color="#FFFFFF" />
            </div>
            <span className="badge badge-neutral">
              → 0%
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Events (Event)
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-headline)' }}>
              {stats.total_events.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Graph View (Left) & Recent Ingestion Feeds (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Quick Graph View */}
        <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Quick Graph View
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('graph')}
              className="btn btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
            >
              <Maximize2 size={13} />
              <span>Expand Graph</span>
            </button>
          </div>

          {/* Graph Canvas Container */}
          <div style={{ 
            flex: 1, 
            minHeight: '300px', 
            backgroundColor: '#F8FAFC', 
            borderRadius: '10px', 
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* Canvas Legend */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '11px',
              color: 'var(--text-muted)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                <span>Verified connection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '2px', borderTop: '2px dashed var(--text-light)' }} />
                <span>AI suggested link</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Ingestion Feeds */}
        <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--text-main)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                Recent Ingestion Feeds
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('datasources')}
              className="btn btn-subtle"
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Feed 1: Card OCR */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    📇
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    Card Visit: Nguyen Van A
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                  2m ago
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                BD Director, Tech Solutions VN • Grounded via Google Search
              </p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                <span className="badge badge-primary">1 New Profile</span>
                <span className="badge badge-success">Mapped to Graph</span>
              </div>
            </div>

            {/* Feed 2: Excel Batch */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    📊
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                    TechExpo_2026_Attendees.csv
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                  1h ago
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Batch parsed 50 guest records • Linked to AI Riser Demo Day
              </p>
              {/* Progress bar */}
              <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden', marginTop: '2px' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            {/* Feed 3: Resolution Alert */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid var(--secondary-border)',
              backgroundColor: 'var(--secondary-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--secondary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ⚡
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--secondary)' }}>
                    Entity Match Suggested
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>
                  Pending
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                AI detected 2 matching enterprise profiles for "TechViet Solutions" (92% confidence).
              </p>
              <button
                onClick={() => setActiveTab('resolutions')}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '2px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--secondary)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Review in Resolution Queue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
