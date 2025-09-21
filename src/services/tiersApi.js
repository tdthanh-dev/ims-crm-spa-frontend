import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Tier Management API - Complete integration with BE endpoints
 */
export const tiersApi = {
    // Get all tiers with pagination
    async getTiers(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'tierId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.TIERS, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get tier by ID
    async getTierById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/${id}`)
        return extractApiResponse(response)
    },

    // Create new tier
    async createTier(tierData) {
        const response = await apiClient.post(API_ENDPOINTS.TIERS, tierData)
        return extractApiResponse(response)
    },

    // Update tier
    async updateTier(id, tierData) {
        const response = await apiClient.put(`${API_ENDPOINTS.TIERS}/${id}`, tierData)
        return extractApiResponse(response)
    },

    // Delete tier
    async deleteTier(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.TIERS}/${id}`)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update tiers
    async bulkUpdateTiers(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.TIERS}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete tiers
    async bulkDeleteTiers(tierIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.TIERS}/bulk`, {
            data: { ids: tierIds }
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search tiers
    async searchTiers(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'tierId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.TIERS, {
            params: { page, size, sortBy, sortDir, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // Get tier by code
    async getTierByCode(code) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/code/${code}`)
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get tier statistics
    async getTierStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get tier distribution
    async getTierDistribution(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/distribution`, { params })
        return extractApiResponse(response)
    },

    // Get tier upgrade/downgrade analysis
    async getTierTransitionAnalysis(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/transitions`, { params })
        return extractApiResponse(response)
    },

    // ========== BENEFITS MANAGEMENT ==========

    // Get tier benefits
    async getTierBenefits(tierId) {
        const response = await apiClient.get(`${API_ENDPOINTS.TIERS}/${tierId}/benefits`)
        return extractApiResponse(response)
    },

    // Update tier benefits
    async updateTierBenefits(tierId, benefits) {
        const response = await apiClient.put(`${API_ENDPOINTS.TIERS}/${tierId}/benefits`, { benefits })
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate tier data
    validateTierData(tierData) {
        const errors = []

        if (!tierData.tierName?.trim()) {
            errors.push('Tên cấp độ không được để trống')
        }

        if (!tierData.tierCode?.trim()) {
            errors.push('Mã cấp độ không được để trống')
        }

        if (tierData.minSpent === undefined || tierData.minSpent < 0) {
            errors.push('Số tiền tối thiểu phải lớn hơn hoặc bằng 0')
        }

        if (tierData.minPoints === undefined || tierData.minPoints < 0) {
            errors.push('Số điểm tối thiểu phải lớn hơn hoặc bằng 0')
        }

        if (!tierData.description?.trim()) {
            errors.push('Mô tả cấp độ không được để trống')
        }

        // Check tier code format
        if (tierData.tierCode && !/^[A-Z_]+$/.test(tierData.tierCode)) {
            errors.push('Mã cấp độ chỉ được chứa chữ in hoa và dấu gạch dưới')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Get tier display name
    getTierDisplayName(tier) {
        const displayNames = {
            'REGULAR': 'Thường',
            'SILVER': 'Bạc',
            'GOLD': 'Vàng',
            'PLATINUM': 'Bạch Kim',
            'DIAMOND': 'Kim Cương',
            'VIP': 'VIP'
        }
        return displayNames[tier] || tier
    },

    // Get tier color for UI
    getTierColor(tier) {
        const colors = {
            'REGULAR': '#6b7280', // Gray
            'SILVER': '#9ca3af', // Light Gray
            'GOLD': '#f59e0b', // Yellow
            'PLATINUM': '#e5e7eb', // Light Silver
            'DIAMOND': '#3b82f6', // Blue
            'VIP': '#dc2626' // Red
        }
        return colors[tier] || '#6b7280'
    },

    // Get tier icon
    getTierIcon(tier) {
        const icons = {
            'REGULAR': '👤',
            'SILVER': '🥈',
            'GOLD': '🥇',
            'PLATINUM': '💎',
            'DIAMOND': '💍',
            'VIP': '👑'
        }
        return icons[tier] || '🏷️'
    },

    // Format tier requirements
    formatTierRequirements(tier) {
        const requirements = []

        if (tier.minSpent > 0) {
            requirements.push(`Chi tiêu tối thiểu: ${tier.minSpent.toLocaleString()} VND`)
        }

        if (tier.minPoints > 0) {
            requirements.push(`Điểm tối thiểu: ${tier.minPoints.toLocaleString()}`)
        }

        return requirements
    },

    // Calculate tier upgrade progress
    calculateTierProgress(currentTier, customerData) {
        if (!customerData || !currentTier) return { progress: 0, remaining: 0 }

        const currentSpent = customerData.totalSpent || 0
        const currentPoints = customerData.totalPoints || 0

        // Calculate progress based on spending requirement
        const spentProgress = currentTier.minSpent > 0 ? (currentSpent / currentTier.minSpent) * 100 : 100
        const pointsProgress = currentTier.minPoints > 0 ? (currentPoints / currentTier.minPoints) * 100 : 100

        // Use the lower progress as the overall progress
        const progress = Math.min(spentProgress, pointsProgress)

        return {
            progress: Math.min(progress, 100),
            remainingSpent: Math.max(currentTier.minSpent - currentSpent, 0),
            remainingPoints: Math.max(currentTier.minPoints - currentPoints, 0)
        }
    }
}

export default tiersApi
