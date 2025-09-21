// filepath: src/components/Appointment/AppointmentsPanel.jsx
import React from 'react';

/** Utils nhỏ: mảng [y,m,d,H,M,S,ns] -> Date */
const arrayToDate = (arr) => {
  if (!Array.isArray(arr) || arr.length < 6) return null;
  const [y, m, d, H, M, S, ns] = arr;
  return new Date(Date.UTC(y, (m - 1), d, H, M, S ?? 0, Math.floor((ns ?? 0) / 1_000_000)));
};

export default function AppointmentsPanel({
  loading = false,
  appointments = [],
  formatDateTimeVN,
  getStatusBadge,
  onCreate // function mở modal tạo lịch hẹn
}) {
  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  const hasData = Array.isArray(appointments) && appointments.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn</h3>
          <button
            className="rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
            onClick={onCreate}
          >
            📅 Tạo lịch hẹn
          </button>
        </div>
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <div className="mb-2 text-3xl">📅</div>
          <p className="text-gray-600">Chưa có lịch hẹn nào</p>
          <button
            className="mt-3 rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
            onClick={onCreate}
          >
            Tạo lịch hẹn đầu tiên
          </button>
        </div>
      </div>
    );
  }

  const fmt = (val) => {
    if (!val) return '—';
    if (Array.isArray(val)) {
      const d = arrayToDate(val);
      return d ? formatDateTimeVN(d.toISOString()) : '—';
    }
    // val có thể đã là ISO string
    return formatDateTimeVN(val);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn</h3>
        <button
          className="rounded-lg bg-pink-600 px-3 py-2 text-white hover:bg-pink-700"
          onClick={onCreate}
        >
          📅 Tạo lịch hẹn
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {appointments.map((a, idx) => {
          const key = a.apptId ?? a.appointmentId ?? a.id ?? idx;
          const statusInfo = getStatusBadge ? getStatusBadge(a.status) : null;

          const customerName = a.customerName || a.customer?.fullName || 'Khách hàng';
          const serviceName = a.serviceName || a.service?.name || 'Dịch vụ';
          const technician = a.technicianName || a.technician?.fullName || '—';

          const startTxt = fmt(a.startAt);
          const endTxt = fmt(a.endAt);

          const notes = a.note ?? a.notes ?? '—';

          return (
            <div key={key} className="rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">
                  {serviceName}
                </h4>
                {statusInfo ? (
                  <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
                    {statusInfo.label}
                  </span>
                ) : null}
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Khách:</strong> {customerName}</p>
                <p><strong>KTV:</strong> {technician}</p>
                <p><strong>Bắt đầu:</strong> {startTxt}</p>
                <p><strong>Kết thúc:</strong> {endTxt}</p>
                <p><strong>Ghi chú:</strong> {notes}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
