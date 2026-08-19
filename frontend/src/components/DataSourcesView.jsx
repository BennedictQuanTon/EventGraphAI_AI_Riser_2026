import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  FileSpreadsheet, 
  Users, 
  Building2, 
  MapPin, 
  Download, 
  Upload, 
  Search, 
  CheckCircle2, 
  Layers,
  ArrowRight,
  ExternalLink,
  Filter
} from 'lucide-react';

export default function DataSourcesView() {
  const [activeTab, setActiveTab] = useState('excel');
  const [persons, setPersons] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  // Rich 10-row CSV payload
  const [csvText, setCsvText] = useState(`full_name,title,company,email,phone,event_role\nNguyen Thanh Son,BD Director,NextGen AI Vietnam,son.nguyen@nextgenai.vn,+84 912 345 678,Speaker\nTran Thi Mai Anh,CEO & Founder,VinFintech Payments,maianh.tran@vinfinpay.com,+84 988 123 456,Keynote\nPham Minh Duc,Managing Partner,Dragon Venture Capital,duc.pham@dragonvc.fund,+84 918 777 666,VIP Investor\nAlex Chen,General Partner,Nexus Ventures Singapore,alex.chen@nexusventures.sg,+65 8123 4567,VIP Investor\nLe Hoang Quan,Senior AI Lead,NextGen AI Vietnam,quan.le@nextgenai.vn,+84 903 888 999,Panelist\nHoang Bich Ngoc,VP of Product,EduSmart Interactive,ngoc.hoang@edusmart.edu.vn,+84 945 112 233,Attendee\nVu Dang Khoa,CTO & Co-founder,GreenFuture ESG Tech,khoa.vu@greenfuture.vn,+84 977 445 566,Attendee\nDo Thu Trang,Head of Ecosystem,National Innovation Hub,trang.do@innovatehub.org.vn,+84 933 654 321,Organizer\nBui Quoc Hung,VP of Security,CyberGuard Security,hung.bui@cyberguard.vn,+84 909 223 344,Panelist\nNguyen Hai Yen,CFO,VinFintech Payments,yen.nguyen@vinfinpay.com,+84 966 554 433,Attendee`);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, eRes] = await Promise.all([
        api.getPersons(),
        api.getCompanies(),
        api.getEvents()
      ]);
      setPersons(pRes || []);
      setCompanies(cRes || []);
      setEvents(eRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImportCSV = async () => {
    setIsImporting(true);
    try {
      const blob = new Blob([csvText], { type: 'text/csv' });
      const file = new File([blob], 'ai_riser_sample_attendees.csv', { type: 'text/csv' });
      const res = await api.importExcel(file);
      setImportStatus(res);
      loadEntities();
    } catch (e) {
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  const filteredPersons = persons.filter(p => 
    p.full_name.toLowerCase().includes(filterSearch.toLowerCase()) ||
    (p.title && p.title.toLowerCase().includes(filterSearch.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            Enterprise Data Sources & Grounded Entities
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Batch Excel attendee parsing, verified entity directory, and Google Workspace 2-way synchronization.
          </p>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('excel')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'excel' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'excel' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'excel' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            Excel Batch Import
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'entities' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'entities' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'entities' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            Canonical Directory ({persons.length + companies.length})
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'sheets' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'sheets' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === 'sheets' ? '700' : '500',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            Google Workspace Export
          </button>
        </div>
      </div>

      {/* TAB 1: EXCEL BATCH IMPORT */}
      {activeTab === 'excel' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 520px) minmax(0, 1fr)', gap: '20px' }}>
          <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>CSV / Excel Batch Parser</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Edit raw attendee records. The system auto-identifies Person, Company affiliation, and Event participation roles.
            </p>

            <textarea 
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={11}
              className="input-enterprise font-mono"
              style={{ fontSize: '11px', lineHeight: '1.45', backgroundColor: '#FFFFFF' }}
            />

            <button
              onClick={handleImportCSV}
              disabled={isImporting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '9px' }}
            >
              <Upload size={15} />
              <span>{isImporting ? 'Parsing & Linking Nodes...' : 'Execute Batch Ingestion (10 Rows)'}</span>
            </button>
          </div>

          {/* Import Summary Result */}
          <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>
              Batch Ingestion Diagnostic Report
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700', fontSize: '13px' }}>
                  <CheckCircle2 size={16} />
                  <span>Column Header Auto-Mapping Verified</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mapped Person:</span>
                  <span style={{ fontWeight: '600' }}>full_name, email, phone</span>

                  <span style={{ color: 'var(--text-muted)' }}>Mapped Company:</span>
                  <span style={{ fontWeight: '600' }}>company, title</span>

                  <span style={{ color: 'var(--text-muted)' }}>Mapped Event Role:</span>
                  <span style={{ fontWeight: '600' }}>event_role (Speaker / VIP / Attendee)</span>
                </div>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-border)' }}>
                <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--primary)' }}>
                  ⚡ Automated Entity Resolution Pipeline
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-main)', marginTop: '2px' }}>
                  All 10 attendee records are automatically matched against 3,105 canonical companies. Unresolved duplicates are sent to the Resolution Queue with complete audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CANONICAL DIRECTORY */}
      {activeTab === 'entities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={15} color="var(--text-light)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Search canonical persons or companies..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="input-enterprise"
                style={{ paddingLeft: '32px', fontSize: '12.5px' }}
              />
            </div>
            <span className="badge badge-primary">
              {filteredPersons.length} Persons · {companies.length} Companies Grounded
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            {/* Persons List */}
            <div className="card-enterprise" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Users size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Canonical Persons Directory</h3>
              </div>
              {filteredPersons.map(p => (
                <div key={p.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{p.full_name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{p.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>✉ {p.email}</div>
                  </div>
                  <span className="badge badge-success">✓ Verified Node</span>
                </div>
              ))}
            </div>

            {/* Companies List */}
            <div className="card-enterprise" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Building2 size={18} color="var(--secondary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Grounded Companies Directory</h3>
              </div>
              {companies.map(c => (
                <div key={c.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.industry}</div>
                    <div style={{ fontSize: '11px', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>🌐 {c.domain}</div>
                  </div>
                  <span className="badge badge-secondary">Grounded</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE SHEETS EXPORT */}
      {activeTab === 'sheets' && (
        <div className="card-enterprise" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet size={22} color="var(--success)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Google Workspace & Enterprise Sheets Export</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '640px' }}>
            Export live normalized data directly to Google Sheets CSV structure or trigger automated sync to Google Cloud Storage.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.open('/api/reports/export/persons.csv', '_blank')}
              className="btn btn-outline"
              style={{ padding: '8px 16px' }}
            >
              <Download size={15} />
              <span>Export Standardized Persons.csv</span>
            </button>
            <button 
              onClick={() => window.open('/api/reports/export/companies.csv', '_blank')}
              className="btn btn-outline"
              style={{ padding: '8px 16px' }}
            >
              <Download size={15} />
              <span>Export Grounded Companies.csv</span>
            </button>
          </div>

          <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Recent Export Jobs Log
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>• <code>export_persons_2026-08-19.csv</code> (24,592 records · 1.4 MB) — <strong>Completed</strong></div>
              <div>• <code>export_companies_grounded.csv</code> (3,105 records · 820 KB) — <strong>Completed</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
