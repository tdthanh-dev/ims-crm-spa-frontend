import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Customer Management API - Complete integration with BE endpoints
 */
export const customersApi = {
  // Get all customers with pagination and sorting
  async getCustomers(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'customerId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS, {
      params: { page, size, sortBy, sortDir }
    })
    return extractApiResponse(response)
  },

  // Get customer by ID with field-level permissions
  async getCustomerById(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`)
    return extractApiResponse(response)
  },

  // Alias for getCustomerById (for backward compatibility with useCustomerProfile)
  async getById(id) {
    return this.getCustomerById(id)
  },

  // Get customer cases/treatments
  async getCases(customerId, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = params

    // Use the correct backend endpoint for customer cases
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/customer/${customerId}`, {
      params: { page, size, sort: `${sortBy},${sortDir}` }
    })
    return extractApiResponse(response)
  },

  // Get customer financial data (invoices, payments)
  async getFinancial(customerId, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = params

    try {
      // Use the new dedicated endpoint for customer invoices
      const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/customer/${customerId}`, {
        params: { page, size, sort: `${sortBy},${sortDir}` }
      })

      const invoices = extractApiResponse(response)

      // Convert to pagination format for consistency with existing code
      return {
        content: Array.isArray(invoices) ? invoices.slice(page * size, (page + 1) * size) : [],
        totalElements: Array.isArray(invoices) ? invoices.length : 0,
        totalPages: Math.ceil((Array.isArray(invoices) ? invoices.length : 0) / size),
        size,
        number: page,
        first: page === 0,
        last: page >= Math.ceil((Array.isArray(invoices) ? invoices.length : 0) / size) - 1,
        numberOfElements: Array.isArray(invoices) ? invoices.slice(page * size, (page + 1) * size).length : 0,
        empty: !Array.isArray(invoices) || invoices.length === 0
      }
    } catch (error) {
      console.warn('Failed to load financial data:', error)
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size,
        number: page,
        first: page === 0,
        last: true,
        numberOfElements: 0,
        empty: true
      }
    }
  },

  // Create new customer
  async createCustomer(customerData) {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS, customerData)
    return extractApiResponse(response)
  },

  // Update customer
  async updateCustomer(id, customerData) {
    const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, customerData)
    return extractApiResponse(response)
  },

  // Delete customer
  async deleteCustomer(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`)
    return extractApiResponse(response)
  },

  // Refresh customer tier
  async refreshCustomerTier(customerId) {
    const response = await apiClient.post(`${API_ENDPOINTS.CUSTOMERS}/${customerId}/refresh-tier`)
    return extractApiResponse(response)
  },

  // Batch refresh all customer tiers
  async refreshAllCustomerTiers() {
    const response = await apiClient.post(`${API_ENDPOINTS.CUSTOMERS}/refresh-all-tiers`)
    return extractApiResponse(response)
  },

  // Search customers (uses same endpoint as getCustomers with search param)
  async searchCustomers(searchTerm, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'customerId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS, {
      params: { page, size, sortBy, sortDir, search: searchTerm }
    })
    return extractApiResponse(response)
  },

  // Search customers by phone (alias for search)
  async searchCustomersByPhone(phone, params = {}) {
    return this.searchCustomers(phone, params)
  },

  // ========== FIELD-LEVEL PERMISSION METHODS ==========

  // Check field permissions for staff
  async checkFieldPermissions(staffId, customerId = null) {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/field/check/${staffId}`, {
      params: customerId ? { customerId } : {}
    })
    return extractApiResponse(response)
  },

  // Check specific field permission
  async checkFieldPermission(staffId, fieldName, customerId = null) {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/field/check/${staffId}/field/${fieldName}`, {
      params: customerId ? { customerId } : {}
    })
    return extractApiResponse(response)
  },

  // Check multiple field permissions at once
  async checkMultipleFieldPermissions(staffId, fieldNames, customerId = null) {
    const promises = fieldNames.map(fieldName =>
      this.checkFieldPermission(staffId, fieldName, customerId)
    )
    return Promise.all(promises)
  },

  // ========== BULK OPERATIONS ==========

  // Bulk update customers
  async bulkUpdateCustomers(updates) {
    const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMERS}/bulk`, updates)
    return extractApiResponse(response)
  },

  // Bulk delete customers
  async bulkDeleteCustomers(customerIds) {
    const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS}/bulk`, {
      data: { ids: customerIds }
    })
    return extractApiResponse(response)
  },

  // ========== STATISTICS & ANALYTICS ==========

  // Get customer statistics
  async getCustomerStatistics(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/statistics`, { params })
    return extractApiResponse(response)
  },

  // Get customer tier distribution
  async getCustomerTierDistribution() {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/tier-distribution`)
    return extractApiResponse(response)
  },

  // Get customer spending analysis
  async getCustomerSpendingAnalysis(customerId, params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS}/${customerId}/spending-analysis`, { params })
    return extractApiResponse(response)
  }
}

export default customersApi
