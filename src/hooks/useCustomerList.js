// filepath: admin-spa-management/src/hooks/useCustomerList.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersApi } from '@/services';

/**
 * Hook danh sách khách hàng:
 * - Không còn modal chi tiết
 * - Click -> chuyển hướng sang trang hồ sơ khách hàng
 */
export const useCustomerList = (userRole) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    customers: [],
    totalElements: 0,
    loading: true,
    error: null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Retry
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  const fetchCustomers = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const params = {
        page: currentPage,
        size: 20,
        sortBy: 'customerId',
        sortDir: 'desc',
      };

      const response = searchTerm
        ? await customersApi.searchCustomers(searchTerm, params)
        : await customersApi.getCustomers(params);

      // Chuẩn hóa nhiều định dạng response có thể gặp
      let customers = [];
      let totalElements = 0;

      if (response?.content && Array.isArray(response.content)) {
        customers = response.content;
        totalElements = response.totalElements ?? response.content.length;
      } else if (Array.isArray(response)) {
        customers = response;
        totalElements = response.length;
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          customers = response.data;
          totalElements = response.data.length;
        } else if (response.data?.content && Array.isArray(response.data.content)) {
          customers = response.data.content;
          totalElements = response.data.totalElements ?? response.data.content.length;
        } else {
          customers = [response.data];
          totalElements = 1;
        }
      } else if (response?.customerId || response?.fullName) {
        customers = [response];
        totalElements = 1;
      } else {
        customers = [];
        totalElements = 0;
      }

      setData({
        customers: customers ?? [],
        totalElements: totalElements ?? 0,
        loading: false,
        error: null,
      });

      setRetryCount(0);
      setIsRetrying(false);
    } catch (error) {
      // Mapping lỗi thân thiện
      let errorMessage = 'Không thể tải danh sách khách hàng. Vui lòng thử lại.';

      if (error.response?.data) {
        const d = error.response.data;
        if (d.message) errorMessage = d.message;
        else if (d.error) errorMessage = d.error;
        else if (Array.isArray(d) && d[0]) {
          errorMessage = d[0].message || d[0].error || errorMessage;
        }
      } else if (error.response?.status) {
        const s = error.response.status;
        errorMessage =
          s === 400 ? 'Dữ liệu không hợp lệ.'
          : s === 401 ? 'Phiên đăng nhập đã hết hạn.'
          : s === 403 ? 'Bạn không có quyền truy cập.'
          : s === 404 ? 'Không tìm thấy dữ liệu.'
          : s >= 500 ? 'Lỗi máy chủ. Vui lòng thử lại sau.'
          : `Lỗi HTTP ${s}: ${error.message}`;
      } else if (error.message) {
        if (error.message.includes('Network Error')) errorMessage = 'Không thể kết nối máy chủ.';
        else if (error.message.includes('timeout')) errorMessage = 'Quá thời gian chờ phản hồi.';
        else errorMessage = error.message;
      }

      const shouldRetry =
        ((error.message?.includes('Network Error') ||
          error.message?.includes('timeout') ||
          error.response?.status >= 500) &&
          retryCount < maxRetries);

      if (shouldRetry && !isRetrying) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(true);

        setTimeout(() => {
          setIsRetrying(false);
          fetchCustomers();
        }, 1000 * (retryCount + 1));

        setData(prev => ({
          ...prev,
          loading: true,
          error: `Đang thử lại... (${retryCount + 1}/${maxRetries})`,
        }));
        return;
      }

      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        customers: [],
        totalElements: 0,
      }));

      setRetryCount(0);
      setIsRetrying(false);
    }
  }, [currentPage, searchTerm, retryCount, isRetrying, maxRetries]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setRetryCount(0);
    fetchCustomers();
  };

  const refreshCustomers = () => {
    setRetryCount(0);
    setCurrentPage(0);
    fetchCustomers();
  };

  // 👉 Chuyển hướng sang trang hồ sơ
  const handleViewProfile = (customerId) => {
    const rolePath = (userRole || 'staff').toLowerCase();
    navigate(`/${rolePath}/customers/${customerId}`);
  };

  // Giữ API cũ cho những nơi vẫn gọi handleCustomerClick
  const handleCustomerClick = (customerId) => handleViewProfile(customerId);

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCustomerCreated = async (newCustomer) => {
    try {
      if (newCustomer?.customerId && customersApi.refreshCustomerTier) {
        await customersApi.refreshCustomerTier(newCustomer.customerId);
      }
    } catch (e) {
      // optional log
    }
    fetchCustomers();
    setShowCreateModal(false);
  };

  const getCustomerTypeLabel = (c) => {
    if (c.isVip) return 'VIP';
    if ((c.totalSpent || 0) > 0) return 'Khách cũ';
    return 'Khách mới';
    };

  const getCustomerRowClass = (c) => {
    if (c.isVip) return 'vip';
    if ((c.totalSpent || 0) > 0) return 'returning';
    return 'new';
  };

  const getTierBadge = (tierName) => {
    if (!tierName) return { class: 'bronze', label: 'Bronze' };
    const t = tierName.toLowerCase();
    if (t.includes('diamond')) return { class: 'diamond', label: 'Diamond' };
    if (t.includes('platinum')) return { class: 'platinum', label: 'Platinum' };
    if (t.includes('gold')) return { class: 'gold', label: 'Gold' };
    if (t.includes('silver')) return { class: 'silver', label: 'Silver' };
    return { class: 'bronze', label: 'Bronze' };
  };

  return {
    // State
    data,
    searchTerm,
    currentPage,
    showCreateModal,

    // Retry info
    retryCount,
    isRetrying,
    maxRetries,

    // Setters
    setSearchTerm,
    setCurrentPage,
    setShowCreateModal,

    // Handlers
    handleSearch,
    handleViewProfile,   // dùng cho nút "Xem"/"Chi tiết"
    handleCustomerClick, // backward-compatible (row click)
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCustomerCreated,

    // Utils
    getCustomerTypeLabel,
    getCustomerRowClass,
    getTierBadge,

    // API helpers
    fetchCustomers,
    refreshCustomers,
  };
};
