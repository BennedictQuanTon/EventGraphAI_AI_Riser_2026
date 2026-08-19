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

export default function GraphView() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedNode, setSelectedNode] = useState(null);

  // Deterministic Fixed Nodes Structure (Spacious, No Overlap, No Vibration)
  const initialNodes = [
    // Center Event Hub
    { id: 'e1', label: 'AI Riser Demo Day 2026', type: 'event', x: 0, y: 0, radius: 36, venue: 'NIC Hanoi', date: 'Aug 20, 2026', attendees: '4,200+' },
    
    // Top Center Company & Lead
    { id: 'c5', label: 'National Innovation Hub', type: 'company', industry: 'Incubation Center', domain: 'innovatehub.org.vn', x: 0, y: -260, radius: 32 },
    { id: 'p6', label: 'Do Thu Trang', role: 'Head of Partnerships', type: 'person', company: 'National Innovation Hub', avatar: 'TT', email: 'trang.do@innovatehub.org.vn', x: 130, y: -300, radius: 24 },

    // Top-Left: NextGen AI & Executives
    { id: 'c1', label: 'NextGen AI Vietnam', type: 'company', industry: 'Artificial Intelligence & Analytics', domain: 'nextgenai.vn', x: -320, y: -150, radius: 34 },
    { id: 'p1', label: 'Nguyen Thanh Son', role: 'Director of BD', type: 'person', company: 'NextGen AI Vietnam', avatar: 'NS', email: 'son.nguyen@nextgenai.vn', x: -470, y: -200, radius: 24 },
    { id: 'p5', label: 'Le Hoang Quan', role: 'Senior AI Lead', type: 'person', company: 'NextGen AI Vietnam', avatar: 'LQ', email: 'quan.le@nextgenai.vn', x: -470, y: -100, radius: 24 },

    // Top-Right: VinFintech & Founder
    { id: 'c2', label: 'VinFintech Payments', type: 'company', industry: 'Financial Technology (FinTech)', domain: 'vinfinpay.com', x: 320, y: -150, radius: 34 },
    { id: 'p2', label: 'Tran Thi Mai Anh', role: 'CEO & Founder', type: 'person', company: 'VinFintech Payments', avatar: 'MA', email: 'maianh.tran@vinfinpay.com', x: 470, y: -150, radius: 24 },

    // Bottom-Left: Dragon VC & Investor
    { id: 'c3', label: 'Dragon Venture Capital', type: 'company', industry: 'Venture Capital & Funds', domain: 'dragonvc.fund', x: -320, y: 160, radius: 34 },
    { id: 'p3', label: 'Pham Minh Duc', role: 'Managing Partner', type: 'person', company: 'Dragon Venture Capital', avatar: 'MD', email: 'duc.pham@dragonvc.fund', x: -470, y: 160, radius: 24 },

    // Bottom-Right: Nexus Ventures & Partner
    { id: 'c4', label: 'Nexus Ventures SG', type: 'company', industry: 'Global Tech Fund', domain: 'nexusventures.sg', x: 320, y: 160, radius: 34 },
    { id: 'p4', label: 'Alex Chen', role: 'General Partner', type: 'person', company: 'Nexus Ventures SG', avatar: 'AC', email: 'alex.chen@nexusventures.sg', x: 470, y: 160, radius: 24 },

    // Bottom-Center: ESG & Cyber Startups
    { id: 'p7', label: 'Vu Dang Khoa', role: 'CTO & Co-Founder', type: 'person', company: 'GreenFuture ESG', avatar: 'VK', email: 'khoa.vu@greenfuture.vn', x: -140, y: 280, radius: 24 },
    { id: 'p8', label: 'Bui Quoc Hung', role: 'VP of Security', type: 'person', company: 'CyberGuard Security', avatar: 'BH', email: 'hung.bui@cyberguard.vn', x: 140, y: 280, radius: 24 }
  ];

  const initialLinks = [
    // Event Hub Central Connections
    { source: 'p1', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#0052CC' },
    { source: 'p2', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#FF8C00' },
    { source: 'p3', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p4', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p6', target: 'e1', label: 'HOST_ORGANIZER', color: '#0052CC' },
    { source: 'p7', target: 'e1', label: 'ATTENDED', color: '#94A3B8', dashed: true },
    { source: 'p8', target: 'e1', label: 'PANELIST', color: '#0052CC' },

    // Affiliations
    { source: 'p1', target: 'c1', label: 'AFFILIATED_WITH', color: '#0052CC' },
    { source: 'p5', target: 'c1', label: 'RESEARCH_LEAD', color: '#0052CC' },
    { source: 'p2', target: 'c2', label: 'FOUNDER_OF', color: '#FF8C00' },
    { source: 'p3', target: 'c3', label: 'MANAGING_PARTNER', color: '#A33500' },
    { source: 'p4', target: 'c4', label: 'GENERAL_PARTNER', color: '#A33500' },
    { source: 'p6', target: 'c5', label: 'OPERATES', color: '#0052CC' },

    // Cross-Company Co-investments
    { source: 'c3', target: 'c1', label: 'INVESTED_IN', color: '#A33500', dashed: true },
    { source: 'c4', target: 'c2', label: 'SYNDICATE_MATCH', color: '#059669', dashed: true }
  ];

  // Camera & Interaction State
  const graphState = useRef({
    nodes: JSON.parse(JSON.stringify(initialNodes)),
    links: initialLinks,
    camera: { x: 0, y: 0, zoom: 0.95 },
    isDragging: false,
    dragNode: null,
    dragStart: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 }
  });

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const { nodes, links, camera } = graphState.current;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Reset & apply camera transform
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Center origin
    ctx.translate(width / 2 + camera.x, height / 2 + camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 1. Subtle Grid Pattern
    ctx.fillStyle = '#E2E8F0';
    const gridSize = 40;
    for (let x = -width * 2; x < width * 2; x += gridSize) {
      for (let y = -height * 2; y < height * 2; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Draw Edges with Directional Lines & Labels
    links.forEach(l => {
      const source = nodeMap.get(l.source);
      const target = nodeMap.get(l.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = l.dashed ? '#CBD5E1' : l.color || '#0052CC';
      ctx.lineWidth = l.dashed ? 1.8 : 2.4;
      if (l.dashed) {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Edge Relationship Pill Label (Spacious & Crisp)
      if (l.label && camera.zoom > 0.6) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.font = '700 10.5px JetBrains Mono, monospace';
        const labelWidth = ctx.measureText(l.label).width;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(midX - labelWidth / 2 - 6, midY - 9, labelWidth + 12, 18, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(l.label, midX, midY);
      }
    });

    // 3. Draw Nodes (Professional Geometric Styling)
    nodes.forEach(n => {
      const isSelected = selectedNode?.id === n.id;

      if (n.type === 'event') {
        // Event Central Hub (Orange Hexagonal Diamond)
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.lineWidth = isSelected ? 4.5 : 3;
        ctx.roundRect(-n.radius, -n.radius, n.radius * 2, n.radius * 2, 10);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#FF8C00';
        ctx.font = '800 13px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUMMIT', n.x, n.y - 6);
        ctx.font = '700 11px JetBrains Mono, monospace';
        ctx.fillStyle = '#0F172A';
        ctx.fillText('HUB 2026', n.x, n.y + 8);

      } else if (n.type === 'company') {
        // Company Node (Double Concentric Sapphire Rings)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#FF8C00' : '#0052CC';
        ctx.lineWidth = isSelected ? 4 : 3;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius - 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 82, 204, 0.08)';
        ctx.strokeStyle = '#0052CC';
        ctx.lineWidth = 1.2;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0052CC';
        ctx.font = '800 12px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ORG', n.x, n.y);

      } else {
        // Person Executive Node (Avatar Ring with Initials)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#EFF6FF' : '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.lineWidth = isSelected ? 3.5 : 2.5;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.font = '800 13px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.avatar || 'EX', n.x, n.y);
      }

      // 4. Clean Distinct Node Label Pill (Generous offset below node, never overlaps)
      const labelY = n.y + n.radius + 16;
      ctx.font = isSelected ? '800 13.5px Plus Jakarta Sans, sans-serif' : '700 13px Plus Jakarta Sans, sans-serif';
      const labelWidth = ctx.measureText(n.label).width;

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = isSelected ? '#0052CC' : '#CBD5E1';
      ctx.lineWidth = isSelected ? 2 : 1.2;
      ctx.beginPath();
      ctx.roundRect(n.x - labelWidth / 2 - 10, labelY - 11, labelWidth + 20, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#0052CC' : '#0F172A';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, labelY);
    });

    ctx.restore();
  }, [selectedNode]);

  // Handle Resize & Canvas Initialization
  const resizeCanvas = useCallback(() => {
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

    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Mouse & Pinch Interaction Handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { camera, nodes } = graphState.current;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Convert screen coordinates to world coordinates
    const wx = (mx - (width / 2 + camera.x)) / camera.zoom;
    const wy = (my - (height / 2 + camera.y)) / camera.zoom;

    const clicked = nodes.find(n => {
      const dx = n.x - wx;
      const dy = n.y - wy;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 12;
    });

    graphState.current.isDragging = true;
    graphState.current.lastMouse = { x: mx, y: my };

    if (clicked) {
      graphState.current.dragNode = clicked;
      setSelectedNode(clicked);
    } else {
      graphState.current.dragNode = null;
      setSelectedNode(null);
    }
    drawGraph();
  };

  const handleMouseMove = (e) => {
    if (!graphState.current.isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { camera, dragNode, lastMouse } = graphState.current;

    const dx = mx - lastMouse.x;
    const dy = my - lastMouse.y;

    if (dragNode) {
      dragNode.x += dx / camera.zoom;
      dragNode.y += dy / camera.zoom;
    } else {
      camera.x += dx;
      camera.y += dy;
    }

    graphState.current.lastMouse = { x: mx, y: my };
    drawGraph();
  };

  const handleMouseUp = () => {
    graphState.current.isDragging = false;
    graphState.current.dragNode = null;
  };

  // Pinch-to-zoom & Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.4, Math.min(2.5, graphState.current.camera.zoom * zoomFactor));
    graphState.current.camera.zoom = newZoom;
    drawGraph();
  };

  const handleZoomBtn = (factor) => {
    graphState.current.camera.zoom = Math.max(0.4, Math.min(2.5, graphState.current.camera.zoom * factor));
    drawGraph();
  };

  const handleResetCamera = () => {
    graphState.current.camera = { x: 0, y: 0, zoom: 0.95 };
    graphState.current.nodes = JSON.parse(JSON.stringify(initialNodes));
    setSelectedNode(null);
    drawGraph();
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: 'calc(100vh - 130px)', 
        minHeight: '680px', 
        backgroundColor: '#FFFFFF', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)', 
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Interactive Fixed Force Canvas */}
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />

      {/* Floating Filter Dataset Panel Top Left */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        width: '300px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--primary)" />
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            Filter Graph Dataset
          </h4>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Industry Sector:
          </label>
          <select 
            value={selectedIndustry} 
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="input-enterprise" 
            style={{ fontSize: '13.5px', padding: '8px 12px' }}
          >
            <option value="all">All Industries (3,105)</option>
            <option value="ai">Artificial Intelligence & DeepTech</option>
            <option value="fintech">Financial Technology (FinTech)</option>
            <option value="vc">Venture Capital & Funds</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Summit / Event Participation:
          </label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="input-enterprise" 
            style={{ fontSize: '13.5px', padding: '8px 12px' }}
          >
            <option value="all">All Summits (142)</option>
            <option value="ai_riser">AI Riser Vietnam Demo Day 2026</option>
            <option value="tech_night">Tech Networking Night Q2/2026</option>
          </select>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '10px', fontSize: '14px', marginTop: '4px' }}
        >
          Apply Active Filter
        </button>
      </div>

      {/* Floating Zoom & Pan Controls Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        display: 'flex',
        gap: '8px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10
      }}>
        <button 
          onClick={() => handleZoomBtn(1.2)} 
          className="btn btn-outline" 
          title="Zoom In (or Pinch/Scroll)"
          style={{ padding: '8px 12px', fontSize: '13px' }}
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={() => handleZoomBtn(0.8)} 
          className="btn btn-outline" 
          title="Zoom Out (or Pinch/Scroll)"
          style={{ padding: '8px 12px', fontSize: '13px' }}
        >
          <ZoomOut size={16} />
        </button>
        <button 
          onClick={handleResetCamera} 
          className="btn btn-outline" 
          title="Reset Camera & Layout"
          style={{ padding: '8px 12px', fontSize: '13px' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Floating Legend Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: selectedNode ? '360px' : '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '12px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '13px',
        boxShadow: 'var(--shadow-md)',
        transition: 'right 0.2s ease',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '2.5px solid #FF8C00' }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Person Executive Node</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '2.5px solid #0052CC' }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Company Entity Node</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '12px', height: '12px', transform: 'rotate(45deg)', backgroundColor: '#FFFFFF', border: '2.5px solid #FF8C00' }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Event / Summit Hub</span>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          width: '330px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className={selectedNode.type === 'company' ? 'badge badge-primary' : 'badge badge-secondary'} style={{ fontSize: '12.5px' }}>
              {selectedNode.type.toUpperCase()}
            </span>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
              {selectedNode.label}
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
              {selectedNode.role || selectedNode.industry}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
            {selectedNode.email && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email: </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{selectedNode.email}</span>
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
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '700' }}>{selectedNode.domain}</span>
              </div>
            )}
            {selectedNode.venue && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Venue: </span>
                <span>{selectedNode.venue}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--success)', fontWeight: '800', marginTop: '6px' }}>
            <ShieldCheck size={16} />
            <span>Verified Canonical Knowledge Node</span>
          </div>
        </div>
      )}
    </div>
  );
}
