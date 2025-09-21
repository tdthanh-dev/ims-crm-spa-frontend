import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Customers Service - handles customer management
 */
class CustomersService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.CUSTOMERS);
  }

  /**
   * Search customers by keyword (name, phone, email)
   * @param {string} keyword - Search keyword
   * @param {Object} params - Additional parameters including pagination
   * @returns {Promise} API response
   */
  async search(keyword, params = {}) {
    return this.getAll({
      ...params,
      search: keyword
    });
  }

  /**
   * Search customers by phone
   * @param {string} phone - Phone number
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async searchByPhone(phone, params = {}) {
    return this.search(phone, params);
  }

  /**
   * Get customers by status
   * @param {string} status - Customer status
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
   * Get VIP customers
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getVipCustomers(params = {}) {
    return this.getAll({
      ...params,
      isVip: true
    });
  }

  /**
   * Update customer VIP status
   * @param {string|number} id - Customer ID
   * @param {boolean} isVip - VIP status
   * @returns {Promise} API response
   */
  async updateVipStatus(id, isVip) {
    return this.update(id, { isVip });
  }

  /**
   * Get customer statistics
   * @returns {Promise} API response
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return response.data;
  }
}

export const customersService = new CustomersService();
export default customersService;
