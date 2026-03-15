// ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
import apiClient from './apiClient';

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  const users = Array.isArray(response) ? response : (response.data || []);
  return users.map((u) => (u.id && !u._id ? { ...u, _id: u.id } : u));
};

export const getAllUsers = async () => {
  const users = await getUsers();
  return { data: users };
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  const user = response?.id && !response?._id ? { ...response, _id: response.id } : response;
  return user;
};

export const createUser = async (data) => {
  const response = await apiClient.post('/users', data);
  return response?.id && !response?._id ? { ...response, _id: response.id } : response;
};

export const updateUser = async (id, data) => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response?.id && !response?._id ? { ...response, _id: response.id } : response;
};

export const deleteUser = async (id) => {
  await apiClient.delete(`/users/${id}`);
};
// ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====
