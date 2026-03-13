import React, { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input.jsx';
import './Admin.css';
import apiClient from '../../services/apiClient';
import { useNotification } from '../../components/common/NotificationCenter';
import { FiTrash2, FiEdit2, FiPlus } from 'react-icons/fi';

const STORAGE_KEY = 'app_settings';

const Settings = () => {
  const [settings, setSettings] = useState({ companyName: '', primaryColor: '', secondaryColor: '' });
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const { notifySuccess, notifyError, confirm } = useNotification();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSettings(JSON.parse(raw));
  }, []);

  const applyColors = (s) => {
    if (s.primaryColor) document.documentElement.style.setProperty('--color-primary', s.primaryColor);
    if (s.secondaryColor) document.documentElement.style.setProperty('--color-secondary', s.secondaryColor);
  };

  useEffect(() => { applyColors(settings); }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyColors(settings);
    notifySuccess('Lưu cài đặt thành công');
  };

  // Carousel settings (CRUD slide cho trang chính)
  const fetchSlides = async () => {
    setLoadingSlides(true);
    try {
      const res = await apiClient.get('/carousel');
      const arr = Array.isArray(res) ? res : (res.data || []);
      setSlides(arr);
    } catch (err) {
      console.error('Load carousel failed', err);
    } finally {
      setLoadingSlides(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSlideChange = (e) => {
    const { name, value } = e.target;
    setEditingSlide(prev => ({ ...prev, [name]: value }));
  };

  const openCreateSlide = () => {
    setEditingSlide({ title: '', description: '', imageUrl: '', link: '' });
  };

  const openEditSlide = (slide) => {
    setEditingSlide(slide);
  };

  const saveSlide = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide.id || editingSlide._id) {
        const id = editingSlide._id || editingSlide.id;
        await apiClient.put(`/carousel/${id}`, editingSlide);
      } else {
        await apiClient.post('/carousel', editingSlide);
      }
      setEditingSlide(null);
      fetchSlides();
    } catch (err) {
      notifyError(err.message || 'Lưu slide thất bại');
    }
  };

  const deleteSlide = async (slide) => {
    const ok = await confirm({
      title: 'Xác nhận xóa slide',
      message: `Bạn có chắc chắn muốn xóa slide "${slide.title}"?`
    });
    if (!ok) return;
    try {
      const id = slide._id || slide.id;
      await apiClient.delete(`/carousel/${id}`);
      fetchSlides();
    } catch (err) {
      notifyError(err.message || 'Xóa slide thất bại');
    }
  };

  return (
    <div className="admin-page-section">
      <h2>Cài đặt</h2>
      <form onSubmit={handleSave} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        <Input label="Tên công ty" name="companyName" value={settings.companyName} onChange={handleChange} fullWidth />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Màu chính</label>
            <input type="color" name="primaryColor" value={settings.primaryColor || '#7a4a2b'} onChange={handleChange} style={{ width: '100%', height: 40, borderRadius: 6, border: '1px solid var(--color-border)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6 }}>Màu phụ</label>
            <input type="color" name="secondaryColor" value={settings.secondaryColor || '#d4a373'} onChange={handleChange} style={{ width: '100%', height: 40, borderRadius: 6, border: '1px solid var(--color-border)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="outline-brown" type="button" onClick={() => { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setSettings(JSON.parse(raw)); }}>Hủy</Button>
          <Button variant="primary" type="submit">Lưu</Button>
        </div>
      </form>

      {/* Quản lý carousel trang chủ */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3>Carousel trang chính</h3>
          <Button variant="primary" type="button" onClick={openCreateSlide}>
            <FiPlus style={{ marginRight: 4 }} /> Thêm slide
          </Button>
        </div>
        {loadingSlides ? (
          <p>Đang tải slide...</p>
        ) : !slides.length ? (
          <p>Chưa có slide nào.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Ảnh</th>
                  <th>Link</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {slides.map(slide => (
                  <tr key={slide._id || slide.id}>
                    <td>{slide.title}</td>
                    <td>{slide.description}</td>
                    <td>{slide.imageUrl}</td>
                    <td>{slide.link}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="outline-brown" type="button" onClick={() => openEditSlide(slide)}>
                          <FiEdit2 style={{ marginRight: 4 }} /> Sửa
                        </Button>
                        <Button variant="outline-danger" type="button" onClick={() => deleteSlide(slide)}>
                          <FiTrash2 style={{ marginRight: 4 }} /> Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingSlide && (
        <div className="admin-modal">
          <div className="admin-modal-content" style={{ maxWidth: 640 }}>
            <h3>{editingSlide.id || editingSlide._id ? 'Sửa slide' : 'Thêm slide'}</h3>
            <form onSubmit={saveSlide} style={{ display: 'grid', gap: 12 }}>
              <Input label="Tiêu đề" name="title" value={editingSlide.title || ''} onChange={handleSlideChange} fullWidth />
              <Input label="Mô tả" name="description" value={editingSlide.description || ''} onChange={handleSlideChange} fullWidth />
              <Input label="URL ảnh" name="imageUrl" value={editingSlide.imageUrl || ''} onChange={handleSlideChange} fullWidth />
              <Input label="Link (tuỳ chọn)" name="link" value={editingSlide.link || ''} onChange={handleSlideChange} fullWidth />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="outline-brown" type="button" onClick={() => setEditingSlide(null)}>Hủy</Button>
                <Button variant="primary" type="submit">Lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
