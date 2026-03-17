// Material Service
import apiClient from './apiClient';
import { API_BASE_URL, MATERIAL_CATEGORIES, SUBCATEGORY_NAMES } from '../utils/constants';

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const apiOrigin = (API_BASE_URL || '').replace(/\/api\/?$/, '');

const resolveAssetUrl = (value) => {
  if (!value) return value;
  if (typeof value !== 'string') return value;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('blob:')) return value;
  if (!apiOrigin) return value;
  if (value.startsWith('/')) return `${apiOrigin}${value}`;
  return `${apiOrigin}/${value}`;
};

const normalizeMaterialImages = (material) => {
  const rawImages = Array.isArray(material.images)
    ? material.images
    : (typeof material.images === 'string' && material.images ? [material.images] : []);
  const fallback = material.imagePath ? [material.imagePath] : (material.image ? [material.image] : []);
  const images = (rawImages.length ? rawImages : fallback).filter(Boolean).map(resolveAssetUrl);

  return {
    ...material,
    imagePath: material.imagePath ? resolveAssetUrl(material.imagePath) : material.imagePath,
    images
  };
};

const categoryNameById = MATERIAL_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c.name;
  return acc;
}, {});

/**
 * Get all materials with optional filters
 * @param {Object} filters - { category, subcategory, detail, minPrice, maxPrice, search, sort, brand }
 * @returns {Promise}
 */
export const getMaterials = async (filters = {}) => {
  try {
    let url = '/materials';
    
    if (filters.category) {
      url += `?category=${filters.category}`;
    }
    
    // For json-server, we'll filter on client side for complex queries
    const response = await apiClient.get(url);
    // json-server returns array directly, not wrapped in data
    let materials = Array.isArray(response) ? response : (response.data || []);
    // Normalize: add _id from id for compatibility with MongoDB format
    materials = materials.map(m => {
      if (m.id && !m._id) {
        return { ...m, _id: m.id };
      }
      return m;
    });

    materials = materials.map(normalizeMaterialImages);
    
    // Apply client-side filters
    // Lưu ý: trong cấu trúc hiện tại, "detail" cũng map vào field subcategory.
    // Khi người dùng chọn cả subcategory + detail, ta ưu tiên detail (cụ thể hơn).
    if (filters.detail) {
      // Ưu tiên lọc theo detail (mã chi tiết)
      materials = materials.filter(m => m.subcategory === filters.detail);
    } else if (filters.subcategory) {
      // Chỉ khi KHÔNG có detail mới lọc theo subcategory cấp 2
      materials = materials.filter(m => m.subcategory === filters.subcategory);
    }
    
    if (filters.search) {
      const searchLower = normalizeText(filters.search);
      materials = materials.filter(m =>
        normalizeText(m.name).includes(searchLower) ||
        normalizeText(m.category).includes(searchLower) ||
        normalizeText(categoryNameById[m.category]).includes(searchLower) ||
        normalizeText(m.subcategory).includes(searchLower) ||
        normalizeText(SUBCATEGORY_NAMES[m.subcategory]).includes(searchLower) ||
        normalizeText(m.unit).includes(searchLower) ||
        normalizeText(m.description).includes(searchLower) ||
        normalizeText(m.priceReference).includes(searchLower) ||
        normalizeText(m.technicalSpecs?.size).includes(searchLower) ||
        normalizeText(m.technicalSpecs?.material).includes(searchLower) ||
        normalizeText(m.technicalSpecs?.standard).includes(searchLower) ||
        normalizeText(m.technicalSpecs?.brand).includes(searchLower)
      );
    }
    
    if (filters.brand) {
      const brandLower = normalizeText(filters.brand);
      materials = materials.filter(m => normalizeText(m.technicalSpecs?.brand || m.brand || m.manufacturer).includes(brandLower));
    }

    if (filters.minPrice) {
      materials = materials.filter(m => m.priceReference >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      materials = materials.filter(m => m.priceReference <= parseFloat(filters.maxPrice));
    }

    if (filters.sort) {
      if (filters.sort === 'price_asc') {
        materials = [...materials].sort((a, b) => (a.priceReference || 0) - (b.priceReference || 0));
      } else if (filters.sort === 'price_desc') {
        materials = [...materials].sort((a, b) => (b.priceReference || 0) - (a.priceReference || 0));
      } else if (filters.sort === 'name_asc') {
        materials = [...materials].sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name)));
      } else if (filters.sort === 'name_desc') {
        materials = [...materials].sort((a, b) => normalizeText(b.name).localeCompare(normalizeText(a.name)));
      }
    }
    
    return { data: materials };
  } catch (error) {
    throw error;
  }
};

/**
 * Get material by ID
 * @param {string} id - Material ID
 * @returns {Promise}
 */
export const getMaterialById = async (id) => {
  try {
    const response = await apiClient.get(`/materials/${id}`);
    // json-server returns object directly
    // Normalize: add _id from id for compatibility
    let material = response;
    if (material && material.id && !material._id) {
      material._id = material.id;
    }
    if (material) {
      material = normalizeMaterialImages(material);
    }
    return { data: material };
  } catch (error) {
    throw error;
  }
};

/**
 * Create material (Admin only)
 * @param {Object} materialData
 * @returns {Promise}
 */
export const createMaterial = async (materialData) => {
  try {
    return await apiClient.post('/materials', materialData);
  } catch (error) {
    throw error;
  }
};

/**
 * Update material (Admin only)
 * @param {string} id - Material ID
 * @param {Object} materialData
 * @returns {Promise}
 */
export const updateMaterial = async (id, materialData) => {
  try {
    return await apiClient.put(`/materials/${id}`, materialData);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete material (Admin only)
 * @param {string} id - Material ID
 * @returns {Promise}
 */
export const deleteMaterial = async (id) => {
  try {
    return await apiClient.delete(`/materials/${id}`);
  } catch (error) {
    throw error;
  }
};

