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
  Split
} from 'lucide-react';

export default function ResolutionQueueView({ onDecisionMade }) {
  const [queue, setQueue] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const [qRes, lRes] = await Promise.all([
        api.getResolutionQueue(),
        api.getResolutionLogs()
      ]);
      setQueue(qRes || []);
      setAuditLogs(lRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (logId, decision) => {
    try {
      await api.submitResolutionDecision(logId, decision);
      fetchQueue();
      if (onDecisionMade) onDecisionMade();
    } catch (e) {
      console.error(e);
    }
  };

  // Mock comparison record matching Image 3 if queue is empty
  const displayItems = queue.length > 0 ? queue : [
    {
      id: "demo-res-1",
      entity_type: "company",
      similarity_score: 0.92,
      matched_rule: "Domain Match & Fuzzy Name Alignment",
      explanation: "Matching corporate email domain (techviet.com.vn) and high token overlap in company headquarters location.",
      source_name: "TechViet Solutions Ltd",
      matched_candidate_name: "TechViet Solutions",
      payload_data: {
        external_id: "EXT-992-CRM",
        domain: "techviet.com.vn",
        address: "Floor 4, Alpha Tower, Dist 1, HCMC",
        rep: "Nguyen Van A",
        industry: "Software & IT Services"
      },
      canonical_data: {
        node_id: "N-441-89X",
        domain: "techviet.com.vn",
        address: "Alpha Tower, Q1, HCM",
        rep: "Nguyen Van A (Verified)",
        edges_count: 14
      }
    }
  ];

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

        {/* Counter Pills */}
        <div className="card-enterprise" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Pending Review
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--secondary)', fontFamily: 'var(--font-headline)' }}>
              {displayItems.length} Records
            </div>
          </div>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-color)' }} />
          <div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Resolved (Today)
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--success)', fontFamily: 'var(--font-headline)' }}>
              142 Records
            </div>
          </div>
        </div>
      </div>

      {/* Main Resolution Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayItems.map((item, idx) => {
          const scorePercent = Math.round((item.similarity_score || 0.92) * 100);
          const isCompany = item.entity_type === 'company' || !item.entity_type;

          return (
            <div key={item.id || idx} className="card-enterprise" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        Proposed Merge: Business Entity Match
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
                      • Matching email domain • High address & representative alignment
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleDecision(item.id, 'create_new')}
                    className="btn btn-outline"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    <Split size={14} />
                    <span>Separate (Dismiss)</span>
                  </button>

                  <button
                    onClick={() => handleDecision(item.id, 'merge')}
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <GitMerge size={15} />
                    <span>Approve Merge</span>
                  </button>
                </div>
              </div>

              {/* Two Column Entity Comparison (Exact layout as Image 3) */}
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
                      {item.payload_data?.domain || 'techviet.com.vn'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.payload_data?.address || 'Floor 4, Alpha Tower, Dist 1, HCMC'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>Representative:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                      {item.payload_data?.rep || 'Nguyen Van A'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>Industry:</span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.payload_data?.industry || 'Software & IT Services'}
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
                      {item.canonical_data?.domain || 'techviet.com.vn'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.canonical_data?.address || 'Alpha Tower, Q1, HCM'}
                    </span>

                    <span style={{ color: 'var(--text-muted)' }}>Representative:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                      {item.canonical_data?.rep || 'Nguyen Van A (Verified)'}
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
        })}
      </div>
    </div>
  );
}
