// filepath: src/services/appointmentsApi.js
import apiClient from './apiClient';
import { extractApiResponse } from '@/utils/apiUtils';
import { API_ENDPOINTS } from '@/config/constants';

export const appointmentsApi = {
  // LIST (có phân trang)
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

  // Lịch hẹn hôm nay
  async getTodayAppointments(params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'startAt',
      sortDir = 'asc',
    } = params;

    const res = await apiClient.get(`${API_ENDPOINTS.APPOINTMENTS}/today`, {
      params: { page, size, sortBy, sortDir },
    });
    return extractApiResponse(res);
  },

  // Lấy theo khách hàng
  async getByCustomer(customerId, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'startAt',
      sortDir = 'desc',
    } = params;

    const res = await apiClient.get(
      `${API_ENDPOINTS.APPOINTMENTS}/customer/${customerId}`,
      { params: { page, size, sortBy, sortDir } },
    );
    return extractApiResponse(res);
  },

  // Lấy theo kỹ thuật viên
  async getByTechnician(technicianId, params = {}) {
    const {
      page = 0,
      size = 20,
      sortBy = 'startAt',
      sortDir = 'desc',
    } = params;

    const res = await apiClient.get(
      `${API_ENDPOINTS.APPOINTMENTS}/technician/${technicianId}`,
      { params: { page, size, sortBy, sortDir } },
    );
    return extractApiResponse(res);
  },

  // Lấy theo khoảng ngày (ISO yyyy-MM-dd)
  async getByDateRange(startDate, endDate, params = {}) {
    const {
      page = 0,
      size = 20,
    } = params;

    const res = await apiClient.get(
      `${API_ENDPOINTS.APPOINTMENTS}/range`,
      { params: { startDate, endDate, page, size } },
    );
    return extractApiResponse(res);
  },

  // Tạo lịch hẹn (hỗ trợ tạo bằng leadId hoặc customerId)
  async createAppointment(payload) {
    // payload: { leadId? | customerId?, serviceId, technicianId?, receptionistId, startAt, endAt, status?, notes? }
    const res = await apiClient.post(API_ENDPOINTS.APPOINTMENTS, payload);
    return extractApiResponse(res);
  },

  // Cập nhật lịch hẹn
  async updateAppointment(id, payload) {
    const res = await apiClient.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, payload);
    return extractApiResponse(res);
  },

  // Cập nhật trạng thái
  async updateStatus(id, status) {
    const res = await apiClient.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}/status`, { status });
    return extractApiResponse(res);
  },

  // Xóa
  async deleteAppointment(id) {
    const res = await apiClient.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`);
    return extractApiResponse(res);
  },
};

export default appointmentsApi;
