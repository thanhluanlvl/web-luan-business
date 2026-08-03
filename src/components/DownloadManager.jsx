import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import './DownloadManager.css';

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '';
const EMPTY_FORM = {
  name: '',
  description: '',
  google_drive_url: '',
};

const DownloadManager = ({ token, onUnauthorized }) => {
  const [downloads, setDownloads] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Phiên đăng nhập đã hết hạn.');
    }
    if (!response.ok) throw new Error(data.error || 'Không thể xử lý yêu cầu.');
    return data;
  }, [onUnauthorized, token]);

  const loadDownloads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request('/api/downloads?admin=1');
      setDownloads(data.downloads || []);
    } catch (loadError) {
      setError(loadError.message || 'Không tải được danh sách phần mềm.');
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    let active = true;

    request('/api/downloads?admin=1')
      .then((data) => {
        if (active) setDownloads(data.downloads || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Không tải được danh sách phần mềm.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [request]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setEditingId('');
    setForm(EMPTY_FORM);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || '',
      google_drive_url: item.google_drive_url,
    });
    setMessage('');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await request(editingId ? `/api/downloads?id=${editingId}` : '/api/downloads', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });
      setMessage(editingId ? 'Đã cập nhật phần mềm.' : 'Đã thêm phần mềm vào trang chủ.');
      resetForm();
      await loadDownloads();
    } catch (saveError) {
      setError(saveError.message || 'Không thể lưu phần mềm.');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (item) => {
    setMessage('');
    setError('');
    try {
      const data = await request(`/api/downloads?id=${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      setDownloads((current) =>
        current.map((entry) => (entry.id === item.id ? data.download : entry))
      );
      setMessage(item.is_active ? 'Đã ẩn khỏi trang chủ.' : 'Đã hiển thị trên trang chủ.');
    } catch (toggleError) {
      setError(toggleError.message || 'Không thể đổi trạng thái.');
    }
  };

  const removeDownload = async (item) => {
    if (!window.confirm(`Xóa “${item.name}” khỏi kho Download?`)) return;

    setMessage('');
    setError('');
    try {
      await request(`/api/downloads?id=${item.id}`, { method: 'DELETE' });
      setDownloads((current) => current.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
      setMessage('Đã xóa phần mềm.');
    } catch (removeError) {
      setError(removeError.message || 'Không thể xóa phần mềm.');
    }
  };

  return (
    <section className="download-admin-card" aria-labelledby="download-admin-title">
      <div className="download-admin-heading">
        <div className="download-admin-icon"><Download size={24} /></div>
        <div>
          <span>QUẢN LÝ TRANG CHỦ</span>
          <h3 id="download-admin-title">Kho Download</h3>
          <p>Dán link file hoặc cả thư mục Google Drive để lưu và mở lại khi cần.</p>
        </div>
      </div>

      <form className="download-admin-form" onSubmit={submit}>
        <label>
          <span>Tên mục *</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            placeholder="Ví dụ: Bộ cài đặt máy tính"
            maxLength={160}
            required
          />
        </label>

        <label>
          <span>Mô tả ngắn</span>
          <input
            type="text"
            value={form.description}
            onChange={(event) => updateForm('description', event.target.value)}
            placeholder="Ví dụ: Hỗ trợ điều khiển máy tính từ xa"
            maxLength={500}
          />
        </label>

        <label className="download-form-wide">
          <span>Link file hoặc thư mục Google Drive *</span>
          <input
            type="url"
            value={form.google_drive_url}
            onChange={(event) => updateForm('google_drive_url', event.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            required
          />
          <small>Chấp nhận cả file và thư mục. Hãy bật quyền “Bất kỳ ai có đường liên kết”.</small>
        </label>

        <div className="download-form-actions download-form-wide">
          {editingId && (
            <button type="button" className="download-secondary-button" onClick={resetForm}>
              Hủy sửa
            </button>
          )}
          <button type="submit" className="download-save-button" disabled={saving}>
            <Plus size={18} />
            {saving ? 'Đang lưu…' : editingId ? 'Lưu thay đổi' : 'Thêm mục'}
          </button>
        </div>
      </form>

      {message && <div className="download-admin-notice success">{message}</div>}
      {error && <div className="download-admin-notice error">{error}</div>}

      <div className="download-admin-list-heading">
        <h4>Danh sách phần mềm</h4>
        <span>{downloads.length} mục</span>
      </div>

      {loading && <div className="download-admin-empty">Đang tải danh sách…</div>}
      {!loading && downloads.length === 0 && (
        <div className="download-admin-empty">Chưa có phần mềm nào. Hãy thêm mục đầu tiên.</div>
      )}

      {!loading && downloads.length > 0 && (
        <div className="download-admin-list">
          {downloads.map((item, index) => (
            <article className={`download-admin-item ${item.is_active ? '' : 'is-hidden'}`} key={item.id}>
              <span className="download-admin-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="download-admin-copy">
                <div>
                  <h4>{item.name}</h4>
                  <span className={item.is_active ? 'status-visible' : 'status-hidden'}>
                    {item.is_active ? 'Đang hiện' : 'Đang ẩn'}
                  </span>
                </div>
                {item.description && <p>{item.description}</p>}
                <small>{item.download_count || 0} lượt tải</small>
              </div>
              <div className="download-admin-actions">
                {item.is_active && (
                  <a
                    href={`${API_BASE}/api/downloads?action=download&id=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Tải thử"
                  >
                    <ExternalLink size={17} />
                  </a>
                )}
                <button type="button" onClick={() => startEdit(item)} title="Sửa">
                  <Pencil size={17} />
                </button>
                <button type="button" onClick={() => toggleVisibility(item)} title={item.is_active ? 'Ẩn' : 'Hiện'}>
                  {item.is_active ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <button type="button" className="delete" onClick={() => removeDownload(item)} title="Xóa">
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default DownloadManager;
