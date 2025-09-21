import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

/**
 * Invoice Management API - Complete integration with BE endpoints
 */
export const invoicesApi = {
    // Get all invoices with pagination
    async getInvoices(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.INVOICES, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get invoice by ID
    async getInvoiceById(id) {
        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/${id}`)
        return extractApiResponse(response)
    },

    // Create new invoice
    async createInvoice(invoiceData) {
        const response = await apiClient.post(API_ENDPOINTS.INVOICES, invoiceData)
        return extractApiResponse(response)
    },

    // Update invoice
    async updateInvoice(id, invoiceData) {
        const response = await apiClient.put(`${API_ENDPOINTS.INVOICES}/${id}`, invoiceData)
        return extractApiResponse(response)
    },

    // Delete invoice
    async deleteInvoice(id) {
        const response = await apiClient.delete(`${API_ENDPOINTS.INVOICES}/${id}`)
        return extractApiResponse(response)
    },

    // Update invoice status
    async updateInvoiceStatus(id, statusRequest) {
        const response = await apiClient.put(`${API_ENDPOINTS.INVOICES}/${id}/status`, statusRequest)
        return extractApiResponse(response)
    },

    // ========== BULK OPERATIONS ==========

    // Bulk update invoices
    async bulkUpdateInvoices(updates) {
        const response = await apiClient.put(`${API_ENDPOINTS.INVOICES}/bulk`, updates)
        return extractApiResponse(response)
    },

    // Bulk delete invoices
    async bulkDeleteInvoices(invoiceIds) {
        const response = await apiClient.delete(`${API_ENDPOINTS.INVOICES}/bulk`, {
            data: { ids: invoiceIds }
        })
        return extractApiResponse(response)
    },

    // Bulk update invoice status
    async bulkUpdateInvoiceStatus(invoiceIds, status, notes = null) {
        const response = await apiClient.put(`${API_ENDPOINTS.INVOICES}/bulk/status`, {
            ids: invoiceIds,
            status,
            notes
        })
        return extractApiResponse(response)
    },

    // ========== SEARCH & FILTERING ==========

    // Search invoices
    async searchInvoices(searchTerm, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(API_ENDPOINTS.INVOICES, {
            params: { page, size, sortBy, sortDir, search: searchTerm }
        })
        return extractApiResponse(response)
    },

    // Filter invoices by status
    async getInvoicesByStatus(status, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter invoices by customer
    async getInvoicesByCustomer(customerId, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/customer/${customerId}`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Filter invoices by date range
    async getInvoicesByDateRange(startDate, endDate, params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/date-range`, {
            params: { startDate, endDate, page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== STATISTICS & ANALYTICS ==========

    // Get invoice statistics
    async getInvoiceStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/statistics`, { params })
        return extractApiResponse(response)
    },

    // Get revenue statistics
    async getRevenueStatistics(params = {}) {
        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/revenue-statistics`, { params })
        return extractApiResponse(response)
    },

    // Get overdue invoices
    async getOverdueInvoices(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/overdue`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // Get unpaid invoices
    async getUnpaidInvoices(params = {}) {
        const {
            page = 0,
            size = 20,
            sortBy = 'invoiceId',
            sortDir = 'desc'
        } = params

        const response = await apiClient.get(`${API_ENDPOINTS.INVOICES}/unpaid`, {
            params: { page, size, sortBy, sortDir }
        })
        return extractApiResponse(response)
    },

    // ========== UTILITY METHODS ==========

    // Validate invoice data
    validateInvoiceData(invoiceData) {
        const errors = []

        if (!invoiceData.customerId) {
            errors.push('Khách hàng không được để trống')
        }

        if (!invoiceData.subtotal || invoiceData.subtotal <= 0) {
            errors.push('Tổng tiền phải lớn hơn 0')
        }

        if (!invoiceData.status) {
            errors.push('Trạng thái hóa đơn không được để trống')
        }

        if (invoiceData.dueDate) {
            const dueDate = new Date(invoiceData.dueDate)
            const today = new Date()
            if (dueDate < today) {
                errors.push('Ngày đáo hạn không được là ngày trong quá khứ')
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        }
    },

    // Calculate invoice totals
    calculateInvoiceTotals(subtotal, taxRate = 0.1, discountRate = 0) {
        const taxAmount = subtotal * taxRate
        const discountAmount = subtotal * discountRate
        const grandTotal = subtotal + taxAmount - discountAmount

        return {
            subtotal,
            taxAmount,
            discountAmount,
            grandTotal
        }
    },

    // Format invoice amount for display
    formatInvoiceAmount(amount) {
        if (amount === undefined || amount === null) return '0 VND'
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    },

    // Get invoice status color for UI
    getInvoiceStatusColor(status) {
        const colors = {
            'DRAFT': '#6b7280', // Gray
            'UNPAID': '#f59e0b', // Yellow
            'PAID': '#10b981', // Green
            'OVERDUE': '#ef4444', // Red
            'CANCELLED': '#6b7280' // Gray
        }
        return colors[status] || '#6b7280'
    },

    // Get invoice status priority for sorting
    getInvoiceStatusPriority(status) {
        const priorities = {
            'OVERDUE': 1,
            'UNPAID': 2,
            'DRAFT': 3,
            'PAID': 4,
            'CANCELLED': 5
        }
        return priorities[status] || 99
    }
}

export default invoicesApi
