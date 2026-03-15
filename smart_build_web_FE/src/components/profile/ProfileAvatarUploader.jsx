// ===== NEW FILE CREATED FOR AVATAR UPLOAD FEATURE =====
import React, { useState, useRef } from 'react';
import Button from '../common/Button';
import './ProfileAvatarUploader.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ProfileAvatarUploader = ({ currentAvatarUrl, currentName, onUpload, loading }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const validateFile = (file) => {
    setError('');
    if (!file) return false;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP.');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError('Kích thước ảnh tối đa 2MB.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setPreview(null);
    setSelectedFile(null);
    if (!file) return;
    if (!validateFile(file)) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh.');
      return;
    }
    setError('');
    try {
      await onUpload(selectedFile);
      setPreview(null);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err?.message || 'Tải lên thất bại.');
    }
  };

  const displaySrc = preview || currentAvatarUrl;
  const initialLetter = (currentName || 'U').charAt(0).toUpperCase();

  return (
    <div className="profile-avatar-uploader">
      <div className="profile-avatar-uploader-preview">
        {displaySrc ? (
          <img src={displaySrc} alt="Avatar preview" />
        ) : (
          <div className="profile-avatar-uploader-placeholder">{initialLetter}</div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="profile-avatar-uploader-input"
      />
      <div className="profile-avatar-uploader-actions">
        <Button
          type="button"
          variant="outline"
          size="medium"
          onClick={() => inputRef.current?.click()}
        >
          Chọn ảnh
        </Button>
        {selectedFile && (
          <Button
            type="button"
            variant="primary"
            size="medium"
            loading={loading}
            onClick={handleUpload}
          >
            Tải lên
          </Button>
        )}
      </div>
      {error && <p className="profile-avatar-uploader-error">{error}</p>}
      <p className="profile-avatar-uploader-hint">JPEG, PNG hoặc WebP. Tối đa 2MB.</p>
    </div>
  );
};

export default ProfileAvatarUploader;
