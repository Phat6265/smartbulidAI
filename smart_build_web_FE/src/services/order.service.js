// Order Service
import apiClient from './apiClient';

/**
 * Create order from cart
 * @param {Object} orderData - { items, shippingAddress, phone, note }
 * @returns {Promise}
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/orders', {
      ...orderData,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user orders with pagination and filter
 * @param {string} userId
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {string} status - Filter by status (default: 'all')
 * @returns {Promise} - { orders, total, page, limit, totalPages }
 */
export const getUserOrders = async (userId, page = 1, limit = 10, status = 'all') => {
  try {
    // Ensure userId is a string
    const customerId = String(userId);
    let url = `/orders?customerId=${customerId}&page=${page}&limit=${limit}`;
    if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    console.log('Fetching orders with customerId:', customerId, 'page:', page, 'limit:', limit, 'status:', status);
    const response = await apiClient.get(url);
    console.log('Orders API response:', response);
    // Backend returns { orders, total, page, limit, totalPages }
    const orders = response.orders || (Array.isArray(response) ? response : (response.data || []));
    console.log('Parsed orders:', orders);
    // Normalize: add _id from id
    const normalizedOrders = orders.map(order => {
      if (order.id && !order._id) {
        return { ...order, _id: order.id };
      }
      return order;
    });
    console.log('Normalized orders:', normalizedOrders);
    return {
      orders: normalizedOrders,
      total: response.total || normalizedOrders.length,
      page: response.page || page,
      limit: response.limit || limit,
      totalPages: response.totalPages || Math.ceil((response.total || normalizedOrders.length) / (response.limit || limit))
    };
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId
 * @returns {Promise}
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/orders/${orderId}`);
    // Normalize: add _id from id
    if (response.id && !response._id) {
      return { ...response, _id: response.id };
    }
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId
 * @param {string} status - 'pending_payment', 'paid_deposit', 'shipped', 'delivered', 'completed', 'cancelled'
 * @returns {Promise}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await getOrderById(orderId);
    return await apiClient.put(`/orders/${orderId}`, {
      ...order,
      status
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm delivery and pay remaining amount
 * @param {string} orderId
 * @returns {Promise}
 */
export const confirmDelivery = async (orderId) => {
  try {
    return await updateOrderStatus(orderId, 'completed');
  } catch (error) {
    throw error;
  }
};
