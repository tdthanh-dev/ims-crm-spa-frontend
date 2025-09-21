import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Role Management API - Complete integration with BE endpoints
 */
export const rolesApi = {
    // Get all roles with pagination
    async getRoles(params = {}) {
        const {
            page = 0,
            size = 20
        } = params

        const response = await apiClient.get(API_ENDPOINTS.ROLES, {
            params: { page, size }
        })
        return extractApiResponse(response)
    },

    // Get role by ID
    async getRoleById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.ROLES}/${id}`)
        return extractApiResponse(response)
    },

    // Create new role
    async createRole(roleData) {
        const response = await apiClient.post(API_ENDPOINTS.ROLES, roleData)
        return extractApiResponse(response)
    },

    // Update role
    async updateRole(id, roleData) {
        const response = await apiClient.put(`${API_ENDPOINTS.ROLES}/${id}`, roleData)
        return extractApiResponse(response)
    },

    // Delete role
    async deleteRole(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.ROLES}/${id}`)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update roles
    async bulkUpdateRoles(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.ROLES}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete roles
    async bulkDeleteRoles(roleIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.ROLES}/bulk`, {
            data: { ids: roleIds }
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search roles
    async searchRoles(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20
        } = params

        const response = await apiClient.get(API_ENDPOINTS.ROLES, {
            params: { page, size, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get role statistics
    async getRoleStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.ROLES}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get role hierarchy
    async getRoleHierarchy() {
        const response = await apiClient.get(`${API_ENDPOINTS.ROLES}/hierarchy`)
        return extractApiResponse(response)
    },

    // ========== PERMISSION MANAGEMENT ==========

    // Get role permissions
    async getRolePermissions(roleId) {
        const response = await apiClient.get(`${API_ENDPOINTS.ROLES}/${roleId}/permissions`)
        return extractApiResponse(response)
    },

    // Update role permissions
    async updateRolePermissions(roleId, permissions) {
        const response = await apiClient.put(`${API_ENDPOINTS.ROLES}/${roleId}/permissions`, { permissions })
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate role data
    validateRoleData(roleData) {
        const errors = []

        if (!roleData.roleName?.trim()) {
            errors.push('Tên vai trò không được để trống')
        }

        if (!roleData.roleCode?.trim()) {
            errors.push('Mã vai trò không được để trống')
        }

        if (!roleData.description?.trim()) {
            errors.push('Mô tả vai trò không được để trống')
        }

        // Check role code format
        if (roleData.roleCode && !/^[A-Z_]+$/.test(roleData.roleCode)) {
            errors.push('Mã vai trò chỉ được chứa chữ in hoa và dấu gạch dưới')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Get role display name
    getRoleDisplayName(role) {
        const displayNames = {
            'ADMIN': 'Quản trị viên',
            'MANAGER': 'Quản lý',
            'RECEPTIONIST': 'Lễ tân',
            'TECHNICIAN': 'Kỹ thuật viên'
        }
        return displayNames[role] || role
    },

    // Get role color for UI
    getRoleColor(role) {
        const colors = {
            'ADMIN': '#dc2626', // Red
            'MANAGER': '#ea580c', // Orange
            'RECEPTIONIST': '#3b82f6', // Blue
            'TECHNICIAN': '#10b981' // Green
        }
        return colors[role] || '#6b7280'
    },

    // Get role priority for sorting
    getRolePriority(role) {
        const priorities = {
            'ADMIN': 1,
            'MANAGER': 2,
            'RECEPTIONIST': 3,
            'TECHNICIAN': 4
        }
        return priorities[role] || 99
    }
}

export default rolesApi
