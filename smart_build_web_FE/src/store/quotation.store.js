// Quotation Store - Zustand
import { create } from 'zustand';
import * as quotationService from '../services/quotation.service';

const useQuotationStore = create((set, get) => ({
  quotations: [],
  currentQuotation: null,
  loading: false,
  error: null,

  // Actions
  fetchQuotations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await quotationService.getMyQuotations();
      const quotations = response.data || (Array.isArray(response) ? response : []);
      set({ quotations, loading: false });
      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải dữ liệu. Vui lòng kiểm tra backend MERN đang chạy.';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchQuotationById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await quotationService.getQuotationById(id);
      set({ currentQuotation: response.data || response, loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  createQuotation: async (quotationData) => {
    set({ loading: true, error: null });
    try {
      const response = await quotationService.createQuotation(quotationData);
      set((state) => ({
        quotations: [response.data || response, ...state.quotations],
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  acceptQuotation: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await quotationService.acceptQuotation(id);
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q._id === id || q.id === id ? { ...q, status: 'accepted' } : q
        ),
        currentQuotation: state.currentQuotation && 
          (state.currentQuotation._id === id || state.currentQuotation.id === id)
          ? { ...state.currentQuotation, status: 'accepted' }
          : state.currentQuotation,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  rejectQuotation: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await quotationService.rejectQuotation(id);
      set((state) => ({
        quotations: state.quotations.map((q) =>
          q._id === id || q.id === id ? { ...q, status: 'rejected' } : q
        ),
        currentQuotation: state.currentQuotation && 
          (state.currentQuotation._id === id || state.currentQuotation.id === id)
          ? { ...state.currentQuotation, status: 'rejected' }
          : state.currentQuotation,
        loading: false
      }));
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  clearCurrentQuotation: () => set({ currentQuotation: null })
}));

export default useQuotationStore;
