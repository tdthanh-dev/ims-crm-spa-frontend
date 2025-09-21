import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

// Permission Management API
export const permissionsApi = {
    // Permission management
    async getAllPermissions() {
        const response = await apiClient.get(API_ENDPOINTS.PERMISSIONS)
        return extractApiResponse(response)
    },

    async getAllFieldPermissions() {
        // This would be a backend endpoint to get all available field permissions
        // For now, return a mock response with common field permissions
        return [
            { scope: 'customer.name', description: 'Customer Name' },
            { scope: 'customer.phone', description: 'Customer Phone' },
            { scope: 'customer.email', description: 'Customer Email' },
            { scope: 'customer.address', description: 'Customer Address' },
            { scope: 'customer.birthdate', description: 'Customer Birthdate' },
            { scope: 'customer.gender', description: 'Customer Gender' },
            { scope: 'appointment.date', description: 'Appointment Date' },
            { scope: 'appointment.time', description: 'Appointment Time' },
            { scope: 'appointment.notes', description: 'Appointment Notes' },
            { scope: 'invoice.amount', description: 'Invoice Amount' },
            { scope: 'invoice.status', description: 'Invoice Status' }
        ]
    },

    async getPermissionById(permissionId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/${permissionId}`)
        return extractApiResponse(response)
    },

    async getPermissionsByType(permissionType) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/type/${permissionType}`)
        return extractApiResponse(response)
    },

    async getPermissionsByResourceType(resourceType) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/resource/${resourceType}`)
        return extractApiResponse(response)
    },

    async createPermission(permissionData) {
        const response = await apiClient.post(API_ENDPOINTS.PERMISSIONS, permissionData)
        return extractApiResponse(response)
    },

    async updatePermission(permissionId, permissionData) {
        const response = await apiClient.put(`${API_ENDPOINTS.PERMISSIONS}/${permissionId}`, permissionData)
        return extractApiResponse(response)
    },

    async deletePermission(permissionId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/${permissionId}`)
    },

    // User permission management
    async grantPermission(staffId, permissionId, customerId, grantedByStaffId, expiresAt, notes) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/grant`, {
            staffId,
            permissionId,
            customerId,
            grantedByStaffId,
            expiresAt,
            notes
        })
        return response.data
    },

    async revokePermission(userPermissionId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/revoke/${userPermissionId}`)
    },

    async revokeAllPermissionsForStaff(staffId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/revoke/staff/${staffId}`)
    },

    async revokePermissionForStaffAndCustomer(staffId, customerId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/revoke/staff/${staffId}/customer/${customerId}`)
    },

    async getPermissionsForStaff(staffId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/staff/${staffId}`)
        return response.data
    },

    async getActivePermissionsForStaff(staffId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/staff/${staffId}/active`)
        return response.data
    },

    // Field permission management
    async grantFieldPermission(staffId, permissionScope, customerId, grantedByStaffId, expiresAt, notes) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/grant`, {
            staffId,
            permissionScope,
            customerId,
            grantedByStaffId,
            expiresAt,
            notes
        })
        return response.data
    },

    async revokeFieldPermission(fieldPermissionId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/field/revoke/${fieldPermissionId}`)
    },

    async revokeAllFieldPermissionsForStaff(staffId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/field/revoke/staff/${staffId}`)
    },

    async revokeFieldPermissionsForCustomer(staffId, customerId) {
        await apiClient.delete(`${API_ENDPOINTS.PERMISSIONS}/field/revoke/staff/${staffId}/customer/${customerId}`)
    },

    async getFieldPermissionsForStaff(staffId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/field/staff/${staffId}`)
        return response.data
    },

    async getActiveFieldPermissionsForStaff(staffId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/field/staff/${staffId}/active`)
        return response.data
    },

    async getFieldPermissionsForStaffAndCustomer(staffId, customerId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/field/staff/${staffId}/customer/${customerId}`)
        return response.data
    },

    // Permission checking
    async hasPermission(staffId, resourceType, action, customerId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/check/${staffId}`, {
            params: { resourceType, action, customerId }
        })
        return response.data
    },

    // Field permission checking
    async canReadCustomerField(staffId, fieldName, customerId) {
        const response = await apiClient.get(`${API_ENDPOINTS.PERMISSIONS}/field/check/${staffId}/field/${fieldName}`, {
            params: { customerId }
        })
        return response.data
    },

    // Bulk operations
    async grantPermissionsToStaff(staffId, permissionIds, grantedByStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/grant/bulk`, {
            staffId,
            permissionIds,
            grantedByStaffId
        })
        return response.data
    },

    async grantCustomerSpecificPermissions(staffId, customerIds, permissionIds, grantedByStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/grant/customer-specific`, {
            staffId,
            customerIds,
            permissionIds,
            grantedByStaffId
        })
        return response.data
    },

    async grantFieldPermissionsToStaff(staffId, permissionScopes, grantedByStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/grant/bulk`, {
            staffId,
            permissionScopes,
            grantedByStaffId
        })
        return response.data
    },

    async grantCustomerFieldPermissions(staffId, customerId, permissionScopes, grantedByStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/grant/customer`, {
            staffId,
            customerId,
            permissionScopes,
            grantedByStaffId
        })
        return response.data
    },

    async grantFieldPermissionsToMultipleCustomers(staffId, customerIds, permissionScopes, grantedByStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/grant/multiple-customers`, {
            staffId,
            customerIds,
            permissionScopes,
            grantedByStaffId
        })
        return response.data
    },

    // System initialization
    async initializeSystemPermissions() {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/initialize`)
        return response.data
    },

    async initializeDefaultFieldPermissions() {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/initialize`)
        return response.data
    },

    async ensureAdminHasAllPermissions(adminStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/ensure-admin/${adminStaffId}`)
        return response.data
    },

    async ensureAdminHasAllFieldPermissions(adminStaffId) {
        const response = await apiClient.post(`${API_ENDPOINTS.PERMISSIONS}/field/ensure-admin/${adminStaffId}`)
        return response.data
    }
}

export default permissionsApi
