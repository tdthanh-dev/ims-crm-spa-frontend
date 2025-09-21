// filepath: src/hooks/useCustomerProfile.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import customersApi from '@/services/customersApi';
import appointmentsApi from '@/services/appointmentsApi';
import photosApi from '@/services/photosApi';

// ---- Helpers ----
const VN = new Intl.NumberFormat('vi-VN');

export const formatCurrency = (v) => {
  try {
    const n = Number(v || 0);
    return `${VN.format(n)} ₫`;
  } catch {
    return `${v} ₫`;
  }
};

export const formatDateTimeVN = (isoLike) => {
  if (!isoLike) return '';
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('vi-VN');
};

const STATUS_BADGE = {
  INVOICE: {
    PAID: { text: 'Đã thanh toán', className: 'bg-green-100 text-green-800' },
    UNPAID: { text: 'Chưa thanh toán', className: 'bg-red-100 text-red-800' },
    PENDING: { text: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
  },
  PAYMENT: {
    SUCCESS: { text: 'Thành công', className: 'bg-green-100 text-green-800' },
    FAILED: { text: 'Thất bại', className: 'bg-red-100 text-red-800' },
  },
};

export const getStatusBadge = (type, status) => {
  const map = STATUS_BADGE[type] || {};
  return map[status] || { text: status || '', className: 'bg-gray-100 text-gray-800' };
};

// ---- Hook chính ----
export function useCustomerProfile(userRole, customerIdFromRoute) {
  const [customerId, setCustomerId] = useState(customerIdFromRoute);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState({
    treatments: false,
    appointments: false,
    financial: false,
    photos: false,
  });

  const [tabData, setTabData] = useState({
    treatments: [],
    appointments: [],
    financial: [],
    photos: [],
  });

  const [error, setError] = useState('');
  const [showCaseCreationModal, setShowCaseCreationModal] = useState(false);
  const [showInvoiceCreationModal, setShowInvoiceCreationModal] = useState(false);
  const [selectedCaseForInvoice, setSelectedCaseForInvoice] = useState(null);

  // ---- Loaders ----
  const loadCustomer = useCallback(async (cid) => {
    try {
      const data = await customersApi.getById(cid);
      setCustomer(data || null);
      return data;
    } catch (error) {
      console.error('❌ Failed to load customer data:', error);
      throw error;
    }
  }, []);

  const loadTreatments = useCallback(async (cid) => {
    setTabLoading((s) => ({ ...s, treatments: true }));
    try {
      const cases = await customersApi.getCases(cid);
      setTabData((prev) => ({ ...prev, treatments: cases.content || [] }));
    } finally {
      setTabLoading((s) => ({ ...s, treatments: false }));
    }
  }, []);

  const loadAppointments = useCallback(async (cid) => {
    setTabLoading((s) => ({ ...s, appointments: true }));
    try {
      const res = await appointmentsApi.getByCustomer(cid);

      let appointments = [];
      if (res?.content && Array.isArray(res.content)) {
        appointments = res.content;
      } else if (Array.isArray(res)) {
        appointments = res;
      } else if (res?.data?.content && Array.isArray(res.data.content)) {
        appointments = res.data.content;
      } else if (Array.isArray(res?.data)) {
        appointments = res.data;
      } else {
        appointments = [];
      }

      setTabData((prev) => ({ ...prev, appointments }));
    } finally {
      setTabLoading((s) => ({ ...s, appointments: false }));
    }
  }, []);

  const loadFinancial = useCallback(async (cid) => {
    setTabLoading((s) => ({ ...s, financial: true }));
    try {
      const data = await customersApi.getFinancial(cid, { sortBy: 'createdAt', sortDir: 'desc' });
      setTabData((prev) => ({ ...prev, financial: data.content || [] }));
    } finally {
      setTabLoading((s) => ({ ...s, financial: false }));
    }
  }, []);

  const loadPhotos = useCallback(async (cid) => {
    setTabLoading((s) => ({ ...s, photos: true }));
    try {
      const photos = await photosApi.getPhotosByCustomer(cid);
      setTabData((prev) => ({ ...prev, photos: photos || [] }));
    } finally {
      setTabLoading((s) => ({ ...s, photos: false }));
    }
  }, []);

  const loadCustomerData = useCallback(async (cidParam) => {
    const cid = cidParam || customerId;
    if (!cid) return;

    setLoading(true);
    setError('');

    try {
      await loadCustomer(cid);
      await Promise.all([
        loadTreatments(cid).catch((err) => console.warn('Failed to load treatments:', err)),
        loadAppointments(cid).catch((err) => console.warn('Failed to load appointments:', err)),
        loadFinancial(cid).catch((err) => console.warn('Failed to load financial:', err)),
        loadPhotos(cid).catch((err) => console.warn('Failed to load photos:', err)),
      ]);
    } catch (e) {
      console.error('[CustomerProfile] Error loading customer:', e);
      setError('Không thể tải dữ liệu khách hàng.');
    } finally {
      setLoading(false);
    }
  }, [customerId, loadCustomer, loadTreatments, loadAppointments, loadFinancial, loadPhotos]);

  // ---- User actions ----
  const handleCreateCase = () => setShowCaseCreationModal(true);
  const handleCloseCaseCreationModal = () => setShowCaseCreationModal(false);
  const handleCaseCreated = async () => {
    setShowCaseCreationModal(false);
    await loadTreatments(customerId);
    setActiveTab('treatments');
  };

  const handleCreateInvoice = () => setShowInvoiceCreationModal(true);
  const handleCreateInvoiceForCase = (caseObj) => {
    setSelectedCaseForInvoice(caseObj);
    setShowInvoiceCreationModal(true);
  };
  const handleCloseInvoiceCreationModal = () => {
    setSelectedCaseForInvoice(null);
    setShowInvoiceCreationModal(false);
  };
  const handleInvoiceCreated = async () => {
    setShowInvoiceCreationModal(false);
    await loadFinancial(customerId);
    setActiveTab('financial');
  };

  const handleBackToList = () => {
    window.history.back();
  };

  // ---- Effects ----
  useEffect(() => {
    if (customerIdFromRoute && customerId !== customerIdFromRoute) {
      setCustomerId(customerIdFromRoute);
    }
  }, [customerIdFromRoute]);

  useEffect(() => {
    if (customerId) loadCustomerData(customerId);
  }, [customerId, loadCustomerData]);

  // ---- Expose ----
  return {
    customer,
    loading,
    error,
    activeTab,
    showCaseCreationModal,
    showInvoiceCreationModal,
    selectedCaseForInvoice,
    tabData,
    tabLoading,

    setActiveTab,
    setShowCaseCreationModal,
    setShowInvoiceCreationModal,
    setSelectedCaseForInvoice,

    handleCreateCase,
    handleCreateInvoice,
    handleCreateInvoiceForCase,
    handleCloseCaseCreationModal,
    handleCloseInvoiceCreationModal,
    handleCaseCreated,
    handleInvoiceCreated,
    handleBackToList,

    formatCurrency,
    formatDateTimeVN,
    getStatusBadge,

    loadCustomerData,
    customerId,
  };
}

export default useCustomerProfile;
