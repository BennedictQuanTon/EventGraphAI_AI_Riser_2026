import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { 
  GitMerge, 
  Check, 
  X, 
  Building2, 
  User, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  Split,
  History
} from 'lucide-react';

export default function ResolutionQueueView({ onDecisionMade }) {
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue' or 'audit'
  const [queue, setQueue] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dense, high-fidelity mock data for pending queue (3 distinct realistic comparisons)
  const [pendingItems, setPendingItems] = useState([
    {
      id: "res-demo-1",
      entity_type: "company",
      similarity_score: 0.92,
      matched_rule: "Corporate Email Domain & Token Alignment",
      explanation: "Matching corporate domain 'nextgenai.vn' with high token overlap in company headquarters location (Floor 12, Keangnam Landmark 72, Hanoi).",
      source_name: "TechViet Solutions Ltd (NextGen AI)",
      matched_candidate_name: "NextGen AI Vietnam",
      payload_data: {
        external_id: "EXT-992-CRM",
        domain: "nextgenai.vn",
        address: "Floor 12, Keangnam Landmark 72, Hanoi",
        rep: "Nguyen Thanh Son",
        industry: "Artificial Intelligence & Analytics"
      },
      canonical_data: {
        node_id: "N-441-89X",
        domain: "nextgenai.vn",
        address: "Keangnam Landmark 72, Hanoi",
        rep: "Nguyen Thanh Son (Verified BD Director)",
        edges_count: 14
      }
    },
    {
      id: "res-demo-2",
      entity_type: "person",
      similarity_score: 0.96,
      matched_rule: "Fuzzy Name Permutation & Phone Hash Match",
      explanation: "High Jaro-Winkler string similarity (0.96) between 'Son Nguyen Thanh' and 'Nguyen Thanh Son' with exact match on mobile contact (+84 912 345 678).",
      source_name: "Son Nguyen Thanh (Son NT)",
      matched_candidate_name: "Nguyen Thanh Son",
      payload_data: {
        external_id: "CSV-ROW-104",
        domain: "nextgenai.vn",
        address: "Hanoi Innovation Center",
        rep: "BD Director",
        industry: "AI Solutions"
      },
      canonical_data: {
        node_id: "P-882-01A",
        domain: "nextgenai.vn",
        address: "Keangnam Landmark 72, Hanoi",
        rep: "Nguyen Thanh Son (Speaker at 3 Summits)",
        edges_count: 8
      }
    },
    {
      id: "res-demo-3",
      entity_type: "company",
      similarity_score: 0.94,
      matched_rule: "Legal Suffix Normalization & Domain Rule",
      explanation: "Exact domain match 'vinfinpay.com' with stripped legal suffix 'JSC' matching canonical node 'VinFintech Payments'.",
      source_name: "VinFin Payments JSC",
      matched_candidate_name: "VinFintech Payments",
      payload_data: {
        external_id: "LEAD-FIN-088",
        domain: "vinfinpay.com",
        address: "District 1, Ho Chi Minh City",
        rep: "Tran Thi Mai Anh",
        industry: "Financial Technology (FinTech)"
      },
      canonical_data: {
        node_id: "N-102-FIN",
        domain: "vinfinpay.com",
        address: "The Loop Hub, D1, HCMC",
        rep: "Tran Thi Mai Anh (CEO & Founder)",
        edges_count: 18
      }
    }
  ]);

  // Rich Audit History logs (6 items)
  const [resolvedLogs, setResolvedLogs] = useState([
    {
      id: "log-1",
      timestamp: "10:45 AM",
      source: "Mai Anh Tran (VinPay)",
      matched_with: "Tran Thi Mai Anh",
      score: 95,
      rule: "Email & Org Match",
      decision: "Merged"
    },
    {
      id: "log-2",
      timestamp: "09:30 AM",
      source: "VinFin Payments JSC",
      matched_with: "VinFintech Payments",
      score: 94,
      rule: "Legal Suffix Normalization",
      decision: "Auto-merged"
    },
    {
      id: "log-3",
      timestamp: "Yesterday",
      source: "Alex C. (Venture Partner)",
      matched_with: "Alex Chen",
      score: 98,
      rule: "Exact Email Match",
      decision: "Auto-merged"
    },
    {
      id: "log-4",
      timestamp: "Yesterday",
      source: "Arthur Vance Advisory",
      matched_with: "None (Novel Entity)",
      score: 38,
      rule: "Novel Entity Isolation Rule",
      decision: "Split"
    },
    {
      id: "log-5",
      timestamp: "18/08/2026",
      source: "Pham M. Duc (Angel)",
      matched_with: "Pham Minh Duc",
      score: 96,
      rule: "Phone & Entity Alignment",
      decision: "Merged"
    }
  ]);

  const handleApprove = (id) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setResolvedLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        source: "Operator Approved Match",
        matched_with: "Canonical Graph Node",
        score: 95,
        rule: "Manual Operator Verification",
        decision: "Merged"
      },
      ...prev
    ]);
    if (onDecisionMade) onDecisionMade();
  };

  const handleSeparate = (id) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setResolvedLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: "Just now",
        source: "Isolated New Entity",
        matched_with: "None (Split Entity)",
        score: 42,
        rule: "Operator Split Rule",
        decision: "Split"
      },
      ...prev
    ]);
    if (onDecisionMade) onDecisionMade();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header matching Image 3 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Critical Workflow
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            Entity Resolution Audit Queue
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '640px' }}>
            Review AI-proposed entity merges. Decisions directly update the Enterprise Knowledge Graph topology.
          </p>
        </div>

        {/* Counter Pills & Sub-tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="card-enterprise" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Pending Review
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary)', fontFamily: 'var(--font-headline)' }}>
                {pendingItems.length} Records
              </div>
            </div>
            <div style={{ width: '1px', height: '26px', backgroundColor: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Resolved (Today)
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--success)', fontFamily: 'var(--font-headline)' }}>
                {142 + (3 - pendingItems.length)} Records
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '8px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveSubTab('queue')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeSubTab === 'queue' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'queue' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'queue' ? '700' : '500',
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          Active Comparison Queue ({pendingItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: activeSubTab === 'audit' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'audit' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'audit' ? '700' : '500',
            fontSize: '12.5px',
            cursor: 'pointer'
          }}
        >
          Audit Trail History ({resolvedLogs.length})
        </button>
      </div>

      {activeSubTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingItems.length === 0 ? (
            <div className="card-enterprise" style={{ padding: '48px', textAlign: 'center' }}>
              <ShieldCheck size={36} color="var(--success)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                All Entity Resolution Queues Clear
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                100% of candidate profiles have been resolved into canonical graph entities.
              </p>
            </div>
          ) : (
            pendingItems.map((item) => {
              const scorePercent = Math.round(item.similarity_score * 100);
              const isCompany = item.entity_type === 'company';

              return (
                <div key={item.id} className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Proposal Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--secondary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={16} color="var(--secondary)" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                            Proposed Merge: {isCompany ? 'Business Account Match' : 'Executive Profile Match'}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--secondary)',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            Similarity Score: {scorePercent}%
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          • Rule: {item.matched_rule}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handleSeparate(item.id)}
                        className="btn btn-outline"
                        style={{ padding: '8px 14px', fontSize: '13px' }}
                      >
                        <Split size={14} />
                        <span>Separate (Dismiss)</span>
                      </button>

                      <button
                        onClick={() => handleApprove(item.id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px' }}
                      >
                        <GitMerge size={15} />
                        <span>Approve Merge</span>
                      </button>
                    </div>
                  </div>

                  {/* Two Column Side-by-Side Comparison (Exact Layout of Image 3) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Left Column: Incoming Record */}
                    <div style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isCompany ? <Building2 size={16} color="var(--text-muted)" /> : <User size={16} color="var(--text-muted)" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                              {item.source_name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                              ID: {item.payload_data?.external_id || 'EXT-992-CRM'}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-secondary">
                          Incoming Record (CRM)
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px', fontSize: '12.5px', marginTop: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Email Domain:</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                          {item.payload_data?.domain || 'nextgenai.vn'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.payload_data?.address || 'Floor 12, Keangnam Landmark 72, Hanoi'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Representative:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                          {item.payload_data?.rep || 'Nguyen Thanh Son'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Industry:</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.payload_data?.industry || 'Artificial Intelligence & Analytics'}
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Canonical Graph Entity */}
                    <div style={{
                      padding: '16px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--primary-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--primary-light)',
                            border: '1px solid var(--primary-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Layers size={16} color="var(--primary)" />
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                              {item.matched_candidate_name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                              Node ID: {item.canonical_data?.node_id || 'N-441-89X'}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-primary">
                          Canonical Graph Entity
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '6px', fontSize: '12.5px', marginTop: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Email Domain:</span>
                        <span style={{ fontWeight: '600', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                          {item.canonical_data?.domain || 'nextgenai.vn'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.canonical_data?.address || 'Keangnam Landmark 72, Hanoi'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Representative:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                          {item.canonical_data?.rep || 'Nguyen Thanh Son (Verified BD Director)'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Connections:</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                          🔗 {item.canonical_data?.edges_count || 14} Graph Edges
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: AUDIT TRAIL LOGS */}
      {activeSubTab === 'audit' && (
        <div className="card-enterprise" style={{ padding: '20px 24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Timestamp</th>
                <th style={{ padding: '10px 12px' }}>Incoming Source Entity</th>
                <th style={{ padding: '10px 12px' }}>Matched Canonical Node</th>
                <th style={{ padding: '10px 12px' }}>Similarity</th>
                <th style={{ padding: '10px 12px' }}>Resolution Rule</th>
                <th style={{ padding: '10px 12px' }}>Status Decision</th>
              </tr>
            </thead>
            <tbody>
              {resolvedLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: '12px 12px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {log.source}
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--primary)', fontWeight: '600' }}>
                    {log.matched_with}
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                    {log.score}%
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {log.rule}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span className={log.decision === 'Merged' || log.decision === 'Auto-merged' ? 'badge badge-success' : 'badge badge-secondary'}>
                      {log.decision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
