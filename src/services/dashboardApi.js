import apiClient from './apiClient'
import { extractApiResponse } from '@/utils/apiUtils'
import { API_ENDPOINTS } from '@/config/constants'

export const dashboardApi = {
  async getReceptionistStats() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/receptionist/stats`)
    return extractApiResponse(res) // Map<String, Long>
  },

  async getAppointmentStatusChart() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/charts/appointment-status`)
    return extractApiResponse(res) // Map<String, Long>
  },

  async getAppointmentTrendChart() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/charts/appointment-trend`)
    return extractApiResponse(res) // List<Long> (7 phần tử)
  },

  async getCustomerTiersChart() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/charts/customer-tiers`)
    return extractApiResponse(res) // Map<String, Long>
  },

  async getRevenueTrendChart() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/charts/revenue-trend`)
    return extractApiResponse(res) // List<Long> (30 phần tử)
  },

  async getMonthlyPerformance() {
    const res = await apiClient.get(`${API_ENDPOINTS.DASHBOARD}/performance/monthly`)
    return extractApiResponse(res) // Map<String, Long>
  },

  async getDashboardData() {
    try {
      const [
        stats,
        statusMap,
        trend7,
        tiersMap,
        revenue30,
        monthly
      ] = await Promise.all([
        this.getReceptionistStats(),
        this.getAppointmentStatusChart(),
        this.getAppointmentTrendChart(),
        this.getCustomerTiersChart(),
        this.getRevenueTrendChart(),
        this.getMonthlyPerformance()
      ])

      return {
        stats: stats || {},
        charts: {
          appointmentStatus: statusMap || {}, // Map
          appointmentTrend: trend7 || [],     // List
          customerTiers: tiersMap || {},      // Map
          revenueTrend: revenue30 || []       // List
        },
        performance: monthly || {}
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e)
      return {
        stats: {},
        charts: { appointmentStatus: {}, appointmentTrend: [], customerTiers: {}, revenueTrend: [] },
        performance: {}
      }
    }
  }
}

export default dashboardApi
