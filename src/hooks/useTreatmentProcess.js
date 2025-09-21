import { useState, useEffect } from 'react';
import { appointmentsApi } from '@/services';
import { useAuth } from '@/hooks/useAuth';

/**
 * Custom hook for Treatment Process logic
 * Handles all business logic, state management, and API calls for technician treatment process
 */
export const useTreatmentProcess = () => {
  const { user } = useAuth();

  // State management
  const [currentTreatment, setCurrentTreatment] = useState(null);
  const [upcomingTreatments, setUpcomingTreatments] = useState([]);
  const [completedTreatments, setCompletedTreatments] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [checklistItems, setChecklistItems] = useState({
    consultation: false,
    skinCheck: false,
    sterilization: false,
    technique: false,
    aftercare: false,
    retouch: false
  });

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      loadTreatmentData();
    }
  }, [user?.id]);

  /**
   * Load all treatment data for the current technician
   */
  const loadTreatmentData = async () => {
    try {
      setLoading(true);

      // Get all appointments for this technician
      const response = await appointmentsApi.getAppointments({
        page: 0,
        size: 50,
        sortBy: 'apptId',
        sortDir: 'desc'
      });
      const allAppointments = response.content || [];

      // Filter appointments for this technician
      const technicianAppointments = allAppointments.filter(apt => apt.technicianId === user.id);

      // Separate by status
      const current = technicianAppointments.find(apt => apt.status === 'IN_PROGRESS');
      const upcoming = technicianAppointments.filter(apt =>
        ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'].includes(apt.status)
      );
      const completed = technicianAppointments.filter(apt => apt.status === 'COMPLETED');

      setCurrentTreatment(current || null);
      setUpcomingTreatments(upcoming.slice(0, 10)); // Show next 10
      setCompletedTreatments(completed.slice(0, 20)); // Show last 20

    } catch (error) {
      console.error('Error loading treatment data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start a treatment session
   */
  const handleStartTreatment = async (appointmentId) => {
    try {
      await appointmentsApi.updateAppointmentStatus(appointmentId, { status: 'IN_PROGRESS' });
      await loadTreatmentData();
    } catch (error) {
      console.error('Error starting treatment:', error);
      alert('Có lỗi khi bắt đầu điều trị');
    }
  };

  /**
   * Complete a treatment session
   */
  const handleCompleteTreatment = async (appointmentId, notes) => {
    try {
      // First update appointment status
      await appointmentsApi.updateAppointmentStatus(appointmentId, { status: 'COMPLETED' });

      // TODO: Save treatment notes to technician notes API
      if (notes) {
        // This would save to technician notes service
        console.log('Saving treatment notes:', notes);
      }

      // Reset modal state
      setSelectedTreatment(null);
      setTreatmentNotes('');
      resetChecklist();

      await loadTreatmentData();

      alert('Điều trị hoàn thành thành công!');
    } catch (error) {
      console.error('Error completing treatment:', error);
      alert('Có lỗi khi hoàn thành điều trị');
    }
  };

  /**
   * Cancel a treatment session
   */
  const handleCancelTreatment = async (appointmentId, reason) => {
    try {
      await appointmentsApi.updateAppointmentStatus(appointmentId, {
        status: 'CANCELLED',
        notes: reason || 'Cancelled by technician'
      });
      await loadTreatmentData();
    } catch (error) {
      console.error('Error cancelling treatment:', error);
      alert('Có lỗi khi hủy điều trị');
    }
  };

  /**
   * Update checklist item
   */
  const updateChecklistItem = (item, checked) => {
    setChecklistItems(prev => ({
      ...prev,
      [item]: checked
    }));
  };

  /**
   * Reset checklist to default state
   */
  const resetChecklist = () => {
    setChecklistItems({
      consultation: false,
      skinCheck: false,
      sterilization: false,
      technique: false,
      aftercare: false,
      retouch: false
    });
  };

  /**
   * Get status badge configuration
   */
  const getStatusBadge = (status) => {
    const statusMap = {
      'SCHEDULED': { class: 'scheduled', label: 'Đã lên lịch', color: '#fbbf24' },
      'CONFIRMED': { class: 'confirmed', label: 'Đã xác nhận', color: '#3b82f6' },
      'CHECKED_IN': { class: 'checked-in', label: 'Đã check-in', color: '#10b981' },
      'IN_PROGRESS': { class: 'in-progress', label: 'Đang điều trị', color: '#8b5cf6' },
      'COMPLETED': { class: 'completed', label: 'Hoàn thành', color: '#10b981' },
      'CANCELLED': { class: 'cancelled', label: 'Đã hủy', color: '#ef4444' }
    };
    return statusMap[status] || statusMap.SCHEDULED;
  };

  /**
   * Calculate quick statistics
   */
  const getQuickStats = () => {
    return {
      upcoming: upcomingTreatments.length,
      current: currentTreatment ? 1 : 0,
      completed: completedTreatments.length,
      rating: 4.8 // This would come from API
    };
  };

  /**
   * Check if all checklist items are completed
   */
  const isChecklistComplete = () => {
    return Object.values(checklistItems).every(item => item);
  };

  // Return all state and functions needed by the UI component
  return {
    // State
    currentTreatment,
    upcomingTreatments,
    completedTreatments,
    selectedTreatment,
    loading,
    treatmentNotes,
    checklistItems,

    // Actions
    loadTreatmentData,
    handleStartTreatment,
    handleCompleteTreatment,
    handleCancelTreatment,
    setSelectedTreatment,
    setTreatmentNotes,
    updateChecklistItem,
    resetChecklist,

    // Utilities
    getStatusBadge,
    getQuickStats,
    isChecklistComplete,

    // Computed values
    stats: getQuickStats(),
    hasCurrentTreatment: !!currentTreatment,
    hasUpcomingTreatments: upcomingTreatments.length > 0,
    hasCompletedTreatments: completedTreatments.length > 0
  };
};