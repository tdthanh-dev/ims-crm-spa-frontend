import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services';

/**
 * Custom hook for Technician Dashboard logic
 * Handles all business logic, state management, and API calls for technician dashboard
 */
export const useTechnicianDashboard = (user) => {
  const [data, setData] = useState({
    todayAppointments: [],
    myAppointments: [],
    currentTreatment: null,
    loading: true,
    error: null
  });

  const technicianId = user?.id;

  // Load dashboard data when technicianId changes
  useEffect(() => {
    if (technicianId) {
      fetchDashboardData();
    }
  }, [technicianId]);

  /**
   * Fetch all dashboard data for the technician
   */
  const fetchDashboardData = async () => {
    if (!technicianId) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Get all appointments to filter by technician and date
      const allAppointmentsRes = await appointmentsApi.getAll();

      console.log('🔍 Technician - All Appointments Response:', allAppointmentsRes);

      // Handle response format properly - appointmentsApi may return different formats
      let allAppointments = [];

      // Handle appointments response
      if (allAppointmentsRes) {
        if (Array.isArray(allAppointmentsRes)) {
          allAppointments = allAppointmentsRes;
        } else if (allAppointmentsRes.content) {
          allAppointments = allAppointmentsRes.content;
        } else if (allAppointmentsRes.data?.success) {
          allAppointments = allAppointmentsRes.data.data || [];
        } else {
          allAppointments = allAppointmentsRes.data || [];
        }
      }

      // Filter appointments by technician and date
      const today = new Date().toDateString();
      const todayAppointments = allAppointments.filter(apt => {
        if (!apt.appointmentDateTime) return false;
        return new Date(apt.appointmentDateTime).toDateString() === today;
      });
      const myAppointments = allAppointments.filter(apt => apt.technicianId === technicianId);

      console.log(`📊 Processed appointments - Today: ${todayAppointments.length}, My: ${myAppointments.length}`);

      // Find current treatment (IN_PROGRESS status)
      const currentTreatment = todayAppointments.find(apt => apt.technicianId === technicianId && apt.status === 'IN_PROGRESS');

      setData({
        todayAppointments: todayAppointments,
        myAppointments: myAppointments.slice(0, 10), // Recent 10
        currentTreatment: currentTreatment || null,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching technician dashboard data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.'
      }));
    }
  };

  /**
   * Update appointment status
   */
  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentsApi.updateAppointmentStatus(appointmentId, { status: newStatus });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Có lỗi khi cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  /**
   * Get status style configuration
   */
  const getStatusStyle = (status) => {
    const styles = {
      SCHEDULED: { background: '#dbeafe', color: '#1e40af', label: 'Đã đặt' },
      CONFIRMED: { background: '#dcfce7', color: '#166534', label: 'Xác nhận' },
      CHECKED_IN: { background: '#fef3c7', color: '#92400e', label: 'Đã check-in' },
      IN_PROGRESS: { background: '#e0e7ff', color: '#5b21b6', label: 'Đang thực hiện' },
      COMPLETED: { background: '#dcfce7', color: '#166534', label: 'Hoàn thành' }
    };
    return styles[status] || styles.SCHEDULED;
  };

  /**
   * Get next appointment from today's schedule
   */
  const getNextAppointment = () => {
    return data.todayAppointments
      .filter(apt => ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'].includes(apt.status))
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0];
  };

  /**
   * Calculate performance statistics
   */
  const getPerformanceStats = () => {
    const todayCompleted = data.todayAppointments.filter(apt => apt.status === 'COMPLETED').length;
    const totalAppointments = data.myAppointments.length;
    const totalCompleted = data.myAppointments.filter(apt => apt.status === 'COMPLETED').length;
    const completionRate = totalAppointments > 0 ? Math.round((totalCompleted / totalAppointments) * 100) : 0;

    return {
      todayTotal: data.todayAppointments.length,
      todayCompleted,
      currentTreatment: data.currentTreatment ? 1 : 0,
      totalAppointments,
      completionRate,
      averageRating: 4.8 // This would come from API
    };
  };

  /**
   * Get recent work items (last 5 appointments)
   */
  const getRecentWork = () => {
    return data.myAppointments.slice(0, 5);
  };

  // Return all state and functions needed by the UI component
  return {
    // State
    data,
    technicianId,

    // Actions
    fetchDashboardData,
    handleUpdateAppointmentStatus,

    // Utilities
    getStatusStyle,
    getNextAppointment,
    getPerformanceStats,
    getRecentWork,

    // Computed values
    nextAppointment: getNextAppointment(),
    performanceStats: getPerformanceStats(),
    recentWork: getRecentWork(),
    hasCurrentTreatment: !!data.currentTreatment,
    hasTodayAppointments: data.todayAppointments.length > 0,
    hasMyAppointments: data.myAppointments.length > 0
  };
};