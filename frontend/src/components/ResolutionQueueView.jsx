import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { GitMerge, Check, X, UserPlus, ShieldAlert, History, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ResolutionQueueView({ onDecisionMade }) {
  const [activeSubTab, setActiveSubTab] = useState('queue'); // 'queue' or 'audit'
  const [pendingQueue, setPendingQueue] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'queue') {
        const res = await api.getResolutionQueue();
        setPendingQueue(res);
      } else {
        const res = await api.getResolutionLogs();
        setAuditLogs(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (logId, decision) => {
    try {
      await api.submitResolutionDecision(logId, decision);
      fetchData();
      if (onDecisionMade) onDecisionMade();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <GitMerge size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Hàng Đợi Chuẩn Hóa & Audit Trail (Entity Resolution Engine)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Đánh giá và minh bạch lý do gộp trùng thực thể (Similarity Score + Business Rules). Tuyệt đối không phải hộp đen.
            </p>
          </div>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveSubTab('queue')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'queue' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeSubTab === 'queue' ? '#60A5FA' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Chờ duyệt ({pendingQueue.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === 'audit' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeSubTab === 'audit' ? '#60A5FA' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Lịch sử Audit Trail
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu chuẩn hóa...
        </div>
      ) : activeSubTab === 'queue' ? (
        /* PENDING QUEUE CARDS */
        pendingQueue.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
              Hàng đợi trống!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Mọi bản ghi mới đều đã được tự động phân giải hoặc duyệt thành công.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingQueue.map((item) => (
              <div key={item.id} className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#FCD34D',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}>
                      Độ tương đồng: {Math.round(item.similarity_score * 100)}%
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60A5FA',
                      fontSize: '12px'
                    }}>
                      Quy tắc: {item.matched_rule}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDecision(item.id, 'merge')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#34D399',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      <Check size={15} />
                      <span>Duyệt Gộp</span>
                    </button>

                    <button
                      onClick={() => handleDecision(item.id, 'create_new')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        color: '#60A5FA',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      <UserPlus size={15} />
                      <span>Tách Thực Thể Mới</span>
                    </button>
                  </div>
                </div>

                {/* Candidate Comparison Box */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Bản ghi nguồn mới (Đang chờ):
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{item.source_name}</div>
                    {item.payload_data?.title && <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.payload_data.title}</div>}
                    {item.payload_data?.email && <div style={{ fontSize: '12px', color: '#60A5FA' }}>{item.payload_data.email}</div>}
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Ứng viên trùng khớp trong Graph:
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#FCD34D' }}>{item.matched_candidate_name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>ID: {item.matched_candidate_id}</div>
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ fontSize: '12.5px', color: '#E2E8F0', lineHeight: '1.4' }}>
                  <strong style={{ color: '#F59E0B' }}>Giải thích thuật toán:</strong> {item.explanation}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* AUDIT TRAIL LOGS */
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Thời gian</th>
                <th style={{ padding: '10px' }}>Tên bản ghi</th>
                <th style={{ padding: '10px' }}>Khớp với</th>
                <th style={{ padding: '10px' }}>Độ khớp</th>
                <th style={{ padding: '10px' }}>Quy tắc</th>
                <th style={{ padding: '10px' }}>Quyết định</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)', fontSize: '11px' }}>
                    {new Date(log.created_at).toLocaleTimeString('vi-VN')}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: '600', color: '#fff' }}>{log.source_name}</td>
                  <td style={{ padding: '12px 10px', color: '#60A5FA' }}>{log.matched_candidate_name || 'N/A'}</td>
                  <td style={{ padding: '12px 10px', color: '#FCD34D', fontWeight: '600' }}>
                    {Math.round(log.similarity_score * 100)}%
                  </td>
                  <td style={{ padding: '12px 10px', color: '#94A3B8', fontSize: '11px' }}>{log.matched_rule}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: log.decision === 'auto_merged' || log.decision === 'merged' 
                        ? 'rgba(16, 185, 129, 0.15)' 
                        : 'rgba(239, 68, 68, 0.15)',
                      color: log.decision === 'auto_merged' || log.decision === 'merged' 
                        ? '#34D399' 
                        : '#F87171'
                    }}>
                      {log.decision === 'auto_merged' ? 'Tự động gộp' : log.decision === 'merged' ? 'Đã duyệt gộp' : 'Tách thực thể'}
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
