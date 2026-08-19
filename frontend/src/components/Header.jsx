import React from 'react';
import { Search, Building, Camera, Bell, User } from 'lucide-react';

export default function Header({ 
  activeSubTab = 'workspace', 
  onSelectSubTab, 
  tenantName = 'Enterprise Node 01', 
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
      gap: '16px',
      padding: '16px 0',
      marginBottom: '20px',
      borderBottom: '1px solid var(--border-color)',
      flexWrap: 'wrap'
    }}>
      {/* Sub-navigation & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1 1 400px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onSelectSubTab && onSelectSubTab('workspace')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: activeSubTab === 'workspace' ? '700' : '500',
              color: activeSubTab === 'workspace' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'workspace' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '6px',
              cursor: 'pointer'
            }}
          >
            Workspace
          </button>
          <button
            onClick={() => onSelectSubTab && onSelectSubTab('network')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: activeSubTab === 'network' ? '700' : '500',
              color: activeSubTab === 'network' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'network' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '6px',
              cursor: 'pointer'
            }}
          >
            Network
          </button>
          <button
            onClick={() => onSelectSubTab && onSelectSubTab('audit')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: activeSubTab === 'audit' ? '700' : '500',
              color: activeSubTab === 'audit' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'audit' ? '2px solid var(--primary)' : '2px solid transparent',
              paddingBottom: '6px',
              cursor: 'pointer'
            }}
          >
            Audit
          </button>
        </div>

        {/* Global Search Input */}
        <div style={{ position: 'relative', flex: '1', maxWidth: '360px' }}>
          <Search 
            size={16} 
            color="var(--text-light)" 
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            placeholder="Search entities, partners, events..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '7px 12px 7px 34px',
              fontSize: '13px',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Tenant Switcher Button */}
        <button
          onClick={onOpenTenantSwitcher}
          className="btn btn-outline"
          style={{ padding: '7px 12px', fontSize: '12.5px', borderRadius: '8px' }}
        >
          <Building size={14} color="var(--primary)" />
          <span>Tenant Switcher</span>
        </button>

        {/* Scan Card Button (Orange) */}
        <button
          onClick={onOpenScan}
          className="btn btn-secondary"
          style={{ padding: '7px 14px', fontSize: '12.5px', borderRadius: '8px' }}
        >
          <Camera size={14} />
          <span>Scan Card</span>
        </button>

        {/* Notification Bell */}
        <button
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={16} color="var(--text-muted)" />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger)'
          }} />
        </button>

        {/* User Avatar */}
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-muted)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <User size={16} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}
