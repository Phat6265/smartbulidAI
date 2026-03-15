// ===== NEW FILE CREATED FOR SYSTEM SETTINGS FEATURE =====
import { create } from 'zustand';
import * as systemSettingService from '../services/systemSetting.service';

const useSystemSettingStore = create((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const settings = await systemSettingService.getSystemSettings();
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      const message = error?.message || 'Không thể tải cài đặt';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateSiteSettings: async (data) => {
    set({ loading: true, error: null });
    try {
      const settings = await systemSettingService.updateSiteSettings(data);
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      const message = error?.message || 'Cập nhật thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateShippingSettings: async (data) => {
    set({ loading: true, error: null });
    try {
      const settings = await systemSettingService.updateShippingSettings(data);
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      const message = error?.message || 'Cập nhật thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateCompanySettings: async (data) => {
    set({ loading: true, error: null });
    try {
      const settings = await systemSettingService.updateCompanySettings(data);
      set({ settings, loading: false });
      return settings;
    } catch (error) {
      const message = error?.message || 'Cập nhật thất bại';
      set({ error: message, loading: false });
      throw error;
    }
  }
}));

export default useSystemSettingStore;
