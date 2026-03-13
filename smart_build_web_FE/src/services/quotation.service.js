// Quotation Service
import apiClient from './apiClient';

/**
 * Create quotation request
 * @param {Object} quotationData - { items, location }
 * @returns {Promise}
 */
export const createQuotation = async (quotationData) => {
  try {
    const response = await apiClient.post('/quotations', quotationData);
    // Normalize: add _id from id for compatibility
    if (response && response.id && !response._id) {
      response._id = response.id;
    }
    return { data: response };
  } catch (error) {
    throw error;
  }
};

/**
 * Get quotation by ID
 * @param {string} id - Quotation ID
 * @returns {Promise}
 */
export const getQuotationById = async (id) => {
  try {
    const response = await apiClient.get(`/quotations/${id}`);
    // Normalize: add _id from id for compatibility
    if (response && response.id && !response._id) {
      response._id = response.id;
    }
    return { data: response };
  } catch (error) {
    throw error;
  }
};

/**
 * Get my quotations (Customer)
 * @returns {Promise}
 */
export const getMyQuotations = async () => {
  try {
    // In real app, this would filter by current user
    // For json-server, we'll get all and filter client-side
    const response = await apiClient.get('/quotations');
    // json-server returns array directly
    const quotations = Array.isArray(response) ? response : (response.data || []);
    // Normalize: add _id from id for compatibility
    const normalized = quotations.map(q => {
      if (q.id && !q._id) {
        return { ...q, _id: q.id };
      }
      return q;
    });
    return { data: normalized };
  } catch (error) {
    throw error;
  }
};

/**
 * Get all quotations (Admin)
 * @param {Object} filters - { status, page, limit }
 * @returns {Promise}
 */
export const getAllQuotations = async (filters = {}) => {
  try {
    let url = '/quotations';
    if (filters.status) {
      url += `?status=${filters.status}`;
    }
    const response = await apiClient.get(url);
    // json-server returns array directly
    const quotations = Array.isArray(response) ? response : (response.data || []);
    // Normalize: add _id from id for compatibility
    const normalized = quotations.map(q => {
      if (q.id && !q._id) {
        return { ...q, _id: q.id };
      }
      return q;
    });
    return { data: normalized };
  } catch (error) {
    throw error;
  }
};

/**
 * Update quotation (Admin)
 * @param {string} id - Quotation ID
 * @param {Object} quotationData
 * @returns {Promise}
 */
export const updateQuotation = async (id, quotationData) => {
  try {
    return await apiClient.put(`/quotations/${id}`, quotationData);
  } catch (error) {
    throw error;
  }
};

/**
 * Accept quotation (Customer)
 * @param {string} id - Quotation ID
 * @returns {Promise}
 */
export const acceptQuotation = async (id) => {
  try {
    return await apiClient.put(`/quotations/${id}/accept`);
  } catch (error) {
    throw error;
  }
};

/**
 * Reject quotation (Customer)
 * @param {string} id - Quotation ID
 * @returns {Promise}
 */
export const rejectQuotation = async (id) => {
  try {
    return await apiClient.put(`/quotations/${id}/reject`);
  } catch (error) {
    throw error;
  }
};
