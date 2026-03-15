// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const WebsiteSettingsForm = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    supportEmail: '',
    supportPhone: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        supportEmail: settings.supportEmail || '',
        supportPhone: settings.supportPhone || ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-settings-form">
      <h3>Cấu hình website</h3>
      <Input label="Tên website" name="siteName" value={formData.siteName} onChange={handleChange} fullWidth />
      <Input label="Mô tả website" name="siteDescription" value={formData.siteDescription} onChange={handleChange} fullWidth />
      <Input label="Email hỗ trợ" name="supportEmail" type="email" value={formData.supportEmail} onChange={handleChange} fullWidth />
      <Input label="Số điện thoại hỗ trợ" name="supportPhone" value={formData.supportPhone} onChange={handleChange} fullWidth />
      <Button type="submit" variant="primary" loading={loading}>Lưu cấu hình website</Button>
    </form>
  );
};

export default WebsiteSettingsForm;
