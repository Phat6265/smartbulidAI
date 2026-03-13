// AI Recognition Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recognizeMaterial } from '../../services/ai.service';
import { AI_CONFIDENCE_THRESHOLD } from '../../utils/constants';
import PhoneCamera from '../../components/ai/PhoneCamera';
import ConfidenceBar from '../../components/ai/ConfidenceBar';
import Button from '../../components/common/Button';
import './AIRecognition.css';

const AIRecognition = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const handleRecognize = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await recognizeMaterial(selectedImage);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi nhận diện');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMaterials = () => {
    if (result?.materialType) {
      navigate(`/materials?category=${result.materialType}`);
    }
  };

  return (
    <div className="ai-recognition">
      <div className="container">
        <h1 className="ai-recognition-title">Nhận diện vật liệu</h1>
        <p className="ai-recognition-subtitle">
          Chụp hoặc tải ảnh vật liệu để nhận diện tự động
        </p>

        <div className="ai-recognition-content">
          <div className="ai-recognition-upload">
            <PhoneCamera
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              selectedImage={selectedImage}
              disabled={loading}
            />
            {selectedImage && (
              <Button
                variant="primary"
                size="large"
                fullWidth
                onClick={handleRecognize}
                loading={loading}
                className="ai-recognition-button"
              >
                Nhận diện vật liệu
              </Button>
            )}
          </div>

          {error && (
            <div className="ai-recognition-error">
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="ai-recognition-result">
              <h2 className="ai-recognition-result-title">Kết quả nhận diện</h2>
              <div className="ai-recognition-result-content">
                <div className="ai-recognition-material">
                  <p className="ai-recognition-material-label">Loại vật liệu:</p>
                  <p className="ai-recognition-material-type">
                    {result.materialType || 'Không xác định'}
                  </p>
                </div>
                {result.confidence !== undefined && (
                  <ConfidenceBar
                    confidence={result.confidence}
                    label="Độ tin cậy"
                  />
                )}
                {result.confidence >= AI_CONFIDENCE_THRESHOLD && (
                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleViewMaterials}
                  >
                    Xem sản phẩm phù hợp
                  </Button>
                )}
                {result.confidence < AI_CONFIDENCE_THRESHOLD && (
                  <p className="ai-recognition-warning">
                    Độ tin cậy thấp. Vui lòng thử lại với ảnh rõ hơn.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecognition;

