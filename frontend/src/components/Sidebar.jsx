import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Building2, 
  FileSpreadsheet, 
  GitMerge, 
  Users, 
  Calendar, 
  Network, 
  Sparkles, 
  MessageSquare, 
  MapPin, 
  FileText, 
  RefreshCw,
  Award
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onResetDb, isResetting, queueCount = 0 }) {
  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'graph', label: 'Đồ thị quan hệ', icon: Network, highlight: true },
    { id: 'scan_card', label: 'Scan Card Visit', icon: Camera },
    { id: 'add_company', label: 'Thêm Doanh Nghiệp', icon: Building2 },
    { id: 'import_excel', label: 'Import Excel Sự Kiện', icon: FileSpreadsheet },
    { 
      id: 'resolution_queue', 
      label: 'Hàng đợi chuẩn hóa', 
      icon: GitMerge, 
      badge: queueCount > 0 ? queueCount : null 
    },
    { id: 'persons', label: 'Danh sách Người', icon: Users },
    { id: 'companies', label: 'Danh sách Công ty', icon: Building2 },
    { id: 'events', label: 'Danh sách Sự kiện', icon: Calendar },
    { id: 'insight_agent', label: 'Insight Agent', icon: Sparkles, highlight: true },
    { id: 'chat_assistant', label: 'Trợ lý Chat RAG', icon: MessageSquare, highlight: true },
    { id: 'maps', label: 'Bản đồ hệ sinh thái', icon: MapPin },
    { id: 'reports', label: 'Báo cáo & Minh chứng', icon: FileText }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)'
          }}>
            <Network size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: '#ffffff' }}>
              EventGraph <span style={{ color: '#60A5FA' }}>AI</span>
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              #BuildwithGoogleAI 2026
            </p>
          </div>
        </div>

        {/* AI Riser Tier Badge */}
        <div style={{
          marginTop: '14px',
          padding: '6px 10px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Award size={14} color="#F59E0B" />
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#FCD34D' }}>
            Mục tiêu Hạng Vàng / Bạch Kim
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '6px 12px', fontWeight: '600' }}>
          Menu Điều Hướng
        </div>
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
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
                  background: isActive 
                    ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.05) 100%)' 
                    : 'transparent',
                  color: isActive ? '#60A5FA' : 'var(--text-secondary)',
                  textAlign: 'left',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? '#60A5FA' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    background: '#EF4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#3B82F6',
                    opacity: 0.8
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(5, 9, 17, 0.8)' }}>
        <button
          onClick={onResetDb}
          disabled={isResetting}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: '500'
          }}
        >
          <RefreshCw size={13} className={isResetting ? 'animate-spin' : ''} />
          {isResetting ? 'Đang nạp lại...' : 'Tái nạp Demo Data'}
        </button>
      </div>
    </aside>
  );
}
