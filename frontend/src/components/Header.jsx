import React from 'react';
import { Search, Camera, User } from 'lucide-react';

export default function Header({ 
  onOpenScan,
  searchQuery = '',
  onSearchChange
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      padding: '16px 0 22px',
      marginBottom: '24px',
      borderBottom: '1px solid var(--border-color)'
    }}>
      {/* Global Search Bar (Spacious & Clean) */}
      <div style={{ position: 'relative', flex: '1', maxWidth: '560px' }}>
        <Search 
          size={18} 
          color="#64748B" 
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          placeholder="Search entities, partners, summits, companies..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="input-enterprise"
          style={{
            paddingLeft: '44px',
            paddingRight: '64px',
            fontSize: '15px',
            backgroundColor: '#FFFFFF',
            height: '46px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--bg-muted)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '3px 7px',
          fontSize: '11.5px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-light)',
          fontWeight: '700'
        }}>
          ⌘K
        </div>
      </div>

      {/* Right Controls: Only Scan Card CTA & User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Scan Card Button (Vibrant Orange CTA) */}
        <button
          onClick={onOpenScan}
          className="btn btn-secondary"
          style={{ 
            padding: '10px 22px', 
            fontSize: '15px', 
            borderRadius: '10px', 
            height: '46px',
            fontWeight: '700',
            boxShadow: '0 3px 10px rgba(255, 140, 0, 0.28)'
          }}
        >
          <Camera size={18} />
          <span>Scan Card</span>
        </button>

        {/* User Profile Avatar */}
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
          boxShadow: '0 3px 8px rgba(0, 82, 204, 0.28)'
        }}>
          AD
        </div>
      </div>
    </header>
  );
}
