// Info Service - FAQ & site policies (public, no auth required for GET)
import apiClient from './apiClient';

/**
 * GET /api/info/faqs
 * @returns {Promise<Array>}
 */
export const getFaqs = async () => {
  const res = await apiClient.get('/info/faqs');
  return Array.isArray(res) ? res : (res?.data || []);
};

/**
 * GET /api/info/faqs/:id
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getFaqById = async (id) => {
  const res = await apiClient.get(`/info/faqs/${id}`);
  return res?.data || res;
};

/**
 * GET /api/info/privacy-policy
 * @returns {Promise<{ key, title, content }>}
 */
export const getPrivacyPolicy = async () => {
  const res = await apiClient.get('/info/privacy-policy');
  return res?.data || res;
};

/**
 * GET /api/info/terms-of-service
 * @returns {Promise<{ key, title, content }>}
 */
export const getTermsOfService = async () => {
  const res = await apiClient.get('/info/terms-of-service');
  return res?.data || res;
};

/**
 * GET /api/info/shipping-policy
 * @returns {Promise<{ key, title, content }>}
 */
export const getShippingPolicy = async () => {
  const res = await apiClient.get('/info/shipping-policy');
  return res?.data || res;
};
