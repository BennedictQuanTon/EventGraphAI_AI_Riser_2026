import React from 'react';
import { Sparkles, Cloud, CheckCircle2, ShieldCheck, Zap, Camera } from 'lucide-react';

export default function Header({ tenantName = 'Demo Innovation Hub', onOpenScan }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      paddingBottom: '20px',
      marginBottom: '24px',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#60A5FA',
            fontWeight: '700',
            background: 'rgba(59, 130, 246, 0.12)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            Multi-Tenant Organization
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '11px', fontWeight: '500' }}>
            <CheckCircle2 size={13} />
            <span>Đã kết nối</span>
          </div>
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#FFFFFF', marginTop: '4px' }}>
          {tenantName}
        </h2>
      </div>

      {/* Google Tech Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '12px',
          color: '#E2E8F0'
        }}>
          <Sparkles size={14} color="#8B5CF6" />
          <span>Gemini 2.5/3 Pro</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '12px',
          color: '#E2E8F0'
        }}>
          <Cloud size={14} color="#3B82F6" />
          <span>Google Cloud Run</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '12px',
          color: '#34D399',
          fontWeight: '600'
        }}>
          <Zap size={14} color="#10B981" />
          <span>Zero-Cost Mode</span>
        </div>

        <button
          onClick={onOpenScan}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}
        >
          <Camera size={16} />
          <span>Quét Card Ngay</span>
        </button>
      </div>
    </header>
  );
}
