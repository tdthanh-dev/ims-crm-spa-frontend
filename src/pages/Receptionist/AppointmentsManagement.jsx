// filepath: src/pages/appointments/AppointmentsManagement.jsx
import React, { useState } from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { Pagination, SortableHeader } from '@/components/common/CommonComponents';
import CreateAppointmentModal from '@/components/Appointment/CreateAppointmentModal';
import AppointmentDetailModal from '@/components/Appointment/AppointmentDetailModal';
import { useAppointmentsManagement } from '@/hooks/useAppointmentsManagement';

const AppointmentsManagement = () => {
  const {
    data, sort, pagination, modalState, services, customers,
    fetchData, handleSort, handlePageChange, handlePageSizeChange,
    handleCreateAppointment, handleCloseModal, handleAppointmentCreated,
    getStatusBadge, statistics, hasAppointments, showPagination
  } = useAppointmentsManagement();

  // State quản lý modal chi tiết
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Status mapping from English to Vietnamese (fallback)
  const getStatusLabel = (status) => {
    const statusMap = {
      'SCHEDULED': 'Đã lên lịch',
      'CONFIRMED': 'Đã xác nhận',
      'NO_SHOW': 'Không đến',
      'DONE': 'Hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const statusTw = (status) => {
    const map = {
      'Đã lên lịch': 'bg-blue-50 text-blue-700',
      'Đã xác nhận': 'bg-green-50 text-green-700',
      'Không đến': 'bg-gray-100 text-gray-600',
      'Hoàn thành': 'bg-emerald-50 text-emerald-700',
      'Đã hủy': 'bg-rose-50 text-rose-700',
      'status-default': 'bg-slate-100 text-slate-700'
    };
    return map[status] || map['status-default'];
  };

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="h-10 w-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <h2 className="mb-1 text-lg font-semibold">⚠️ Có lỗi xảy ra</h2>
          <p className="mb-4 text-sm">{data.error}</p>
          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
            onClick={fetchData}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-50"
            onClick={fetchData}
          >
            🔄 Làm mới
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
            onClick={handleCreateAppointment}
          >
            ➕ Tạo lịch hẹn
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon="📅" label="Tổng lịch hẹn" value={statistics.total} />
        <Stat icon="⏰" label="Đã đặt" value={statistics.scheduled} />
        <Stat icon="✅" label="Đã xác nhận" value={statistics.confirmed} />
        <Stat icon="🎉" label="Hoàn thành" value={statistics.done} />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách lịch hẹn ({data.appointments.length})
          </h2>
          <div className="text-sm text-gray-600">
            {data.appointments.length} / {data.totalElements} lịch hẹn
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-pink-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">STT</th>
                <SortableHeader label="Khách hàng" sortKey="customerName" currentSort={sort} onSort={handleSort} className="px-4 py-3 font-semibold text-gray-700" />
                <SortableHeader label="Số điện thoại" sortKey="customerPhone" currentSort={sort} onSort={handleSort} className="px-4 py-3 font-semibold text-gray-700" />
                <SortableHeader label="Thời gian hẹn" sortKey="appointmentDateTime" currentSort={sort} onSort={handleSort} className="px-4 py-3 font-semibold text-gray-700" />
                <SortableHeader label="Trạng thái" sortKey="status" currentSort={sort} onSort={handleSort} className="px-4 py-3 font-semibold text-gray-700" />
                <th className="px-4 py-3 font-semibold text-gray-700">Ghi chú</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {hasAppointments ? (
                data.appointments.map((apt, index) => {
                  return (
                    <tr key={apt.apptId ?? index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">{pagination.page * pagination.size + index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{apt.customerName || 'N/A'}</td>
                      <td className="px-4 py-3">{apt.customerPhone || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {apt.displayDate || formatDateTimeVN(apt.appointmentDateTime).split(' ')[0] || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {apt.displayTime || formatDateTimeVN(apt.appointmentDateTime).split(' ')[1] || ''}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={['inline-flex rounded-full px-2 py-1 text-xs font-medium', statusTw(apt.displayStatus || getStatusLabel(apt.status))].join(' ')}>
                          {apt.displayStatus || getStatusLabel(apt.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{apt.note || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <button
                          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={7} className="px-4 py-10"><Empty /></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <div className="mt-4">
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

      {/* Create Modal */}
      <CreateAppointmentModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onAppointmentCreated={handleAppointmentCreated}
        services={services}
        customers={customers}
      />

      {/* Detail Modal */}
      <AppointmentDetailModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdated={fetchData}
      />
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow">
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

const Empty = () => (
  <div className="flex flex-col items-center justify-center text-gray-500">
    <div className="mb-2 text-3xl">📅</div>
    <p>Chưa có lịch hẹn nào</p>
  </div>
);

export default AppointmentsManagement;
