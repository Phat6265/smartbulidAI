// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import React, { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ShippingSettingsForm = ({ settings, onSave, loading }) => {
  const [formData, setFormData] = useState({
    shippingFee: '',
    freeShippingThreshold: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        shippingFee: settings.shippingFee != null ? String(settings.shippingFee) : '',
        freeShippingThreshold: settings.freeShippingThreshold != null ? String(settings.freeShippingThreshold) : ''
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      shippingFee: formData.shippingFee === '' ? 0 : Number(formData.shippingFee),
      freeShippingThreshold: formData.freeShippingThreshold === '' ? 0 : Number(formData.freeShippingThreshold)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-settings-form">
      <h3>Cấu hình vận chuyển</h3>
      <Input label="Phí vận chuyển (VNĐ)" name="shippingFee" type="number" min={0} value={formData.shippingFee} onChange={handleChange} fullWidth />
      <Input label="Ngưỡng miễn phí vận chuyển (VNĐ)" name="freeShippingThreshold" type="number" min={0} value={formData.freeShippingThreshold} onChange={handleChange} fullWidth />
      <Button type="submit" variant="primary" loading={loading}>Lưu cấu hình vận chuyển</Button>
    </form>
  );
};

export default ShippingSettingsForm;
