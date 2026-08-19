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

  // Rich Audit History logs (5 items)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-secondary" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '12px', padding: '4px 10px' }}>
              Critical Workflow
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Entity Resolution Audit Queue
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '720px' }}>
            Review AI-proposed entity merges. Decisions directly update the Enterprise Knowledge Graph topology.
          </p>
        </div>

        {/* Counter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="card-enterprise" style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Pending Review
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--secondary)', fontFamily: 'var(--font-headline)' }}>
                {pendingItems.length} Records
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Resolved (Today)
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--success)', fontFamily: 'var(--font-headline)' }}>
                {142 + (3 - pendingItems.length)} Records
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-muted)', padding: '5px', borderRadius: '12px', alignSelf: 'flex-start', border: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveSubTab('queue')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === 'queue' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'queue' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'queue' ? '800' : '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Active Comparison Queue ({pendingItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          style={{
            padding: '9px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeSubTab === 'audit' ? '#FFFFFF' : 'transparent',
            color: activeSubTab === 'audit' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeSubTab === 'audit' ? '800' : '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Audit Trail History ({resolvedLogs.length})
        </button>
      </div>

      {activeSubTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {pendingItems.length === 0 ? (
            <div className="card-enterprise" style={{ padding: '60px', textAlign: 'center' }}>
              <ShieldCheck size={44} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                All Entity Resolution Queues Clear
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                100% of candidate profiles have been resolved into canonical graph entities.
              </p>
            </div>
          ) : (
            pendingItems.map((item) => {
              const scorePercent = Math.round(item.similarity_score * 100);
              const isCompany = item.entity_type === 'company';

              return (
                <div key={item.id} className="card-enterprise" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Proposal Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--secondary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={18} color="var(--secondary)" />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                            Proposed Merge: {isCompany ? 'Business Account Match' : 'Executive Profile Match'}
                          </span>
                          <span style={{
                            fontSize: '13.5px',
                            fontWeight: '800',
                            color: 'var(--secondary)',
                            fontFamily: 'var(--font-mono)'
                          }}>
                            Similarity Score: {scorePercent}%
                          </span>
                        </div>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          • Rule: {item.matched_rule}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => handleSeparate(item.id)}
                        className="btn btn-outline"
                        style={{ padding: '10px 18px', fontSize: '14px' }}
                      >
                        <Split size={16} />
                        <span>Separate (Dismiss)</span>
                      </button>

                      <button
                        onClick={() => handleApprove(item.id)}
                        className="btn btn-primary"
                        style={{ padding: '10px 22px', fontSize: '14.5px' }}
                      >
                        <GitMerge size={16} />
                        <span>Approve Merge</span>
                      </button>
                    </div>
                  </div>

                  {/* Two Column Side-by-Side Comparison */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left Column: Incoming Record */}
                    <div style={{
                      padding: '20px 22px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isCompany ? <Building2 size={18} color="var(--text-muted)" /> : <User size={18} color="var(--text-muted)" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                              {item.source_name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                              ID: {item.payload_data?.external_id || 'EXT-992-CRM'}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-secondary" style={{ fontSize: '12px' }}>
                          Incoming Record
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '14px', marginTop: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Domain:</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                          {item.payload_data?.domain || 'nextgenai.vn'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.payload_data?.address || 'Floor 12, Keangnam Landmark 72, Hanoi'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
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
                      padding: '20px 22px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-main)',
                      border: '1px solid var(--primary-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary-light)',
                            border: '1px solid var(--primary-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Layers size={18} color="var(--primary)" />
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>
                              {item.matched_candidate_name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                              Node ID: {item.canonical_data?.node_id || 'N-441-89X'}
                            </div>
                          </div>
                        </div>
                        <span className="badge badge-primary" style={{ fontSize: '12px' }}>
                          Canonical Node
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', fontSize: '14px', marginTop: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Domain:</span>
                        <span style={{ fontWeight: '700', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                          {item.canonical_data?.domain || 'nextgenai.vn'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {item.canonical_data?.address || 'Keangnam Landmark 72, Hanoi'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Contact:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                          {item.canonical_data?.rep || 'Nguyen Thanh Son (Verified BD Director)'}
                        </span>

                        <span style={{ color: 'var(--text-muted)' }}>Connections:</span>
                        <span style={{ color: 'var(--primary)', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
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
        <div className="card-enterprise" style={{ padding: '24px 28px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Timestamp</th>
                <th style={{ padding: '12px 14px' }}>Incoming Source Entity</th>
                <th style={{ padding: '12px 14px' }}>Matched Canonical Node</th>
                <th style={{ padding: '12px 14px' }}>Similarity</th>
                <th style={{ padding: '12px 14px' }}>Resolution Rule</th>
                <th style={{ padding: '12px 14px' }}>Status Decision</th>
              </tr>
            </thead>
            <tbody>
              {resolvedLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '14px 14px', color: 'var(--text-muted)', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ padding: '14px 14px', fontWeight: '800', color: 'var(--text-main)' }}>
                    {log.source}
                  </td>
                  <td style={{ padding: '14px 14px', color: 'var(--primary)', fontWeight: '700' }}>
                    {log.matched_with}
                  </td>
                  <td style={{ padding: '14px 14px', fontFamily: 'var(--font-mono)', fontWeight: '800' }}>
                    {log.score}%
                  </td>
                  <td style={{ padding: '14px 14px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    {log.rule}
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <span className={log.decision === 'Merged' || log.decision === 'Auto-merged' ? 'badge badge-success' : 'badge badge-secondary'} style={{ fontSize: '12.5px' }}>
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
