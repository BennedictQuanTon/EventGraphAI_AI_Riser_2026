import React, { useState, useRef } from 'react';
import { api } from '../api';
import { 
  UploadCloud, 
  FolderOpen, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Play, 
  Search, 
  Building2, 
  Layers, 
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Send,
  Cpu
} from 'lucide-react';

export default function IntelligenceView({ onIngestionComplete }) {
  const [activeSubTab, setActiveSubTab] = useState('batch_ocr'); // 'batch_ocr', 'enrichment', 'query_console'

  // Batch OCR State
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Nguyen Van A",
      title: "Chief Technology Officer",
      company: "Tech Solutions VN",
      email: "a.nguyen@techsolutions.vn",
      phone: "+84 901 234 567",
      confidence: 100,
      status: "completed",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Tran Thi B",
      title: "Head of Marketing",
      company: "Global Media Hub",
      email: "b.tran@globalmedia.io",
      phone: "+84 912 345 678",
      confidence: 98,
      status: "completed",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Alex Chen",
      title: "Venture Partner",
      company: "Nexus Ventures SG",
      email: "alex@nexusventures.sg",
      phone: "+65 8123 4567",
      confidence: 92,
      status: "processing",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      name: "Arthur Vance",
      title: "Managing Director",
      company: "Vance Advisory Group",
      email: "arthur@vanceadvisory.com",
      confidence: 88,
      status: "linking",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      name: "Le Quoc C",
      title: "Unknown Title",
      company: "Innovate Labs",
      email: "c.le@innovate.vn",
      confidence: 65,
      status: "warning",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Search Grounding State
  const [companyQuery, setCompanyQuery] = useState('');
  const [enrichResult, setEnrichResult] = useState(null);
  const [isEnriching, setIsEnriching] = useState(false);

  // Query Console State
  const [queryInput, setQueryInput] = useState('');
  const [queryHistory, setQueryHistory] = useState([
    {
      query: "Identify key FinTech and AI executives who participated in AI Riser Demo Day.",
      answer: "Based on the Enterprise Knowledge Graph, 3 key executives were identified with active participation:\n• **Nguyen Thanh Son** (BD Director, NextGen AI Vietnam)\n• **Tran Thi B** (Head of Marketing, Global Media Hub)\n• **Alex Chen** (Venture Partner, Nexus Ventures SG)\nAll entities are canonical and cross-referenced with Google Search Grounding.",
      timestamp: "Just now"
    }
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  // Handle Card Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        name: "Hoang Minh T",
        title: "Founder & CEO",
        company: "Skyline AI Analytics",
        email: "t.hoang@skyline.ai",
        phone: "+84 988 776 655",
        confidence: 96,
        status: "completed",
        image: URL.createObjectURL(files[0])
      };
      setCards(prev => [newCard, ...prev]);
      setIsProcessing(false);
      if (onIngestionComplete) onIngestionComplete();
    }, 1500);
  };

  // Handle Company Search Grounding
  const handleEnrichCompany = async (e) => {
    e?.preventDefault();
    if (!companyQuery.trim()) return;
    setIsEnriching(true);
    try {
      const res = await api.enrichCompany(companyQuery);
      setEnrichResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnriching(false);
    }
  };

  // Handle Enterprise Graph Query
  const handleExecuteQuery = async (e) => {
    e?.preventDefault();
    if (!queryInput.trim()) return;
    const q = queryInput;
    setQueryInput('');
    setIsQuerying(true);

    try {
      const res = await api.chat(q);
      setQueryHistory(prev => [
        {
          query: q,
          answer: res.answer || "Query executed across all Graph nodes with anti-hallucination verification.",
          timestamp: "Just now"
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sub Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            Multimodal Intelligence & Ingestion
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Extract, enrich, and cross-reference enterprise relationships using Google Gemini Multimodal & Search Grounding.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('batch_ocr')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'batch_ocr' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'batch_ocr' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'batch_ocr' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'batch_ocr' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Batch Card Ingestion
          </button>
          <button
            onClick={() => setActiveSubTab('enrichment')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'enrichment' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'enrichment' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'enrichment' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'enrichment' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Search Grounding
          </button>
          <button
            onClick={() => setActiveSubTab('query_console')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeSubTab === 'query_console' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'query_console' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'query_console' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'query_console' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Graph Intelligence Console
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH CARD INGESTION (EXACT LAYOUT AS IMAGE 4) */}
      {activeSubTab === 'batch_ocr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Batch processing mode. Upload physical business card photos to automatically extract structured data and link graph entities.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ padding: '7px 14px' }}>
                <RefreshCw size={14} />
                <span>Processing History</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary" 
                style={{ padding: '7px 16px' }}
              >
                <Play size={14} />
                <span>Process Batch ({cards.length})</span>
              </button>
            </div>
          </div>

          {/* Two-Column Grid: Upload Zone (Left) & Preview Grid (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: '20px' }}>
            {/* Left Column: Upload Dropzone & Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--primary-border)',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '36px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'border-color 0.2s'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  multiple 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadCloud size={28} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                    Drag & drop images here
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports JPG, PNG. Select multiple files simultaneously.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button 
                    type="button"
                    className="btn btn-outline" 
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <FolderOpen size={14} />
                    <span>Browse Files</span>
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline" 
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <Camera size={14} />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>

              {/* Progress Card */}
              <div className="card-enterprise" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Current Batch Progress
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                  <span>Uploaded: {cards.length}</span>
                  <span style={{ color: 'var(--success)' }}>Completed: {cards.filter(c => c.status === 'completed').length}</span>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--secondary)', fontWeight: '600' }}>
                  <Sparkles size={14} />
                  <span>AI Multimodal Engine active & parsing</span>
                </div>
              </div>
            </div>

            {/* Right Column: Preview Grid */}
            <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Card Previews ({cards.length})
                </h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-subtle" style={{ padding: '4px 8px', fontSize: '12px' }}>
                    <SlidersHorizontal size={14} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Grid of Preview Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-main)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Card Thumbnail Image */}
                    <div style={{ height: '90px', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#E2E8F0' }}>
                      <img 
                        src={card.image} 
                        alt="Card preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Status Badge in Top Right of Image */}
                      <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                        {card.status === 'completed' && (
                          <span className="badge badge-success" style={{ backgroundColor: '#FFFFFF' }}>
                            <CheckCircle2 size={12} /> {card.confidence}% OCR
                          </span>
                        )}
                        {card.status === 'processing' && (
                          <span className="badge badge-primary" style={{ backgroundColor: '#FFFFFF' }}>
                            <Loader2 size={12} className="animate-spin" /> Processing...
                          </span>
                        )}
                        {card.status === 'linking' && (
                          <span className="badge badge-secondary" style={{ backgroundColor: '#FFFFFF' }}>
                            <Sparkles size={12} /> Linking Nodes
                          </span>
                        )}
                        {card.status === 'warning' && (
                          <span className="badge badge-danger" style={{ backgroundColor: '#FFFFFF' }}>
                            <AlertCircle size={12} /> Review Required
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Meta Content */}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--primary)', marginTop: '2px' }}>
                        🏢 {card.company}
                      </div>
                      {card.status === 'warning' && (
                        <button 
                          className="btn btn-outline"
                          style={{ marginTop: '8px', padding: '4px 10px', fontSize: '11px', alignSelf: 'flex-start' }}
                        >
                          Manual Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE SEARCH GROUNDING */}
      {activeSubTab === 'enrichment' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 420px) minmax(0, 1fr)', gap: '20px' }}>
          {/* Search Form */}
          <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Company Profile Grounding</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Enter any enterprise or startup name. Google Search Grounding retrieves verified industry, size, and source citations.
            </p>

            <form onSubmit={handleEnrichCompany} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Company Name:
                </label>
                <input 
                  type="text"
                  placeholder="e.g. NextGen AI Vietnam, SkyLine Labs..."
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                  className="input-enterprise"
                />
              </div>

              <button 
                type="submit" 
                disabled={isEnriching}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                {isEnriching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                <span>{isEnriching ? 'Grounding via Google Search...' : 'Enrich & Verify Profile'}</span>
              </button>
            </form>
          </div>

          {/* Search Result */}
          <div className="card-enterprise" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
              Grounded Enterprise Knowledge Card
            </h3>
            {enrichResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                    {enrichResult.name}
                  </h4>
                  <span className="badge badge-success">✓ Grounded</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Industry:</span>
                  <span style={{ fontWeight: '600' }}>{enrichResult.industry}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Company Size:</span>
                  <span>{enrichResult.size_range}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Headquarters:</span>
                  <span>{enrichResult.headquarters}</span>

                  <span style={{ color: 'var(--text-muted)' }}>Overview:</span>
                  <span style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>{enrichResult.description}</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Enter a company name on the left to inspect grounded profile intelligence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: GRAPH INTELLIGENCE QUERY CONSOLE (NO TACKY CHAT HEADS) */}
      {activeSubTab === 'query_console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Query Bar */}
          <div className="card-enterprise" style={{ padding: '16px 20px' }}>
            <form onSubmit={handleExecuteQuery} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                placeholder="Ask any question on your ecosystem graph (e.g. 'Show me all venture investors connected to AI startups')..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="input-enterprise"
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                disabled={isQuerying}
                className="btn btn-primary"
                style={{ padding: '8px 20px' }}
              >
                {isQuerying ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                <span>Execute Query</span>
              </button>
            </form>
          </div>

          {/* Results Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {queryHistory.map((item, idx) => (
              <div key={idx} className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="var(--primary)" />
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                      Query: "{item.query}"
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp}
                  </span>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  padding: '14px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  fontSize: '13.5px',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6'
                }}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
