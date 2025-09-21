import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Staff User Management API - Complete integration with BE endpoints
 */
export const staffUsersApi = {
    // Get all staff users with pagination
    async getStaffUsers(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'staffId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.STAFF_USERS, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get staff user by ID
    async getStaffUserById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/${id}`)
        return extractApiResponse(response)
    },

    // Create new staff user
    async createStaffUser(staffUserData) {
        const response = await apiClient.post(API_ENDPOINTS.STAFF_USERS, staffUserData)
        return extractApiResponse(response)
    },

    // Update staff user
    async updateStaffUser(id, staffUserData) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/${id}`, staffUserData)
        return extractApiResponse(response)
    },

    // Delete staff user
    async deleteStaffUser(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.STAFF_USERS}/${id}`)
        return extractApiResponse(response)
    },

    // Update staff user status
    async updateStaffUserStatus(id, statusRequest) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/${id}/status`, statusRequest)
        return extractApiResponse(response)
    },

    // Health check
    async healthCheck() {
        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/health`)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update staff users
    async bulkUpdateStaffUsers(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete staff users
    async bulkDeleteStaffUsers(staffUserIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.STAFF_USERS}/bulk`, {
            data: { ids: staffUserIds }
        })
        return extractApiResponse(response)
    },

    // Bulk update staff user status
    async bulkUpdateStaffUserStatus(staffUserIds, status, notes = null) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/bulk/status`, {
            ids: staffUserIds,
            status,
            notes
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search staff users
    async searchStaffUsers(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'staffId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.STAFF_USERS, {
            params: { page, size, sortBy, sortDir, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // Filter staff users by status
    async getStaffUsersByStatus(status, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'staffId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter staff users by role
    async getStaffUsersByRole(role, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'staffId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/role/${role}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get staff user statistics
    async getStaffUserStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get staff user activity logs
    async getStaffUserActivityLogs(staffUserId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'createdAt',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/${staffUserId}/activity-logs`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get staff user performance metrics
    async getStaffUserPerformanceMetrics(staffUserId, params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.STAFF_USERS}/${staffUserId}/performance`, { params })
        return extractApiResponse(response)
    },

    // ========== AUTHENTICATION & SECURITY ==========

    // Change password
    async changePassword(staffUserId, passwordData) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/${staffUserId}/password`, passwordData)
        return extractApiResponse(response)
    },

    // Reset password
    async resetPassword(staffUserId, resetData) {
        const response = await apiClient.post(`${API_ENDPOINTS.STAFF_USERS}/${staffUserId}/reset-password`, resetData)
        return extractApiResponse(response)
    },

    // Update profile
    async updateProfile(staffUserId, profileData) {
        const response = await apiClient.put(`${API_ENDPOINTS.STAFF_USERS}/${staffUserId}/profile`, profileData)
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate staff user data
    validateStaffUserData(staffUserData) {
        const errors = []

        if (!staffUserData.fullName?.trim()) {
            errors.push('Họ tên không được để trống')
        }

        if (!staffUserData.email?.trim()) {
            errors.push('Email không được để trống')
        }

        if (!staffUserData.role) {
            errors.push('Vai trò không được để trống')
        }

        if (!staffUserData.position) {
            errors.push('Chức vụ không được để trống')
        }

        if (staffUserData.phone && !/^\+?[\d\s\-()]+$/.test(staffUserData.phone)) {
            errors.push('Số điện thoại không hợp lệ')
        }

        if (staffUserData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffUserData.email)) {
            errors.push('Email không hợp lệ')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Get staff user role color for UI
    getStaffUserRoleColor(role) {
        const colors = {
            'ADMIN': '#dc2626', // Red
            'MANAGER': '#ea580c', // Orange
            'RECEPTIONIST': '#3b82f6', // Blue
            'TECHNICIAN': '#10b981' // Green
        }
        return colors[role] || '#6b7280'
    },

    // Get staff user status color for UI
    getStaffUserStatusColor(status) {
        const colors = {
            'ACTIVE': '#10b981', // Green
            'INACTIVE': '#6b7280', // Gray
            'SUSPENDED': '#ef4444' // Red
        }
        return colors[status] || '#6b7280'
    },

    // Format staff user display name
    formatStaffUserDisplayName(staffUser) {
        if (!staffUser) return 'N/A'
        return `${staffUser.fullName} (${staffUser.position})`
    },

    // Get staff user avatar placeholder
    getStaffUserAvatarPlaceholder(staffUser) {
        if (!staffUser || !staffUser.fullName) return '👤'
        return staffUser.fullName.charAt(0).toUpperCase()
    },

    // Calculate staff user metrics
    calculateStaffUserMetrics(staffUsers) {
        return staffUsers.reduce((metrics, user) => {
            metrics.totalCount += 1
            metrics.activeCount += user.status === 'ACTIVE' ? 1 : 0
            metrics.roleCounts[user.role] = (metrics.roleCounts[user.role] || 0) + 1
            return metrics
        }, {
            totalCount: 0,
            activeCount: 0,
            roleCounts: {}
        })
    }
}

export default staffUsersApi
