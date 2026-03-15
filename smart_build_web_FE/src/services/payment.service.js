// Payment Service - VNPay
import apiClient from './apiClient';

/**
 * Create VNPay payment URL
 * @param {Object} paymentData - { orderId, amount, bankCode?, language? }
 * @returns {Promise} - { paymentUrl, txnRef }
 */
export const createVNPayPaymentUrl = async (paymentData) => {
  try {
    const response = await apiClient.post('/payment/vnpay/create_payment_url', paymentData);
    return response;
  } catch (error) {
    throw error;
  }
};
