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
  Maximize2,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';

export default function GraphView() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [activeFilter, setActiveFilter] = useState({ industry: 'all', event: 'all' });
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsible filter state (starts sleek)

  // Full Rich Master Nodes Dataset Covering All Filter Options
  const masterNodes = [
    // 1. Center Main Event Hub
    { 
      id: 'e1', 
      label: 'AI Riser Demo Day 2026', 
      type: 'event', 
      x: 0, 
      y: 0, 
      radius: 40, 
      venue: 'NIC Hanoi', 
      date: 'Aug 20, 2026', 
      attendees: '4,200+',
      events: ['all', 'ai_riser'],
      industry: 'all'
    },
    { 
      id: 'e2', 
      label: 'Tech Networking Night', 
      type: 'event', 
      x: 220, 
      y: -300, 
      radius: 34, 
      venue: 'The Loop HCMC', 
      date: 'Jun 15, 2026', 
      attendees: '1,800+',
      events: ['all', 'tech_night'],
      industry: 'all'
    },
    
    // 2. Artificial Intelligence & DeepTech Cluster (Top Left)
    { 
      id: 'c1', 
      label: 'NextGen AI Vietnam', 
      type: 'company', 
      industry: 'ai', 
      industryLabel: 'Artificial Intelligence & DeepTech',
      domain: 'nextgenai.vn', 
      x: -340, 
      y: -160, 
      radius: 36,
      events: ['all', 'ai_riser', 'tech_night']
    },
    { 
      id: 'p1', 
      label: 'Tran Duc Anh', 
      role: 'Executive Director', 
      type: 'person', 
      company: 'NextGen AI Vietnam', 
      industry: 'ai',
      avatar: 'DA', 
      email: 'duc.anh@nextgenai.vn', 
      x: -500, 
      y: -210, 
      radius: 25,
      events: ['all', 'ai_riser', 'tech_night']
    },
    { 
      id: 'p5', 
      label: 'Le Hoang Quan', 
      role: 'Senior AI Lead', 
      type: 'person', 
      company: 'NextGen AI Vietnam', 
      industry: 'ai',
      avatar: 'LQ', 
      email: 'quan.le@nextgenai.vn', 
      x: -500, 
      y: -110, 
      radius: 25,
      events: ['all', 'ai_riser']
    },

    // 3. Financial Technology (FinTech) Cluster (Top Right)
    { 
      id: 'c2', 
      label: 'VinFintech Payments', 
      type: 'company', 
      industry: 'fintech', 
      industryLabel: 'Financial Technology (FinTech)',
      domain: 'vinfintech.com', 
      x: 340, 
      y: -160, 
      radius: 36,
      events: ['all', 'ai_riser', 'tech_night', 'fintech_expo']
    },
    { 
      id: 'p2', 
      label: 'Alex Carter', 
      role: 'Co-Founder & CEO', 
      type: 'person', 
      company: 'VinFintech Payments', 
      industry: 'fintech',
      avatar: 'AC', 
      email: 'alex.carter@vinfintech.com', 
      x: 500, 
      y: -160, 
      radius: 25,
      events: ['all', 'ai_riser', 'fintech_expo']
    },
    { 
      id: 'p2b', 
      label: 'Tran Thi Mai Anh', 
      role: 'President & Founder', 
      type: 'person', 
      company: 'VinFintech Payments', 
      industry: 'fintech',
      avatar: 'MA', 
      email: 'maianh.tran@vinfinpay.com', 
      x: 440, 
      y: -60, 
      radius: 24,
      events: ['all', 'tech_night', 'fintech_expo']
    },

    // 4. Venture Capital & Funds Cluster (Bottom)
    { 
      id: 'c3', 
      label: 'Dragon Venture Capital', 
      type: 'company', 
      industry: 'vc', 
      industryLabel: 'Venture Capital & Funds',
      domain: 'dragonvc.co', 
      x: -340, 
      y: 180, 
      radius: 36,
      events: ['all', 'ai_riser', 'sea_summit']
    },
    { 
      id: 'p3', 
      label: 'Alexander Chen', 
      role: 'Partner | Founder', 
      type: 'person', 
      company: 'Dragon Venture Capital', 
      industry: 'vc',
      avatar: 'AC', 
      email: 'alex.chen@dragonvc.co', 
      x: -500, 
      y: 180, 
      radius: 25,
      events: ['all', 'ai_riser', 'sea_summit']
    },
    { 
      id: 'c4', 
      label: 'Nexus Ventures', 
      type: 'company', 
      industry: 'vc', 
      industryLabel: 'Venture Capital & Funds',
      domain: 'nexusventures.co', 
      x: 340, 
      y: 180, 
      radius: 36,
      events: ['all', 'ai_riser', 'tech_night']
    },
    { 
      id: 'p4', 
      label: 'Sarah Jenkins', 
      role: 'Managing Partner', 
      type: 'person', 
      company: 'Nexus Ventures', 
      industry: 'vc',
      avatar: 'SJ', 
      email: 'sarah@nexusventures.co', 
      x: 500, 
      y: 180, 
      radius: 25,
      events: ['all', 'ai_riser', 'tech_night']
    },

    // 5. Incubation & Ecosystem Hub (Top Center)
    { 
      id: 'c5', 
      label: 'National Innovation Hub', 
      type: 'company', 
      industry: 'incubation', 
      industryLabel: 'Incubation & Ecosystem',
      domain: 'innovatehub.org.vn', 
      x: -40, 
      y: -280, 
      radius: 34,
      events: ['all', 'ai_riser', 'tech_night', 'sea_summit']
    },
    { 
      id: 'p6', 
      label: 'Do Thu Trang', 
      role: 'Head of Partnerships', 
      type: 'person', 
      company: 'National Innovation Hub', 
      industry: 'incubation',
      avatar: 'TT', 
      email: 'trang.do@innovatehub.org.vn', 
      x: 80, 
      y: -320, 
      radius: 25,
      events: ['all', 'ai_riser', 'sea_summit']
    },

    // 6. GreenTech & Cybersecurity Nodes (Bottom Center)
    { 
      id: 'p7', 
      label: 'Vu Dang Khoa', 
      role: 'CTO & Co-Founder', 
      type: 'person', 
      company: 'GreenFuture ESG Tech', 
      industry: 'greentech',
      avatar: 'VK', 
      email: 'khoa.vu@greenfuture.vn', 
      x: -150, 
      y: 300, 
      radius: 25,
      events: ['all', 'ai_riser']
    },
    { 
      id: 'p8', 
      label: 'Bui Quoc Hung', 
      role: 'VP of Security', 
      type: 'person', 
      company: 'CyberGuard Security', 
      industry: 'cybersecurity',
      avatar: 'BH', 
      email: 'hung.bui@cyberguard.vn', 
      x: 150, 
      y: 300, 
      radius: 25,
      events: ['all', 'ai_riser', 'tech_night']
    }
  ];

  const masterLinks = [
    // Event Hub Central Connections
    { source: 'p1', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#0052CC' },
    { source: 'p2', target: 'e1', label: 'KEYNOTE_SPEAKER', color: '#FF8C00' },
    { source: 'p3', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p4', target: 'e1', label: 'VIP_INVESTOR', color: '#A33500' },
    { source: 'p6', target: 'e1', label: 'HOST_ORGANIZER', color: '#0052CC' },
    { source: 'p7', target: 'e1', label: 'ATTENDED', color: '#94A3B8', dashed: true },
    { source: 'p8', target: 'e1', label: 'PANELIST', color: '#0052CC' },

    // Tech Networking Night Connections
    { source: 'p1', target: 'e2', label: 'ATTENDED', color: '#0052CC' },
    { source: 'p2b', target: 'e2', label: 'SPEAKER', color: '#FF8C00' },
    { source: 'p4', target: 'e2', label: 'SPONSOR', color: '#A33500' },

    // Affiliations
    { source: 'p1', target: 'c1', label: 'AFFILIATED_WITH', color: '#0052CC' },
    { source: 'p5', target: 'c1', label: 'RESEARCH_LEAD', color: '#0052CC' },
    { source: 'p2', target: 'c2', label: 'CO_FOUNDER', color: '#FF8C00' },
    { source: 'p2b', target: 'c2', label: 'FOUNDER_PRESIDENT', color: '#FF8C00' },
    { source: 'p3', target: 'c3', label: 'MANAGING_PARTNER', color: '#A33500' },
    { source: 'p4', target: 'c4', label: 'GENERAL_PARTNER', color: '#A33500' },
    { source: 'p6', target: 'c5', label: 'OPERATES', color: '#0052CC' },

    // Co-investments
    { source: 'c3', target: 'c1', label: 'INVESTED_IN', color: '#A33500', dashed: true },
    { source: 'c4', target: 'c2', label: 'SYNDICATE_MATCH', color: '#059669', dashed: true }
  ];

  // Camera & Interaction State
  const graphState = useRef({
    nodes: JSON.parse(JSON.stringify(masterNodes)),
    links: masterLinks,
    camera: { x: 0, y: 0, zoom: 0.95 },
    isDragging: false,
    dragNode: null,
    lastMouse: { x: 0, y: 0 }
  });

  // Filter Matching Helper
  const isNodeMatching = useCallback((node) => {
    const { industry, event } = activeFilter;
    const matchIndustry = industry === 'all' || node.industry === industry || node.type === 'event';
    const matchEvent = event === 'all' || (node.events && node.events.includes(event));
    return matchIndustry && matchEvent;
  }, [activeFilter]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const { nodes, links, camera } = graphState.current;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const isFilterActive = activeFilter.industry !== 'all' || activeFilter.event !== 'all';

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

      const sourceMatches = isNodeMatching(source);
      const targetMatches = isNodeMatching(target);
      const edgeMatches = sourceMatches && targetMatches;

      ctx.save();
      if (isFilterActive && !edgeMatches) {
        ctx.globalAlpha = 0.15;
      }

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = l.dashed ? '#CBD5E1' : l.color || '#0052CC';
      ctx.lineWidth = edgeMatches && isFilterActive ? 3.2 : l.dashed ? 1.8 : 2.4;
      if (l.dashed) {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Edge Relationship Pill Label (Crisp & High Contrast)
      if (l.label && camera.zoom > 0.6) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        ctx.font = '700 11px JetBrains Mono, monospace';
        const labelWidth = ctx.measureText(l.label).width;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = edgeMatches && isFilterActive ? '#0052CC' : '#CBD5E1';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(midX - labelWidth / 2 - 6, midY - 10, labelWidth + 12, 20, 5);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = edgeMatches && isFilterActive ? '#0052CC' : '#334155';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(l.label, midX, midY);
      }
      ctx.restore();
    });

    // 3. Draw Nodes
    nodes.forEach(n => {
      const isSelected = selectedNode?.id === n.id;
      const matches = isNodeMatching(n);

      ctx.save();
      if (isFilterActive && !matches) {
        ctx.globalAlpha = 0.18;
      }

      // Highlight Glow effect if matches active filter
      if (isFilterActive && matches) {
        ctx.shadowColor = n.type === 'company' ? 'rgba(0, 82, 204, 0.4)' : 'rgba(255, 140, 0, 0.45)';
        ctx.shadowBlur = 16;
      }

      if (n.type === 'event') {
        // Event Central Hub (Orange Hexagonal Diamond)
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.lineWidth = isSelected ? 5 : 3.5;
        ctx.roundRect(-n.radius, -n.radius, n.radius * 2, n.radius * 2, 12);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#FF8C00';
        ctx.font = '800 13.5px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SUMMIT', n.x, n.y - 7);
        ctx.font = '700 11.5px JetBrains Mono, monospace';
        ctx.fillStyle = '#0F172A';
        ctx.fillText('HUB 2026', n.x, n.y + 8);

      } else if (n.type === 'company') {
        // Company Node (Double Concentric Sapphire Rings)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#FF8C00' : '#0052CC';
        ctx.lineWidth = isSelected ? 4.5 : 3;
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
        ctx.font = '800 13px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ORG', n.x, n.y);

      } else {
        // Person Executive Node (Avatar Ring with Initials)
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#EFF6FF' : '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.lineWidth = isSelected ? 4 : 3;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#0052CC' : '#FF8C00';
        ctx.font = '800 13.5px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.avatar || 'EX', n.x, n.y);
      }

      // 4. Clean Distinct Node Label Pill (Always has clear content)
      if (n.label && n.label.trim()) {
        const labelY = n.y + n.radius + 18;
        ctx.font = isSelected ? '800 14px Plus Jakarta Sans, sans-serif' : '700 13.5px Plus Jakarta Sans, sans-serif';
        const labelWidth = ctx.measureText(n.label).width;

        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isSelected ? '#0052CC' : matches && isFilterActive ? '#0052CC' : '#CBD5E1';
        ctx.lineWidth = isSelected ? 2 : matches && isFilterActive ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.roundRect(n.x - labelWidth / 2 - 10, labelY - 12, labelWidth + 20, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSelected ? '#0052CC' : matches && isFilterActive ? '#0052CC' : '#0F172A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, labelY);
      }

      ctx.restore();
    });

    ctx.restore();
  }, [selectedNode, activeFilter, isNodeMatching]);

  // Handle Resize & Canvas Initialization
  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 680;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawGraph();
  }, [drawGraph]);

  // Non-passive wheel event listener to completely PREVENT page scroll during zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      const newZoom = Math.max(0.35, Math.min(3.0, graphState.current.camera.zoom * zoomFactor));
      graphState.current.camera.zoom = newZoom;
      drawGraph();
    };

    canvas.addEventListener('wheel', handleNativeWheel, { passive: false });
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('wheel', handleNativeWheel);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas, drawGraph]);

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

    const wx = (mx - (width / 2 + camera.x)) / camera.zoom;
    const wy = (my - (height / 2 + camera.y)) / camera.zoom;

    const clicked = nodes.find(n => {
      const dx = n.x - wx;
      const dy = n.y - wy;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 14;
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

  const handleZoomBtn = (factor) => {
    graphState.current.camera.zoom = Math.max(0.35, Math.min(3.0, graphState.current.camera.zoom * factor));
    drawGraph();
  };

  const handleResetCamera = () => {
    graphState.current.camera = { x: 0, y: 0, zoom: 0.95 };
    graphState.current.nodes = JSON.parse(JSON.stringify(masterNodes));
    setSelectedNode(null);
    drawGraph();
  };

  // Apply Filter Handler
  const handleApplyFilter = (e) => {
    e?.preventDefault();
    setActiveFilter({ industry: selectedIndustry, event: selectedEvent });

    if (selectedIndustry === 'fintech') {
      graphState.current.camera = { x: -140, y: 30, zoom: 1.15 };
    } else if (selectedIndustry === 'ai') {
      graphState.current.camera = { x: 140, y: 30, zoom: 1.15 };
    } else if (selectedIndustry === 'vc') {
      graphState.current.camera = { x: 0, y: -60, zoom: 1.1 };
    } else {
      graphState.current.camera = { x: 0, y: 0, zoom: 0.95 };
    }
    setTimeout(drawGraph, 50);
  };

  const handleClearFilter = () => {
    setSelectedIndustry('all');
    setSelectedEvent('all');
    setActiveFilter({ industry: 'all', event: 'all' });
    graphState.current.camera = { x: 0, y: 0, zoom: 0.95 };
    setTimeout(drawGraph, 50);
  };

  const matchedNodesCount = masterNodes.filter(n => isNodeMatching(n)).length;
  const isFilterActive = activeFilter.industry !== 'all' || activeFilter.event !== 'all';

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
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />

      {/* Collapsible Filter Panel Top Left */}
      {!isFilterOpen ? (
        // Sleek Compact Collapsed Button (Does not obstruct canvas)
        <button
          onClick={() => setIsFilterOpen(true)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '10px 16px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: isFilterActive ? 'var(--primary-light)' : 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Filter size={16} color="var(--primary)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-main)' }}>
              Filter Dataset
            </div>
            <div style={{ fontSize: '11px', color: isFilterActive ? 'var(--primary)' : 'var(--text-light)', fontWeight: isFilterActive ? '700' : '500' }}>
              {isFilterActive ? `Active: ${matchedNodesCount} Matched` : 'All Entities (14)'}
            </div>
          </div>
          <ChevronDown size={17} color="var(--text-muted)" style={{ marginLeft: '4px' }} />
        </button>
      ) : (
        // Expanded Filter Card with Collapse Toggle Button
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '320px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '22px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 10,
          animation: 'fadeIn 0.18s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={20} color="var(--primary)" />
              <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                Filter Graph Dataset
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isFilterActive && (
                <button 
                  onClick={handleClearFilter}
                  className="btn btn-subtle" 
                  style={{ fontSize: '12px', padding: '2px 6px', color: 'var(--danger)' }}
                >
                  Reset
                </button>
              )}
              {/* Collapse Button */}
              <button 
                onClick={() => setIsFilterOpen(false)}
                title="Collapse Filter Panel"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <ChevronUp size={20} />
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Industry Sector:
            </label>
            <select 
              value={selectedIndustry} 
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="input-enterprise" 
              style={{ fontSize: '14px', padding: '9px 12px' }}
            >
              <option value="all">All Industries (3,105)</option>
              <option value="ai">Artificial Intelligence & DeepTech</option>
              <option value="fintech">Financial Technology (FinTech)</option>
              <option value="vc">Venture Capital & Funds</option>
              <option value="greentech">GreenTech & ESG</option>
              <option value="cybersecurity">Cybersecurity Infrastructure</option>
              <option value="incubation">Incubation & Ecosystem Hubs</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Summit / Event Participation:
            </label>
            <select 
              value={selectedEvent} 
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="input-enterprise" 
              style={{ fontSize: '14px', padding: '9px 12px' }}
            >
              <option value="all">All Summits (142)</option>
              <option value="ai_riser">AI Riser Vietnam Demo Day 2026</option>
              <option value="tech_night">Tech Networking Night Q2/2026</option>
              <option value="sea_summit">SEA Startup Summit 2025</option>
              <option value="fintech_expo">Vietnam FinTech Expo 2026</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={handleApplyFilter}
              className="btn btn-primary" 
              style={{ flex: 1, padding: '11px', fontSize: '14px' }}
            >
              <Check size={16} />
              <span>Apply Filter</span>
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="btn btn-outline" 
              style={{ padding: '11px 14px', fontSize: '14px' }}
              title="Hide Filter Card"
            >
              Hide
            </button>
          </div>

          {isFilterActive && (
            <div style={{
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              fontSize: '12.5px',
              color: 'var(--primary)',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>✨ {matchedNodesCount} Nodes Matched</span>
              <span style={{ fontSize: '11.5px', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleClearFilter}>Clear</span>
            </div>
          )}
        </div>
      )}

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
          title="Zoom In"
          style={{ padding: '9px 13px', fontSize: '14px' }}
        >
          <ZoomIn size={17} />
        </button>
        <button 
          onClick={() => handleZoomBtn(0.8)} 
          className="btn btn-outline" 
          title="Zoom Out"
          style={{ padding: '9px 13px', fontSize: '14px' }}
        >
          <ZoomOut size={17} />
        </button>
        <button 
          onClick={handleResetCamera} 
          className="btn btn-outline" 
          title="Reset Camera & Layout"
          style={{ padding: '9px 13px', fontSize: '14px' }}
        >
          <RotateCcw size={17} />
        </button>
      </div>

      {/* Floating Legend Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: selectedNode ? '370px' : '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '13.5px',
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
          width: '340px',
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
            <span className={selectedNode.type === 'company' ? 'badge badge-primary' : selectedNode.type === 'event' ? 'badge badge-warning' : 'badge badge-secondary'} style={{ fontSize: '13px', padding: '4px 10px' }}>
              {selectedNode.type.toUpperCase()}
            </span>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={19} color="var(--text-muted)" />
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '21px', fontWeight: '800', color: 'var(--text-main)' }}>
              {selectedNode.label}
            </h4>
            <p style={{ fontSize: '14.5px', color: 'var(--primary)', fontWeight: '700', marginTop: '3px' }}>
              {selectedNode.role || selectedNode.industryLabel || selectedNode.venue}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '14px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--success)', fontWeight: '800', marginTop: '6px' }}>
            <ShieldCheck size={17} />
            <span>Verified Canonical Knowledge Node</span>
          </div>
        </div>
      )}
    </div>
  );
}
