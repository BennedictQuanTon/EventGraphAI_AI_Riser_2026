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
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0, 82, 204, 0.25)'
          }}>
            <Network size={20} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: '1.2' }}>
              EventGraph AI
            </h1>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Enterprise Node
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setActiveTab('intelligence')}
          style={{
            width: '100%',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '9px 14px',
            borderRadius: '8px',
            backgroundColor: 'var(--secondary)',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: '13px',
            border: 'none',
            boxShadow: '0 2px 4px rgba(255, 140, 0, 0.2)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    backgroundColor: 'var(--secondary-light)',
                    color: 'var(--secondary)',
                    fontSize: '11px',
                    fontWeight: '700',
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
      <div style={{ padding: '14px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          <HelpCircle size={16} />
          <span>Documentation & Help</span>
        </button>
        <button
          onClick={onResetDb}
          disabled={isResetting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--tertiary)',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          <LogOut size={16} />
          <span>{isResetting ? 'Resetting Data...' : 'Reset Canonical Data'}</span>
        </button>
      </div>
    </aside>
  );
}
