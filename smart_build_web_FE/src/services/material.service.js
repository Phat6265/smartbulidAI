// Material Service
import apiClient from './apiClient';

/**
 * Get all materials with optional filters
 * @param {Object} filters - { category, subcategory, detail, minPrice, maxPrice, search }
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
      const searchLower = filters.search.toLowerCase();
      materials = materials.filter(m =>
        m.name.toLowerCase().includes(searchLower) ||
        m.category.toLowerCase().includes(searchLower) ||
        (m.subcategory && m.subcategory.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.minPrice) {
      materials = materials.filter(m => m.priceReference >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      materials = materials.filter(m => m.priceReference <= parseFloat(filters.maxPrice));
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
    const material = response;
    if (material && material.id && !material._id) {
      material._id = material.id;
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

/**
 * Update material stock quantity (Staff/Admin)
 * @param {string} id - Material ID
 * @param {number} stockQuantity
 * @returns {Promise}
 */
export const updateMaterialStock = async (id, stockQuantity) => {
  try {
    return await apiClient.put(`/materials/${id}/stock`, { stockQuantity });
  } catch (error) {
    throw error;
  }
};

