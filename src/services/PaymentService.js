import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Payment Service - handles payment processing and transactions
 */
class PaymentService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.PAYMENTS);
  }

  /**
   * Get payments by invoice ID
   * @param {string|number} invoiceId - Invoice ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByInvoiceId(invoiceId, params = {}) {
    return this.getAll({
      ...params,
      invoiceId
    });
  }

  /**
   * Get payments by customer ID
   * @param {string|number} customerId - Customer ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCustomerId(customerId, params = {}) {
    return this.getAll({
      ...params,
      customerId
    });
  }

  /**
   * Get payments by payment method
   * @param {string} method - Payment method
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByPaymentMethod(method, params = {}) {
    return this.getAll({
      ...params,
      method
    });
  }

  /**
   * Process payment for invoice
   * @param {string|number} invoiceId - Invoice ID
   * @param {number} amount - Payment amount
   * @param {string} method - Payment method
   * @param {string} transactionId - Optional transaction ID
   * @returns {Promise} API response
   */
  async processPayment(invoiceId, amount, method, transactionId = '') {
    const paymentRequest = {
      invoiceId,
      amount,
      method,
      transactionId
    };

    return this.create(paymentRequest);
  }

  /**
   * Update payment status
   * @param {string|number} id - Payment ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  async updatePaymentStatus(id, status) {
    const response = await this.apiClient.put(`${this.endpoint}/${id}/status?status=${status}`);
    return response.data;
  }

  /**
   * Get payment statistics
   * @returns {Promise} API response
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return response.data;
  }

  /**
   * Get daily payments
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} API response
   */
  async getDailyPayments(date) {
    return this.getAll({
      date
    });
  }

  /**
   * Get payments by date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByDateRange(startDate, endDate, params = {}) {
    return this.getAll({
      ...params,
      startDate,
      endDate
    });
  }

  /**
   * Refund payment
   * @param {string|number} id - Payment ID
   * @param {number} amount - Refund amount
   * @param {string} reason - Refund reason
   * @returns {Promise} API response
   */
  async refundPayment(id, amount, reason = '') {
    const response = await this.apiClient.post(`${this.endpoint}/${id}/refund`, {
      amount,
      reason
    });
    return response.data;
  }

  /**
   * Calculate points earned for payment
   * @param {number} amount - Payment amount
   * @returns {number} Points earned
   */
  calculatePointsEarned(amount) {
    // 1 point per 100,000 VND (configurable)
    return Math.floor(amount / 100000);
  }
}

export const paymentService = new PaymentService();
export default paymentService;
