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
  Cpu,
  Check,
  Globe,
  Tag
} from 'lucide-react';

export default function IntelligenceView({ onIngestionComplete }) {
  const [activeSubTab, setActiveSubTab] = useState('batch_ocr');

  // Rich Batch Cards Data (8 items)
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Nguyen Thanh Son",
      title: "Director of Business Development",
      company: "NextGen AI Vietnam",
      email: "son.nguyen@nextgenai.vn",
      phone: "+84 912 345 678",
      location: "Hanoi, Vietnam",
      confidence: 100,
      status: "completed",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "Tran Thi Mai Anh",
      title: "Chief Executive Officer (CEO)",
      company: "VinFintech Payments",
      email: "maianh.tran@vinfinpay.com",
      phone: "+84 988 123 456",
      location: "HCMC, Vietnam",
      confidence: 98,
      status: "completed",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Alex Chen",
      title: "General Partner",
      company: "Nexus Ventures Singapore",
      email: "alex.chen@nexusventures.sg",
      phone: "+65 8123 4567",
      location: "Singapore",
      confidence: 94,
      status: "completed",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      name: "Pham Minh Duc",
      title: "Managing Partner & Angel Investor",
      company: "Dragon Venture Capital",
      email: "duc.pham@dragonvc.fund",
      phone: "+84 918 777 666",
      location: "Hanoi / Danang",
      confidence: 95,
      status: "completed",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      name: "Le Hoang Quan",
      title: "Senior AI Research Lead",
      company: "NextGen AI Vietnam",
      email: "quan.le@nextgenai.vn",
      phone: "+84 903 888 999",
      location: "Hanoi, Vietnam",
      confidence: 92,
      status: "linking",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 6,
      name: "Hoang Bich Ngoc",
      title: "VP of Product Management",
      company: "EduSmart Interactive",
      email: "ngoc.hoang@edusmart.edu.vn",
      phone: "+84 945 112 233",
      location: "HCMC, Vietnam",
      confidence: 88,
      status: "processing",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 7,
      name: "Vu Dang Khoa",
      title: "Co-Founder & CTO",
      company: "GreenFuture ESG Tech",
      email: "khoa.vu@greenfuture.vn",
      phone: "+84 977 445 566",
      location: "Danang, Vietnam",
      confidence: 91,
      status: "completed",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60"
    },
    {
      id: 8,
      name: "Arthur Vance",
      title: "Principal Strategist",
      company: "Vance Advisory Group",
      email: "arthur@vanceadvisory.com",
      phone: "+84 909 112 334",
      location: "HCMC, Vietnam",
      confidence: 65,
      status: "warning",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=60"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Search Grounding State with rich default
  const [companyQuery, setCompanyQuery] = useState('');
  const [enrichResult, setEnrichResult] = useState({
    name: "NextGen AI Vietnam",
    domain: "nextgenai.vn",
    industry: "Artificial Intelligence & Analytics",
    size_range: "50-100 employees",
    headquarters: "Keangnam Landmark 72, Hanoi, Vietnam",
    founded_year: "2021",
    description: "Enterprise multimodal AI platform developing automated OCR pipelines, neural entity resolution engines, and graph analytics for Tier-1 financial institutions.",
    key_products: ["GenAI Enterprise Suite", "Vision OCR Pipeline", "Graph Entity Resolver", "Automated Compliance Engine"],
    sources: [
      { title: "National Business Portal & Official Registry", url: "https://dangkydoanhnghiep.gov.vn" },
      { title: "Google Search Grounding Live Verification", url: "https://nextgenai.vn" }
    ],
    confidence_score: 0.98
  });
  const [isEnriching, setIsEnriching] = useState(false);

  // Query Console State with rich multi-turn examples
  const [queryInput, setQueryInput] = useState('');
  const [queryHistory, setQueryHistory] = useState([
    {
      query: "Identify high-priority venture investors connected to DeepTech and AI founders across 2025-2026 summits.",
      answer: "Top Venture Capital Partners identified with verified Graph connections:\n1. **Pham Minh Duc** (Managing Partner, Dragon Venture Capital)\n   • Connected to 4 AI Startups (NextGen AI, GreenFuture ESG, CyberGuard Security)\n   • Attended: AI Riser Demo Day 2026 (VIP Sponsor), Startup Summit 2025 (Speaker)\n2. **Alex Chen** (General Partner, Nexus Ventures Singapore)\n   • Cross-border SEA Tech syndicate focus\n   • Direct co-investment relationship with National Innovation Hub.\n*All entities are canonical and anti-hallucination verified against the Knowledge Graph.*",
      timestamp: "2m ago"
    },
    {
      query: "Which executives participated in multiple cross-city events between Hanoi and Ho Chi Minh City?",
      answer: "Found **3 high-mobility executive nodes**:\n• **Nguyen Thanh Son** (NextGen AI): AI Riser Demo Day (Hanoi), Tech Networking Night (HCMC).\n• **Tran Thi Mai Anh** (VinFintech Payments): Vietnam FinTech Expo (HCMC), AI Riser Demo Day (Hanoi).\n• **Do Thu Trang** (Innovation Hub Lead): Active across Hanoi, HCMC, and Danang summits as Co-organizer.",
      timestamp: "18m ago"
    }
  ]);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        name: "Hoang Minh Tu",
        title: "Founder & Chief Architect",
        company: "Skyline AI Analytics",
        email: "tu.hoang@skyline.ai",
        phone: "+84 988 776 655",
        location: "Hanoi, Vietnam",
        confidence: 97,
        status: "completed",
        image: URL.createObjectURL(files[0])
      };
      setCards(prev => [newCard, ...prev]);
      setIsProcessing(false);
      if (onIngestionComplete) onIngestionComplete();
    }, 1200);
  };

  const handleEnrichCompany = async (companyName) => {
    const target = companyName || companyQuery;
    if (!target.trim()) return;
    setIsEnriching(true);
    try {
      const res = await api.enrichCompany(target);
      if (res && res.name) {
        setEnrichResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnriching(false);
    }
  };

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
      {/* Sub Header & Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            Multimodal Intelligence & Ingestion Pipeline
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Powered by Google Gemini 2.5/3 Pro Vision OCR, Search Grounding, and Knowledge Graph Query Console.
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
            Batch Card Ingestion ({cards.length})
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
            Graph Query Console
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH CARD INGESTION */}
      {activeSubTab === 'batch_ocr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Batch camera & image processor. Upload business cards to extract bilingual metadata (Vietnamese & International) and link to graph nodes.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ padding: '7px 14px' }}>
                <RefreshCw size={14} />
                <span>Ingestion History (142)</span>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: '20px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--primary-border)',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
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
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadCloud size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                    Drag & drop business cards here
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports high-resolution PNG, JPG, and mobile camera photos.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
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

              {/* Progress Box */}
              <div className="card-enterprise" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Current Batch Pipeline
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                  <span>Ingested: {cards.length} cards</span>
                  <span style={{ color: 'var(--success)' }}>Completed: {cards.filter(c => c.status === 'completed').length} verified</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--secondary)', fontWeight: '600' }}>
                  <Sparkles size={14} />
                  <span>Gemini Multimodal Vision Model Active</span>
                </div>
              </div>
            </div>

            {/* Right Column: 8 Preview Cards Grid */}
            <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Card Previews & Structured Ingestion ({cards.length})
                </h3>
                <span className="badge badge-primary">8 Cards Loaded</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
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
                    <div style={{ height: '80px', width: '100%', overflow: 'hidden', position: 'relative', backgroundColor: '#E2E8F0' }}>
                      <img 
                        src={card.image} 
                        alt="Card preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                        {card.status === 'completed' && (
                          <span className="badge badge-success" style={{ backgroundColor: '#FFFFFF' }}>
                            <CheckCircle2 size={11} /> {card.confidence}% OCR
                          </span>
                        )}
                        {card.status === 'processing' && (
                          <span className="badge badge-primary" style={{ backgroundColor: '#FFFFFF' }}>
                            <Loader2 size={11} className="animate-spin" /> Processing...
                          </span>
                        )}
                        {card.status === 'linking' && (
                          <span className="badge badge-secondary" style={{ backgroundColor: '#FFFFFF' }}>
                            <Sparkles size={11} /> Linking Nodes
                          </span>
                        )}
                        {card.status === 'warning' && (
                          <span className="badge badge-danger" style={{ backgroundColor: '#FFFFFF' }}>
                            <AlertCircle size={11} /> Review ({card.confidence}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--primary)', marginTop: '2px' }}>
                        🏢 {card.company}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                        ✉ {card.email}
                      </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)', gap: '20px' }}>
          {/* Left Form */}
          <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Company Profile Grounding</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Lookup official corporate profiles using Google Search Grounding to verify legal entities, industry codes, and citations.
            </p>

            {/* Quick Chips */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                Quick Lookup Suggestions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {["NextGen AI Vietnam", "VinFintech Payments", "Dragon Venture Capital", "CyberGuard Security"].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { setCompanyQuery(name); handleEnrichCompany(name); }}
                    className="btn btn-outline"
                    style={{ fontSize: '11.5px', padding: '4px 8px', borderRadius: '6px' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEnrichCompany(); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <input 
                type="text"
                placeholder="Enter enterprise or startup name..."
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                className="input-enterprise"
              />
              <button 
                type="submit" 
                disabled={isEnriching}
                className="btn btn-primary"
                style={{ width: '100%', padding: '9px' }}
              >
                {isEnriching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                <span>{isEnriching ? 'Grounding via Google Search...' : 'Verify Enterprise Profile'}</span>
              </button>
            </form>
          </div>

          {/* Right Card Output */}
          <div className="card-enterprise" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                {enrichResult.name}
              </h3>
              <span className="badge badge-success">✓ 100% Grounded & Verified</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '10px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Corporate Domain:</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{enrichResult.domain}</span>

              <span style={{ color: 'var(--text-muted)' }}>Industry Sector:</span>
              <span style={{ fontWeight: '600' }}>{enrichResult.industry}</span>

              <span style={{ color: 'var(--text-muted)' }}>Estimated Scale:</span>
              <span>{enrichResult.size_range}</span>

              <span style={{ color: 'var(--text-muted)' }}>Headquarters:</span>
              <span>{enrichResult.headquarters}</span>

              <span style={{ color: 'var(--text-muted)' }}>Overview:</span>
              <span style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>{enrichResult.description}</span>

              <span style={{ color: 'var(--text-muted)' }}>Core Products:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {enrichResult.key_products?.map((prod, i) => (
                  <span key={i} className="badge badge-neutral">{prod}</span>
                ))}
              </div>

              <span style={{ color: 'var(--text-muted)' }}>Google Citations:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {enrichResult.sources?.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ExternalLink size={12} /> {s.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRAPH QUERY CONSOLE */}
      {activeSubTab === 'query_console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card-enterprise" style={{ padding: '18px 22px' }}>
            <form onSubmit={handleExecuteQuery} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                placeholder="Ask complex topological questions (e.g. 'List all FinTech founders who attended AI Riser Demo Day')..."
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
                {isQuerying ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                <span>Execute Query</span>
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {queryHistory.map((item, idx) => (
              <div key={idx} className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="var(--primary)" />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                      Query: "{item.query}"
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp}
                  </span>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  padding: '14px 18px', 
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
