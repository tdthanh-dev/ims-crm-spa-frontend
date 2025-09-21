import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardApi } from '../services/dashboardApi.js';
import { useAuth } from './useAuth.js';

/**
 * Hook quản lý dữ liệu dashboard cho receptionist
 * @returns {Object} Dashboard data và các function xử lý
 */
export function useReceptionistDashboard() {
  const { user } = useAuth();

  // State quản lý data
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: [],
    recentActivities: [],
    overview: {},
  });

  // State loading
  const [loading, setLoading] = useState({
    overview: false,
    appointments: false,
    activities: false,
  });

  // State error
  const [error, setError] = useState(null);

  /**
   * Fetch tổng quan dashboard
   */
  const fetchOverview = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, overview: true }));
    setError(null);

    try {
      const data = await dashboardApi.getReceptionistDashboardData();
      setDashboardData(prev => ({
        ...prev,
        todayAppointments: data?.todayAppointments || [],
        recentActivities: data?.recentActivities || [],
        overview: data?.overview || {},
      }));
    } catch (err) {
      console.error('Error fetching receptionist dashboard overview:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }
  }, [user]);

  /**
   * Fetch lịch hẹn hôm nay
   */
  const fetchTodayAppointments = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, appointments: true }));

    try {
      const data = await dashboardApi.getReceptionistDashboardData();
      setDashboardData(prev => ({
        ...prev,
        todayAppointments: data?.todayAppointments || [],
      }));
    } catch (err) {
      console.error('Error fetching today appointments:', err);
    } finally {
      setLoading(prev => ({ ...prev, appointments: false }));
    }
  }, [user]);

  /**
   * Fetch hoạt động gần đây
   */
  const fetchRecentActivities = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, activities: true }));

    try {
      const data = await dashboardApi.getReceptionistDashboardData();
      setDashboardData(prev => ({
        ...prev,
        recentActivities: data?.recentActivities || [],
      }));
    } catch (err) {
      console.error('Error fetching recent activities:', err);
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  }, [user]);


  /**
   * Fetch tất cả dữ liệu dashboard
   */
  const fetchAllDashboardData = useCallback(async () => {
    if (!user) return;

    setError(null);

    try {
      await Promise.allSettled([
        fetchOverview(),
        fetchTodayAppointments(),
        fetchRecentActivities(),
      ]);
    } catch (err) {
      console.error('Error fetching all dashboard data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu dashboard.');
    }
  }, [user, fetchOverview, fetchTodayAppointments, fetchRecentActivities]);

  /**
   * Refresh dữ liệu dashboard
   */
  const refreshDashboard = useCallback(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  /**
   * Load dữ liệu khi component mount
   */
  useEffect(() => {
    if (user) {
      fetchAllDashboardData();
    }
  }, [user, fetchAllDashboardData]);

  /**
   * Computed values - Thống kê từ dữ liệu
   */
  const stats = useMemo(() => {
    const { todayAppointments, recentActivities, overview } = dashboardData;

    return {
      totalAppointments: overview?.totalAppointments || 0,
      todayAppointments: todayAppointments?.length || 0,
      recentActivitiesCount: recentActivities?.length || 0,
      pendingConsultations: overview?.pendingConsultations || 0,
    };
  }, [dashboardData]);

  /**
   * Computed values - Lịch hẹn sắp tới (4 giờ tới)
   */
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    return dashboardData.todayAppointments?.filter(apt => {
      const aptTime = new Date(apt.appointmentTime);
      return aptTime >= now && aptTime <= fourHoursLater;
    }) || [];
  }, [dashboardData.todayAppointments]);

  return {
    // Data
    dashboardData,
    stats,
    upcomingAppointments,

    // Loading states
    loading,

    // Error state
    error,

    // Functions
    refreshDashboard,
    fetchOverview,
    fetchTodayAppointments,
    fetchRecentActivities,
    fetchAllDashboardData,
  };
}

export default useReceptionistDashboard;