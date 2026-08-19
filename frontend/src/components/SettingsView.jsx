import React, { useState } from 'react';
import { Settings, Building, Key, Database, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export default function SettingsView({ onResetDb, isResetting }) {
  const [tenantName, setTenantName] = useState('Enterprise Innovation Node 01');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
          Enterprise System Settings
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Configure multi-tenant organization parameters, Google AI Studio credentials, and vector topology settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="card-enterprise" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Tenant Configuration */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Tenant & Node Identifier</h4>
          </div>
          <input 
            type="text" 
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            className="input-enterprise" 
          />
        </div>

        {/* Gemini API Key */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Key size={16} color="var(--secondary)" />
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Google AI Studio / Gemini API Key</h4>
          </div>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input-enterprise font-mono" 
          />
        </div>

        {/* Model Selection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Google AI Model Architecture</h4>
          </div>
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            className="input-enterprise"
          >
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Multimodal & Fast RAG)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning & Search Grounding)</option>
            <option value="gemini-2.5-pro">Gemini 2.5/3 Pro (Enterprise Knowledge Graph Mode)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px' }}>
            Save Configuration
          </button>
          {saved && (
            <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Saved successfully!
            </span>
          )}
        </div>
      </form>

      {/* Database Diagnostics */}
      <div className="card-enterprise" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={16} color="var(--tertiary)" />
          <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Database Diagnostics & Seeding</h4>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
          Reset local database state and re-seed canonical enterprise entities (Persons, Companies, and Events).
        </p>
        <button
          type="button"
          onClick={onResetDb}
          disabled={isResetting}
          className="btn btn-outline"
          style={{ alignSelf: 'flex-start', color: 'var(--tertiary)' }}
        >
          <RefreshCw size={14} className={isResetting ? 'animate-spin' : ''} />
          <span>{isResetting ? 'Resetting...' : 'Re-seed Canonical Dataset'}</span>
        </button>
      </div>
    </div>
  );
}
