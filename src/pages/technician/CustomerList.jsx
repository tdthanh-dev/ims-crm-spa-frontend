// filepath: admin-spa-management/src/pages/technician/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { useCustomerList } from '@/hooks';
import { customersApi } from '@/services';

/**
 * Technician Customer List Component
 * Specialized customer list for technicians with focus on service history
 * and quick access to customer information
 */
const TechnicianCustomerList = ({ user }) => {
  console.log('🎯 TechnicianCustomerList component rendered with user:', user);

  const [technicianCustomers, setTechnicianCustomers] = useState([]);
  const [loadingTechnicianData, setLoadingTechnicianData] = useState(false);

  const {
    // State
    data,
    searchTerm,
    currentPage,
    selectedCustomer,
    showDetailModal,
    selectedCustomerId,
    retryCount,
    isRetrying,
    maxRetries,

    // Setters
    setSearchTerm,
    setCurrentPage,
    setSelectedCustomer,
    setShowDetailModal,
    setSelectedCustomerId,

    // Handlers
    handleSearch,
    handleCustomerClick,
    handleViewProfile,
    handleCloseDetailModal,

    // Utilities
    getCustomerTypeLabel,
    getCustomerRowClass,
    getTierBadge,

    // API
    fetchCustomers,
    refreshCustomers
  } = useCustomerList('TECHNICIAN');

  // Load technician's customer history
  useEffect(() => {
    if (user?.id && data.customers.length > 0) {
      loadTechnicianCustomerData();
    }
  }, [user?.id, data.customers]);

  const loadTechnicianCustomerData = async () => {
    if (!user?.id) return;

    try {
      setLoadingTechnicianData(true);
      console.log('🔧 Loading technician customer data for:', user.id);

      // Get all customers and filter by technician's appointments
      const allCustomers = data.customers;

      // For now, we'll show all customers since we don't have appointment filtering
      // In production, this should filter by technician's appointment history
      const technicianCustomerData = allCustomers.map(customer => ({
        ...customer,
        lastServiceDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Mock data
        totalServices: Math.floor(Math.random() * 10) + 1, // Mock data
        favoriteService: ['Phun mày 6D', 'Phun môi Collagen', 'Massage toàn thân', 'Làm nail'][Math.floor(Math.random() * 4)]
      }));

      setTechnicianCustomers(technicianCustomerData);
      console.log('✅ Loaded technician customer data:', technicianCustomerData.length);

    } catch (error) {
      console.error('❌ Error loading technician customer data:', error);
    } finally {
      setLoadingTechnicianData(false);
    }
  };

  // -------- Loading State ----------
  if (data.loading || loadingTechnicianData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loadingTechnicianData ? 'Đang tải dữ liệu khách hàng...' : 'Đang tải danh sách khách hàng...'}
          </p>
          {isRetrying && (
            <p className="mt-2 text-sm text-blue-600">
              Đang thử lại... ({retryCount}/{maxRetries})
            </p>
          )}
        </div>
      </div>
    );
  }

  // -------- Error State ----------
  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-red-700 mb-4">{data.error}</p>
            <button
              onClick={refreshCustomers}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info */}
      <div className="bg-yellow-100 border border-yellow-300 p-2 text-xs">
        <strong>DEBUG:</strong> TechnicianCustomerList loaded |
        User: {user?.id || 'No user'} |
        Route: /technician/customer-list |
        Time: {new Date().toLocaleTimeString()} |
        <button
          onClick={() => window.location.reload()}
          className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Reload Page
        </button>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👥 Danh sách Khách hàng</h1>
              <p className="text-gray-600 mt-1">Khách hàng mà bạn đã phục vụ</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshCustomers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="mr-2">🔄</span>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm khách hàng theo tên, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(0);
                    fetchCustomers();
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{technicianCustomers.length}</div>
                <div className="text-sm text-gray-500">Tổng khách hàng</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">👑</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {technicianCustomers.filter(c => c.isVip).length}
                </div>
                <div className="text-sm text-gray-500">Khách VIP</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-lg">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {technicianCustomers.reduce((sum, c) => sum + (c.totalServices || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Tổng dịch vụ</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {technicianCustomers.filter(c => (c.totalSpent || 0) > 1000000).length}
                </div>
                <div className="text-sm text-gray-500">Khách hàng thân thiết</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {technicianCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khách hàng</h3>
              <p className="text-gray-500">Bạn chưa phục vụ khách hàng nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {technicianCustomers.map((customer) => {
                const tierInfo = getTierBadge(customer.tierName);
                const customerType = getCustomerTypeLabel(customer);

                return (
                  <div
                    key={customer.customerId}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => handleCustomerClick(customer.customerId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {customer.isVip && <span className="text-yellow-500">👑</span>}
                            <h3 className="text-lg font-semibold text-gray-900">
                              {customer.fullName}
                            </h3>
                          </div>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            customerType === 'VIP'
                              ? 'bg-yellow-100 text-yellow-800'
                              : customerType === 'Khách cũ'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customerType}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ring-1 ${
                            tierInfo.class === 'gold'
                              ? 'bg-yellow-50 text-yellow-800 ring-yellow-200'
                              : tierInfo.class === 'silver'
                              ? 'bg-gray-50 text-gray-800 ring-gray-200'
                              : 'bg-orange-50 text-orange-700 ring-orange-200'
                          }`}>
                            {tierInfo.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span>📱</span>
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>💰</span>
                            <span>{customer.totalSpent ? `${customer.totalSpent.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>⭐</span>
                            <span>{customer.totalPoints || 0} điểm</span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span>📅</span>
                            <span>Lần cuối: {new Date(customer.lastServiceDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>🛠️</span>
                            <span>{customer.totalServices} dịch vụ • Yêu thích: {customer.favoriteService}</span>
                          </div>
                        </div>

                        {customer.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-0.5">💬</span>
                              <p className="text-sm text-blue-800">{customer.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(customer.customerId);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="mr-2">👁️</span>
                          Xem profile
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomerId(customer.customerId);
                            setShowDetailModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
                        >
                          <span className="mr-2">📋</span>
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.totalElements > 20 && (
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ← Trang trước
            </button>

            <span className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded-lg">
              Trang <strong>{currentPage + 1}</strong> / <strong>{Math.ceil(data.totalElements / 20)}</strong>
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * 20 >= data.totalElements}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Trang sau →
            </button>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomerId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết khách hàng</h3>
                  <button
                    onClick={handleCloseDetailModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {selectedCustomer && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {selectedCustomer.isVip && <span className="text-2xl">👑</span>}
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{selectedCustomer.fullName}</h4>
                        <p className="text-sm text-gray-500">{getCustomerTypeLabel(selectedCustomer)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">📱 Số điện thoại:</span>
                        <p className="text-gray-900">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">📧 Email:</span>
                        <p className="text-gray-900">{selectedCustomer.email || 'Chưa có'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">💰 Tổng chi tiêu:</span>
                        <p className="text-gray-900">
                          {selectedCustomer.totalSpent ? `${selectedCustomer.totalSpent.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">⭐ Điểm tích lũy:</span>
                        <p className="text-gray-900">{selectedCustomer.totalPoints || 0} điểm</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <button
                          onClick={handleCloseDetailModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => handleViewProfile(selectedCustomer.customerId)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          Xem hồ sơ đầy đủ
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Default export for the component
export default TechnicianCustomerList;

// Named export for debugging
export { TechnicianCustomerList };
