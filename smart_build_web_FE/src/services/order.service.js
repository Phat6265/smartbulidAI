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
 * Get user orders
 * @param {string} userId
 * @returns {Promise}
 */
export const getUserOrders = async (userId) => {
  try {
    const response = await apiClient.get(`/orders?customerId=${userId}`);
    // json-server returns array directly
    const orders = Array.isArray(response) ? response : (response.data || []);
    // Normalize: add _id from id
    return orders.map(order => {
      if (order.id && !order._id) {
        return { ...order, _id: order.id };
      }
      return order;
    });
  } catch (error) {
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
