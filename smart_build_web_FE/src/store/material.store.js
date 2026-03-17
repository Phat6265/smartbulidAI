// Material Store - Zustand
import { create } from 'zustand';
import * as materialService from '../services/material.service';

const useMaterialStore = create((set, get) => ({
  materials: [],
  currentMaterial: null,
  filters: {
    category: '',
    subcategory: '',
    detail: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sort: '',
    brand: ''
  },
  loading: false,
  error: null,

  // Actions
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  clearFilters: () => set({
    filters: {
      category: '',
      subcategory: '',
      detail: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '',
      brand: ''
    }
  }),

  fetchMaterials: async (filters = null) => {
    set({ loading: true, error: null });
    try {
      const activeFilters = filters || get().filters;
      const response = await materialService.getMaterials(activeFilters);
      // Handle both { data: [...] } and direct array
      const materials = response.data || (Array.isArray(response) ? response : []);
      set({ materials, loading: false });
      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải dữ liệu. Vui lòng kiểm tra backend MERN đang chạy.';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchMaterialById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await materialService.getMaterialById(id);
      set({ currentMaterial: response.data || response, loading: false });
      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải dữ liệu. Vui lòng kiểm tra backend MERN đang chạy.';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  clearCurrentMaterial: () => set({ currentMaterial: null })
}));

export default useMaterialStore;

