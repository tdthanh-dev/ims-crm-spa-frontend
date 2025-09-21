// ========= ConsultationDashboard.jsx (Tailwind) =========
import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
// removed: import { truncateText } from '@/utils/formatters';
import { Pagination, SortableHeader } from '@/components/common/CommonComponents';
import { useConsultationDashboard } from '@/hooks/useConsultationDashboard.jsx';
import RequestDetailModalV2 from '@/components/RequestDetailModal/RequestDetailModalV2';

const ConsultationDashboard = () => {
  const {
    data,
    statistics,
    hasRequests,
    showPagination,
    sort,
    pagination,
    statusFilter,
    modalState,
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
    StatusBadge,
  } = useConsultationDashboard();

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4 text-2xl">⚠️</div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
            <p className="text-red-700 mb-4">{data.error}</p>
            <button
              onClick={fetchData}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">💬</span>
              Yêu cầu tư vấn
            </h1>
            {statusFilter && (
              <span className="ml-4 inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                {statusFilter === 'NEW' ? 'Mới' : statusFilter === 'IN_PROGRESS' ? 'Đang tư vấn' : statusFilter === 'WON' ? 'Thành công' : statusFilter === 'LOST' ? 'Thất bại' : statusFilter}
                <button
                  onClick={handleClearFilter}
                  className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
                  title="Xoá bộ lọc"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
            title="Làm mới"
          >
            <span className="text-base">🔄</span> Làm mới
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div
            onClick={handleClearFilter}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all bg-white hover:shadow-md ${statusFilter === null ? 'ring-2 ring-blue-300 bg-blue-50' : ''}`}
            title="Xem tất cả yêu cầu"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 grid place-items-center text-lg">📊</div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Tổng</h3>
                <p className="text-lg font-semibold text-gray-900">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleStatusFilter('NEW')}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all bg-white hover:shadow-md ${statusFilter === 'NEW' ? 'ring-2 ring-blue-300 bg-blue-50' : ''}`}
            title="Xem yêu cầu mới"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 grid place-items-center text-lg">➕</div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Mới</h3>
                <p className="text-lg font-semibold text-gray-900">{statistics.newRequests}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleStatusFilter('IN_PROGRESS')}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all bg-white hover:shadow-md ${statusFilter === 'IN_PROGRESS' ? 'ring-2 ring-yellow-300 bg-yellow-50' : ''}`}
            title="Xem yêu cầu đang tư vấn"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 grid place-items-center text-lg">💬</div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Đang tư vấn</h3>
                <p className="text-lg font-semibold text-gray-900">{statistics.inProgress}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleStatusFilter('WON')}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all bg-white hover:shadow-md ${statusFilter === 'WON' ? 'ring-2 ring-green-300 bg-green-50' : ''}`}
            title="Xem yêu cầu thành công"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 grid place-items-center text-lg">✔️</div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Thành công</h3>
                <p className="text-lg font-semibold text-gray-900">{statistics.won}</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleStatusFilter('LOST')}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition-all bg-white hover:shadow-md ${statusFilter === 'LOST' ? 'ring-2 ring-red-300 bg-red-50' : ''}`}
            title="Xem yêu cầu thất bại"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 grid place-items-center text-lg">✖️</div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Thất bại</h3>
                <p className="text-lg font-semibold text-gray-900">{statistics.lost}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Yêu cầu tư vấn ({data.requests.length})</h2>
            <div className="text-sm text-gray-600">{data.requests.length} / {data.totalElements} yêu cầu</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-700">
                  <th className="px-6 py-2.5 font-semibold">STT</th>
                  <SortableHeader label="Khách hàng" sortKey="fullName" currentSort={sort} onSort={handleSort} thClassName="px-6 py-2.5" />
                  <SortableHeader label="SĐT" sortKey="phone" currentSort={sort} onSort={handleSort} thClassName="px-6 py-2.5" />
                  {/* removed "Ghi chú" column */}
                  <th className="px-6 py-2.5 font-semibold">Loại khách</th>
                  <SortableHeader label="Trạng thái" sortKey="status" currentSort={sort} onSort={handleSort} thClassName="px-6 py-2.5" />
                  <SortableHeader label="Thời gian" sortKey="createdAt" currentSort={sort} onSort={handleSort} thClassName="px-6 py-2.5" />
                  <th className="px-6 py-2.5 font-semibold">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {hasRequests ? (
                  data.requests.map((request, index) => (
                    <tr
                      key={request.leadId}
                      className="border-t border-gray-100 even:bg-gray-50 hover:bg-gray-100/60 transition-colors"
                    >
                      <td className="px-6 py-2.5 text-gray-800">{pagination.page * pagination.size + index + 1}</td>
                      <td className="px-6 py-2.5 text-gray-900 font-medium">{request.fullName || 'N/A'}</td>
                      <td className="px-6 py-2.5 text-gray-800">{request.phone || 'N/A'}</td>
                      {/* removed note cell */}
                      <td className="px-6 py-2.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${
                            request.customerId
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {request.customerId ? 'Khách cũ' : 'Khách mới'}
                        </span>
                      </td>
                      <td className="px-6 py-2.5">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-2.5 text-gray-700">
                        {request.createdAt ? (
                          <span className="inline-flex rounded-md bg-white px-2 py-0.5 border border-gray-200 text-xs text-gray-800">
                            {formatDateTimeVN(request.createdAt)}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-2.5">
                        <div className="flex flex-wrap gap-2">
                          {request.status === 'NEW' && (
                            <button
                              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 text-white px-3 py-1 text-xs font-medium hover:bg-blue-700 transition-colors"
                              title="Bắt đầu tư vấn"
                              onClick={() => handleStartConsultation(request)}
                            >
                              <span>💬</span> Tư vấn
                            </button>
                          )}
                          {request.status === 'IN_PROGRESS' && (
                            <button
                              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 text-gray-800 px-3 py-1 text-xs font-medium hover:bg-gray-50 transition-colors"
                              title="Xem chi tiết"
                              onClick={() => handleViewRequest(request)}
                            >
                              <span>📄</span> Chi tiết
                            </button>
                          )}
                          {request.status === 'WON' && request.customerId && (
                            <button
                              className="inline-flex items-center gap-1.5 rounded-md border border-green-300 text-green-700 px-3 py-1 text-xs font-medium hover:bg-green-50 transition-colors"
                              title="Xem hồ sơ khách hàng"
                              onClick={() => handleViewCustomerProfile(request.customerId)}
                            >
                              <span>👤</span> Hồ sơ
                            </button>
                          )}
                          {request.status === 'LOST' && (
                            <button
                              className="inline-flex items-center gap-1.5 rounded-md border border-red-300 text-red-700 px-3 py-1 text-xs font-medium hover:bg-red-50 transition-colors"
                              title="Yêu cầu thất bại"
                              onClick={() => handleViewRequest(request)}
                            >
                              <span>⚠️</span> Thất bại
                            </button>
                          )}
                          {/* removed: Edit button */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* colSpan reduced: from 8 -> 7 after removing "Ghi chú" */}
                    <td colSpan={7} className="px-6 py-10">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-3">📄</div>
                        <p className="text-lg">Chưa có yêu cầu tư vấn nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                pageSize={data.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                disabled={data.loading}
              />
            </div>
          )}
        </div>

        {/* Modal */}
        <RequestDetailModalV2
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          request={modalState.selectedRequest}
          onCreateCustomer={handleCreateCustomer}
          onCreateAppointment={handleCreateAppointment}
        />
      </div>
    </div>
  );
};

export default ConsultationDashboard;
