const API_BASE = '/api';

export const api = {
  // Auth & Tenant
  getTenants: () => fetch(`${API_BASE}/auth/tenants`).then(r => r.json()),
  getCurrentTenant: () => fetch(`${API_BASE}/auth/current`).then(r => r.json()),

  // Ingest
  scanCard: (formData) => 
    fetch(`${API_BASE}/ingest/card`, { method: 'POST', body: formData }).then(r => r.json()),
  
  enrichCompany: (data) =>
    fetch(`${API_BASE}/ingest/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  previewExcel: (formData) =>
    fetch(`${API_BASE}/ingest/excel/preview`, { method: 'POST', body: formData }).then(r => r.json()),

  importExcelBatch: (formData) =>
    fetch(`${API_BASE}/ingest/excel/batch`, { method: 'POST', body: formData }).then(r => r.json()),

  // Entities
  getPersons: (search = '', eventId = '') =>
    fetch(`${API_BASE}/entities/persons?search=${encodeURIComponent(search)}&event_id=${encodeURIComponent(eventId)}`).then(r => r.json()),
  
  getPersonDetail: (id) =>
    fetch(`${API_BASE}/entities/persons/${id}`).then(r => r.json()),

  getCompanies: (search = '', industry = '') =>
    fetch(`${API_BASE}/entities/companies?search=${encodeURIComponent(search)}&industry=${encodeURIComponent(industry)}`).then(r => r.json()),
  
  getCompanyDetail: (id) =>
    fetch(`${API_BASE}/entities/companies/${id}`).then(r => r.json()),

  getEvents: () =>
    fetch(`${API_BASE}/entities/events`).then(r => r.json()),

  getEventDetail: (id) =>
    fetch(`${API_BASE}/entities/events/${id}`).then(r => r.json()),

  createEvent: (data) =>
    fetch(`${API_BASE}/entities/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Resolution & Audit
  getResolutionQueue: () =>
    fetch(`${API_BASE}/resolution/queue`).then(r => r.json()),

  getResolutionLogs: () =>
    fetch(`${API_BASE}/resolution/logs`).then(r => r.json()),

  submitResolutionDecision: (logId, decision, mergeIntoId = null) =>
    fetch(`${API_BASE}/resolution/${logId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, merge_into_id: mergeIntoId })
    }).then(r => r.json()),

  // Graph
  getGraphTopology: () =>
    fetch(`${API_BASE}/graph/topology`).then(r => r.json()),

  // Insight Agent
  recommendGuests: (data) =>
    fetch(`${API_BASE}/insight/recommend-guests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Chat RAG
  askChat: (query, history = []) =>
    fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history })
    }).then(r => r.json()),

  // Export
  getExportCsvUrl: () => `${API_BASE}/export/csv`,

  // Feedback (Gold Tier Proof)
  getFeedbacks: () => fetch(`${API_BASE}/feedback`).then(r => r.json()),
  submitFeedback: (data) =>
    fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Reset / Seed
  resetDatabase: () =>
    fetch(`${API_BASE}/seed/reset`, { method: 'POST' }).then(r => r.json())
};
