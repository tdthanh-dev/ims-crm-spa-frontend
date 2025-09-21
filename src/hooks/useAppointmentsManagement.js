// filepath: src/hooks/useAppointmentsManagement.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { servicesService, customersService, leadsService } from '@/services';
import { useSort } from '@/hooks/useSort';
import { appointmentsApi } from '@/services/appointmentsApi';

export const useAppointmentsManagement = () => {
  const [searchParams] = useSearchParams();
  const urlLeadId = searchParams.get('leadId');
  const sessionLeadId = sessionStorage.getItem('appointmentLeadId');
  const sessionCustomerName = sessionStorage.getItem('appointmentCustomerName');
  const sessionCustomerPhone = sessionStorage.getItem('appointmentCustomerPhone');
  const sessionCustomerId = sessionStorage.getItem('appointmentCustomerId');

  // Use URL leadId first, then session leadId
  const leadId = urlLeadId || sessionLeadId;

  const [data, setData] = useState({
    appointments: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    loading: true,
    error: null,
  });

  const { sort, handleSort } = useSort({ sortBy: 'apptId', sortDir: 'desc' });
  const [pagination, setPagination] = useState({ page: 0, size: 20 });
  const [modalState, setModalState] = useState({ isOpen: false, context: null });

  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchData();
    fetchServices();
    fetchCustomers();
    if (leadId) fetchLeadAndOpenModal(leadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, pagination, leadId]);

  // Cleanup sessionStorage when component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('appointmentLeadId');
      sessionStorage.removeItem('appointmentCustomerName');
      sessionStorage.removeItem('appointmentCustomerPhone');
      sessionStorage.removeItem('appointmentCustomerId');
    };
  }, []);

  const fetchData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const response = await appointmentsApi.getAll({
        page: pagination.page,
        size: pagination.size,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      });

      // ✅ Chuẩn hóa response
      const payload = response?.data || response; // có thể là { success, message, data }
      const content = Array.isArray(payload?.content) ? payload.content : [];

      setData({
        appointments: content,
        totalElements: payload?.totalElements ?? 0,
        totalPages: payload?.totalPages ?? 0,
        currentPage: payload?.currentPage ?? pagination.page,
        pageSize: payload?.pageSize ?? pagination.size,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Fetch appointments error:', error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: 'Không thể tải dữ liệu lịch hẹn',
      }));
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesService.getActive();
      setServices(Array.isArray(response?.content) ? response.content : []);
    } catch (error) {
      console.error('Fetch services error:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersService.getAll({ size: 100 });
      setCustomers(Array.isArray(response?.content) ? response.content : []);
    } catch (error) {
      console.error('Fetch customers error:', error);
    }
  };

  const fetchLeadAndOpenModal = async (id) => {
    try {
      await leadsService.getById(id);
      const context = {
        leadId: Number(id),
        customerName: sessionCustomerName,
        customerPhone: sessionCustomerPhone,
        customerId: sessionCustomerId && sessionCustomerId !== '' ? sessionCustomerId : null
      };
      setModalState({ isOpen: true, context });
      // Clear sessionStorage after using the data
      sessionStorage.removeItem('appointmentLeadId');
      sessionStorage.removeItem('appointmentCustomerName');
      sessionStorage.removeItem('appointmentCustomerPhone');
      sessionStorage.removeItem('appointmentCustomerId');
    } catch (error) {
      console.error('Error fetching lead:', error);
      // Clear sessionStorage even if there's an error
      sessionStorage.removeItem('appointmentLeadId');
      sessionStorage.removeItem('appointmentCustomerName');
      sessionStorage.removeItem('appointmentCustomerPhone');
      sessionStorage.removeItem('appointmentCustomerId');
    }
  };

  const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
  const handlePageSizeChange = (newSize) => setPagination({ page: 0, size: newSize });
  const handleCreateAppointment = () => setModalState({ isOpen: true, context: null });
  const handleCreateAppointmentWithContext = (leadId) => setModalState({ isOpen: true, context: { leadId: Number(leadId) } });
  const handleCloseModal = () => setModalState({ isOpen: false, context: null });
  const handleAppointmentCreated = () => {
    fetchData();
    handleCloseModal();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      SCHEDULED: { label: 'Đã đặt', className: 'status-scheduled' },
      CONFIRMED: { label: 'Đã xác nhận', className: 'status-confirmed' },
      NO_SHOW: { label: 'Không đến', className: 'status-no-show' },
      DONE: { label: 'Hoàn thành', className: 'status-done' },
      CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
    };
    return statusMap[status] || { label: status, className: 'status-default' };
  };

  const getStatistics = () => {
    const appointments = data.appointments;
    return {
      total: data.totalElements,
      scheduled: appointments.filter((apt) => apt.status === 'SCHEDULED').length,
      confirmed: appointments.filter((apt) => apt.status === 'CONFIRMED').length,
      done: appointments.filter((apt) => apt.status === 'DONE').length,
    };
  };

  return {
    data,
    sort,
    pagination,
    modalState,
    services,
    customers,
    fetchData,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleCreateAppointment,
    handleCreateAppointmentWithContext,
    handleCloseModal,
    handleAppointmentCreated,
    getStatusBadge,
    getStatistics,
    statistics: getStatistics(),
    hasAppointments: data.appointments.length > 0,
    showPagination: data.totalPages > 1,
  };
};
