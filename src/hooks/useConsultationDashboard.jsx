import { useState, useEffect, useCallback } from 'react';
import { leadsService } from '@/services';
import { useSort } from '@/hooks/useSort';

/**
 * Custom hook for Consultation Dashboard logic
 * Handles all business logic, state management, and API calls
 */
export const useConsultationDashboard = () => {
  // Data state
  const [data, setData] = useState({
    requests: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    loading: true,
    error: null,
  });

  // Statistics state - separate from data to ensure accuracy
  const [statistics, setStatistics] = useState({
    total: 0,
    newRequests: 0,
    inProgress: 0,
    won: 0,
    lost: 0,
  });

  // Sorting state
  const { sort, handleSort } = useSort({ sortBy: 'leadId', sortDir: 'desc' });

  // Pagination state
  const [pagination, setPagination] = useState({ page: 0, size: 20 });

  // Status filter state
  const [statusFilter, setStatusFilter] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState({ isOpen: false, selectedRequest: null });

  // Fetch statistics from API
  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await leadsService.getStatusStats();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep existing statistics on error to avoid flickering
    }
  }, []);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setData((d) => ({ ...d, loading: true, error: null }));
      let response;
      if (statusFilter && statusFilter !== null) {
        response = await leadsService.getByStatus(statusFilter, {
          page: pagination.page,
          size: pagination.size,
          sortBy: sort.sortBy || 'leadId',
          sortDir: sort.sortDir || 'desc',
        });
      } else {
        response = await leadsService.getAll({
          page: pagination.page,
          size: pagination.size,
          sortBy: sort.sortBy || 'leadId',
          sortDir: sort.sortDir || 'desc',
        });
      }
      const requests = response?.content || [];
      setData({
        requests,
        totalElements: response?.totalElements || 0,
        totalPages: response?.totalPages || 0,
        currentPage: response?.number || 0,
        pageSize: response?.size || pagination.size,
        loading: false,
        error: null,
      });

      // Refresh statistics after data fetch to ensure accuracy
      await fetchStatistics();
    } catch (error) {
      let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
      if (error.response?.status === 401) return;
      else if (error.response?.status === 403) errorMessage = 'Bạn không có quyền truy cập dữ liệu này.';
      else if (error.response?.status === 500) errorMessage = 'Lỗi server. Vui lòng liên hệ quản trị viên.';
      else if (error.code === 'NETWORK_ERROR' || !error.response) errorMessage = 'Không thể kết nối tới server. Kiểm tra kết nối mạng.';
      setData((d) => ({ ...d, loading: false, error: errorMessage }));
    }
  }, [statusFilter, pagination, sort, fetchStatistics]);

  // Event handlers
  const handlePageChange = useCallback((newPage) => {
    setPagination((p) => ({ ...p, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPagination({ page: 0, size: newSize });
  }, []);

  const handleViewRequest = useCallback((request) => {
    setModalState({ isOpen: true, selectedRequest: request });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({ isOpen: false, selectedRequest: null });
  }, []);

  const handleCreateCustomer = useCallback(async () => {
    await fetchData();
    await fetchStatistics();
  }, [fetchData, fetchStatistics]);

  const handleCreateAppointment = useCallback((request) => {
    window.location.href = '/receptionist/appointments?leadId=' + request.leadId;
  }, []);

  const handleStartConsultation = useCallback(async (request) => {
    try {
      await leadsService.updateLeadStatus(request.leadId, 'IN_PROGRESS', 'Bắt đầu tư vấn khách hàng');
      handleViewRequest({ ...request, status: 'IN_PROGRESS' });
      await fetchStatistics(); // Update statistics after status change
    } catch (error) {
      console.error('Lỗi khi bắt đầu tư vấn:', error);
      throw error;
    }
  }, [handleViewRequest, fetchStatistics]);

  const handleViewCustomerProfile = useCallback((customerId) => {
    const currentPath = window.location.pathname;
    let profilePath = `/customers/${customerId}`;
    if (currentPath.includes('/admin/')) profilePath = `/admin${profilePath}`;
    else if (currentPath.includes('/technician/')) profilePath = `/technician${profilePath}`;
    else profilePath = `/receptionist${profilePath}`;
    window.open(profilePath, '_blank');
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setPagination((p) => ({ ...p, page: 0 }));
  }, []);

  const handleClearFilter = useCallback(async () => {
    setStatusFilter(null);
    setPagination((p) => ({ ...p, page: 0 }));
    await fetchStatistics(); // Refresh statistics when clearing filter
  }, [fetchStatistics]);

  // Status badge component
  const StatusBadge = useCallback(({ status }) => {
    const getStatusInfo = (status) => {
      const statusMap = {
        'NEW': { label: 'Mới' },
        'IN_PROGRESS': { label: 'Đang tư vấn' },
        'WON': { label: 'Thành công' },
        'LOST': { label: 'Thất bại' }
      };
      return statusMap[status] || { label: status };
    };

    const statusInfo = getStatusInfo(status) || { label: status };
    const color =
      status === 'NEW'
        ? 'bg-blue-100 text-blue-800 border-blue-200'
        : status === 'IN_PROGRESS'
        ? 'bg-yellow-50 text-yellow-700 border-yellow-500/20'
        : status === 'WON'
        ? 'bg-green-50 text-green-700 border-green-500/20'
        : status === 'LOST'
        ? 'bg-red-50 text-red-700 border-red-500/20'
        : 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${color}`}>
        {statusInfo.label}
      </span>
    );
  }, []);

  // Initialize data and statistics fetching
  useEffect(() => {
    fetchData();
    fetchStatistics();
  }, [fetchData, fetchStatistics]);

  // Computed values
  const hasRequests = data.requests.length > 0;
  const showPagination = data.totalPages > 1;

  return {
    // Data
    data,
    statistics,
    hasRequests,
    showPagination,

    // State
    sort,
    pagination,
    statusFilter,
    modalState,

    // Handlers
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleViewRequest,
    handleCloseModal,
    handleCreateCustomer,
    handleCreateAppointment,
    handleStartConsultation,
    handleViewCustomerProfile,
    handleStatusFilter,
    handleClearFilter,
    fetchData,

    // Components
    StatusBadge,
  };
};