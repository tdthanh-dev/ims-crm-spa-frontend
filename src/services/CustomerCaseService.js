import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Customer Case Service - handles customer treatment case management
 */
class CustomerCaseService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.CUSTOMER_CASES);
  }

  /**
   * Get cases by customer ID
   * @param {string|number} customerId - Customer ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCustomerId(customerId, params = {}) {
    const endpoint = `${this.endpoint}/customer/${customerId}`;
    return this.getAll(params, endpoint);
  }

  /**
   * Get cases by status
   * @param {string} status - Case status
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByStatus(status, params = {}) {
    return this.getAll({
      ...params,
      status
    });
  }

  /**
   * Update case status
   * @param {string|number} id - Case ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  async updateCaseStatus(id, status) {
    const response = await this.apiClient.put(`${this.endpoint}/${id}/status?status=${status}`);
    return response.data;
  }

  /**
   * Get case statistics
   * @returns {Promise} API response
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return response.data;
  }

  /**
   * Get cases by service ID
   * @param {string|number} serviceId - Service ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByServiceId(serviceId, params = {}) {
    return this.getAll({
      ...params,
      serviceId
    });
  }
}

export const customerCaseService = new CustomerCaseService();
export default customerCaseService;
