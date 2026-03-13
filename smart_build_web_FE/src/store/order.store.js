// Order Store - Zustand
import { create } from 'zustand';
import * as orderService from '../services/order.service';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // Create order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await orderService.createOrder(orderData);
      const order = response.data || response;
      // Normalize: add _id from id
      const normalizedOrder = order.id && !order._id ? { ...order, _id: order.id } : order;
      set({ currentOrder: normalizedOrder, loading: false });
      return normalizedOrder;
    } catch (error) {
      const errorMessage = error?.message || 'Có lỗi xảy ra khi tạo đơn hàng';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch user orders
  fetchUserOrders: async (userId) => {
    set({ loading: true, error: null });
    try {
      const orders = await orderService.getUserOrders(userId);
      set({ orders, loading: false });
      return orders;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải danh sách đơn hàng';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch order by ID
  fetchOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.getOrderById(orderId);
      set({ currentOrder: order, loading: false });
      return order;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể tải thông tin đơn hàng';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.updateOrderStatus(orderId, status);
      // Update in orders list if exists
      set((state) => ({
        orders: state.orders.map(o => 
          (o._id === orderId || o.id === orderId) ? { ...o, status } : o
        ),
        currentOrder: state.currentOrder && 
          (state.currentOrder._id === orderId || state.currentOrder.id === orderId)
          ? { ...state.currentOrder, status }
          : state.currentOrder,
        loading: false
      }));
      return order;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể cập nhật trạng thái đơn hàng';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Confirm delivery
  confirmDelivery: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const order = await orderService.confirmDelivery(orderId);
      set((state) => ({
        orders: state.orders.map(o => 
          (o._id === orderId || o.id === orderId) ? { ...o, status: 'completed' } : o
        ),
        currentOrder: state.currentOrder && 
          (state.currentOrder._id === orderId || state.currentOrder.id === orderId)
          ? { ...state.currentOrder, status: 'completed' }
          : state.currentOrder,
        loading: false
      }));
      return order;
    } catch (error) {
      const errorMessage = error?.message || 'Không thể xác nhận giao hàng';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null })
}));

export default useOrderStore;
