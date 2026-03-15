// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
import { create } from 'zustand';
import * as userService from '../services/user.service';
// ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
import * as adminUserService from '../services/admin.user.service';
// ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====

const useUserStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,
  // ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
  users: [],
  selectedUser: null,
  // ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await userService.getProfile();
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      const message = error?.message || 'Không thể tải hồ sơ';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const profile = await userService.updateProfile(data);
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      const message = error?.message || 'Cập nhật thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateAvatar: async (avatarUrlOrFile) => {
    set({ loading: true, error: null });
    try {
      // ===== MODIFIED START (AVATAR UPLOAD FEATURE) =====
      const profile =
        avatarUrlOrFile instanceof File
          ? await userService.uploadAvatar(avatarUrlOrFile)
          : await userService.updateAvatar(avatarUrlOrFile);
      // ===== MODIFIED END (AVATAR UPLOAD FEATURE) =====
      set({ profile, loading: false });
      return profile;
    } catch (error) {
      const message = error?.message || 'Cập nhật avatar thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await userService.deleteAccount();
      set({ profile: null, loading: false });
    } catch (error) {
      const message = error?.message || 'Xóa tài khoản thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearProfile: () => set({ profile: null, error: null }),

  // ===== MODIFIED START (ADMIN USER CRUD FEATURE) =====
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await adminUserService.getUsers();
      set({ users, loading: false });
      return users;
    } catch (error) {
      const message = error?.message || 'Không thể tải danh sách người dùng';
      set({ error: message, loading: false });
      throw error;
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const selectedUser = await adminUserService.getUserById(id);
      set({ selectedUser, loading: false });
      return selectedUser;
    } catch (error) {
      const message = error?.message || 'Không thể tải thông tin người dùng';
      set({ error: message, loading: false });
      throw error;
    }
  },

  createUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = await adminUserService.createUser(data);
      set((s) => ({ users: [user, ...s.users], loading: false }));
      return user;
    } catch (error) {
      const message = error?.message || 'Tạo người dùng thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await adminUserService.updateUser(id, data);
      set((s) => ({
        users: s.users.map((u) => (u._id === id || u.id === id ? updated : u)),
        selectedUser: s.selectedUser && (s.selectedUser._id === id || s.selectedUser.id === id) ? updated : s.selectedUser,
        loading: false
      }));
      return updated;
    } catch (error) {
      const message = error?.message || 'Cập nhật thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await adminUserService.deleteUser(id);
      set((s) => ({
        users: s.users.filter((u) => u._id !== id && u.id !== id),
        selectedUser: s.selectedUser && s.selectedUser._id !== id && s.selectedUser.id !== id ? s.selectedUser : null,
        loading: false
      }));
    } catch (error) {
      const message = error?.message || 'Xóa thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearSelectedUser: () => set({ selectedUser: null })
  // ===== MODIFIED END (ADMIN USER CRUD FEATURE) =====
}));

export default useUserStore;
