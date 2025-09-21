import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Service Management API - Complete integration with BE endpoints
 */
export const servicesApi = {
  // Get all services with pagination and filtering
  async getServices(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'serviceId',
      sortDir = 'desc',
      isActive
    } = params

    const queryParams = {
      page,
      size,
      sortBy,
      sortDir
    }

    // Add isActive filter if provided
    if (isActive !== undefined) {
      queryParams.isActive = isActive
    }

    const response = await apiClient.get(API_ENDPOINTS.SERVICES, { params: queryParams })
    return extractApiResponse(response)
  },

  // Get active services only
  async getActiveServices(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'serviceId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/active`, {
      params: { page, size, sortBy, sortDir }
    })
    return extractApiResponse(response)
  },

  // Get service by ID
  async getServiceById(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/${id}`)
    return extractApiResponse(response)
  },

  // Create new service
  async createService(serviceData) {
    const response = await apiClient.post(API_ENDPOINTS.SERVICES, serviceData)
    return extractApiResponse(response)
  },

  // Update service
  async updateService(id, serviceData) {
    const response = await apiClient.put(`${API_ENDPOINTS.SERVICES}/${id}`, serviceData)
    return extractApiResponse(response)
  },

  // Delete service
  async deleteService(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.SERVICES}/${id}`)
    return extractApiResponse(response)
  },

  // ========== BULK OPERATIONS ==========

  // Bulk update services
  async bulkUpdateServices(updates) {
    const response = await apiClient.put(`${API_ENDPOINTS.SERVICES}/bulk`, updates)
    return extractApiResponse(response)
  },

  // Bulk delete services
  async bulkDeleteServices(serviceIds) {
    const response = await apiClient.delete(`${API_ENDPOINTS.SERVICES}/bulk`, {
      data: { ids: serviceIds }
    })
    return extractApiResponse(response)
  },

  // Bulk update service status
  async bulkUpdateServiceStatus(serviceIds, isActive) {
    const response = await apiClient.put(`${API_ENDPOINTS.SERVICES}/bulk/status`, {
      ids: serviceIds,
      isActive
    })
    return extractApiResponse(response)
  },

  // ========== SEARCH & FILTERING ==========

  // Search services
  async searchServices(searchTerm, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'serviceId',
      sortDir = 'desc',
      isActive
    } = params

    const queryParams = {
      page,
      size,
      sortBy,
      sortDir,
      search: searchTerm
    }

    if (isActive !== undefined) {
      queryParams.isActive = isActive
    }

    const response = await apiClient.get(API_ENDPOINTS.SERVICES, { params: queryParams })
    return extractApiResponse(response)
  },

  // Filter services by category
  async getServicesByCategory(category, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'serviceId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/category/${category}`, {
      params: { page, size, sortBy, sortDir }
    })
    return extractApiResponse(response)
  },

  // ========== STATISTICS & ANALYTICS ==========

  // Get service statistics
  async getServiceStatistics(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/statistics`, { params })
    return extractApiResponse(response)
  },

  // Get service categories with counts
  async getServiceCategoriesWithCounts() {
    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/categories/counts`)
    return extractApiResponse(response)
  },

  // Get popular services
  async getPopularServices(params = {}) {
    const { limit = 10, period = 'month' } = params
    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/popular`, {
      params: { limit, period }
    })
    return extractApiResponse(response)
  },

  // Get service revenue analysis
  async getServiceRevenueAnalysis(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.SERVICES}/revenue-analysis`, { params })
    return extractApiResponse(response)
  },

  // ========== UTILITY METHODS ==========

  // Validate service data
  validateServiceData(serviceData) {
    const errors = []

    if (!serviceData.serviceName?.trim()) {
      errors.push('Tên dịch vụ không được để trống')
    }

    if (!serviceData.category) {
      errors.push('Danh mục dịch vụ không được để trống')
    }

    if (serviceData.price === undefined || serviceData.price < 0) {
      errors.push('Giá dịch vụ phải lớn hơn hoặc bằng 0')
    }

    if (serviceData.duration && serviceData.duration <= 0) {
      errors.push('Thời gian thực hiện phải lớn hơn 0')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Format service price for display
  formatServicePrice(price) {
    if (price === undefined || price === null) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  },

  // Get service status color for UI
  getServiceStatusColor(isActive) {
    return isActive ? '#10b981' : '#ef4444' // Green for active, red for inactive
  }
}

export default servicesApi
