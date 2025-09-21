import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Services Service - handles spa services management
 */
class ServicesService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.SERVICES);
  }

  /**
   * Get active services only
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getActive(params = {}) {
    return this.getAll({
      ...params,
      isActive: true
    });
  }

  /**
   * Get services by category
   * @param {string} category - Service category
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCategory(category, params = {}) {
    return this.getAll({
      ...params,
      category
    });
  }

  /**
   * Get service categories
   * @returns {Promise} API response
   */
  async getCategories() {
    const response = await this.apiClient.get(`${this.endpoint}/categories`);
    return response.data;
  }

  /**
   * Toggle service active status
   * @param {string|number} id - Service ID
   * @param {boolean} isActive - Active status
   * @returns {Promise} API response
   */
  async toggleActive(id, isActive) {
    return this.update(id, { isActive });
  }

  /**
   * Get services by price range
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByPriceRange(minPrice, maxPrice, params = {}) {
    return this.getAll({
      ...params,
      minPrice,
      maxPrice
    });
  }

  /**
   * Search services by name
   * @param {string} searchTerm - Search term
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async searchServices(searchTerm, params = {}) {
    return this.search(searchTerm, params);
  }
}

export const servicesService = new ServicesService();
export default servicesService;
