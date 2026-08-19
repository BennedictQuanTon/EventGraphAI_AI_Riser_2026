import React, { useState } from 'react';
import { api } from '../api';
import { MessageSquare, Send, Sparkles, ShieldCheck, User, Building2, Calendar, Bot } from 'lucide-react';

export default function ChatAssistantView() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là Trợ lý AI của EventGraph. Tôi có thể giúp bạn truy vấn tự do mọi mối quan hệ, nhân sự, doanh nghiệp và lịch sử sự kiện trong đồ thị dữ liệu của đơn vị. Bạn muốn tìm hiểu thông tin gì hôm nay?',
      entities_cited: []
    }
  ]);
  const [loading, setLoading] = useState(false);

  const quickQueries = [
    "Ai từng tham gia từ 2 sự kiện trở lên trong hệ sinh thái?",
    "Những ai làm việc trong lĩnh vực Trí tuệ nhân tạo (AI)?",
    "Tìm các đối tác thuộc ngành FinTech và thanh toán số.",
    "Ai là đại diện của NextGen AI Vietnam và VinFintech Payments?"
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMsg = { role: 'user', content: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.askChat(q, messages);
      const botMsg = {
        role: 'assistant',
        content: res.answer,
        entities_cited: res.entities_cited || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Đã xảy ra lỗi khi truy vấn đồ thị dữ liệu. Vui lòng thử lại.',
        entities_cited: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 160px)' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <Bot size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
              Trợ Lý Chatbot Graph RAG
            </h2>
            <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> Cam kết chống ảo giác: Chỉ trích dẫn thực thể có thật trong Graph
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', color: '#C084FC', fontWeight: '600' }}>
          Hybrid SQL + Vector Embeddings
        </div>
      </div>

      {/* Messages Area */}
      <div className="glass-panel" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'rgba(10, 15, 26, 0.8)'
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {m.role === 'assistant' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={16} color="#fff" />
              </div>
            )}

            <div style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: m.role === 'user' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'rgba(255, 255, 255, 0.04)',
              border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              color: '#fff',
              fontSize: '13.5px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}

              {/* Verified Citations Tag */}
              {m.entities_cited && m.entities_cited.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={11} color="#10B981" /> Thực thể xác thực:
                  </span>
                  {m.entities_cited.map((ent, ei) => (
                    <span key={ei} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD' }}>
                      {ent.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)', fontSize: '13px' }}>
              Đang truy vấn đồ thị quan hệ và tổng hợp câu trả lời...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Queries Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {quickQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: '#94A3B8',
              fontSize: '11.5px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Hỏi bất cứ điều gì về các sự kiện, nhân sự hoặc đối tác trong hệ sinh thái..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '14px 18px', borderRadius: '12px' }}
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          style={{
            padding: '0 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
