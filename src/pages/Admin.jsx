import { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', category: 'Sửa máy tính', description: '' });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads/')) return `http://localhost:3001${imgPath}`;
    return imgPath.startsWith('/') ? imgPath : '/' + imgPath;
  };

  const fetchProjects = () => {
    fetch('http://localhost:3001/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  };

  useEffect(() => {
    if (localStorage.getItem('admin_token') === 'fake-jwt-token') {
      setIsLoggedIn(true);
      fetchProjects();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        fetchProjects();
      } else {
        setError('Sai mật khẩu!');
      }
    })
    .catch(() => setError('Không kết nối được với server. Hãy chắc chắn server đang chạy.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }
    
    if (isEditing) {
      data.append('existingImages', JSON.stringify(existingImages));
    }

    const url = isEditing ? `http://localhost:3001/api/projects/${editId}` : 'http://localhost:3001/api/projects';
    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: data
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed');
      return res.json();
    })
    .then(() => {
      setSuccess(isEditing ? 'Cập nhật thành công!' : 'Đã thêm dự án thành công!');
      resetForm();
      fetchProjects();
      setTimeout(() => setSuccess(''), 3000);
    })
    .catch(() => setError('Có lỗi xảy ra khi lưu!'));
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditId(p.id);
    setFormData({ title: p.title, category: p.category, description: p.description || '' });
    setExistingImages(p.images || []);
    setFiles([]);
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    const token = localStorage.getItem('admin_token');
    
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => fetchProjects())
    .catch(() => setError('Không thể xóa!'));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ title: '', category: 'Sửa máy tính', description: '' });
    setFiles([]);
    setExistingImages([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-wrapper section bg-light" style={{minHeight: '80vh', display: 'flex', alignItems: 'center'}}>
        <div className="container" style={{maxWidth: '400px'}}>
          <div className="admin-card animate-fade-in">
            <h2 className="admin-title">Đăng Nhập Quản Trị</h2>
            {error && <div className="alert-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
            <form onSubmit={handleLogin} className="admin-form">
              <div className="form-group">
                <input 
                  type="password" 
                  className="form-input" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Đăng nhập</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper section bg-light">
      <div className="container">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h2 className="admin-title" style={{margin: 0}}>Quản lý Dự Án</h2>
          <button onClick={handleLogout} className="btn-outline" style={{padding: '0.5rem 1rem'}}>Đăng xuất</button>
        </div>

        <div className="admin-card animate-fade-in" style={{marginBottom: '2rem'}}>
          <h3 style={{marginBottom: '1rem'}}>{isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h3>
          
          {success && <div className="alert-success" style={{color: 'green', marginBottom: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px'}}>{success}</div>}
          {error && <div className="alert-error" style={{color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffebee', borderRadius: '4px'}}>{error}</div>}
          
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label className="form-label">Tên dự án/sản phẩm</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="VD: Thay thế linh kiện laptop Dell..."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Danh mục dịch vụ</label>
              <select 
                className="form-input" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Sửa máy tính">Sửa máy tính</option>
                <option value="Sửa máy in">Sửa máy in</option>
                <option value="In bạt">In bạt</option>
                <option value="Thiết kế & Thi công">Thiết kế & Thi công</option>
                <option value="Đổ mực">Đổ mực</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea 
                className="form-input" 
                rows="4"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Nhập mô tả về dự án..."
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Tải ảnh lên (có thể chọn nhiều ảnh)</label>
              <input 
                type="file" 
                className="form-input" 
                multiple
                accept="image/*"
                onChange={e => setFiles(e.target.files)}
                style={{padding: '0.5rem'}}
              />
            </div>

            {isEditing && existingImages.length > 0 && (
              <div className="form-group">
                <label className="form-label">Ảnh đang có (Bấm để xóa)</label>
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {existingImages.map((img, idx) => (
                    <div key={idx} style={{position: 'relative', width: '100px', height: '100px', border: '1px solid #ddd'}}>
                      <img src={getImageUrl(img)} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      <button type="button" onClick={() => removeExistingImage(idx)} style={{position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 5px'}}>X</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{display: 'flex', gap: '1rem'}}>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {isEditing ? 'Cập nhật' : 'Đăng tải'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-card animate-fade-in">
          <h3 style={{marginBottom: '1rem'}}>Danh sách bài viết</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {projects.map(p => (
              <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #eee', borderRadius: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '60px', height: '60px', backgroundColor: '#eee', borderRadius: '4px', backgroundImage: `url(${getImageUrl(p.image)})`, backgroundSize: 'cover'}}>
                  </div>
                  <div>
                    <h4 style={{margin: '0 0 0.5rem 0'}}>{p.title}</h4>
                    <span style={{fontSize: '0.8rem', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px'}}>{p.category}</span>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button onClick={() => handleEdit(p)} style={{padding: '0.5rem 1rem', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sửa</button>
                  <button onClick={() => handleDelete(p.id)} style={{padding: '0.5rem 1rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
