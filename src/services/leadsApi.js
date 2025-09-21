import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Lead Management API - Complete integration with BE endpoints
 */
export const leadsApi = {
  // Get all leads with pagination and sorting
  async getLeads(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'leadId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(API_ENDPOINTS.LEADS, {
      params: { page, size, sortBy, sortDir }
    })
    return extractApiResponse(response)
  },

  // Get lead by ID
  async getLeadById(id) {
    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/${id}`)
    return extractApiResponse(response)
  },

  // Create new lead (public API - no auth required)
  async createLead(leadData) {
    const response = await apiClient.post(API_ENDPOINTS.LEADS, leadData)
    return extractApiResponse(response)
  },

  // Update lead
  async updateLead(id, leadData) {
    const response = await apiClient.put(`${API_ENDPOINTS.LEADS}/${id}`, leadData)
    return extractApiResponse(response)
  },

  // Delete lead
  async deleteLead(id) {
    const response = await apiClient.delete(`${API_ENDPOINTS.LEADS}/${id}`)
    return extractApiResponse(response)
  },

  // Update lead status
  async updateLeadStatus(id, statusRequest) {
    const response = await apiClient.put(`${API_ENDPOINTS.LEADS}/${id}/status`, statusRequest)
    return extractApiResponse(response)
  },

  // Get lead statistics
  async getLeadStats() {
    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/stats`)
    return extractApiResponse(response)
  },

  // Get leads by status with pagination
  async getLeadsByStatus(status, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'leadId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/status/${status}`, {
      params: { page, size, sortBy, sortDir }
    })
    return extractApiResponse(response)
  },

  // Search leads (uses same endpoint as getLeads with search param)
  async searchLeads(searchTerm, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'leadId',
      sortDir = 'desc'
    } = params

    const response = await apiClient.get(API_ENDPOINTS.LEADS, {
      params: { page, size, sortBy, sortDir, search: searchTerm }
    })
    return extractApiResponse(response)
  },

  // ========== BULK OPERATIONS ==========

  // Bulk update leads
  async bulkUpdateLeads(updates) {
    const response = await apiClient.put(`${API_ENDPOINTS.LEADS}/bulk`, updates)
    return extractApiResponse(response)
  },

  // Bulk delete leads
  async bulkDeleteLeads(leadIds) {
    const response = await apiClient.delete(`${API_ENDPOINTS.LEADS}/bulk`, {
      data: { ids: leadIds }
    })
    return extractApiResponse(response)
  },

  // Bulk update lead status
  async bulkUpdateLeadStatus(leadIds, status, notes = null) {
    const response = await apiClient.put(`${API_ENDPOINTS.LEADS}/bulk/status`, {
      ids: leadIds,
      status,
      notes
    })
    return extractApiResponse(response)
  },

  // ========== ANALYTICS & REPORTING ==========

  // Get lead conversion rate
  async getLeadConversionRate(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/conversion-rate`, { params })
    return extractApiResponse(response)
  },

  // Get lead source analysis
  async getLeadSourceAnalysis(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/source-analysis`, { params })
    return extractApiResponse(response)
  },

  // Get lead performance metrics
  async getLeadPerformanceMetrics(params = {}) {
    const response = await apiClient.get(`${API_ENDPOINTS.LEADS}/performance-metrics`, { params })
    return extractApiResponse(response)
  },

  // ========== UTILITY METHODS ==========

  // Validate lead status transition
  async validateStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      'NEW': ['IN_PROGRESS', 'LOST'],
      'IN_PROGRESS': ['WON', 'LOST'],
      'WON': [],
      'LOST': []
    }

    return validTransitions[currentStatus]?.includes(newStatus) || false
  },

  // Get lead status color for UI
  getLeadStatusColor(status) {
    const colors = {
      'NEW': '#10b981', // Green
      'IN_PROGRESS': '#f59e0b', // Yellow
      'WON': '#3b82f6', // Blue
      'LOST': '#ef4444' // Red
    }
    return colors[status] || '#6b7280'
  }
}

export default leadsApi
