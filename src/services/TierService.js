import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Tier Service - handles customer loyalty tiers and benefits
 */
class TierService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.TIERS);
  }

  /**
   * Get tiers by code
   * @param {string} code - Tier code
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCode(code, params = {}) {
    return this.getAll({
      ...params,
      code
    });
  }

  /**
   * Get all active tiers
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getActiveTiers(params = {}) {
    return this.getAll({
      ...params,
      isActive: true
    });
  }

  /**
   * Calculate tier for customer
   * @param {number} totalSpent - Customer's total spent amount
   * @param {number} totalPoints - Customer's total points
   * @returns {Promise} API response
   */
  async calculateTierForCustomer(totalSpent, totalPoints) {
    const response = await this.apiClient.post(`${this.endpoint}/calculate`, {
      totalSpent,
      totalPoints
    });
    return response.data;
  }

  /**
   * Get tier benefits
   * @param {string|number} tierId - Tier ID
   * @returns {Promise} API response
   */
  async getTierBenefits(tierId) {
    const response = await this.apiClient.get(`${this.endpoint}/${tierId}/benefits`);
    return response.data;
  }

  /**
   * Get tier upgrade requirements
   * @param {string|number} currentTierId - Current tier ID
   * @returns {Promise} API response
   */
  async getUpgradeRequirements(currentTierId) {
    const response = await this.apiClient.get(`${this.endpoint}/${currentTierId}/upgrade-requirements`);
    return response.data;
  }

  /**
   * Get customer tier progression
   * @param {string|number} customerId - Customer ID
   * @returns {Promise} API response
   */
  async getCustomerProgression(customerId) {
    const response = await this.apiClient.get(`${this.endpoint}/customer/${customerId}/progression`);
    return response.data;
  }

  /**
   * Get tier statistics
   * @returns {Promise} API response
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return response.data;
  }
}

export const tierService = new TierService();
export default tierService;
