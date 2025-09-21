import { BaseService } from './BaseService';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Appointments Service - handles appointment management
 */
class AppointmentsService extends BaseService {
  constructor() {
    super(API_ENDPOINTS.APPOINTMENTS);
  }

  /**
   * Get appointments by status
   * @param {string} status - Appointment status
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
   * Get appointments by customer
   * @param {string|number} customerId - Customer ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByCustomer(customerId, params = {}) {
    return this.getAll({
      ...params,
      customerId
    });
  }

  /**
   * Get appointments by technician
   * @param {string|number} technicianId - Technician ID
   * @param {Object} params - Additional parameters
   * @returns {Promise} API response
   */
  async getByTechnician(technicianId, params = {}) {
    return this.getAll({
      ...params,
      technicianId
    });
  }

  /**
   * Get calendar appointments
   * @param {string} startDate - Start date (ISO string)
   * @param {string} endDate - End date (ISO string)
   * @returns {Promise} API response
   */
  async getCalendar(startDate, endDate) {
    const response = await this.apiClient.get(`${this.endpoint}/calendar`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Get today's appointments
   * @returns {Promise} API response
   */
  async getToday() {
    const response = await this.apiClient.get(`${this.endpoint}/today`);
    return response.data;
  }

  /**
   * Get appointments for specific date
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise} API response
   */
  async getByDate(date) {
    const response = await this.apiClient.get(`${this.endpoint}/date/${date}`);
    return response.data;
  }

  /**
   * Update appointment status
   * @param {string|number} id - Appointment ID
   * @param {string|Object} status - New status or payload object
   * @param {string} reason - Optional reason
   * @param {string} notes - Optional notes
   * @returns {Promise} API response
   */
  async updateAppointmentStatus(id, status, reason, notes) {
    // If status is a string, convert to object format
    const payload = typeof status === 'string'
      ? { status, reason, notes }
      : status;
    return this.updateStatus(id, payload);
  }

  /**
   * Cancel appointment
   * @param {string|number} id - Appointment ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} API response
   */
  async cancel(id, reason = '') {
    return this.update(id, { 
      status: 'CANCELLED',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
    });
  }

  /**
   * Complete appointment
   * @param {string|number} id - Appointment ID
   * @param {string} notes - Completion notes
   * @returns {Promise} API response
   */
  async complete(id, notes = '') {
    return this.update(id, { 
      status: 'DONE',
      notes: notes || 'Completed'
    });
  }
}

export const appointmentsService = new AppointmentsService();
export default appointmentsService;
