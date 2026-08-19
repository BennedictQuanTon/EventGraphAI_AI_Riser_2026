import React, { useState } from 'react';
import { api } from '../api';
import { Camera, Upload, CheckCircle2, Sparkles, AlertCircle, Building2, User, Phone, Mail, Globe, ArrowRight } from 'lucide-react';

export default function ScanCardView({ onFinish }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.scanCard(formData);
      setResult(res);
    } catch (err) {
      setError('Đã xảy ra lỗi khi quét ảnh danh thiếp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title & Info */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <Camera size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Quét Danh Thiếp Bằng Gemini Multimodal Vision
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Trích xuất tự động thông tin đối tác tiếng Việt, tiếng Anh và chạy quy trình Entity Resolution chuẩn hóa.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Upload Card Box */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Tải lên hoặc Chụp ảnh Danh thiếp</h3>

          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            border: '2px dashed var(--border-subtle)',
            borderRadius: '12px',
            padding: '32px 16px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.02)',
            minHeight: '220px',
            transition: 'border-color 0.2s'
          }}>
            <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'contain' }} />
            ) : (
              <>
                <Upload size={32} color="#60A5FA" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Bấm để chọn hoặc chụp ảnh</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hỗ trợ JPG, PNG, WEBP (Tối ưu trên mobile)</div>
                </div>
              </>
            )}
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              background: !selectedFile || loading ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Gemini đang phân tích...' : 'Bắt đầu Phân tích & Chuẩn hóa'}</span>
          </button>
        </div>

        {/* Result Preview Box */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>Kết Quả Phân Tích & Đối Soát</h3>

          {loading && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '13px' }}>Đang gọi Gemini 2.5/3 Pro Multimodal Vision...</p>
            </div>
          )}

          {!loading && !result && !error && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              Chưa có dữ liệu. Vui lòng chọn ảnh danh thiếp để quét.
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Status Badge */}
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: result.resolution_status === 'auto_merged' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                border: result.resolution_status === 'auto_merged' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color={result.resolution_status === 'auto_merged' ? '#34D399' : '#60A5FA'} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: result.resolution_status === 'auto_merged' ? '#34D399' : '#60A5FA' }}>
                  {result.resolution_status === 'auto_merged' 
                    ? 'Tự động gộp thành công vào hồ sơ có sẵn' 
                    : result.resolution_status === 'pending_review' 
                      ? 'Đã chuyển vào Hàng đợi xác nhận (Pending Review)' 
                      : 'Đã tạo thực thể mới trên Graph'}
                </span>
              </div>

              {/* Extracted Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={16} color="var(--text-muted)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Họ và tên:</span>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{result.extracted_data?.full_name || 'N/A'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={16} color="var(--text-muted)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Chức danh & Công ty:</span>
                    <div style={{ color: '#E2E8F0' }}>
                      {result.extracted_data?.title} — <strong style={{ color: '#60A5FA' }}>{result.extracted_data?.company_name}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} color="var(--text-muted)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Email:</span>
                    <div style={{ color: '#E2E8F0' }}>{result.extracted_data?.email || 'N/A'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} color="var(--text-muted)" />
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Số điện thoại:</span>
                    <div style={{ color: '#E2E8F0' }}>{result.extracted_data?.phone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Audit Explanation */}
              {result.resolution_log && (
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  color: '#94A3B8'
                }}>
                  <strong style={{ color: '#FCD34D' }}>Lý do quyết định:</strong> {result.resolution_log.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
