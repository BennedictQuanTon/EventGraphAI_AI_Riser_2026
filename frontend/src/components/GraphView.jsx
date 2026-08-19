import React, { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../api';
import { 
  Filter, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Building2, 
  User, 
  Calendar, 
  Sparkles, 
  X,
  Layers,
  ExternalLink,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export default function GraphView({ onSelectEntity }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [data, setData] = useState({ nodes: [], links: [], stats: {} });
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  // Simulation physics & camera state
  const simRef = useRef({
    nodes: [],
    links: [],
    transform: { x: 0, y: 0, k: 1 },
    isDragging: false,
    dragNode: null,
    lastMouse: { x: 0, y: 0 },
    animId: null
  });

  // Comprehensive 14 Realistic Enterprise Nodes
  const initialNodes = [
    { id: 'p1', label: 'Nguyen Thanh Son', role: 'Director of BD', type: 'person', company: 'NextGen AI Vietnam', avatar: 'NS', email: 'son.nguyen@nextgenai.vn' },
    { id: 'p2', label: 'Tran Thi Mai Anh', role: 'CEO & Founder', type: 'person', company: 'VinFintech Payments', avatar: 'MA', email: 'maianh.tran@vinfinpay.com' },
    { id: 'p3', label: 'Pham Minh Duc', role: 'Managing Partner', type: 'person', company: 'Dragon Venture Capital', avatar: 'MD', email: 'duc.pham@dragonvc.fund' },
    { id: 'p4', label: 'Alex Chen', role: 'General Partner', type: 'person', company: 'Nexus Ventures SG', avatar: 'AC', email: 'alex.chen@nexusventures.sg' },
    { id: 'p5', label: 'Le Hoang Quan', role: 'Senior AI Lead', type: 'person', company: 'NextGen AI Vietnam', avatar: 'LQ', email: 'quan.le@nextgenai.vn' },
    { id: 'p6', label: 'Do Thu Trang', role: 'Head of Partnerships', type: 'person', company: 'National Innovation Hub', avatar: 'TT', email: 'trang.do@innovatehub.org.vn' },
    { id: 'p7', label: 'Vu Dang Khoa', role: 'CTO & Co-founder', type: 'person', company: 'GreenFuture ESG', avatar: 'VK', email: 'khoa.vu@greenfuture.vn' },
    { id: 'p8', label: 'Bui Quoc Hung', role: 'VP of Security', type: 'person', company: 'CyberGuard Security', avatar: 'BH', email: 'hung.bui@cyberguard.vn' },
    
    { id: 'c1', label: 'NextGen AI Vietnam', industry: 'Artificial Intelligence & Analytics', type: 'company', domain: 'nextgenai.vn', scale: '50-100 staff' },
    { id: 'c2', label: 'VinFintech Payments', industry: 'Financial Technology (FinTech)', type: 'company', domain: 'vinfinpay.com', scale: '100-250 staff' },
    { id: 'c3', label: 'Dragon Venture Capital', industry: 'Venture Capital & Funds', type: 'company', domain: 'dragonvc.fund', scale: '15-30 partners' },
    { id: 'c4', label: 'Nexus Ventures Singapore', industry: 'Global Tech Fund', type: 'company', domain: 'nexusventures.sg', scale: '20-40 partners' },
    { id: 'c5', label: 'National Innovation Hub', industry: 'Incubation Center', type: 'company', domain: 'innovatehub.org.vn', scale: '40-70 staff' },

    { id: 'e1', label: 'AI Riser Demo Day 2026', type: 'event', location: 'NIC Hanoi', date: 'Aug 20, 2026' },
    { id: 'e2', label: 'Tech Networking Night Q2', type: 'event', location: 'The Loop HCMC', date: 'Jun 15, 2026' },
    { id: 'e3', label: 'SEA Startup Summit 2025', type: 'event', location: 'Danang Innovation Park', date: 'Nov 10, 2025' }
  ];

  const initialLinks = [
    { source: 'p1', target: 'c1', label: 'AFFILIATED_WITH', color: '#0052CC' },
    { source: 'p5', target: 'c1', label: 'LEADS_RESEARCH', color: '#0052CC' },
    { source: 'p2', target: 'c2', label: 'FOUNDER_OF', color: '#FF8C00' },
    { source: 'p3', target: 'c3', label: 'PARTNER_AT', color: '#A33500' },
    { source: 'p4', target: 'c4', label: 'INVESTOR_AT', color: '#A33500' },
    { source: 'p6', target: 'c5', label: 'OPERATES', color: '#0052CC' },
    { source: 'p7', target: 'e1', label: 'ATTENDED', color: '#CBD5E1', dashed: true },
    { source: 'p8', target: 'e2', label: 'PANELIST', color: '#0052CC' },

    { source: 'p1', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#0052CC' },
    { source: 'p2', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#FF8C00' },
    { source: 'p3', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p4', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p6', target: 'e1', label: 'HOST_ORGANIZER', color: '#0052CC' },

    { source: 'p1', target: 'e2', label: 'ATTENDED', color: '#0052CC' },
    { source: 'p2', target: 'e2', label: 'SPEAKER', color: '#FF8C00' },
    { source: 'p3', target: 'e3', label: 'SPEAKER', color: '#A33500' },
    { source: 'p4', target: 'e3', label: 'INVESTOR', color: '#A33500' },
    { source: 'p6', target: 'e3', label: 'ORGANIZER', color: '#0052CC' },

    { source: 'c3', target: 'c1', label: 'INVESTED_IN', color: '#A33500', dashed: true },
    { source: 'c4', target: 'c2', label: 'SYNDICATE_MATCH', color: '#A33500', dashed: true }
  ];

  // Initialize simulation positions
  const initGraph = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 650;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cx = width / 2;
    const cy = height / 2;

    const nodes = initialNodes.map((n, i) => {
      const angle = (i / initialNodes.length) * Math.PI * 2;
      const radiusDist = n.type === 'event' ? 60 : n.type === 'company' ? 180 : 280;
      return {
        ...n,
        x: cx + Math.cos(angle) * radiusDist + (Math.random() - 0.5) * 40,
        y: cy + Math.sin(angle) * radiusDist + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: n.type === 'company' ? 26 : n.type === 'event' ? 24 : 20
      };
    });

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const links = initialLinks.map(l => ({
      ...l,
      sourceNode: nodeMap.get(l.source),
      targetNode: nodeMap.get(l.target)
    })).filter(l => l.sourceNode && l.targetNode);

    simRef.current.nodes = nodes;
    simRef.current.links = links;
    simRef.current.transform = { x: 0, y: 0, k: 1 };
  }, []);

  useEffect(() => {
    initGraph();
    const handleResize = () => initGraph();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initGraph]);

  // Main Render Animation Loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const { nodes, links, transform, dragNode } = simRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // 1. Force physics
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = n1.radius + n2.radius + 110;
          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.08;
            if (n1 !== dragNode) { n1.vx -= dx * force; n1.vy -= dy * force; }
            if (n2 !== dragNode) { n2.vx += dx * force; n2.vy += dy * force; }
          }
        }
      }

      links.forEach(l => {
        const dx = l.targetNode.x - l.sourceNode.x;
        const dy = l.targetNode.y - l.sourceNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 160;
        const force = (dist - targetDist) * 0.015;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (l.sourceNode !== dragNode) { l.sourceNode.vx += fx; l.sourceNode.vy += fy; }
        if (l.targetNode !== dragNode) { l.targetNode.vx -= fx; l.targetNode.vy -= fy; }
      });

      // Center gravity & damping
      const cx = width / 2;
      const cy = height / 2;
      nodes.forEach(n => {
        if (n !== dragNode) {
          n.vx += (cx - n.x) * 0.001;
          n.vy += (cy - n.y) * 0.001;
          n.vx *= 0.88;
          n.vy *= 0.88;
          n.x += n.vx;
          n.y += n.vy;
        }
      });

      // Clear & Set Transform
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Subtle Grid Dots
      ctx.fillStyle = '#CBD5E1';
      for (let x = -width * 2; x < width * 3; x += 32) {
        for (let y = -height * 2; y < height * 3; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Links
      links.forEach(l => {
        ctx.beginPath();
        ctx.moveTo(l.sourceNode.x, l.sourceNode.y);
        ctx.lineTo(l.targetNode.x, l.targetNode.y);
        ctx.strokeStyle = l.dashed ? '#CBD5E1' : l.color || '#0052CC';
        ctx.lineWidth = l.dashed ? 1.5 : 2;
        if (l.dashed) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();

        // Edge relationship label
        if (l.label && transform.k > 0.75) {
          const midX = (l.sourceNode.x + l.targetNode.x) / 2;
          const midY = (l.sourceNode.y + l.targetNode.y) / 2;
          ctx.font = '600 9.5px JetBrains Mono, monospace';
          const textWidth = ctx.measureText(l.label).width;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(midX - textWidth / 2 - 3, midY - 6, textWidth + 6, 12);
          
          ctx.fillStyle = '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(l.label, midX, midY);
        }
      });
      ctx.setLineDash([]);

      // Draw Nodes
      nodes.forEach(n => {
        const isSelected = selectedNode?.id === n.id;

        if (n.type === 'company') {
          // Company Node (Double Ring Blue)
          ctx.beginPath();
          ctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#0052CC';
          ctx.lineWidth = isSelected ? 4 : 2.5;
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 82, 204, 0.08)';
          ctx.strokeStyle = '#0052CC';
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0052CC';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🏢', n.x, n.y);

        } else if (n.type === 'event') {
          // Event Node (Yellow Diamond Badge)
          ctx.save();
          ctx.translate(n.x, n.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#FF8C00';
          ctx.lineWidth = isSelected ? 4 : 2.5;
          ctx.roundRect(-22, -22, 44, 44, 8);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = '#FF8C00';
          ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('📅 HUB', n.x, n.y);

        } else {
          // Person Node (Orange Circle with Initial)
          ctx.beginPath();
          ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = isSelected ? '#0052CC' : '#FF8C00';
          ctx.lineWidth = isSelected ? 4 : 2.5;
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isSelected ? '#0052CC' : '#FF8C00';
          ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(n.avatar || '👤', n.x, n.y);
        }

        // Clean Label Pill Below Node (Never Overlaps)
        const labelY = n.y + n.radius + 14;
        ctx.font = isSelected ? '700 13px Plus Jakarta Sans, sans-serif' : '600 12px Plus Jakarta Sans, sans-serif';
        const labelWidth = ctx.measureText(n.label).width;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = isSelected ? '#0052CC' : '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(n.x - labelWidth / 2 - 8, labelY - 9, labelWidth + 16, 18, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#0052CC' : '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, labelY);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedNode]);

  // Mouse Handlers for Dragging / Panning
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { transform, nodes } = simRef.current;

    const wx = (mx - transform.x) / transform.k;
    const wy = (my - transform.y) / transform.k;

    const clicked = nodes.find(n => {
      const dx = n.x - wx;
      const dy = n.y - wy;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
    });

    if (clicked) {
      simRef.current.isDragging = true;
      simRef.current.dragNode = clicked;
      setSelectedNode(clicked);
    } else {
      simRef.current.isDragging = true;
      simRef.current.dragNode = null;
      simRef.current.lastMouse = { x: mx, y: my };
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!simRef.current.isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { transform, dragNode, lastMouse } = simRef.current;

    if (dragNode) {
      dragNode.x = (mx - transform.x) / transform.k;
      dragNode.y = (my - transform.y) / transform.k;
    } else {
      transform.x += mx - lastMouse.x;
      transform.y += my - lastMouse.y;
      simRef.current.lastMouse = { x: mx, y: my };
    }
  };

  const handleMouseUp = () => {
    simRef.current.isDragging = false;
    simRef.current.dragNode = null;
  };

  const handleZoom = (delta) => {
    const { transform } = simRef.current;
    transform.k = Math.max(0.4, Math.min(2.5, transform.k + delta));
  };

  const handleReset = () => {
    simRef.current.transform = { x: 0, y: 0, k: 1 };
    initGraph();
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 120px)', 
        minHeight: '650px', 
        backgroundColor: '#FFFFFF', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Live Force-Directed Canvas */}
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />

      {/* Floating Filter Dataset Panel */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '280px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '18px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={17} color="var(--primary)" />
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            Filter Graph Dataset
          </h4>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Industry Sector:
          </label>
          <select 
            value={selectedIndustry} 
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="input-enterprise" 
            style={{ fontSize: '13px', padding: '7px 10px' }}
          >
            <option value="all">All Industries (3,105)</option>
            <option value="ai">Artificial Intelligence & DeepTech</option>
            <option value="fintech">Financial Technology (FinTech)</option>
            <option value="vc">Venture Capital & Funds</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Summit / Event Participation:
          </label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input-enterprise" 
            style={{ fontSize: '13px', padding: '7px 10px' }}
          >
            <option value="all">All Summits (142)</option>
            <option value="ai_riser">AI Riser Vietnam Demo Day 2026</option>
            <option value="tech_night">Tech Networking Night Q2/2026</option>
            <option value="danang">SEA Startup Summit 2025</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            Date Filter Range:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input type="text" defaultValue="01/01/2025" className="input-enterprise" style={{ fontSize: '12px', padding: '6px', textAlign: 'center' }} />
            <input type="text" defaultValue="20/08/2026" className="input-enterprise" style={{ fontSize: '12px', padding: '6px', textAlign: 'center' }} />
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '8px', fontSize: '13px', marginTop: '4px' }}
        >
          Apply Active Filter
        </button>
      </div>

      {/* Floating Zoom Controls Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '6px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '6px',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10
      }}>
        <button onClick={() => handleZoom(0.2)} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '12px' }}>
          <ZoomIn size={15} />
        </button>
        <button onClick={() => handleZoom(-0.2)} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '12px' }}>
          <ZoomOut size={15} />
        </button>
        <button onClick={handleReset} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '12px' }}>
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Floating Legend Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: selectedNode ? '340px' : '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        boxShadow: 'var(--shadow-md)',
        transition: 'right 0.2s ease',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '2px solid #FF8C00' }} />
          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Person Executive Node</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '2px solid #0052CC' }} />
          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Company Entity Node</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', transform: 'rotate(45deg)', backgroundColor: '#FFFFFF', border: '2px solid #FF8C00' }} />
          <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Event / Summit Hub</span>
        </div>
      </div>

      {/* Selected Node Details Drawer Right */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '310px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={selectedNode.type === 'company' ? 'badge badge-primary' : 'badge badge-secondary'}>
              {selectedNode.type.toUpperCase()}
            </span>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={17} color="var(--text-muted)" />
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              {selectedNode.label}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>
              {selectedNode.role || selectedNode.industry}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            {selectedNode.email && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{selectedNode.email}</span>
              </div>
            )}
            {selectedNode.company && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Affiliation: </span>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{selectedNode.company}</span>
              </div>
            )}
            {selectedNode.domain && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Corporate Domain: </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{selectedNode.domain}</span>
              </div>
            )}
            {selectedNode.location && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Venue: </span>
                <span>{selectedNode.location}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '700', marginTop: '6px' }}>
            <ShieldCheck size={16} />
            <span>Verified Canonical Knowledge Node</span>
          </div>
        </div>
      )}
    </div>
  );
}
