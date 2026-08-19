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
  ExternalLink
} from 'lucide-react';

export default function DataSourcesView() {
  const [activeTab, setActiveTab] = useState('excel'); // 'excel', 'entities', 'sheets', 'maps'
  const [persons, setPersons] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Excel Upload State
  const [csvText, setCsvText] = useState(`full_name,title,company,email,phone\nNguyen Van A,CTO,TechCorp VN,a.nguyen@techcorp.vn,0901234567\nTran Thi B,Director,Alpha Group,b.tran@alpha.vn,0912345678\nLe Van C,AI Architect,Innovate Lab,c.le@innovate.vn,0987654321`);
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
      const file = new File([blob], 'sample_events_history.csv', { type: 'text/csv' });
      const res = await api.importExcel(file);
      setImportStatus(res);
      loadEntities();
    } catch (e) {
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            Data Sources & Enterprise Records
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage batch Excel imports, explore canonical Person/Company records, and sync with Google Workspace.
          </p>
        </div>

        {/* Sub-tabs */}
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
            Entity Directory ({persons.length + companies.length})
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
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 480px) minmax(0, 1fr)', gap: '20px' }}>
          <div className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: '700' }}>CSV / Excel Payload</h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Paste or edit attendee rows. Column headers are automatically mapped to Person, Company, and Event relations.
            </p>

            <textarea 
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              className="input-enterprise font-mono"
              style={{ fontSize: '11.5px', lineHeight: '1.4' }}
            />

            <button
              onClick={handleImportCSV}
              disabled={isImporting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '9px' }}
            >
              <Upload size={15} />
              <span>{isImporting ? 'Ingesting Records...' : 'Execute Batch Import'}</span>
            </button>
          </div>

          {/* Import Summary Result */}
          <div className="card-enterprise" style={{ padding: '20px 24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
              Ingestion Execution Log
            </h3>
            {importStatus ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '700' }}>
                  <CheckCircle2 size={18} />
                  <span>Batch Ingestion Completed Successfully</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Processed:</span>
                  <span style={{ fontWeight: '700' }}>{importStatus.total_rows || 3} rows</span>

                  <span style={{ color: 'var(--text-muted)' }}>Entities Resolved:</span>
                  <span>{importStatus.created_persons || 3} persons, {importStatus.created_companies || 3} companies</span>

                  <span style={{ color: 'var(--text-muted)' }}>Audit Log:</span>
                  <span style={{ color: 'var(--primary)' }}>Generated Entity Resolution entries</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Click "Execute Batch Import" to test batch ingestion.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ENTITIES DIRECTORY */}
      {activeTab === 'entities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Persons List */}
          <div className="card-enterprise" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Persons ({persons.length})</h3>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {persons.map(p => (
                <div key={p.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{p.full_name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{p.title || 'Executive'}</div>
                  </div>
                  <span className="badge badge-primary">Canonical</span>
                </div>
              ))}
            </div>
          </div>

          {/* Companies List */}
          <div className="card-enterprise" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--secondary)" />
                <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Companies ({companies.length})</h3>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {companies.map(c => (
                <div key={c.id} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.industry || 'Technology'}</div>
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
        <div className="card-enterprise" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <FileSpreadsheet size={22} color="var(--success)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Google Workspace & Sheets Synchronization</h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px', maxWidth: '640px' }}>
            Export the unified Enterprise Knowledge Graph to Google Sheets format or download standardized CSV files for offline analytics.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.open('/api/reports/export/persons.csv', '_blank')}
              className="btn btn-outline"
            >
              <Download size={14} />
              <span>Export Persons.csv</span>
            </button>
            <button 
              onClick={() => window.open('/api/reports/export/companies.csv', '_blank')}
              className="btn btn-outline"
            >
              <Download size={14} />
              <span>Export Companies.csv</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
