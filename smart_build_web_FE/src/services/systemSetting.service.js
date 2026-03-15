// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import apiClient from './apiClient';

export const getSystemSettings = async () => {
  const response = await apiClient.get('/settings');
  return response;
};

export const updateSiteSettings = async (data) => {
  const response = await apiClient.put('/settings/site', data);
  return response;
};

export const updateShippingSettings = async (data) => {
  const response = await apiClient.put('/settings/shipping', data);
  return response;
};

export const updateCompanySettings = async (data) => {
  const response = await apiClient.put('/settings/company', data);
  return response;
};
