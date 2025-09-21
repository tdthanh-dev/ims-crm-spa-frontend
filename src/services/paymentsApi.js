import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Payment Management API - Complete integration with BE endpoints
 */
export const paymentsApi = {
    // Get all payments with pagination
    async getPayments(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get payment by ID
    async getPaymentById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/${id}`)
        return extractApiResponse(response)
    },

    // Create new payment
    async createPayment(paymentData) {
        const response = await apiClient.post(API_ENDPOINTS.PAYMENTS, paymentData)
        return extractApiResponse(response)
    },

    // Update payment
    async updatePayment(id, paymentData) {
        const response = await apiClient.put(`${API_ENDPOINTS.PAYMENTS}/${id}`, paymentData)
        return extractApiResponse(response)
    },

    // Delete payment
    async deletePayment(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.PAYMENTS}/${id}`)
        return extractApiResponse(response)
    },

    // Update payment status
    async updatePaymentStatus(id, statusRequest) {
        const response = await apiClient.put(`${API_ENDPOINTS.PAYMENTS}/${id}/status`, statusRequest)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update payments
    async bulkUpdatePayments(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.PAYMENTS}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete payments
    async bulkDeletePayments(paymentIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.PAYMENTS}/bulk`, {
            data: { ids: paymentIds }
        })
        return extractApiResponse(response)
    },

    // Bulk update payment status
    async bulkUpdatePaymentStatus(paymentIds, status, notes = null) {
        const response = await apiClient.put(`${API_ENDPOINTS.PAYMENTS}/bulk/status`, {
            ids: paymentIds,
            status,
            notes
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search payments
    async searchPayments(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, {
            params: { page, size, sortBy, sortDir, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // Filter payments by status
    async getPaymentsByStatus(status, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter payments by customer
    async getPaymentsByCustomer(customerId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/customer/${customerId}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter payments by invoice
    async getPaymentsByInvoice(invoiceId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/invoice/${invoiceId}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter payments by date range
    async getPaymentsByDateRange(startDate, endDate, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'paymentId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/date-range`, {
            params: { startDate, endDate, page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get payment statistics
    async getPaymentStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get payment method statistics
    async getPaymentMethodStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/method-statistics`, { params })
        return extractApiResponse(response)
    },

    // Get daily payment totals
    async getDailyPaymentTotals(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/daily-totals`, { params })
        return extractApiResponse(response)
    },

    // Get monthly payment summary
    async getMonthlyPaymentSummary(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/monthly-summary`, { params })
        return extractApiResponse(response)
    },

    // ========== PROCESSING METHODS ==========

    // Process payment
    async processPayment(paymentId, processingData) {
        const response = await apiClient.post(`${API_ENDPOINTS.PAYMENTS}/${paymentId}/process`, processingData)
        return extractApiResponse(response)
    },

    // Refund payment
    async refundPayment(paymentId, refundData) {
        const response = await apiClient.post(`${API_ENDPOINTS.PAYMENTS}/${paymentId}/refund`, refundData)
        return extractApiResponse(response)
    },

    // Cancel payment
    async cancelPayment(paymentId, reason) {
        const response = await apiClient.post(`${API_ENDPOINTS.PAYMENTS}/${paymentId}/cancel`, { reason })
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate payment data
    validatePaymentData(paymentData) {
        const errors = []

        if (!paymentData.invoiceId) {
            errors.push('Hóa đơn không được để trống')
        }

        if (!paymentData.amount || paymentData.amount <= 0) {
            errors.push('Số tiền phải lớn hơn 0')
        }

        if (!paymentData.paymentMethod) {
            errors.push('Phương thức thanh toán không được để trống')
        }

        if (!paymentData.paymentDate) {
            errors.push('Ngày thanh toán không được để trống')
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Format payment amount for display
    formatPaymentAmount(amount) {
        if (amount === undefined || amount === null) return '0 VND'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    },

    // Get payment status color for UI
    getPaymentStatusColor(status) {
        const colors = {
            'PENDING': '#f59e0b', // Yellow
            'PROCESSING': '#3b82f6', // Blue
            'COMPLETED': '#10b981', // Green
            'FAILED': '#ef4444', // Red
            'CANCELLED': '#6b7280', // Gray
            'REFUNDED': '#8b5cf6' // Purple
        }
        return colors[status] || '#6b7280'
    },

    // Get payment method icon
    getPaymentMethodIcon(method) {
        const icons = {
            'CASH': '💵',
            'CARD': '💳',
            'BANK': '🏦',
            'EWALLET': '📱'
        }
        return icons[method] || '💰'
    },

    // Calculate payment totals
    calculatePaymentTotals(payments) {
        return payments.reduce((totals, payment) => {
            totals.totalAmount += payment.amount || 0
            totals.completedCount += payment.status === 'COMPLETED' ? 1 : 0
            totals.pendingCount += payment.status === 'PENDING' ? 1 : 0
            totals.failedCount += payment.status === 'FAILED' ? 1 : 0
            return totals
        }, {
            totalAmount: 0,
            completedCount: 0,
            pendingCount: 0,
            failedCount: 0
        })
    }
}

export default paymentsApi
