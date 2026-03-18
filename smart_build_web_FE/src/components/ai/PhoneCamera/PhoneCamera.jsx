// Phone Camera Component - Locket-style UI
import React, { useRef, useState, useEffect } from 'react';
import { FiUpload, FiRotateCw, FiX, FiRefreshCw } from 'react-icons/fi';
import { isValidImageFile } from '../../../utils/validators';
import './PhoneCamera.css';

const PhoneCamera = ({ onImageSelect, onImageRemove, selectedImage, disabled = false }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' (front) or 'environment' (back)
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Switch camera (front/back)
  const switchCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    // Wait a bit before starting new camera
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedImage(URL.createObjectURL(blob));
        onImageSelect?.(file);
        stopCamera();
        setIsCapturing(false);
      }
    }, 'image/jpeg', 0.9);
  };

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setError('Vui lòng chọn file ảnh (JPEG, PNG) và kích thước không quá 5MB');
      return;
    }

    setError(null);
    setCapturedImage(URL.createObjectURL(file));
    onImageSelect?.(file);
    stopCamera();
  };

  // Handle remove image
  const handleRemove = () => {
    setCapturedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
    startCamera(); // Restart camera after removing
  };

  // Initialize camera on mount
  useEffect(() => {
    if (!disabled && !selectedImage && !capturedImage) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restart camera when image is removed
  useEffect(() => {
    if (!selectedImage && !capturedImage && !disabled) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, capturedImage, disabled]);

  const displayImage = capturedImage || (selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage);

  return (
    <div className="phone-camera">
      <div className="phone-frame">
        {/* Phone notch (top) */}
        <div className="phone-notch"></div>

        {/* Camera viewfinder */}
        <div className="phone-screen">
          {displayImage ? (
            <div className="phone-preview">
              <img
                src={displayImage}
                alt="Captured"
                className="phone-preview-img"
              />
              {!disabled && (
                <button
                  className="phone-btn-remove"
                  onClick={handleRemove}
                  aria-label="Remove image"
                >
                  <FiX />
                </button>
              )}
            </div>
          ) : (
            <div className="phone-viewfinder">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`phone-video ${facingMode === 'user' ? 'phone-video--flip' : ''}`}
              />
              {error && (
                <div className="phone-error">
                  <p>{error}</p>
                  <button onClick={startCamera} className="phone-btn-retry">
                    <FiRefreshCw /> Thử lại
                  </button>
                </div>
              )}
              {!stream && !error && (
                <div className="phone-loading">
                  <div className="phone-loading-spinner"></div>
                  <p>Đang khởi động camera...</p>
                </div>
              )}
            </div>
          )}

          {/* Control buttons overlay */}
          {!displayImage && stream && (
            <div className="phone-controls">
              {/* Switch camera button */}
              <button
                className="phone-btn-switch"
                onClick={switchCamera}
                aria-label="Switch camera"
                disabled={disabled}
              >
                <FiRotateCw />
              </button>

              {/* Capture button */}
              <button
                className="phone-btn-capture"
                onClick={capturePhoto}
                disabled={disabled || isCapturing}
                aria-label="Capture photo"
              >
                <span className="phone-btn-capture-inner"></span>
              </button>

              {/* Upload button */}
              <button
                className="phone-btn-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                aria-label="Upload image"
              >
                <FiUpload />
              </button>
            </div>
          )}
        </div>

        {/* Phone bottom bezel */}
        <div className="phone-bezel"></div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="phone-input"
        disabled={disabled}
      />

      {/* Instructions */}
      {!displayImage && (
        <div className="phone-instructions">
          <p>Chụp ảnh hoặc tải lên từ thư viện</p>
          <p className="phone-instructions-hint">JPEG, PNG (tối đa 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default PhoneCamera;

