import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Customer Case Management API - Complete integration with BE endpoints
 */
export const customerCasesApi = {
    // Get all customer cases with pagination
    async getCustomerCases(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_CASES, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get customer case by ID
    async getCustomerCaseById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/${id}`)
        return extractApiResponse(response)
    },

    // Create new customer case
    async createCustomerCase(customerCaseData) {
        const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_CASES, customerCaseData)
        return extractApiResponse(response)
    },

    // Update customer case
    async updateCustomerCase(id, customerCaseData) {
        const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMER_CASES}/${id}`, customerCaseData)
        return extractApiResponse(response)
    },

    // Delete customer case
    async deleteCustomerCase(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOMER_CASES}/${id}`)
        return extractApiResponse(response)
    },

    // Update customer case status
    async updateCustomerCaseStatus(id, statusRequest) {
        const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMER_CASES}/${id}/status`, statusRequest)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update customer cases
    async bulkUpdateCustomerCases(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMER_CASES}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete customer cases
    async bulkDeleteCustomerCases(customerCaseIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.CUSTOMER_CASES}/bulk`, {
            data: { ids: customerCaseIds }
        })
        return extractApiResponse(response)
    },

    // Bulk update customer case status
    async bulkUpdateCustomerCaseStatus(customerCaseIds, status, notes = null) {
        const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMER_CASES}/bulk/status`, {
            ids: customerCaseIds,
            status,
            notes
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search customer cases
    async searchCustomerCases(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_CASES, {
            params: { page, size, sortBy, sortDir, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // Filter customer cases by status
    async getCustomerCasesByStatus(status, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter customer cases by customer
    async getCustomerCasesByCustomer(customerId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/customer/${customerId}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter customer cases by technician
    async getCustomerCasesByTechnician(technicianId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/technician/${technicianId}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter customer cases by service category
    async getCustomerCasesByServiceCategory(category, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'caseId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/category/${category}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get customer case statistics
    async getCustomerCaseStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get case completion rate
    async getCaseCompletionRate(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/completion-rate`, { params })
        return extractApiResponse(response)
    },

    // Get technician performance metrics
    async getTechnicianPerformanceMetrics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/technician-performance`, { params })
        return extractApiResponse(response)
    },

    // Get service popularity by category
    async getServicePopularityByCategory(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/service-popularity`, { params })
        return extractApiResponse(response)
    },

    // ========== TREATMENT PROGRESS ==========

    // Update treatment progress
    async updateTreatmentProgress(caseId, progressData) {
        const response = await apiClient.put(`${API_ENDPOINTS.CUSTOMER_CASES}/${caseId}/progress`, progressData)
        return extractApiResponse(response)
    },

    // Add treatment notes
    async addTreatmentNotes(caseId, notesData) {
        const response = await apiClient.post(`${API_ENDPOINTS.CUSTOMER_CASES}/${caseId}/notes`, notesData)
        return extractApiResponse(response)
    },

    // Get treatment history
    async getTreatmentHistory(caseId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'createdAt',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_CASES}/${caseId}/history`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate customer case data
    validateCustomerCaseData(customerCaseData) {
        const errors = []

        if (!customerCaseData.customerId) {
            errors.push('Khách hàng không được để trống')
        }

        if (!customerCaseData.serviceId) {
            errors.push('Dịch vụ không được để trống')
        }

        if (!customerCaseData.technicianId) {
            errors.push('Kỹ thuật viên không được để trống')
        }

        if (!customerCaseData.description?.trim()) {
            errors.push('Mô tả case không được để trống')
        }

        if (customerCaseData.estimatedDuration && customerCaseData.estimatedDuration <= 0) {
            errors.push('Thời gian ước tính phải lớn hơn 0')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Get customer case status color for UI
    getCustomerCaseStatusColor(status) {
        const colors = {
            'INTAKE': '#f59e0b', // Yellow
            'IN_PROGRESS': '#3b82f6', // Blue
            'COMPLETED': '#10b981', // Green
            'ON_HOLD': '#6b7280', // Gray
            'CANCELLED': '#ef4444' // Red
        }
        return colors[status] || '#6b7280'
    },

    // Get service category icon
    getServiceCategoryIcon(category) {
        const icons = {
            'LIP': '💋',
            'BROW': '👀',
            'OTHER': '✨'
        }
        return icons[category] || '💼'
    },

    // Format case duration for display
    formatCaseDuration(duration) {
        if (!duration) return 'N/A'

        const hours = Math.floor(duration / 60)
        const minutes = duration % 60

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    },

    // Calculate case metrics
    calculateCaseMetrics(customerCases) {
        return customerCases.reduce((metrics, caseData) => {
            metrics.totalCount += 1
            metrics.completedCount += caseData.status === 'COMPLETED' ? 1 : 0
            metrics.inProgressCount += caseData.status === 'IN_PROGRESS' ? 1 : 0
            metrics.cancelledCount += caseData.status === 'CANCELLED' ? 1 : 0

            if (caseData.estimatedDuration) {
                metrics.totalEstimatedDuration += caseData.estimatedDuration
            }

            return metrics
        }, {
            totalCount: 0,
            completedCount: 0,
            inProgressCount: 0,
            cancelledCount: 0,
            totalEstimatedDuration: 0
        })
    },

    // Get case priority level
    getCasePriority(caseData) {
        if (!caseData) return 'normal'

        // High priority for VIP customers
        if (caseData.customer?.isVip) return 'high'

        // High priority for urgent cases
        if (caseData.isUrgent) return 'high'

        // Medium priority for existing customers
        if (caseData.customer?.totalSpent > 0) return 'medium'

        return 'normal'
    }
}

export default customerCasesApi
