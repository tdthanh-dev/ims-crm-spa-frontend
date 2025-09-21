// filepath: src/hooks/useRequestDetailModal.js
import { useState, useEffect } from 'react';
import { customersService, leadsService } from '@/services';

const useRequestDetailModal = (isOpen, request, onCreateCustomer, onCreateAppointment, onClose) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal states
  const [showCustomerCreationModal, setShowCustomerCreationModal] = useState(false);

  // Status update state
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'NEW',
    note: ''
  });

  useEffect(() => {
    if (isOpen && request) {
      if (request.customerId) {
        // Fetch existing customer data
        fetchCustomerData(request.customerId);
      }

      // Set initial status - sync with current request status
      setStatusUpdate(prev => ({
        ...prev,
        status: request.status || 'NEW'
      }));

      // Clear any previous errors
      setError(null);
    }
     
  }, [isOpen, request]);

  const fetchCustomerData = async (customerId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await customersService.getById(customerId);
      setCustomerData(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Không thể tải thông tin khách hàng');
      setLoading(false);
    }
  };

  const handleOpenCustomerCreationModal = () => {
    setShowCustomerCreationModal(true);
  };

  const handleCloseCustomerCreationModal = () => {
    setShowCustomerCreationModal(false);
  };

  const handleCustomerCreated = async (customerResponse) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Customer created successfully:', customerResponse);

      // Update lead status to WON (successful conversion)
      await leadsService.updateLeadStatus(
        request.leadId,
        'WON',
        `Converted to customer ID: ${customerResponse.customerId}`
      );

      if (onCreateCustomer) {
        onCreateCustomer(customerResponse);
      }

      // Close both modals
      setShowCustomerCreationModal(false);
      onClose();
    } catch (err) {
      console.error('Error updating lead after customer creation:', err);
      setError('Khách hàng được tạo thành công nhưng không thể cập nhật yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      setError(null);

      await leadsService.updateLeadStatus(request.leadId, statusUpdate.status);

      // Refresh request data
      if (onCreateCustomer) {
        onCreateCustomer(); // trigger a refresh
      }

      setLoading(false);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Không thể cập nhật trạng thái');
      setLoading(false);
    }
  };

  const handleCreateAppointment = () => {
    if (onCreateAppointment) {
      onCreateAppointment(request, customerData);
    }
    onClose();
  };

  // Helpers KHÔNG render JSX (để UI dùng ở component)
  const getStatusInfo = (status) => {
    switch (status) {
      case 'NEW': return { label: 'Mới', key: 'NEW' };
      case 'IN_PROGRESS': return { label: 'Đang xử lý', key: 'IN_PROGRESS' };
      case 'WON': return { label: 'Thành công', key: 'WON' };
      case 'LOST': return { label: 'Thất bại', key: 'LOST' };
      default: return { label: status, key: 'DEFAULT' };
    }
  };

  const getCustomerType = (hasCustomerId) => hasCustomerId ? 'existing' : 'new';

  const handleViewCustomerProfile = (customerId) => {
    const currentPath = window.location.pathname;
    let profilePath = `/customers/${customerId}`;

    if (currentPath.includes('/admin/')) {
      profilePath = `/admin${profilePath}`;
    } else if (currentPath.includes('/technician/')) {
      profilePath = `/technician${profilePath}`;
    } else {
      profilePath = `/receptionist${profilePath}`;
    }

    window.open(profilePath, '_blank');
  };

  return {
    // State
    customerData,
    loading,
    error,
    isFullscreen,
    showCustomerCreationModal,
    statusUpdate,

    // Actions
    setIsFullscreen,
    setStatusUpdate,
    handleOpenCustomerCreationModal,
    handleCloseCustomerCreationModal,
    handleCustomerCreated,
    handleStatusUpdate,
    handleCreateAppointment,
    handleViewCustomerProfile,

    // Helpers (data-only)
    getStatusInfo,
    getCustomerType,
  };
};

export default useRequestDetailModal;
