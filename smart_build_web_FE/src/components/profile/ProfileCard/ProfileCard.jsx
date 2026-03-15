// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import Button from '../../common/Button';
import { formatDateOfBirth } from '../../../utils/formatDateOfBirth';
// ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
import ProfileAvatarUploader from '../ProfileAvatarUploader';
// ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
import './ProfileCard.css';

const ProfileCard = ({ profile, onDeleteAccount, onAvatarUpload, avatarUploadLoading }) => {
  if (!profile) return null;

  const avatarSrc = profile.avatarUrl || null;
  const dateDisplay = profile.dateOfBirth
    ? formatDateOfBirth(profile.dateOfBirth)
    : 'Chưa cập nhật';

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        {/* ===== MODIFIED START (AVATAR UPLOAD FEATURE) ===== */}
        <ProfileAvatarUploader
          currentAvatarUrl={avatarSrc}
          currentName={profile.name}
          onUpload={onAvatarUpload}
          loading={avatarUploadLoading}
        />
        {/* ===== MODIFIED END (AVATAR UPLOAD FEATURE) ===== */}
        <div className="profile-card-name">{profile.name || 'Chưa có tên'}</div>
        {profile.role && (
          <span className="profile-card-role">
            {profile.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
          </span>
        )}
      </div>
      <dl className="profile-card-details">
        <div className="profile-card-row">
          <dt>Email</dt>
          <dd>{profile.email || '—'}</dd>
        </div>
        <div className="profile-card-row">
          <dt>Số điện thoại</dt>
          <dd>{profile.phone || 'Chưa cập nhật'}</dd>
        </div>
        <div className="profile-card-row">
          <dt>Địa chỉ</dt>
          <dd>{profile.address || 'Chưa cập nhật'}</dd>
        </div>
        <div className="profile-card-row">
          <dt>Ngày sinh</dt>
          <dd>{dateDisplay}</dd>
        </div>
      </dl>
      <div className="profile-card-actions">
        <Link to={ROUTES.PROFILE_EDIT}>
          <Button variant="primary" size="large">
            Chỉnh sửa hồ sơ
          </Button>
        </Link>
        <Link to={ROUTES.CHANGE_PASSWORD} className="profile-change-password-link">
          <Button type="button" variant="outline" size="large">
            Đổi mật khẩu
          </Button>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="large"
          className="profile-card-delete-btn"
          onClick={onDeleteAccount}
        >
          Xóa tài khoản
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
