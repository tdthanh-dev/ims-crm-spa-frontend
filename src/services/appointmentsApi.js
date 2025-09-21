// filepath: src/services/appointmentsApi.js
import apiClient from './apiClient';
import { extractApiResponse } from '@/utils/apiUtils';
import { API_ENDPOINTS } from '@/config/constants';

export const appointmentsApi = {
  // Lấy tất cả lịch hẹn với phân trang
  async getAll(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'apptId',
      sortDir = 'desc',
    } = params;

    const res = await apiClient.get(API_ENDPOINTS.APPOINTMENTS, {
      params: { page, size, sortBy, sortDir },
    });
    return extractApiResponse(res);
  },

  // Lấy lịch hẹn theo ID
  async getById(id) {
    const res = await apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
    return extractApiResponse(res);
  },

  // Lấy lịch hẹn theo customer ID với phân trang
  async getByCustomer(customerId, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'appointmentDateTime',
      sortDir = 'desc',
    } = params;

    const res = await apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/customer/${customerId}`, {
      params: { page, size, sortBy, sortDir },
    });
    return extractApiResponse(res);
  },

  // Tạo lịch hẹn mới
  async createAppointment(payload) {
    // payload: { leadId?, customerId?, customerName?, customerPhone?, appointmentDateTime, status?, notes? }
    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS, payload);
    return extractApiResponse(res);
  },

  // Cập nhật lịch hẹn
  async updateAppointment(id, payload) {
    const res = await apiClient.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, payload);
    return extractApiResponse(res);
  },

  // Cập nhật trạng thái
  async updateStatus(id, payload) {
    // payload: { status, reason?, notes? }
    const res = await apiClient.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}/status`, payload);
    return extractApiResponse(res);
  },

  // Xóa lịch hẹn
  async deleteAppointment(id) {
    const res = await apiClient.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
    return extractApiResponse(res);
  },
};

export default appointmentsApi;
