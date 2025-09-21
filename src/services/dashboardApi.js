import apiClient from './apiClient.js';

/**
 * Extract data from ApiResponse format
 * @param {Object} response - Axios response
 * @returns {Object} Extracted data
 */
const extractApiResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid response format');
  }

  const apiResponse = response.data;

  // Check if response follows ApiResponse format
  if (typeof apiResponse === 'object' && 'success' in apiResponse) {
    if (!apiResponse.success) {
      const error = new Error(apiResponse.message || apiResponse.error || 'API request failed');
      error.response = { data: apiResponse };
      throw error;
    }
    return apiResponse.data;
  }

  // Fallback for responses that don't use ApiResponse wrapper
  return apiResponse;
};

// API endpoints cho Dashboard
export const DASHBOARD_ENDPOINTS = {
  // General Dashboard
  OVERVIEW: '/dashboard/overview',
  REALTIME: '/dashboard/realtime',
  TODAY: '/dashboard/today',
  THIS_WEEK: '/dashboard/this-week',
  THIS_MONTH: '/dashboard/this-month',
  THIS_YEAR: '/dashboard/this-year',
  PERIOD: '/dashboard/period',
  CUSTOMER_STATS: '/dashboard/customer-stats',
  REVENUE_STATS: '/dashboard/revenue-stats',
  TOP_CUSTOMERS: '/dashboard/top-customers',
  TOP_SERVICES: '/dashboard/top-services',
  STAFF_PERFORMANCE: '/dashboard/staff-performance',

  // Receptionist Dashboard
  RECEPTIONIST: '/dashboard/receptionist',
  RECEPTIONIST_APPOINTMENTS_SUMMARY: '/dashboard/receptionist/appointments/summary',
  RECEPTIONIST_APPOINTMENTS_DETAIL: '/dashboard/receptionist/appointments/detail',
  RECEPTIONIST_TASKS_TODAY: '/dashboard/receptionist/tasks/today',
  RECEPTIONIST_CASES_TODAY: '/dashboard/receptionist/cases/today',
  RECEPTIONIST_ACTIVITIES_RECENT: '/dashboard/receptionist/activities/recent',

  // Manager Dashboard
  MANAGER: '/dashboard/manager',
  MANAGER_OVERVIEW: '/dashboard/manager/overview',
  MANAGER_REVENUE_ANALYTICS: '/dashboard/manager/revenue-analytics',
  MANAGER_STAFF_PERFORMANCE: '/dashboard/manager/staff-performance',
  MANAGER_CUSTOMER_ANALYTICS: '/dashboard/manager/customer-analytics',
  MANAGER_SERVICE_PERFORMANCE: '/dashboard/manager/service-performance',
  MANAGER_INVENTORY_ALERTS: '/dashboard/manager/inventory-alerts',
  MANAGER_FINANCIAL_SUMMARY: '/dashboard/manager/financial-summary',
  MANAGER_REALTIME: '/dashboard/manager/realtime',
};

class DashboardApi {
  // ===== GENERAL DASHBOARD METHODS =====

  /**
   * Lấy tổng quan dashboard
   */
  async getDashboardOverview() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.OVERVIEW);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard real-time
   */
  async getRealtimeDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.REALTIME);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard hôm nay
   */
  async getTodayDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.TODAY);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard tuần này
   */
  async getThisWeekDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.THIS_WEEK);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard tháng này
   */
  async getThisMonthDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.THIS_MONTH);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard năm này
   */
  async getThisYearDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.THIS_YEAR);
    return extractApiResponse(response);
  }

  /**
   * Lấy dữ liệu dashboard theo khoảng thời gian
   */
  async getDashboardDataForPeriod(startDate, endDate) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    const response = await apiClient.get(`${DASHBOARD_ENDPOINTS.PERIOD}?${params}`);
    return extractApiResponse(response);
  }

  /**
   * Lấy thống kê khách hàng theo tháng
   */
  async getCustomerStatsByMonth(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.CUSTOMER_STATS, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy thống kê doanh thu theo tháng
   */
  async getRevenueStatsByMonth(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.REVENUE_STATS, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy top khách hàng
   */
  async getTopCustomers(limit = 10, startDate) {
    const params = {
      limit: limit.toString(),
      ...(startDate && { startDate: startDate.toISOString() })
    };
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.TOP_CUSTOMERS, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy top dịch vụ
   */
  async getTopServices(limit = 10, startDate) {
    const params = {
      limit: limit.toString(),
      ...(startDate && { startDate: startDate.toISOString() })
    };
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.TOP_SERVICES, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy hiệu suất nhân viên
   */
  async getStaffPerformance(limit = 10, startDate) {
    const params = {
      limit: limit.toString(),
      ...(startDate && { startDate: startDate.toISOString() })
    };
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.STAFF_PERFORMANCE, { params });
    return extractApiResponse(response);
  }

  // ===== RECEPTIONIST DASHBOARD METHODS =====

  /**
   * Lấy dữ liệu dashboard cho receptionist
   */
  async getReceptionistDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST);
    return extractApiResponse(response);
  }

  /**
   * Lấy tóm tắt lịch hẹn hôm nay cho receptionist
   */
  async getTodayAppointmentsSummary() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST_APPOINTMENTS_SUMMARY);
    return extractApiResponse(response);
  }

  /**
   * Lấy chi tiết lịch hẹn hôm nay cho receptionist
   */
  async getTodayAppointmentsDetail() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST_APPOINTMENTS_DETAIL);
    return extractApiResponse(response);
  }

  /**
   * Lấy tasks cần làm hôm nay cho receptionist
   */
  async getTodayTasksForReceptionist() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST_TASKS_TODAY);
    return extractApiResponse(response);
  }

  /**
   * Lấy customer cases cần xử lý hôm nay cho receptionist
   */
  async getTodayCasesForReceptionist() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST_CASES_TODAY);
    return extractApiResponse(response);
  }

  /**
   * Lấy hoạt động gần đây cho receptionist
   */
  async getRecentActivitiesForReceptionist() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.RECEPTIONIST_ACTIVITIES_RECENT);
    return extractApiResponse(response);
  }

  // ===== MANAGER DASHBOARD METHODS =====

  /**
   * Lấy dữ liệu dashboard cho manager
   */
  async getManagerDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER);
    return extractApiResponse(response);
  }

  /**
   * Lấy tổng quan chi tiết cho manager
   */
  async getManagerDashboardOverview() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_OVERVIEW);
    return extractApiResponse(response);
  }

  /**
   * Lấy analytics doanh thu cho manager
   */
  async getRevenueAnalyticsForManager(startDate, endDate) {
    const params = {
      ...(startDate && { startDate: startDate.toISOString() }),
      ...(endDate && { endDate: endDate.toISOString() })
    };
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_REVENUE_ANALYTICS, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy performance của nhân viên cho manager
   */
  async getStaffPerformanceForManager(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_STAFF_PERFORMANCE, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy analytics khách hàng cho manager
   */
  async getCustomerAnalyticsForManager(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_CUSTOMER_ANALYTICS, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy performance của dịch vụ cho manager
   */
  async getServicePerformanceForManager(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_SERVICE_PERFORMANCE, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy inventory alerts cho manager
   */
  async getInventoryAlertsForManager() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_INVENTORY_ALERTS);
    return extractApiResponse(response);
  }

  /**
   * Lấy financial summary cho manager
   */
  async getFinancialSummaryForManager(startDate) {
    const params = startDate ? { startDate: startDate.toISOString() } : {};
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_FINANCIAL_SUMMARY, { params });
    return extractApiResponse(response);
  }

  /**
   * Lấy real-time data cho manager dashboard
   */
  async getManagerRealtimeDashboardData() {
    const response = await apiClient.get(DASHBOARD_ENDPOINTS.MANAGER_REALTIME);
    return extractApiResponse(response);
  }
}

// Export singleton instance
export const dashboardApi = new DashboardApi();
export default dashboardApi;