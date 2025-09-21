import apiClient from './apiClient';

/**
 * Extract data from ApiResponse format
 * @param {Object} response - Axios response
 * @returns {Object} Extracted data
 */
const extractApiResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid response format');
  }

  const apiResponse = response.data;

  // Check if response follows ApiResponse format
  if (typeof apiResponse === 'object' && 'success' in apiResponse) {
    if (!apiResponse.success) {
      const error = new Error(apiResponse.message || apiResponse.error || 'API request failed');
      error.response = { data: apiResponse };
      throw error;
    }
    return apiResponse.data;
  }

  // Fallback for responses that don't use ApiResponse wrapper
  return apiResponse;
};

/**
 * Base service class for common CRUD operations
 * Handles ApiResponse format from backend
 */
export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.apiClient = apiClient;
  }

  /**
   * Get all items with pagination and optional filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 0)
   * @param {number} params.size - Page size (default: 20)
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortDir - Sort direction (asc/desc)
   * @param {Object} params.filters - Additional filters
   * @param {string} customEndpoint - Optional custom endpoint to use instead of this.endpoint
   * @returns {Promise} API response
   */
  async getAll(params = {}, customEndpoint = null) {
    const {
      page = 0,
      size = 20,
      sortBy,
      sortDir,
      ...filters
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortDir) queryParams.append('sortDir', sortDir);

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = customEndpoint || this.endpoint;
    const response = await apiClient.get(`${endpoint}?${queryParams}`);
    return extractApiResponse(response);
  }

  /**
   * Get item by ID
   * @param {string|number} id - Item ID
   * @returns {Promise} API response
   */
  async getById(id) {
    const url = `${this.endpoint}/${id}`;
    console.log('🌐 [BaseService.getById] API Call:', url);
    console.log('📋 [BaseService.getById] Endpoint:', this.endpoint);
    
    const response = await apiClient.get(url);
    console.log('📥 [BaseService.getById] Raw Response:', response);
    console.log('📊 [BaseService.getById] Response Data:', response.data);
    
    const extractedData = extractApiResponse(response);
    console.log('✨ [BaseService.getById] Extracted Data:', extractedData);
    
    // Log loyalty program specific fields if present
    if (extractedData) {
      console.log('💰 [BaseService.getById] totalSpent:', extractedData.totalSpent);
      console.log('⭐ [BaseService.getById] totalPoints:', extractedData.totalPoints); 
      console.log('🏆 [BaseService.getById] tierCode:', extractedData.tierCode);
      console.log('👑 [BaseService.getById] isVip:', extractedData.isVip);
    }

    return extractedData;
  }

  /**
   * Create new item
   * @param {Object} data - Item data
   * @returns {Promise} API response
   */
  async create(data) {
    const response = await apiClient.post(this.endpoint, data);
    return extractApiResponse(response);
  }

  /**
   * Update item by ID
   * @param {string|number} id - Item ID
   * @param {Object} data - Updated data
   * @returns {Promise} API response
   */
  async update(id, data) {
    const response = await apiClient.put(`${this.endpoint}/${id}`, data);
    return extractApiResponse(response);
  }

  /**
   * Delete item by ID
   * @param {string|number} id - Item ID
   * @returns {Promise} API response
   */
  async delete(id) {
    const response = await apiClient.delete(`${this.endpoint}/${id}`);
    return extractApiResponse(response);
  }

  /**
   * Search items
   * @param {string} searchTerm - Search term
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async search(searchTerm, params = {}) {
    return this.getAll({
      ...params,
      search: searchTerm
    });
  }

  /**
   * Update status of item
   * @param {string|number} id - Item ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  async updateStatus(id, status) {
    const response = await apiClient.put(`${this.endpoint}/${id}/status`, { status });
    return extractApiResponse(response);
  }
}

export default BaseService;
