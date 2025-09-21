import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';
import { extractApiResponse } from '@/utils/apiUtils';

/**
 * Leads Service - handles consultation requests
 * Updated to match backend LeadController API structure
 */
class LeadsService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.LEADS);
  }

  /**
   * Get leads by status using dedicated endpoint
   * @param {string} status - Lead status (NEW, IN_PROGRESS, WON, LOST)
   * @param {Object} params - Pagination and sorting parameters
   * @returns {Promise} API response with Page<LeadResponse>
   */
  async getByStatus(status, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'leadId',
      sortDir = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    const response = await this.apiClient.get(`${this.endpoint}/status/${status}?${queryParams}`);
    return extractApiResponse(response);
  }

  /**
   * Get leads with search functionality
   * @param {string} searchTerm - Search term (name, phone, email)
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async searchLeads(searchTerm, params = {}) {
    return this.getAll({
      ...params,
      search: searchTerm
    });
  }

  /**
   * Update lead status using dedicated endpoint
   * @param {string|number} id - Lead ID
   * @param {string} status - New status (LeadStatus enum)
   * @param {string} note - Optional note for status change
   * @returns {Promise} API response with updated LeadResponse
   */
  async updateLeadStatus(id, status, note = '') {
    const requestData = {
      status: status,
      note: note.trim() || null
    };

    const response = await this.apiClient.put(`${this.endpoint}/${id}/status`, requestData);
    return extractApiResponse(response);
  }

  /**
   * Update lead information
   * @param {string|number} id - Lead ID
   * @param {Object} leadData - Lead data to update
   * @returns {Promise} API response with updated LeadResponse
   */
  async updateLead(id, leadData) {
    const response = await this.apiClient.put(`${this.endpoint}/${id}`, leadData);
    return extractApiResponse(response);
  }

  /**
   * Create new lead (public API - no authentication required)
   * @param {Object} leadData - Lead data
   * @returns {Promise} API response with created LeadResponse
   */
  async createLead(leadData) {
    const response = await this.apiClient.post(this.endpoint, leadData);
    return extractApiResponse(response);
  }

  /**
   * Get lead statistics
   * @returns {Promise} API response with LeadStats
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return extractApiResponse(response);
  }

  /**
   * Get lead statistics by status
   * @returns {Promise} API response with status statistics
   */
  async getStatusStats() {
    try {
      const statuses = ['NEW', 'IN_PROGRESS', 'WON', 'LOST'];
      const statusPromises = statuses.map(status =>
        this.apiClient.get(`${this.endpoint}/status/${status}?page=0&size=1`)
          .then(response => extractApiResponse(response))
          .then(data => ({
            status,
            count: data.totalElements || 0
          }))
          .catch(error => ({
            status,
            count: 0
          }))
      );

      const results = await Promise.all(statusPromises);
      const stats = {
        total: results.reduce((sum, item) => sum + item.count, 0),
        newRequests: results.find(item => item.status === 'NEW')?.count || 0,
        inProgress: results.find(item => item.status === 'IN_PROGRESS')?.count || 0,
        won: results.find(item => item.status === 'WON')?.count || 0,
        lost: results.find(item => item.status === 'LOST')?.count || 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching status statistics:', error);
      return {
        total: 0,
        newRequests: 0,
        inProgress: 0,
        won: 0,
        lost: 0
      };
    }
  }

  /**
   * Convert lead to customer
   * @param {string|number} leadId - Lead ID
   * @param {Object} customerData - Customer data
   * @returns {Promise} API response
   */
  async convertToCustomer(leadId, customerData) {
    const response = await this.apiClient.post(`${this.endpoint}/${leadId}/convert`, customerData);
    return extractApiResponse(response);
  }

  /**
   * Mark lead as won (converted to customer)
   * @param {string|number} id - Lead ID
   * @param {string|number} customerId - Customer ID
   * @returns {Promise} API response
   */
  async markAsWon(id, customerId) {
    return this.updateLeadStatus(id, 'WON', `Converted to customer ID: ${customerId}`);
  }

  /**
   * Mark lead as lost
   * @param {string|number} id - Lead ID
   * @param {string} reason - Reason for losing the lead
   * @returns {Promise} API response
   */
  async markAsLost(id, reason = '') {
    return this.updateLeadStatus(id, 'LOST', reason);
  }

  /**
   * Mark lead as in progress
   * @param {string|number} id - Lead ID
   * @param {string} note - Optional note
   * @returns {Promise} API response
   */
  async markAsInProgress(id, note = '') {
    return this.updateLeadStatus(id, 'IN_PROGRESS', note);
  }
}

export const leadsService = new LeadsService();
export default leadsService;
