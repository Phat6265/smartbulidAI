// Image Uploader Component for AI Recognition
import React, { useRef, useState } from 'react';
import { FiCamera, FiUpload, FiX } from 'react-icons/fi';
import { isValidImageFile } from '../../../utils/validators';
import './ImageUploader.css';

const ImageUploader = ({ onImageSelect, onImageRemove, selectedImage, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setError('Vui lòng chọn file ảnh (JPEG, PNG) và kích thước không quá 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onImageSelect?.(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="image-uploader-input"
        disabled={disabled}
      />

      {preview || selectedImage ? (
        <div className="image-uploader-preview">
          <img
            src={preview || (selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage)}
            alt="Preview"
            className="image-uploader-preview-img"
          />
          {!disabled && (
            <button
              className="image-uploader-remove"
              onClick={handleRemove}
              aria-label="Remove image"
            >
              <FiX />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`image-uploader-placeholder ${disabled ? 'image-uploader-placeholder--disabled' : ''}`}
          onClick={handleClick}
        >
          <div className="image-uploader-icon">
            <FiCamera />
          </div>
          <p className="image-uploader-text">Chụp hoặc tải ảnh vật liệu</p>
          <p className="image-uploader-hint">JPEG, PNG (tối đa 5MB)</p>
        </div>
      )}

      {error && <p className="image-uploader-error">{error}</p>}
    </div>
  );
};

export default ImageUploader;

