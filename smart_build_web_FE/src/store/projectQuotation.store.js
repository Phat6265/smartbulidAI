// Project Quotation Store - Zustand
import { create } from 'zustand';
import * as projectQuotationService from '../services/projectQuotation.service';

const useProjectQuotationStore = create((set, get) => ({
  projectQuotation: null,
  loading: false,
  error: null,

  getProjectQuotation: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await projectQuotationService.getProjectQuotation(projectData);
      const projectQuotation = response.data || response;
      set({ projectQuotation, loading: false });
      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải dữ liệu. Vui lòng kiểm tra backend MERN đang chạy.';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  clearProjectQuotation: () => set({ projectQuotation: null })
}));

export default useProjectQuotationStore;
