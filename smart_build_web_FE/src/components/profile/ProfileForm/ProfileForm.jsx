// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
import React, { useState, useEffect } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import './ProfileForm.css';

const ProfileForm = ({ profile, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    avatarUrl: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().slice(0, 10)
          : '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
      avatarUrl: formData.avatarUrl.trim()
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form-edit">
      <Input
        label="Họ và tên"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
      />
      <Input
        label="Số điện thoại"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
      />
      <Input
        label="Địa chỉ"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
      />
      <Input
        label="Ngày sinh"
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        fullWidth
      />
      <Input
        label="URL Avatar"
        name="avatarUrl"
        value={formData.avatarUrl}
        onChange={handleChange}
        placeholder="https://..."
        fullWidth
      />
      <div className="profile-form-actions">
        <Button type="submit" variant="primary" size="large" loading={loading}>
          Lưu thay đổi
        </Button>
        <Button type="button" variant="outline" size="large" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
