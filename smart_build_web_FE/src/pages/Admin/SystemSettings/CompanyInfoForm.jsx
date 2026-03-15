// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const CompanyInfoForm = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyHotline: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || '',
        companyAddress: settings.companyAddress || '',
        companyHotline: settings.companyHotline || ''
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
      <h3>Thông tin hệ thống / công ty</h3>
      <Input label="Tên công ty" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth />
      <Input label="Địa chỉ công ty" name="companyAddress" value={formData.companyAddress} onChange={handleChange} fullWidth />
      <Input label="Hotline" name="companyHotline" value={formData.companyHotline} onChange={handleChange} fullWidth />
      <Button type="submit" variant="primary" loading={loading}>Lưu thông tin công ty</Button>
    </form>
  );
};

export default CompanyInfoForm;
