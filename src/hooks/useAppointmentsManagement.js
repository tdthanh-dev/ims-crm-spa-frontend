// filepath: src/hooks/useAppointmentsManagement.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { servicesService, customersService, leadsService } from '@/services';
import { useSort } from '@/hooks/useSort';
import { appointmentsApi } from '@/services/appointmentsApi';
import { convertArrayToDate } from '@/utils/dateUtils';

function normalizeAppointment(item) {
  if (!item) return item;
  return {
    ...item,
    startAt: Array.isArray(item.startAt) ? convertArrayToDate(item.startAt) : item.startAt,
    endAt: Array.isArray(item.endAt) ? convertArrayToDate(item.endAt) : item.endAt,
    notes: item.note ?? item.notes ?? null,
  };
}

export const useAppointmentsManagement = () => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');

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
      const normalized = content.map(normalizeAppointment);

      setData({
        appointments: normalized,
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
      setModalState({ isOpen: true, context: { leadId: Number(id) } });
    } catch (error) {
      console.error('Error fetching lead:', error);
    }
  };

  const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
  const handlePageSizeChange = (newSize) => setPagination({ page: 0, size: newSize });
  const handleCreateAppointment = () => setModalState({ isOpen: true, context: null });
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
    handleCloseModal,
    handleAppointmentCreated,
    getStatusBadge,
    getStatistics,
    statistics: getStatistics(),
    hasAppointments: data.appointments.length > 0,
    showPagination: data.totalPages > 1,
  };
};
