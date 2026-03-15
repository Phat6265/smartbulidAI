// Order Store - Zustand
import { create } from 'zustand';
import * as orderService from '../services/order.service';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  // Pagination info
  ordersPage: 1,
  ordersLimit: 10,
  ordersTotal: 0,
  ordersTotalPages: 1,

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

  // Fetch user orders with pagination and filter
  fetchUserOrders: async (userId, page = 1, limit = 10, status = 'all') => {
    set({ loading: true, error: null });
    try {
      const result = await orderService.getUserOrders(userId, page, limit, status);
      set({ 
        orders: result.orders, 
        ordersPage: result.page,
        ordersLimit: result.limit,
        ordersTotal: result.total,
        ordersTotalPages: result.totalPages,
        loading: false 
      });
      return result;
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
