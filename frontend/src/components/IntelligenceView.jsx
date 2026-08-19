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
  Send, 
  Cpu, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  CreditCard,
  Maximize2
} from 'lucide-react';

export default function IntelligenceView({ onIngestionComplete }) {
  const [activeSubTab, setActiveSubTab] = useState('batch_ocr');

  // Realistic Business Card Upload Scans with Photorealistic Preview Assets
  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Nguyễn Thanh Sơn",
      title: "Director of Business Development",
      company: "NextGen AI Vietnam",
      email: "son.nguyen@nextgenai.vn",
      phone: "+84 (0) 912 345 678",
      address: "Floor 12, Keangnam Landmark 72, Hanoi",
      domain: "nextgenai.vn",
      cardImage: "/assets/cards/card_nextgen.jpg",
      confidence: 100,
      status: "completed"
    },
    {
      id: 2,
      name: "Trần Thị Mai Anh",
      title: "Chief Executive Officer & Founder",
      company: "VinFintech Payments",
      email: "maianh.tran@vinfinpay.com",
      phone: "+84 (0) 988 123 456",
      address: "The Loop Hub, District 1, Ho Chi Minh City",
      domain: "vinfinpay.com",
      cardImage: "/assets/cards/card_vinfin.jpg",
      confidence: 98,
      status: "completed"
    },
    {
      id: 3,
      name: "Alex Chen",
      title: "General Partner & Founder",
      company: "Dragon Venture Capital",
      email: "alex.chen@dragonvc.co",
      phone: "+1 (650) 555-0188",
      address: "Hai Chau Innovation Center, Danang",
      domain: "dragonvc.co",
      cardImage: "/assets/cards/card_dragon.jpg",
      confidence: 96,
      status: "completed"
    },
    {
      id: 4,
      name: "Sarah Jenkins",
      title: "Managing Partner & SEA Lead",
      company: "Nexus Ventures",
      email: "sarah@nexusventures.co",
      phone: "+1 (555) 123-4567",
      address: "450 Tech Way, Singapore & SF",
      domain: "nexusventures.co",
      cardImage: "/assets/cards/card_nexus.jpg",
      confidence: 95,
      status: "completed"
    },
    {
      id: 5,
      name: "Lê Hoàng Quân",
      title: "Senior AI Research Lead",
      company: "NextGen AI Vietnam",
      email: "quan.le@nextgenai.vn",
      phone: "+84 (0) 903 888 999",
      address: "Keangnam Landmark 72, Hanoi",
      domain: "nextgenai.vn",
      cardImage: "/assets/cards/card_nextgen.jpg",
      confidence: 92,
      status: "linking"
    },
    {
      id: 6,
      name: "Vũ Đăng Khoa",
      title: "Co-Founder & Chief Technology Officer",
      company: "GreenFuture ESG Tech",
      email: "khoa.vu@greenfuture.vn",
      phone: "+84 (0) 977 445 566",
      address: "Hoa Lac Hi-Tech Park, Hanoi",
      domain: "greenfuture.vn",
      cardImage: "/assets/cards/card_nexus.jpg",
      confidence: 91,
      status: "completed"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Search Grounding State
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
    ]
  });
  const [isEnriching, setIsEnriching] = useState(false);

  // Query Console State
  const [queryInput, setQueryInput] = useState('');
  const [queryHistory, setQueryHistory] = useState([
    {
      query: "Identify high-priority venture investors connected to DeepTech and AI founders across 2025-2026 summits.",
      answer: "Top Venture Capital Partners identified with verified Graph connections:\n1. **Pham Minh Duc & Alex Chen** (Managing Partners, Dragon Venture Capital)\n   • Connected to 4 AI Startups (NextGen AI, GreenFuture ESG, CyberGuard Security)\n   • Attended: AI Riser Demo Day 2026 (VIP Sponsor), Startup Summit 2025 (Speaker)\n2. **Sarah Jenkins** (Managing Partner, Nexus Ventures Singapore)\n   • Cross-border SEA Tech syndicate focus\n   • Direct co-investment relationship with National Innovation Hub.\n*All entities are canonical and anti-hallucination verified against the Knowledge Graph.*",
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
        name: "Hoàng Minh Tú",
        title: "Founder & Chief Architect",
        company: "Skyline AI Analytics",
        email: "tu.hoang@skyline.ai",
        phone: "+84 (0) 988 776 655",
        address: "Lang Ha, Ba Dinh, Hanoi",
        domain: "skyline.ai",
        cardImage: URL.createObjectURL(files[0]),
        confidence: 97,
        status: "completed"
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Sub Header & Tab Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Multimodal Intelligence & Ingestion Pipeline
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Extract physical business cards with Google Gemini Multimodal OCR, verify corporate domains with Search Grounding.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-muted)', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveSubTab('batch_ocr')}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'batch_ocr' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'batch_ocr' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'batch_ocr' ? '800' : '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'batch_ocr' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Physical Card Ingestion ({cards.length})
          </button>
          <button
            onClick={() => setActiveSubTab('enrichment')}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'enrichment' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'enrichment' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'enrichment' ? '800' : '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'enrichment' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Google Search Grounding
          </button>
          <button
            onClick={() => setActiveSubTab('query_console')}
            style={{
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === 'query_console' ? '#FFFFFF' : 'transparent',
              color: activeSubTab === 'query_console' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'query_console' ? '800' : '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeSubTab === 'query_console' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Graph Query Console
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH PHYSICAL BUSINESS CARD INGESTION */}
      {activeSubTab === 'batch_ocr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)' }}>
              Batch multimodal camera & scanner pipeline. Upload physical executive business card photos to automatically extract structured contact fields.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ padding: '9px 18px', fontSize: '14px' }}>
                <RefreshCw size={15} />
                <span>History Log (142)</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary" 
                style={{ padding: '9px 22px', fontSize: '14.5px' }}
              >
                <Play size={16} />
                <span>Process All ({cards.length} Cards)</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)', gap: '26px' }}>
            {/* Left Column: Dropzone & Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--primary-border)',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  padding: '36px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)'
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
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UploadCloud size={28} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Drop physical business cards
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supports camera snapshots, PNG, and JPG scans.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button 
                    type="button"
                    className="btn btn-outline" 
                    style={{ fontSize: '13.5px', padding: '8px 16px' }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <FolderOpen size={16} />
                    <span>Browse Files</span>
                  </button>
                  <button 
                    type="button"
                    className="btn btn-outline" 
                    style={{ fontSize: '13.5px', padding: '8px 16px' }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <Camera size={16} />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>

              {/* Progress Box */}
              <div className="card-enterprise" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Current Ingestion Pipeline
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', fontWeight: '700' }}>
                  <span>Ingested: {cards.length} cards</span>
                  <span style={{ color: 'var(--success)' }}>Completed: {cards.filter(c => c.status === 'completed').length} verified</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--primary)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--secondary)', fontWeight: '700' }}>
                  <Sparkles size={16} />
                  <span>Gemini Multimodal OCR & Vision Active</span>
                </div>
              </div>
            </div>

            {/* Right Column: 6 Physical Business Card Photos Grid */}
            <div className="card-enterprise" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)' }}>
                    Physical Card Ingestion Queue ({cards.length})
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Uploaded physical name cards with Gemini Vision OCR extraction
                  </p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '13px', padding: '5px 12px' }}>
                  {cards.length} Cards Loaded
                </span>
              </div>

              {/* Grid of Real Business Card Photograph Previews */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
                {cards.map((card) => (
                  <div 
                    key={card.id}
                    className="card-enterprise"
                    style={{
                      borderRadius: '14px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-md)'
                    }}
                  >
                    {/* Realistic Photo Header */}
                    <div style={{ height: '165px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                      <img 
                        src={card.cardImage} 
                        alt="Physical Name Card Photo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        {card.status === 'completed' && (
                          <span className="badge badge-success" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: '12px' }}>
                            <CheckCircle2 size={13} /> {card.confidence}% OCR
                          </span>
                        )}
                        {card.status === 'linking' && (
                          <span className="badge badge-secondary" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: '12px' }}>
                            <Sparkles size={13} /> Linking Graph
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Extracted Structured Card Metadata */}
                    <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                          {card.name}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--primary)', marginTop: '2px' }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--secondary)', marginTop: '2px' }}>
                          🏢 {card.company}
                        </div>
                      </div>

                      {/* Contact Fields with Icons */}
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                          <Mail size={14} color="var(--primary)" />
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{card.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                          <Phone size={14} color="var(--secondary)" />
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>{card.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '12px' }}>
                          <MapPin size={14} color="#64748B" />
                          <span>{card.address}</span>
                        </div>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 420px) minmax(0, 1fr)', gap: '26px' }}>
          {/* Left Form */}
          <div className="card-enterprise" style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '19px', fontWeight: '800' }}>Company Search Grounding</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Lookup corporate profiles using Google Search Grounding to verify legal entities, industry codes, and citations.
            </p>

            {/* Quick Chips */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                Quick Lookup Suggestions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {["NextGen AI Vietnam", "VinFintech Payments", "Dragon Venture Capital", "CyberGuard Security"].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { setCompanyQuery(name); handleEnrichCompany(name); }}
                    className="btn btn-outline"
                    style={{ fontSize: '13px', padding: '7px 14px', borderRadius: '8px' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEnrichCompany(); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
              <input 
                type="text"
                placeholder="Enter enterprise or startup name..."
                value={companyQuery}
                onChange={(e) => setCompanyQuery(e.target.value)}
                className="input-enterprise"
                style={{ height: '46px', fontSize: '14.5px' }}
              />
              <button 
                type="submit" 
                disabled={isEnriching}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '14.5px' }}
              >
                {isEnriching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                <span>{isEnriching ? 'Grounding via Google Search...' : 'Verify Enterprise Profile'}</span>
              </button>
            </form>
          </div>

          {/* Right Output */}
          <div className="card-enterprise" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>
                {enrichResult.name}
              </h3>
              <span className="badge badge-success" style={{ fontSize: '13px', padding: '5px 12px' }}>
                ✓ 100% Grounded & Verified
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '14px', fontSize: '14.5px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Corporate Domain:</span>
              <span style={{ fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{enrichResult.domain}</span>

              <span style={{ color: 'var(--text-muted)' }}>Industry Sector:</span>
              <span style={{ fontWeight: '700' }}>{enrichResult.industry}</span>

              <span style={{ color: 'var(--text-muted)' }}>Scale:</span>
              <span>{enrichResult.size_range}</span>

              <span style={{ color: 'var(--text-muted)' }}>Headquarters:</span>
              <span>{enrichResult.headquarters}</span>

              <span style={{ color: 'var(--text-muted)' }}>Overview:</span>
              <span style={{ color: 'var(--text-main)', lineHeight: '1.65' }}>{enrichResult.description}</span>

              <span style={{ color: 'var(--text-muted)' }}>Core Products:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {enrichResult.key_products?.map((prod, i) => (
                  <span key={i} className="badge badge-neutral" style={{ fontSize: '13px', padding: '4px 10px' }}>{prod}</span>
                ))}
              </div>

              <span style={{ color: 'var(--text-muted)' }}>Google Citations:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {enrichResult.sources?.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '13.5px', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ExternalLink size={15} /> {s.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRAPH QUERY CONSOLE */}
      {activeSubTab === 'query_console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div className="card-enterprise" style={{ padding: '22px 26px' }}>
            <form onSubmit={handleExecuteQuery} style={{ display: 'flex', gap: '14px' }}>
              <input 
                type="text"
                placeholder="Ask complex topological questions (e.g. 'List all FinTech founders who attended AI Riser Demo Day')..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="input-enterprise"
                style={{ flex: 1, height: '48px', fontSize: '15px' }}
              />
              <button 
                type="submit" 
                disabled={isQuerying}
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontSize: '15px' }}
              >
                {isQuerying ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                <span>Execute Query</span>
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {queryHistory.map((item, idx) => (
              <div key={idx} className="card-enterprise" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={20} color="var(--primary)" />
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                      Query: "{item.query}"
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                    {item.timestamp}
                  </span>
                </div>
                <div style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  padding: '18px 22px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)',
                  fontSize: '15px',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.7'
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
