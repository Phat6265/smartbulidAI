import apiClient from './apiClient';

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    const users = Array.isArray(response) ? response : (response.data || []);
    return { data: users.map(u => (u.id && !u._id ? { ...u, _id: u.id } : u)) };
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    return await apiClient.put(`/users/${id}`, data);
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    return await apiClient.delete(`/users/${id}`);
  } catch (error) {
    throw error;
  }
};
