import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Account Management API - Complete integration with BE endpoints
 */
export const accountsApi = {
    // Create new account (Public API - No authentication required)
    async createAccount(accountData) {
        const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS, accountData)
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate account data
    validateAccountData(accountData) {
        const errors = []

        if (!accountData.fullName?.trim()) {
            errors.push('Họ tên không được để trống')
        }

        if (!accountData.email?.trim()) {
            errors.push('Email không được để trống')
        }

        if (!accountData.phone?.trim()) {
            errors.push('Số điện thoại không được để trống')
        }

        if (!accountData.password) {
            errors.push('Mật khẩu không được để trống')
        }

        if (accountData.password && accountData.password.length < 6) {
            errors.push('Mật khẩu phải có ít nhất 6 ký tự')
        }

        // Email validation
        if (accountData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
            errors.push('Email không hợp lệ')
        }

        // Phone validation (Vietnamese phone number)
        if (accountData.phone && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(accountData.phone)) {
            errors.push('Số điện thoại không hợp lệ (VD: 0397554756)')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Format account display name
    formatAccountDisplayName(account) {
        if (!account) return 'N/A'
        return `${account.fullName} (${account.email})`
    },

    // Get account status color for UI
    getAccountStatusColor(status) {
        const colors = {
            'ACTIVE': '#10b981', // Green
            'INACTIVE': '#6b7280', // Gray
            'SUSPENDED': '#ef4444', // Red
            'PENDING': '#f59e0b' // Yellow
        }
        return colors[status] || '#6b7280'
    },

    // Generate strong password suggestion
    generatePasswordSuggestion() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return password
    },

    // Check password strength
    checkPasswordStrength(password) {
        if (!password) return { strength: 0, label: 'Rất yếu', color: '#ef4444' }

        let strength = 0
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        }

        strength = Object.values(checks).filter(Boolean).length

        const strengthMap = {
            0: { label: 'Rất yếu', color: '#ef4444' },
            1: { label: 'Yếu', color: '#f97316' },
            2: { label: 'Trung bình', color: '#f59e0b' },
            3: { label: 'Khá mạnh', color: '#eab308' },
            4: { label: 'Mạnh', color: '#84cc16' },
            5: { label: 'Rất mạnh', color: '#22c55e' }
        }

        return {
            strength,
            ...strengthMap[strength],
            checks
        }
    }
}

export default accountsApi
