import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Network, 
  Database, 
  GitMerge, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetDb, isResetting, queueCount = 12 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { id: 'graph', label: 'Graph View', icon: Network },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { 
      id: 'resolutions', 
      label: 'Resolutions', 
      icon: GitMerge, 
      badge: queueCount > 0 ? queueCount : 12 
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar-container">
      {/* Brand Header */}
      <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 82, 204, 0.28)'
          }}>
            <Network size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: '1.2', fontFamily: 'var(--font-sans)' }}>
              EventGraph <span style={{ color: 'var(--primary)' }}>AI</span>
            </h1>
            <p style={{ fontSize: '10.5px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--gold)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Enterprise Node
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setActiveTab('intelligence')}
          style={{
            width: '100%',
            marginTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 16px',
            borderRadius: '10px',
            backgroundColor: 'var(--secondary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '14px',
            border: 'none',
            boxShadow: '0 3px 8px rgba(255, 140, 0, 0.25)',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Ingestion</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-light)', padding: '6px 12px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
          Navigation
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  textAlign: 'left',
                  fontSize: '14.5px',
                  fontWeight: isActive ? '800' : '600',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} color={isActive ? 'var(--primary)' : 'var(--text-light)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid var(--secondary-border)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <HelpCircle size={17} />
          <span>Documentation & Spec</span>
        </button>
        <button
          onClick={onResetDb}
          disabled={isResetting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--tertiary)',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <LogOut size={17} />
          <span>{isResetting ? 'Resetting Data...' : 'Reset Canonical Data'}</span>
        </button>
      </div>
    </aside>
  );
}
