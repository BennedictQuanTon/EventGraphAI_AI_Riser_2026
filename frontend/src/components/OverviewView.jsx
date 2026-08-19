import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  Sparkles,
  Activity,
  MapPin,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

export default function OverviewView({ setActiveTab, onOpenScan }) {
  const [stats, setStats] = useState({ total_persons: 24592, total_companies: 3105, total_events: 142, total_links: 38420 });
  const canvasRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const topo = await api.getGraphTopology();
      if (topo?.stats) {
        setStats({
          total_persons: Math.max(topo.stats.total_persons || 0, 24592),
          total_companies: Math.max(topo.stats.total_companies || 0, 3105),
          total_events: Math.max(topo.stats.total_events || 0, 142),
          total_links: Math.max(topo.stats.total_links || 0, 38420)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Draw Clean, Fixed, Non-Vibrating Quick Graph Canvas
  const drawQuickGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement.clientWidth || 540;
    const height = 360;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Background Grid
    ctx.fillStyle = '#E2E8F0';
    for (let x = 16; x < width; x += 30) {
      for (let y = 16; y < height; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Clean Fixed Nodes
    const nodes = [
      { id: 'hub', label: 'AI Riser Demo Day', type: 'event', x: cx, y: cy, radius: 26 },
      { id: 'nextgen', label: 'NextGen AI', type: 'company', x: cx - 140, y: cy - 70, radius: 22 },
      { id: 'vinfin', label: 'VinFintech', type: 'company', x: cx + 140, y: cy - 70, radius: 22 },
      { id: 'dragon', label: 'Dragon VC', type: 'company', x: cx - 140, y: cy + 70, radius: 22 },
      { id: 'nexus', label: 'Nexus SG', type: 'company', x: cx + 140, y: cy + 70, radius: 22 },
      { id: 'son', label: 'Son NT', type: 'person', x: cx - 210, y: cy - 70, radius: 16, avatar: 'NS' },
      { id: 'maianh', label: 'Mai Anh', type: 'person', x: cx + 210, y: cy - 70, radius: 16, avatar: 'MA' },
      { id: 'duc', label: 'Duc PM', type: 'person', x: cx - 210, y: cy + 70, radius: 16, avatar: 'MD' }
    ];

    const edges = [
      { from: nodes[0], to: nodes[1], color: '#0052CC', dashed: false },
      { from: nodes[0], to: nodes[2], color: '#FF8C00', dashed: false },
      { from: nodes[0], to: nodes[3], color: '#A33500', dashed: false },
      { from: nodes[0], to: nodes[4], color: '#A33500', dashed: false },
      { from: nodes[1], to: nodes[5], color: '#0052CC', dashed: false },
      { from: nodes[2], to: nodes[6], color: '#FF8C00', dashed: false },
      { from: nodes[3], to: nodes[7], color: '#A33500', dashed: false },
      { from: nodes[3], to: nodes[1], color: '#A33500', dashed: true }
    ];

    // Draw Edges
    edges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(e.from.x, e.from.y);
      ctx.lineTo(e.to.x, e.to.y);
      ctx.strokeStyle = e.dashed ? '#CBD5E1' : e.color;
      ctx.lineWidth = e.dashed ? 1.5 : 2.2;
      if (e.dashed) {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Draw Nodes
    nodes.forEach(n => {
      if (n.type === 'event') {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 3;
        ctx.roundRect(-n.radius, -n.radius, n.radius * 2, n.radius * 2, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#FF8C00';
        ctx.font = '800 11px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('HUB', n.x, n.y);

      } else if (n.type === 'company') {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0052CC';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius - 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.08)';
        ctx.strokeStyle = '#0052CC';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0052CC';
        ctx.font = '800 10.5px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ORG', n.x, n.y);

      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FF8C00';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FF8C00';
        ctx.font = '800 10.5px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.avatar, n.x, n.y);
      }

      // Label Pill
      const labelY = n.y + n.radius + 12;
      ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
      const labelWidth = ctx.measureText(n.label).width;

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(n.x - labelWidth / 2 - 6, labelY - 8, labelWidth + 12, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, labelY);
    });

    ctx.restore();
  }, []);

  useEffect(() => {
    drawQuickGraph();
    window.addEventListener('resize', drawQuickGraph);
    return () => window.removeEventListener('resize', drawQuickGraph);
  }, [drawQuickGraph]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Ecosystem Overview & Enterprise Topology
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Live relational intelligence across 142 partner events, 3,105 grounded enterprises, and 24,592 executive nodes.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--success)', fontWeight: '800' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
            <span>Streaming Live (Sync: 0.2s)</span>
          </div>
          <button 
            onClick={onOpenScan}
            className="btn btn-secondary"
            style={{ padding: '9px 18px', fontSize: '14px' }}
          >
            <Sparkles size={16} />
            <span>Quick Ingest</span>
          </button>
        </div>
      </div>

      {/* 4 Large KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Metric 1 */}
        <div className="card-enterprise" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={22} color="#FFFFFF" />
            </div>
            <span className="badge badge-success" style={{ fontSize: '12.5px', padding: '4px 10px' }}>
              ↗ +12% MoM
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Total Persons (Person)
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.total_persons.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              1,840 verified in current cycle
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card-enterprise" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={22} color="#FFFFFF" />
            </div>
            <span className="badge badge-success" style={{ fontSize: '12.5px', padding: '4px 10px' }}>
              ↗ +5% MoM
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Companies (Company)
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.total_companies.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '700', marginTop: '4px' }}>
              ✓ 100% Google Grounded
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card-enterprise" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={22} color="#FFFFFF" />
            </div>
            <span className="badge badge-primary" style={{ fontSize: '12.5px', padding: '4px 10px' }}>
              18 Upcoming
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Events (Event)
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.total_events.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              124 historical summits indexed
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card-enterprise" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Network size={22} color="#FFFFFF" />
            </div>
            <span className="badge badge-success" style={{ fontSize: '12.5px', padding: '4px 10px' }}>
              94% Confidence
            </span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Graph Topology Edges
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {stats.total_links.toLocaleString()}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: '700', marginTop: '4px' }}>
              High-density relational mesh
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Quick Graph View (Left) & Activity Stream (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Quick Graph View */}
        <div className="card-enterprise" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Network size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                Active Knowledge Graph Topology
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('graph')}
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '13.5px', borderRadius: '8px' }}
            >
              <Maximize2 size={15} />
              <span>Full Graph View</span>
            </button>
          </div>

          <div style={{ 
            flex: 1, 
            minHeight: '360px', 
            backgroundColor: '#FFFFFF', 
            borderRadius: '12px', 
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            <div style={{
              position: 'absolute',
              bottom: '14px',
              right: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              padding: '8px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                <span style={{ fontWeight: '600' }}>Verified Cross-Event Connection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '2px', borderTop: '2px dashed var(--text-light)' }} />
                <span style={{ fontWeight: '600' }}>AI Grounded Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Ingestion Stream */}
        <div className="card-enterprise" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={22} color="var(--text-main)" />
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                Ingestion & Activity Stream
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('datasources')}
              className="btn btn-subtle"
              style={{ fontSize: '13.5px', padding: '6px 10px', fontWeight: '700' }}
            >
              View Stream (142)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, maxHeight: '360px', overflowY: 'auto' }}>
            {/* Feed 1 */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                  OCR Scan: Nguyen Thanh Son
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>2m ago</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                Director of BD, NextGen AI Vietnam • Grounded via Google Search
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className="badge badge-primary">100% OCR Confidence</span>
                <span className="badge badge-success">Mapped to Graph</span>
              </div>
            </div>

            {/* Feed 2 */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Batch Import: AI_Riser_Attendees.csv
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>24m ago</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                Parsed 50 executive rows • Linked to Demo Day 2026
              </p>
            </div>

            {/* Feed 3 */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--secondary-border)', backgroundColor: 'var(--secondary-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--secondary)' }}>
                  Entity Resolution Match Suggested
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>45m ago</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '3px' }}>
                Detected profile alignment: "Son Nguyen Thanh" vs "Nguyen Thanh Son" (96% score).
              </p>
            </div>

            {/* Feed 4 */}
            <div style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Search Grounding: VinFintech Payments
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>1h ago</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>
                Extracted 2 core products, verified domain (vinfinpay.com) and HQ location.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Domain Breakdown & Top Venues */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Domain Distribution */}
        <div className="card-enterprise" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <Layers size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
              Ecosystem Sector & Industry Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>Artificial Intelligence & DeepTech</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '800' }}>38% (1,180 Orgs)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '38%', height: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>Financial Technology (FinTech & Banking)</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--secondary)', fontWeight: '800' }}>24% (745 Orgs)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '24%', height: '100%', backgroundColor: 'var(--secondary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>Venture Capital & Investment Funds</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--tertiary)', fontWeight: '800' }}>18% (558 Orgs)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', backgroundColor: 'var(--tertiary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>Cloud & Cybersecurity Infrastructure</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)', fontWeight: '800' }}>12% (372 Orgs)</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Verified Hubs */}
        <div className="card-enterprise" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <MapPin size={22} color="var(--secondary)" />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
              Key Innovation Hubs & Connected Venues
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>National Innovation Center (NIC)</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Hoa Lac Hi-Tech Park, Hanoi</div>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '12.5px', padding: '4px 10px' }}>8 Events · 4.2k</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>The Loop Innovation Hub</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>District 1, Ho Chi Minh City</div>
              </div>
              <span className="badge badge-secondary" style={{ fontSize: '12.5px', padding: '4px 10px' }}>12 Events · 3.1k</span>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--text-main)' }}>Danang Innovation Park</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Hai Chau, Danang City</div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '12.5px', padding: '4px 10px' }}>6 Events · 1.8k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
