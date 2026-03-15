// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import useUserStore from '../../store/user.store';
import { useAuth } from '../../hooks/useAuth';
import ProfileForm from '../../components/profile/ProfileForm';
// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
import ProfileAvatarUploader from '../../components/profile/ProfileAvatarUploader';
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
import './EditProfile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { profile, loading, fetchProfile, updateProfile, updateAvatar } = useUserStore();
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile().catch(() => navigate(ROUTES.PROFILE));
  }, [fetchProfile, navigate]);

  const handleSubmit = async (payload) => {
    setError('');
    try {
      await updateProfile(payload);
      await refreshUser();
      navigate(ROUTES.PROFILE);
    } catch (err) {
      setError(err?.message || 'Cập nhật thất bại');
    }
  };

  // ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
  const handleAvatarUpload = async (file) => {
    setError('');
    await updateAvatar(file);
    await refreshUser();
  };
  // ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
  };

  if (!profile) {
    return (
      <div className="edit-profile-page">
        <div className="container">
          <div className="edit-profile-loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="container">
        <h1 className="edit-profile-title">Chỉnh sửa hồ sơ</h1>
        {error && <p className="edit-profile-error">{error}</p>}
        <div className="edit-profile-avatar-section">
          <ProfileAvatarUploader
            currentAvatarUrl={profile.avatarUrl}
            currentName={profile.name}
            onUpload={handleAvatarUpload}
            loading={loading}
          />
        </div>
        <ProfileForm
          profile={profile}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default EditProfile;
