// filepath: admin-spa-management/src/pages/customers/CustomerList.jsx
import React from 'react';
import { useCustomerList } from '@/hooks';
import CustomerCreationModal from '@/components/Customer/CustomerCreationModal';

const CustomerList = ({ userRole }) => {
  const {
    // state
    data,
    searchTerm,
    currentPage,
    showCreateModal,

    // setters
    setSearchTerm,
    setCurrentPage,
    setShowCreateModal,

    // handlers
    handleSearch,
    handleViewProfile,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleCustomerCreated,

    // utils
    getCustomerTypeLabel,
    getCustomerRowClass,
    getTierBadge,

    // api
    fetchCustomers,
  } = useCustomerList(userRole);

  // -------- Loading ----------
  if (data.loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          <p className="text-gray-600">Đang tải danh sách khách hàng...</p>
        </div>
      </div>
    );
  }

  // -------- Error ----------
  if (data.error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <div className="mb-3 flex items-center gap-2 text-rose-700">
            <span>⚠️</span>
            <span>{data.error}</span>
          </div>
          <button
            onClick={fetchCustomers}
            className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-black"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // -------- View ----------
  return (
    <div className="mx-auto max-w-[1200px] p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500 whitespace-nowrap">Tìm kiếm, xem chi tiết, tạo khách hàng mới</p>
        </div>
        {(userRole === 'ADMIN' || userRole === 'RECEPTIONIST') && (
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
            onClick={handleOpenCreateModal}
          >
            ➕ Thêm khách hàng
          </button>
        )}
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-12 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(0);
                  fetchCustomers();
                }}
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-4 py-2 font-medium text-white hover:bg-black"
          >
            🔍 Tìm kiếm
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-xl font-semibold text-gray-900">{data.totalElements}</div>
          <div className="text-sm text-gray-500 whitespace-nowrap">Tổng khách hàng</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-xl font-semibold text-gray-900">
            {data.customers.filter((c) => c.isVip).length}
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">Khách VIP</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="text-xl font-semibold text-gray-900">
            {data.customers.filter((c) => (c.totalSpent || 0) > 0).length}
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap">Đã chi tiêu</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="max-h-[60vh] overflow-auto">
          <table className="table-fixed min-w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr className="text-gray-700">
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Tên khách hàng</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Số điện thoại</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Email</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Loại</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Tier</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Chi tiêu</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Điểm</th>
                <th scope="col" className="px-4 py-2 font-semibold whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="mb-2 text-4xl">👥</div>
                      <p className="font-medium whitespace-nowrap">Không tìm thấy khách hàng nào</p>
                      <p className="mt-1 text-sm text-gray-400 whitespace-nowrap">
                        Thử thay đổi từ khóa tìm kiếm
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.customers.map((customer, idx) => {
                  const rowType = getCustomerRowClass(customer); // 'vip' | 'returning' | 'new'
                  const tierInfo = getTierBadge(customer.tierName);

                  return (
                    <tr
                      key={customer.customerId}
                      className={`odd:bg-white even:bg-gray-50 hover:bg-gray-100 cursor-pointer`}
                      onClick={() => handleCustomerClick(customer.customerId)}
                    >
                      {/* Tên */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {customer.isVip && <span className="text-base">👑</span>}
                          <span className="max-w-[220px] truncate font-medium text-gray-900">
                            {customer.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-2 tabular-nums text-gray-700 whitespace-nowrap">
                        {customer.phone}
                      </td>

                      {/* Email */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="inline-block max-w-[240px] truncate text-gray-600 align-middle">
                          {customer.email || 'Chưa có'}
                        </span>
                      </td>

                      {/* Loại */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            rowType === 'vip'
                              ? 'bg-pink-50 text-pink-700 ring-1 ring-pink-200'
                              : rowType === 'returning'
                              ? 'bg-gray-100 text-gray-800 ring-1 ring-gray-200'
                              : 'bg-white text-gray-700 ring-1 ring-gray-200',
                          ].join(' ')}
                        >
                          {getCustomerTypeLabel(customer)}
                        </span>
                      </td>

                      {/* Tier */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1',
                            tierInfo.class === 'diamond'
                              ? 'bg-white text-gray-900 ring-gray-300'
                              : tierInfo.class === 'platinum'
                              ? 'bg-gray-100 text-gray-900 ring-gray-200'
                              : tierInfo.class === 'gold'
                              ? 'bg-amber-50 text-amber-800 ring-amber-200'
                              : tierInfo.class === 'silver'
                              ? 'bg-slate-100 text-slate-700 ring-slate-200'
                              : 'bg-orange-50 text-orange-700 ring-orange-200',
                          ].join(' ')}
                        >
                          {tierInfo.label}
                        </span>
                      </td>

                      {/* Chi tiêu */}
                      <td className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">
                        {customer.totalSpent
                          ? `${customer.totalSpent.toLocaleString('vi-VN')} VNĐ`
                          : '0 VNĐ'}
                      </td>

                      {/* Điểm */}
                      <td className="px-4 py-2 font-medium text-gray-700 whitespace-nowrap">
                        {customer.totalPoints || 0} điểm
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* Xem profile: icon-only, không xuống dòng */}
                          <button
                            className="rounded-md bg-white p-1.5 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(customer.customerId);
                            }}
                            title="Xem hồ sơ khách hàng"
                            aria-label="Xem hồ sơ khách hàng"
                          >
                            👁️
                          </button>

                          {/* Mở chi tiết: điều hướng đến trang profile đầy đủ */}
                          <button
                            className="rounded-md bg-pink-600 p-1.5 text-sm font-medium text-white hover:bg-pink-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(customer.customerId);
                            }}
                            title="Xem chi tiết đầy đủ"
                            aria-label="Xem chi tiết đầy đủ"
                          >
                            🔎
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data.totalElements > 20 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="rounded-xl bg-white px-4 py-2 text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-50"
          >
            ← Trang trước
          </button>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Trang <strong>{currentPage + 1}</strong> /{' '}
            <strong>{Math.ceil(data.totalElements / 20)}</strong>
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * 20 >= data.totalElements}
            className="rounded-xl bg-white px-4 py-2 text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Trang sau →
          </button>
        </div>
      )}

      {/* Customer Creation Modal */}
      <CustomerCreationModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCustomerCreated={handleCustomerCreated}
      />
    </div>
  );
};

export default CustomerList;
