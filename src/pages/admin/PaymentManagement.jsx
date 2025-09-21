import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { formatCurrencyVN } from '@/utils/formatters';
import { usePaymentManagement } from '@/hooks/usePaymentManagement';


const PaymentManagement = () => {
  const {
    loading,
    error,
    activeTab,
    searchTerm,
    statusFilter,
    selectedPayment,
    filteredPayments,
    filteredInvoices,
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setSelectedPayment,
    handleStatusUpdate,
    getStatusBadge,
    handleRetry,
    canCreate
  } = usePaymentManagement();

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">💳</span>
          Quản lý thanh toán
        </h3>
        {canCreate && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={() => alert('Create payment modal - TODO: Implement')}
          >
            <span className="mr-2">➕</span>
            Tạo thanh toán
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="FAILED">Thất bại</option>
              <option value="REFUNDED">Hoàn tiền</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map(payment => {
                const statusInfo = getStatusBadge(payment.status);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrencyVN(payment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTimeVN(payment.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => setSelectedPayment(payment)}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        {payment.status === 'PENDING' && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-900 p-1"
                              onClick={() => handleStatusUpdate(payment.id, 'COMPLETED')}
                              title="Duyệt"
                            >
                              ✓
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-1"
                              onClick={() => handleStatusUpdate(payment.id, 'FAILED')}
                              title="Từ chối"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thanh toán nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📄</span>
          Quản lý hóa đơn
        </h3>
        {canCreate && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">➕</span>
            Tạo hóa đơn
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="OVERDUE">Quá hạn</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map(invoice => {
          const statusInfo = getStatusBadge(invoice.status);
          return (
            <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">#{invoice.id}</h4>
                  <p className="text-sm text-gray-500">{formatDateTimeVN(invoice.createdAt)}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="font-medium text-gray-900">{invoice.customerName}</p>
                  <p className="text-sm text-gray-600">{invoice.customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">{invoice.serviceName}</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrencyVN(invoice.totalAmount)}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                  <span className="mr-1">👁️</span>
                  Chi tiết
                </button>
                {invoice.status === 'PENDING' && (
                  <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <span className="mr-1">💳</span>
                    Thanh toán
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy hóa đơn nào</h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );

  // Payment Details Modal
  const renderPaymentDetailsModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedPayment(null)}>
        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Chi tiết thanh toán #{selectedPayment.id}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setSelectedPayment(null)}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng:</label>
                <span className="text-gray-900">{selectedPayment.customerName}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền:</label>
                <span className="text-lg font-semibold text-gray-900">{formatCurrencyVN(selectedPayment.amount)}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức:</label>
                <span className="text-gray-900">{selectedPayment.paymentMethod || 'N/A'}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedPayment.status).bgColor} ${getStatusBadge(selectedPayment.status).textColor}`}>
                  {getStatusBadge(selectedPayment.status).label}
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian:</label>
                <span className="text-gray-900">{formatDateTimeVN(selectedPayment.createdAt)}</span>
              </div>

              {selectedPayment.notes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
                  <span className="text-gray-900">{selectedPayment.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={() => setSelectedPayment(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">💰</span>
            Quản lý thanh toán
          </h1>
          <p className="mt-2 text-gray-600">Quản lý thanh toán và hóa đơn của spa</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('payments')}
              >
                💳 Thanh toán
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('invoices')}
              >
                📄 Hóa đơn
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'payments' && renderPaymentsTab()}
          {activeTab === 'invoices' && renderInvoicesTab()}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {renderPaymentDetailsModal()}
      </div>
    </div>
  );
};

export default PaymentManagement;
