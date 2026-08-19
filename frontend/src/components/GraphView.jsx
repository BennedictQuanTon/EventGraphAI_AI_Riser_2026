import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { Network, Search, Filter, ZoomIn, ZoomOut, RotateCcw, Building2, Calendar, User, X, ExternalLink } from 'lucide-react';

export default function GraphView({ onSelectEntity }) {
  const canvasRef = useRef(null);
  const [data, setData] = useState({ nodes: [], links: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  // Simulation state
  const simulationRef = useRef({
    nodes: [],
    links: [],
    transform: { x: 0, y: 0, k: 1 },
    isDragging: false,
    dragNode: null,
    lastMouse: { x: 0, y: 0 }
  });

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const res = await api.getGraphTopology();
      setData(res);
      initSimulation(res.nodes, res.links);
    } catch (e) {
      console.error("Error loading graph:", e);
    } finally {
      setLoading(false);
    }
  };

  const initSimulation = (rawNodes, rawLinks) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    // Initialize positions randomly around center
    const nodes = rawNodes.map((n, i) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * (width * 0.7),
      y: height / 2 + (Math.random() - 0.5) * (height * 0.7),
      vx: 0,
      vy: 0,
      radius: n.type === 'event' ? 24 : n.type === 'company' ? 18 : 12
    }));

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const links = rawLinks
      .map(l => ({
        ...l,
        sourceNode: nodeMap.get(l.source),
        targetNode: nodeMap.get(l.target)
      }))
      .filter(l => l.sourceNode && l.targetNode);

    simulationRef.current.nodes = nodes;
    simulationRef.current.links = links;
    simulationRef.current.transform = { x: 0, y: 0, k: 1 };
  };

  // Physics animation loop
  useEffect(() => {
    let animId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
      const { nodes, links, isDragging, dragNode } = simulationRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          
          const minDist = n1.radius + n2.radius + 50;
          const force = (minDist * minDist) / (distSq * 1.5);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (n1 !== dragNode) {
            n1.vx -= fx * 0.3;
            n1.vy -= fy * 0.3;
          }
          if (n2 !== dragNode) {
            n2.vx += fx * 0.3;
            n2.vy += fy * 0.3;
          }
        }
      }

      // 2. Spring attraction along links
      for (const l of links) {
        const s = l.sourceNode;
        const t = l.targetNode;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const desiredDist = l.type === 'participation' ? 120 : 90;
        const force = (dist - desiredDist) * 0.04;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (s !== dragNode) {
          s.vx += fx;
          s.vy += fy;
        }
        if (t !== dragNode) {
          t.vx -= fx;
          t.vy -= fy;
        }
      }

      // 3. Center gravity & damping
      const cx = width / 2;
      const cy = height / 2;
      for (const n of nodes) {
        if (n === dragNode) continue;
        n.vx += (cx - n.x) * 0.008;
        n.vy += (cy - n.y) * 0.008;

        n.vx *= 0.85;
        n.vy *= 0.85;

        n.x += n.vx;
        n.y += n.vy;
      }
    };

    const draw = () => {
      updatePhysics();
      const { nodes, links, transform } = simulationRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Apply pan & zoom
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw Links
      for (const l of links) {
        const s = l.sourceNode;
        const t = l.targetNode;
        const isFaded = (filterType !== 'all' && (s.type !== filterType && t.type !== filterType));

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = isFaded 
          ? 'rgba(255, 255, 255, 0.04)' 
          : l.type === 'participation' 
            ? 'rgba(245, 158, 11, 0.4)' 
            : 'rgba(59, 130, 246, 0.35)';
        ctx.lineWidth = l.type === 'participation' ? 1.5 : 1.2;
        ctx.stroke();
      }

      // Draw Nodes
      for (const n of nodes) {
        const isMatchFilter = filterType === 'all' || n.type === filterType;
        const isMatchSearch = !searchTerm || n.label.toLowerCase().includes(searchTerm.toLowerCase()) || (n.subtitle && n.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
        const isSelected = selectedNode && selectedNode.id === n.id;
        const isFaded = !isMatchFilter || !isMatchSearch;

        ctx.save();
        ctx.globalAlpha = isFaded ? 0.2 : 1;

        // Glow ring for Events or Selected
        if ((n.type === 'event' || isSelected) && !isFaded) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = n.type === 'event' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.3)';
          ctx.fill();
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = isSelected ? 20 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();

        // Node Label
        if (!isFaded || isSelected) {
          ctx.font = `${n.type === 'event' ? 'bold 12px' : n.type === 'company' ? '600 11px' : '500 10px'} Outfit, sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.x, n.y + n.radius + 14);

          if (n.type === 'event' || n.type === 'company') {
            ctx.font = '9px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(n.type === 'event' ? 'SỰ KIỆN' : 'DOANH NGHIỆP', n.x, n.y + n.radius + 25);
          }
        }

        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [filterType, searchTerm, selectedNode]);

  // Mouse & Touch interaction
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { nodes, transform } = simulationRef.current;

    // Convert screen coordinates to world coordinates
    const wx = (mx - transform.x) / transform.k;
    const wy = (my - transform.y) / transform.k;

    // Check hit node
    let clicked = null;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = wx - n.x;
      const dy = wy - n.y;
      if (dx * dx + dy * dy <= n.radius * n.radius * 1.5) {
        clicked = n;
        break;
      }
    }

    if (clicked) {
      simulationRef.current.isDragging = true;
      simulationRef.current.dragNode = clicked;
      setSelectedNode(clicked);
    } else {
      simulationRef.current.isDragging = true;
      simulationRef.current.dragNode = null;
    }
    simulationRef.current.lastMouse = { x: mx, y: my };
  };

  const handleMouseMove = (e) => {
    if (!simulationRef.current.isDragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - simulationRef.current.lastMouse.x;
    const dy = my - simulationRef.current.lastMouse.y;
    const { dragNode, transform } = simulationRef.current;

    if (dragNode) {
      dragNode.x += dx / transform.k;
      dragNode.y += dy / transform.k;
      dragNode.vx = 0;
      dragNode.vy = 0;
    } else {
      // Pan canvas
      transform.x += dx;
      transform.y += dy;
    }

    simulationRef.current.lastMouse = { x: mx, y: my };
  };

  const handleMouseUp = () => {
    simulationRef.current.isDragging = false;
    simulationRef.current.dragNode = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const { transform } = simulationRef.current;
    transform.k = Math.max(0.4, Math.min(3.0, transform.k * zoomFactor));
  };

  const handleZoom = (factor) => {
    const { transform } = simulationRef.current;
    transform.k = Math.max(0.4, Math.min(3.0, transform.k * factor));
  };

  const resetView = () => {
    simulationRef.current.transform = { x: 0, y: 0, k: 1 };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Controls Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm nút trong graph..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['all', 'person', 'company', 'event'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: filterType === type ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid var(--border-subtle)',
                  background: filterType === type ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: filterType === type ? '#60A5FA' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: filterType === type ? '600' : '400'
                }}
              >
                {type === 'all' ? 'Tất cả' : type === 'person' ? '👤 Người' : type === 'company' ? '🏢 Công ty' : '📅 Sự kiện'}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => handleZoom(1.2)} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#fff' }} title="Phóng to">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => handleZoom(0.8)} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#fff' }} title="Thu nhỏ">
            <ZoomOut size={16} />
          </button>
          <button onClick={resetView} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: '#fff' }} title="Căn giữa">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Container & Side Drawer */}
      <div style={{ position: 'relative', width: '100%', height: '620px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#070b14' }}>
        <canvas
          ref={canvasRef}
          width={1100}
          height={620}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
        />

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '14px',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <span>Sự kiện ({data.stats?.total_events || 0})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3B82F6' }} />
            <span>Công ty ({data.stats?.total_companies || 0})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            <span>Nhân sự ({data.stats?.total_persons || 0})</span>
          </div>
        </div>

        {/* Node Detail Drawer */}
        {selectedNode && (
          <div className="glass-panel" style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '320px',
            maxHeight: '580px',
            overflowY: 'auto',
            padding: '20px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                background: selectedNode.type === 'event' ? 'rgba(245, 158, 11, 0.2)' : selectedNode.type === 'company' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: selectedNode.type === 'event' ? '#FBBF24' : selectedNode.type === 'company' ? '#60A5FA' : '#34D399'
              }}>
                {selectedNode.type === 'event' ? 'Sự Kiện' : selectedNode.type === 'company' ? 'Doanh Nghiệp' : 'Hồ Sơ Nhân Sự'}
              </span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              {selectedNode.label}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {selectedNode.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {selectedNode.details?.email && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Email:</span>
                  <div style={{ color: '#E2E8F0', fontWeight: '500' }}>{selectedNode.details.email}</div>
                </div>
              )}
              {selectedNode.details?.phone && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Số điện thoại:</span>
                  <div style={{ color: '#E2E8F0', fontWeight: '500' }}>{selectedNode.details.phone}</div>
                </div>
              )}
              {selectedNode.details?.industry && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Lĩnh vực:</span>
                  <div style={{ color: '#E2E8F0', fontWeight: '500' }}>{selectedNode.details.industry}</div>
                </div>
              )}
              {selectedNode.details?.description && (
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Mô tả:</span>
                  <div style={{ color: '#94A3B8', fontSize: '12px', marginTop: '2px', lineHeight: '1.4' }}>{selectedNode.details.description}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
