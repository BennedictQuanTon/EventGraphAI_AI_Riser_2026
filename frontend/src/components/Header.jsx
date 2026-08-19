import React from 'react';
import { Search, Building, Camera, Bell, User, Sparkles, Command } from 'lucide-react';

export default function Header({ 
  tenantName = 'Enterprise Innovation Node 01', 
  onOpenScan,
  onOpenTenantSwitcher,
  searchQuery = '',
  onSearchChange
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      padding: '14px 0 20px',
      marginBottom: '20px',
      borderBottom: '1px solid var(--border-color)',
      flexWrap: 'wrap'
    }}>
      {/* Global Search Bar (Expanded & Clean) */}
      <div style={{ position: 'relative', flex: '1', maxWidth: '480px' }}>
        <Search 
          size={17} 
          color="#94A3B8" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          placeholder="Search entities, partners, summits, companies..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="input-enterprise"
          style={{
            paddingLeft: '38px',
            paddingRight: '60px',
            fontSize: '14px',
            backgroundColor: 'var(--bg-muted)',
            height: '42px',
            borderRadius: '10px'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '2px 6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-light)'
        }}>
          ⌘K
        </div>
      </div>

      {/* Right Controls (Simplified & Professional) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Gemini Engine Active Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '9999px',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          fontSize: '12.5px',
          fontWeight: '700',
          color: 'var(--primary)'
        }}>
          <Sparkles size={14} color="var(--primary)" />
          <span>Gemini 2.5/3 Pro Active</span>
        </div>

        {/* Tenant Switcher Button */}
        <button
          onClick={onOpenTenantSwitcher}
          className="btn btn-outline"
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: '8px', height: '40px' }}
        >
          <Building size={15} color="var(--primary)" />
          <span>{tenantName}</span>
        </button>

        {/* Scan Card Button (Orange CTA) */}
        <button
          onClick={onOpenScan}
          className="btn btn-secondary"
          style={{ padding: '8px 18px', fontSize: '13.5px', borderRadius: '8px', height: '40px' }}
        >
          <Camera size={16} />
          <span>Scan Card</span>
        </button>

        {/* User Profile Avatar */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '13px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0, 82, 204, 0.3)'
        }}>
          AD
        </div>
      </div>
    </header>
  );
}
