// Materials Page
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import useMaterialStore from '../../store/material.store';
import { MATERIAL_CATEGORIES, SUBCATEGORY_NAMES, MATERIAL_TYPE_BADGES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LazyImage from '../../components/common/LazyImage';
import wallIcon from '../../assets/icon/wall-removebg-preview.png';
import cementIcon from '../../assets/icon/cement-removebg-preview.png';
import sandIcon from '../../assets/icon/sand-removebg-preview.png';
import steelIcon from '../../assets/icon/steel-removebg-preview.png';
import waterTapIcon from '../../assets/icon/water-tap-removebg-preview.png';
import './Materials.css';

// Icon mapping
const CATEGORY_ICONS = {
  'wall-removebg-preview.png': wallIcon,
  'cement-removebg-preview.png': cementIcon,
  'sand-removebg-preview.png': sandIcon,
  'steel-removebg-preview.png': steelIcon,
  'water-tap-removebg-preview.png': waterTapIcon
};

const Materials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { materials, filters, loading, error, fetchMaterials, setFilters, clearFilters } = useMaterialStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [sort, setSort] = useState(filters.sort || '');
  const [brand, setBrand] = useState(filters.brand || '');
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});

  const selectedCategory = MATERIAL_CATEGORIES.find(cat => cat.id === (filters.category || ''));
  const brandSubcategory = selectedCategory?.subcategories?.find(sub => sub.id === 'thuong-hieu');
  const brandOptions = (brandSubcategory?.details || []).map((detailId) => ({
    id: detailId,
    label: SUBCATEGORY_NAMES[detailId] || detailId
  }));

  useEffect(() => {
    if (brand && brandOptions.length === 0) {
      setBrand('');
    }
  }, [brand, brandOptions.length]);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const detail = searchParams.get('detail') || '';
    setFilters({
      category,
      subcategory,
      detail,
      search: debouncedSearch,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      sort,
      brand
    });
  }, [debouncedSearch, debouncedMinPrice, debouncedMaxPrice, sort, brand, searchParams, setFilters]);

  useEffect(() => {
    fetchMaterials().catch((error) => {
      console.error('Error fetching materials:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.subcategory, filters.detail, filters.search, filters.minPrice, filters.maxPrice, filters.sort]);

  // Scroll về đầu trang khi category/subcategory/detail thay đổi
  useEffect(() => {
    // Chỉ scroll khi có thay đổi filter (không phải lần đầu load)
    if (filters.category || filters.subcategory || filters.detail) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [filters.category, filters.subcategory, filters.detail]);

  const toggleCategoryExpand = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const toggleSubcategoryExpand = (subcategoryId, e) => {
    e.stopPropagation();
    setExpandedSubcategories(prev => ({ ...prev, [subcategoryId]: !prev[subcategoryId] }));
  };

  const handleCategoryChange = (categoryId) => {
    setSearchParams({ category: categoryId, subcategory: '', detail: '' });
    setFilters({ category: categoryId, subcategory: '', detail: '' });
    setBrand('');
    // Auto-expand when category is selected (only if not already expanded)
    if (categoryId && !expandedCategories[categoryId]) {
      setExpandedCategories(prev => ({ ...prev, [categoryId]: true }));
    }
    // Đóng tất cả các category khác khi chọn category mới
    if (categoryId) {
      setExpandedCategories(prev => {
        const newState = {};
        MATERIAL_CATEGORIES.forEach(cat => {
          if (cat.id === categoryId) {
            newState[cat.id] = true; // Mở category được chọn
          } else {
            newState[cat.id] = false; // Đóng các category khác
          }
        });
        return newState;
      });
    }
    // Scroll về đầu trang khi chọn category
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcategoryChange = (subcategoryId) => {
    const params = { category: filters.category };
    if (subcategoryId) {
      params.subcategory = subcategoryId;
      params.detail = '';
    }
    setSearchParams(params);
    setFilters({ ...filters, subcategory: subcategoryId || '', detail: '' });
    // Auto-expand when subcategory is selected (only if not already expanded)
    if (subcategoryId && !expandedSubcategories[subcategoryId]) {
      setExpandedSubcategories(prev => ({ ...prev, [subcategoryId]: true }));
    }
    // Scroll về đầu trang khi chọn subcategory
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailChange = (detailId) => {
    const params = { category: filters.category, subcategory: filters.subcategory };
    if (detailId) {
      params.detail = detailId;
    }
    setSearchParams(params);
    setFilters({ ...filters, detail: detailId || '' });
    // Scroll về đầu trang khi chọn detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearAll = () => {
    setSearchParams({ category: '', subcategory: '', detail: '' });
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setBrand('');
    clearFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="materials-page">
      <div className="container">
        <h1 className="materials-title">Vật liệu xây dựng</h1>

        <div className="materials-layout">
          {/* Sidebar Filter - Scrollable với phân cấp 3 tầng */}
          <aside className="materials-sidebar">
            <div className="materials-sidebar-content">
              <div className="materials-filter-section">
                <h3 className="materials-filter-title">Loại vật liệu</h3>
                <div className="materials-filter-categories">
                  <button
                    className={`materials-filter-category ${!filters.category ? 'active' : ''}`}
                    onClick={() => {
                      setSearchParams({ category: '', subcategory: '', detail: '' });
                      setFilters({ category: '', subcategory: '', detail: '' });
                      // Scroll về đầu trang khi chọn "Tất cả"
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Tất cả
                  </button>
                  {MATERIAL_CATEGORIES.map((category) => {
                    const isExpanded = expandedCategories[category.id] ?? false;
                    const isActive = filters.category === category.id;
                    return (
                      <div key={category.id} className="materials-filter-category-wrapper">
                        <button
                          className={`materials-filter-category ${isActive ? 'active' : ''}`}
                          onClick={() => handleCategoryChange(category.id)}
                        >
                          <img 
                            src={CATEGORY_ICONS[category.iconPath]} 
                            alt={category.name}
                            className="materials-filter-category-icon"
                          />
                          <span>{category.name}</span>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <span 
                              className="materials-filter-expand-icon"
                              onClick={(e) => toggleCategoryExpand(category.id, e)}
                            >
                              {isExpanded ? '▼' : '▶'}
                            </span>
                          )}
                        </button>
                        
                        {/* Subcategories - Level 2 */}
                        {isExpanded && category.subcategories && category.subcategories.length > 0 && (
                          <div className="materials-filter-subcategories-level">
                            <button
                              className={`materials-filter-subcategory ${isActive && !filters.subcategory ? 'active' : ''}`}
                              onClick={() => handleSubcategoryChange('')}
                            >
                              Tất cả
                            </button>
                            {category.subcategories.map((subcat) => {
                              const isSubExpanded = expandedSubcategories[subcat.id] ?? false;
                              const isSubActive = filters.subcategory === subcat.id;
                              return (
                                <div key={subcat.id} className="materials-filter-subcategory-wrapper">
                                  <button
                                    className={`materials-filter-subcategory ${isSubActive ? 'active' : ''}`}
                                    onClick={() => handleSubcategoryChange(subcat.id)}
                                  >
                                    <span>{subcat.name}</span>
                                    {subcat.details && subcat.details.length > 0 && (
                                      <span 
                                        className="materials-filter-expand-icon"
                                        onClick={(e) => toggleSubcategoryExpand(subcat.id, e)}
                                      >
                                        {isSubExpanded ? '▼' : '▶'}
                                      </span>
                                    )}
                                  </button>
                                  
                                  {/* Detail Classifications - Level 3 */}
                                  {isSubExpanded && subcat.details && subcat.details.length > 0 && (
                                    <div className="materials-filter-details-level">
                                      {subcat.details.map((detailId) => (
                                        <button
                                          key={detailId}
                                          className={`materials-filter-detail ${filters.detail === detailId ? 'active' : ''}`}
                                          onClick={() => handleDetailChange(detailId)}
                                        >
                                          {SUBCATEGORY_NAMES[detailId] || detailId}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="materials-main">
            <div className="materials-toolbar">
              <div className="materials-toolbar-row materials-toolbar-row--top">
                <div className="materials-search">
                  <Input
                    type="text"
                    placeholder="Tìm theo tên, loại, thông số, đơn vị..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                  />
                </div>
              </div>

              <div className="materials-toolbar-row materials-toolbar-row--bottom">
                <div className="materials-price-range">
                  <Input
                    type="number"
                    placeholder="Giá từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="Giá đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>

                <select
                  className="materials-brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={brandOptions.length === 0}
                >
                  <option value="">{brandOptions.length ? 'Thương hiệu' : 'Không có thương hiệu'}</option>
                  {brandOptions.map((opt) => (
                    <option key={opt.id} value={opt.label}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  className="materials-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="">Sắp xếp</option>
                  <option value="price_asc">Giá tăng dần</option>
                  <option value="price_desc">Giá giảm dần</option>
                  <option value="name_asc">Tên A → Z</option>
                  <option value="name_desc">Tên Z → A</option>
                </select>

                <Button variant="outline-brown" size="small" onClick={handleClearAll}>
                  Xóa lọc
                </Button>
              </div>
              <div className="materials-toolbar-meta">
                Hiển thị {materials.length} vật liệu
              </div>
            </div>

            {loading ? (
              <div className="materials-loading">Đang tải...</div>
            ) : error ? (
              <div className="materials-error">
                <p>{error}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                  Vui lòng kiểm tra backend đang chạy (npm run dev trong thư mục backend).
                </p>
              </div>
            ) : materials.length === 0 ? (
              <div className="materials-empty">Không tìm thấy vật liệu nào</div>
            ) : (
              <div className="materials-grid">
                {materials.map((material) => (
                  <div
                    key={material._id}
                    className="materials-card"
                  >
                    <Link
                      to={isAuthenticated ? `/materials/${material._id}` : '#'}
                      onClick={(e) => {
                        if (!isAuthenticated) {
                          e.preventDefault();
                          navigate('/login');
                        }
                      }}
                      className="materials-card-link"
                    >
                      <div className="materials-card-image">
                        {material.images?.[0] ? (
                          <LazyImage 
                            src={material.images[0]} 
                            alt={material.name}
                            effect="blur"
                          />
                        ) : (
                          <div className="materials-card-placeholder">📦</div>
                        )}
                      </div>
                    </Link>
                    <div className="materials-card-content">
                      <div className="materials-card-header">
                        <h3 className="materials-card-name">{material.name}</h3>
                        {material.materialType && MATERIAL_TYPE_BADGES[material.materialType] && (
                          <span 
                            className="materials-card-badge"
                            style={{
                              backgroundColor: MATERIAL_TYPE_BADGES[material.materialType].bgColor,
                              color: MATERIAL_TYPE_BADGES[material.materialType].textColor,
                              borderColor: MATERIAL_TYPE_BADGES[material.materialType].color
                            }}
                          >
                            {MATERIAL_TYPE_BADGES[material.materialType].label}
                          </span>
                        )}
                      </div>
                      <p className="materials-card-category">{(() => {
                        const cat = MATERIAL_CATEGORIES.find(c => c.id === (material.category || ''));
                        const catName = (cat && cat.name) ? cat.name : (material.category || '');
                        const subName = SUBCATEGORY_NAMES[material.subcategory] || '';
                        return subName ? `${catName} — ${subName}` : catName;
                      })()}</p>
                      {isAuthenticated ? (
                        <>
                          <p className="materials-card-price">
                            {formatCurrency(material.priceReference)}
                          </p>
                          <Link to={`/materials/${material._id}`}>
                            <Button variant="primary" size="small" fullWidth>
                              Xem chi tiết
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Button 
                          variant="outline-brown" 
                          size="small" 
                          fullWidth
                          onClick={() => navigate('/login')}
                        >
                          Đăng nhập để xem giá
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Materials;

