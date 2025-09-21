import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Invoice Service - handles invoice management and billing
 */
class InvoiceService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.INVOICES);
  }

  /**
   * Get invoices by customer ID
   * @param {string|number} customerId - Customer ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCustomerId(customerId, params = {}) {
    return this.getAll({
      ...params,
      customerId
    });
  }

  /**
   * Get invoices by status
   * @param {string} status - Invoice status
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByStatus(status, params = {}) {
    return this.getAll({
      ...params,
      status
    });
  }

  /**
   * Update invoice status
   * @param {string|number} id - Invoice ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise} API response
   */
  async updateInvoiceStatus(id, status, notes = '') {
    const response = await this.apiClient.put(`${this.endpoint}/${id}/status`, {
      status,
      notes
    });
    return response.data;
  }

  /**
   * Create invoice with items
   * @param {Object} invoiceData - Invoice data
   * @param {Array} items - Invoice items
   * @returns {Promise} API response
   */
  async createInvoiceWithItems(invoiceData, items) {
    const invoiceRequest = {
      ...invoiceData,
      items: items.map(item => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    return this.create(invoiceRequest);
  }

  /**
   * Get invoice statistics
   * @returns {Promise} API response
   */
  async getStats() {
    const response = await this.apiClient.get(`${this.endpoint}/stats`);
    return response.data;
  }

  /**
   * Get unpaid invoices
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getUnpaidInvoices(params = {}) {
    return this.getByStatus('UNPAID', params);
  }

  /**
   * Get overdue invoices
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getOverdueInvoices(params = {}) {
    return this.getByStatus('OVERDUE', params);
  }

  /**
   * Mark invoice as paid
   * @param {string|number} id - Invoice ID
   * @returns {Promise} API response
   */
  async markAsPaid(id) {
    return this.updateInvoiceStatus(id, 'PAID');
  }

  /**
   * Generate invoice for customer case
   * @param {string|number} caseId - Customer case ID
   * @param {Object} invoiceData - Additional invoice data
   * @returns {Promise} API response
   */
  async generateFromCase(caseId, invoiceData = {}) {
    const response = await this.apiClient.post(`${this.endpoint}/generate/case/${caseId}`, invoiceData);
    return response.data;
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
