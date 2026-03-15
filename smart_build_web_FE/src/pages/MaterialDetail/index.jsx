// Material Detail Page
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useMaterialStore from '../../store/material.store';
import useCartStore from '../../store/cart.store';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import { MATERIAL_CATEGORIES, SUBCATEGORY_NAMES } from '../../utils/constants';
import { getMaterialImage } from '../../utils/materialImages';
import './MaterialDetail.css';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentMaterial, loading, error, fetchMaterialById } = useMaterialStore();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (currentMaterial) {
      addItem(currentMaterial);
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  useEffect(() => {
    if (id) {
      fetchMaterialById(id).catch((err) => {
        console.error('Error fetching material:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="material-detail-loading">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="material-detail-error">
        <p>{error}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Vui lòng kiểm tra backend MERN đang chạy.
        </p>
        <Button onClick={() => navigate(-1)} variant="outline" style={{ marginTop: '1rem' }}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (!currentMaterial) {
    return (
      <div className="material-detail-empty">
        <p>Không tìm thấy vật liệu</p>
        <Button onClick={() => navigate(-1)} variant="outline" style={{ marginTop: '1rem' }}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="material-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="material-detail-back">
          ← Quay lại
        </button>

        <div className="material-detail-content">
          <div className="material-detail-image">
            {(() => {
              // Ưu tiên sử dụng ảnh từ assets cho danh mục Sắt
              const assetImage = getMaterialImage(currentMaterial);
              const imageUrl = assetImage || currentMaterial.images?.[0];
              
              return imageUrl ? (
                <img src={imageUrl} alt={currentMaterial.name} />
              ) : (
                <div className="material-detail-placeholder">📦</div>
              );
            })()}
          </div>

          <div className="material-detail-info">
            <h1 className="material-detail-name">{currentMaterial.name}</h1>
            <p className="material-detail-category">{(() => {
              const cat = MATERIAL_CATEGORIES.find(c => c.id === (currentMaterial.category || ''));
              const catName = (cat && cat.name) ? cat.name : (currentMaterial.category || '');
              const subName = SUBCATEGORY_NAMES[currentMaterial.subcategory] || '';
              return subName ? `${catName} — ${subName}` : catName;
            })()}</p>
            <p className="material-detail-price">
              {formatCurrency(currentMaterial.priceReference)}
            </p>

            {currentMaterial.technicalSpecs && (
              <div className="material-detail-specs">
                <h3>Thông số kỹ thuật</h3>
                <ul>
                  {currentMaterial.technicalSpecs.size && (
                    <li>Kích thước: {currentMaterial.technicalSpecs.size}</li>
                  )}
                  {currentMaterial.technicalSpecs.material && (
                    <li>Chất liệu: {currentMaterial.technicalSpecs.material}</li>
                  )}
                  {currentMaterial.technicalSpecs.standard && (
                    <li>Tiêu chuẩn: {currentMaterial.technicalSpecs.standard}</li>
                  )}
                </ul>
              </div>
            )}

            <div className="material-detail-actions">
              <Button variant="primary" size="large" fullWidth onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="large" fullWidth>
                So sánh
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;

