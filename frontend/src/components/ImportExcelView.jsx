import React, { useState } from 'react';
import { api } from '../api';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, ArrowRight, Table, Sparkles } from 'lucide-react';

export default function ImportExcelView({ onImportComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [importStats, setImportStats] = useState(null);
  const [error, setError] = useState('');

  // Mapping state
  const [eventName, setEventName] = useState('Tech Networking Night 2026');
  const [eventDate, setEventDate] = useState('2026-09-10');
  const [eventLocation, setEventLocation] = useState('Hà Nội / TP.HCM');
  const [fullNameCol, setFullNameCol] = useState('');
  const [titleCol, setTitleCol] = useState('');
  const [companyCol, setCompanyCol] = useState('');
  const [emailCol, setEmailCol] = useState('');
  const [phoneCol, setPhoneCol] = useState('');
  const [roleCol, setRoleCol] = useState('');

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(null);
    setImportStats(null);
    setError('');
    setLoadingPreview(true);

    const formData = new FormData();
    formData.append('file', selected);

    try {
      const res = await api.previewExcel(formData);
      setPreview(res);
      // Pre-fill suggested mapping
      const sm = res.suggested_mapping || {};
      setFullNameCol(sm.full_name_col || res.columns[0] || '');
      setTitleCol(sm.title_col || '');
      setCompanyCol(sm.company_col || '');
      setEmailCol(sm.email_col || '');
      setPhoneCol(sm.phone_col || '');
      setRoleCol(sm.role_col || '');
    } catch (err) {
      setError('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleRunBatchImport = async (e) => {
    e.preventDefault();
    if (!file || !fullNameCol) {
      setError('Vui lòng chọn cột chứa Họ tên.');
      return;
    }

    setLoadingImport(true);
    setError('');

    const mapping = {
      full_name_col: fullNameCol,
      title_col: titleCol || null,
      company_col: companyCol || null,
      email_col: emailCol || null,
      phone_col: phoneCol || null,
      role_col: roleCol || null,
      event_name: eventName,
      event_date: eventDate,
      event_location: eventLocation
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping_json', JSON.stringify(mapping));

    try {
      const stats = await api.importExcelBatch(formData);
      setImportStats(stats);
      if (onImportComplete) onImportComplete();
    } catch (err) {
      setError('Lỗi khi thực thi batch import.');
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
              Import File Excel Dữ Liệu Sự Kiện Cũ (Batch Parser Agent)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Tải file XLSX/CSV, tự động nhận diện cấu trúc cột và chạy Entity Resolution hàng loạt dưới 5 phút.
            </p>
          </div>
        </div>
      </div>

      {/* Upload & Setup Step */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '14px' }}>1. Chọn File Dữ Liệu (.xlsx, .csv)</h3>
        
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: '2px dashed var(--border-subtle)',
          borderRadius: '12px',
          padding: '24px',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} style={{ display: 'none' }} />
          <Upload size={28} color="#60A5FA" />
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
            {file ? file.name : 'Bấm để tải lên file Excel sự kiện'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Hỗ trợ file danh sách khách mời, check-in, form Google Sheets'}
          </div>
        </label>
      </div>

      {/* Column Mapping & Event Details */}
      {preview && !importStats && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>2. Cấu Hình Sự Kiện & Ánh Xạ Cột (Column Mapping)</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tên sự kiện</label>
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Thời gian</label>
              <input type="text" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Địa điểm tổ chức</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#E2E8F0', marginBottom: '12px' }}>Ánh xạ các cột trong file:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#60A5FA', marginBottom: '4px', fontWeight: '600' }}>Cột Họ và tên *</label>
                <select value={fullNameCol} onChange={(e) => setFullNameCol(e.target.value)} style={{ width: '100%' }}>
                  <option value="">-- Chọn cột --</option>
                  {preview.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cột Chức danh</label>
                <select value={titleCol} onChange={(e) => setTitleCol(e.target.value)} style={{ width: '100%' }}>
                  <option value="">-- Không có --</option>
                  {preview.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cột Công ty</label>
                <select value={companyCol} onChange={(e) => setCompanyCol(e.target.value)} style={{ width: '100%' }}>
                  <option value="">-- Không có --</option>
                  {preview.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cột Email</label>
                <select value={emailCol} onChange={(e) => setEmailCol(e.target.value)} style={{ width: '100%' }}>
                  <option value="">-- Không có --</option>
                  {preview.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Cột Số điện thoại</label>
                <select value={phoneCol} onChange={(e) => setPhoneCol(e.target.value)} style={{ width: '100%' }}>
                  <option value="">-- Không có --</option>
                  {preview.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunBatchImport}
            disabled={loadingImport}
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
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
            <span>{loadingImport ? 'Đang phân tích & xử lý batch...' : `Thực thi Chuẩn hóa ${preview.total_rows} dòng`}</span>
          </button>
        </div>
      )}

      {/* Import Result Stats */}
      {importStats && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981' }}>
            <CheckCircle2 size={24} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>Hoàn Tất Chuẩn Hóa Dữ Liệu Batch!</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tổng số dòng</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#60A5FA' }}>{importStats.processed_rows}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Nhân sự mới</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#34D399' }}>{importStats.new_persons}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Doanh nghiệp mới</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#A78BFA' }}>{importStats.new_companies}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tự động gộp</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#FCD34D' }}>{importStats.auto_merged}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
