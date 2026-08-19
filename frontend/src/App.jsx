import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import IntelligenceView from './components/IntelligenceView';
import GraphView from './components/GraphView';
import DataSourcesView from './components/DataSourcesView';
import ResolutionQueueView from './components/ResolutionQueueView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenantInfo, setTenantInfo] = useState({ tenant_name: 'Enterprise Node 01' });
  const [queueCount, setQueueCount] = useState(12);
  const [isResetting, setIsResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTenantAndQueue();
  }, []);

  const loadTenantAndQueue = async () => {
    try {
      const [tRes, qRes] = await Promise.all([
        api.getCurrentTenant().catch(() => ({ tenant_name: 'Enterprise Node 01' })),
        api.getResolutionQueue().catch(() => [])
      ]);
      setTenantInfo(tRes || { tenant_name: 'Enterprise Node 01' });
      setQueueCount(qRes?.length || 12);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Are you sure you want to reset and re-seed the canonical dataset?')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetDatabase();
      await loadTenantAndQueue();
      alert('Canonical dataset re-seeded successfully.');
      window.location.reload();
    } catch (e) {
      alert('Failed to reset dataset.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDb={handleResetDb}
        isResetting={isResetting}
        queueCount={queueCount}
      />

      {/* Main Content Viewport */}
      <main className="main-viewport">
        <div className="content-body">
          {/* Unified Clean Top Header */}
          <Header
            tenantName={tenantInfo.tenant_name}
            onOpenScan={() => setActiveTab('intelligence')}
            onOpenTenantSwitcher={() => setActiveTab('settings')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Active View */}
          <div style={{ transition: 'opacity 0.15s ease-in-out' }}>
            {activeTab === 'dashboard' && (
              <OverviewView
                setActiveTab={setActiveTab}
                onOpenScan={() => setActiveTab('intelligence')}
              />
            )}

            {activeTab === 'intelligence' && (
              <IntelligenceView
                onIngestionComplete={() => { loadTenantAndQueue(); }}
              />
            )}

            {activeTab === 'graph' && (
              <GraphView />
            )}

            {activeTab === 'datasources' && (
              <DataSourcesView />
            )}

            {activeTab === 'resolutions' && (
              <ResolutionQueueView
                onDecisionMade={() => { loadTenantAndQueue(); }}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                onResetDb={handleResetDb}
                isResetting={isResetting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
