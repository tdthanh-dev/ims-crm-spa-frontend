import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services';

/**
 * Custom hook for Appointment Calendar logic
 * Handles all business logic, state management, and API calls
 */
export const useAppointmentCalendar = () => {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'

  // Fetch appointments when date or view mode changes
  useEffect(() => {
    fetchAppointments();
  }, [currentDate, viewMode]);

  /**
   * Fetch appointments from API based on current date and view mode
   */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range based on view mode
      const { startDate, endDate } = getDateRange(currentDate, viewMode);

      // Use appointmentsApi to get all appointments, then filter by date range
      const appointmentsData = await appointmentsApi.getAll();
      const content = appointmentsData.content || [];

      // Filter appointments by date range
      const filteredAppointments = content.filter(appointment => {
        if (!appointment.appointmentDateTime) return false;

        const appointmentDate = new Date(appointment.appointmentDateTime);
        return appointmentDate >= startDate && appointmentDate < endDate;
      });

      setAppointments(filteredAppointments);

    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Không thể tải lịch hẹn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate date range based on current date and view mode
   */
  const getDateRange = (date, mode) => {
    const startDate = new Date(date);
    const endDate = new Date(date);

    switch (mode) {
      case 'day':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'week':
        startDate.setDate(date.getDate() - date.getDay()); // Start of week
        endDate.setDate(startDate.getDate() + 6); // End of week
        break;
      case 'month':
        startDate.setDate(1); // Start of month
        endDate.setMonth(startDate.getMonth() + 1, 0); // End of month
        break;
    }

    return { startDate, endDate };
  };

  /**
   * Navigate to previous/next period based on view mode
   */
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  /**
   * Get status styling for appointment badges
   */
  const getStatusStyle = (status) => {
    const styles = {
      SCHEDULED: { background: '#dbeafe', color: '#1e40af' },
      CONFIRMED: { background: '#dcfce7', color: '#166534' },
      DONE: { background: '#dcfce7', color: '#166534' },
      CANCELLED: { background: '#fee2e2', color: '#dc2626' },
      NO_SHOW: { background: '#f3f4f6', color: '#6b7280' }
    };
    return styles[status] || styles.SCHEDULED;
  };

  /**
   * Format time range for display
   */
  const formatTimeRange = (start, end) => {
    const startTime = new Date(start).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = end ? new Date(end).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }) : '?';
    return `${startTime} - ${endTime}`;
  };

  /**
   * Get quick statistics for the current appointments
   */
  const getQuickStats = () => {
    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(a => {
      if (!a.appointmentDateTime) return false;
      return new Date(a.appointmentDateTime).toDateString() === today;
    }).length;

    const completedAppointments = appointments.filter(a =>
      a.status === 'DONE'
    ).length;

    const pendingAppointments = appointments.filter(a =>
      ['SCHEDULED', 'CONFIRMED'].includes(a.status)
    ).length;

    return {
      today: todayAppointments,
      completed: completedAppointments,
      pending: pendingAppointments
    };
  };

  /**
   * Change view mode and reset to current date
   */
  const changeViewMode = (mode) => {
    setViewMode(mode);
    setCurrentDate(new Date()); // Reset to today when changing view
  };

  // Return all state and functions needed by the UI component
  return {
    // State
    appointments,
    loading,
    error,
    currentDate,
    viewMode,

    // Actions
    fetchAppointments,
    navigateDate,
    setViewMode: changeViewMode,

    // Utilities
    getStatusStyle,
    formatTimeRange,
    getQuickStats,

    // Computed values
    stats: getQuickStats(),
    hasAppointments: appointments.length > 0,
    currentPeriodLabel: getCurrentPeriodLabel(currentDate, viewMode)
  };
};

/**
 * Helper function to get current period label
 */
const getCurrentPeriodLabel = (date, viewMode) => {
  switch (viewMode) {
    case 'month':
      return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    default:
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
  }
};