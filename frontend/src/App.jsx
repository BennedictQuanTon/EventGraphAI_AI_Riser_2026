import React, { useState, useEffect } from 'react';
import { api } from './api';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import GraphView from './components/GraphView';
import ScanCardView from './components/ScanCardView';
import AddCompanyView from './components/AddCompanyView';
import ImportExcelView from './components/ImportExcelView';
import ResolutionQueueView from './components/ResolutionQueueView';
import PersonsView from './components/PersonsView';
import CompaniesView from './components/CompaniesView';
import EventsView from './components/EventsView';
import InsightAgentView from './components/InsightAgentView';
import ChatAssistantView from './components/ChatAssistantView';
import MapsView from './components/MapsView';
import ReportsView from './components/ReportsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tenantInfo, setTenantInfo] = useState({ tenant_name: 'Demo Innovation Hub' });
  const [queueCount, setQueueCount] = useState(1);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadTenantAndQueue();
  }, []);

  const loadTenantAndQueue = async () => {
    try {
      const [tRes, qRes] = await Promise.all([
        api.getCurrentTenant(),
        api.getResolutionQueue()
      ]);
      setTenantInfo(tRes);
      setQueueCount(qRes.length || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn nạp lại dữ liệu mẫu tiếng Việt chuẩn cho hệ sinh thái?')) {
      return;
    }
    setIsResetting(true);
    try {
      await api.resetDatabase();
      await loadTenantAndQueue();
      alert('Đã tái tạo cơ sở dữ liệu và nạp dữ liệu mẫu thành công!');
      window.location.reload();
    } catch (e) {
      alert('Lỗi khi nạp lại dữ liệu.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDb={handleResetDb}
        isResetting={isResetting}
        queueCount={queueCount}
      />

      {/* Main Content Pane */}
      <main className="main-content">
        <Header
          tenantName={tenantInfo.tenant_name}
          onOpenScan={() => setActiveTab('scan_card')}
        />

        {/* Dynamic Views */}
        <div style={{ transition: 'opacity 0.2s ease-in-out' }}>
          {activeTab === 'overview' && (
            <OverviewView
              setActiveTab={setActiveTab}
              onOpenScan={() => setActiveTab('scan_card')}
            />
          )}

          {activeTab === 'graph' && <GraphView />}

          {activeTab === 'scan_card' && (
            <ScanCardView onFinish={() => { loadTenantAndQueue(); }} />
          )}

          {activeTab === 'add_company' && (
            <AddCompanyView onAdded={() => { loadTenantAndQueue(); }} />
          )}

          {activeTab === 'import_excel' && (
            <ImportExcelView onImportComplete={() => { loadTenantAndQueue(); }} />
          )}

          {activeTab === 'resolution_queue' && (
            <ResolutionQueueView onDecisionMade={() => { loadTenantAndQueue(); }} />
          )}

          {activeTab === 'persons' && <PersonsView />}

          {activeTab === 'companies' && <CompaniesView />}

          {activeTab === 'events' && <EventsView />}

          {activeTab === 'insight_agent' && <InsightAgentView />}

          {activeTab === 'chat_assistant' && <ChatAssistantView />}

          {activeTab === 'maps' && <MapsView />}

          {activeTab === 'reports' && <ReportsView />}
        </div>
      </main>
    </div>
  );
}
