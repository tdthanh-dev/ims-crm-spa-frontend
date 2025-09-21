// filepath: src/components/Appointment/AppointmentsPanel.jsx
import React from 'react';

export default function AppointmentsPanel({
  loading = false,
  appointments = [],
  formatDateTimeVN,
  getStatusBadge,
  onCreate, // function mở modal tạo lịch hẹn
  onViewDetail // function mở modal chi tiết
}) {
  if (loading) {
    return <div className="text-gray-500">Đang tải...</div>;
  }

  const hasData = Array.isArray(appointments) && appointments.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              📅
            </div>
            <h3 className="text-xl font-bold text-gray-900">Lịch hẹn</h3>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-2.5 text-white font-medium hover:from-pink-700 hover:to-pink-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={onCreate}
          >
            <span className="text-sm">➕</span>
            Tạo lịch hẹn
          </button>
        </div>
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100">
            <span className="text-xl">📅</span>
          </div>
          <h4 className="mb-2 text-base font-semibold text-gray-700">Chưa có lịch hẹn nào</h4>
          <p className="mb-4 text-sm text-gray-500">Tạo lịch hẹn đầu tiên để bắt đầu theo dõi</p>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 px-4 py-2 text-sm text-white font-medium hover:from-pink-700 hover:to-pink-800 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={onCreate}
          >
            <span>➕</span>
            Tạo lịch hẹn đầu tiên
          </button>
        </div>
      </div>
    );
  }

  const fmt = (val) => {
    if (!val) return '—';
    // val là LocalDateTime string từ backend
    return formatDateTimeVN(val);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-gradient-to-br from-pink-500 to-purple-600 text-white text-sm">
            📅
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Lịch hẹn</h3>
            <p className="text-xs text-gray-500">{appointments.length} lịch hẹn</p>
          </div>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 text-xs text-white font-medium hover:from-pink-700 hover:to-pink-800 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={onCreate}
        >
          <span>➕</span>
          Tạo lịch hẹn
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {appointments.map((a, idx) => {
          const key = a.apptId ?? a.appointmentId ?? a.id ?? idx;
          const statusInfo = getStatusBadge ? getStatusBadge(a.status) : null;

          const customerName = a.customerName || 'Khách hàng';
          const customerPhone = a.customerPhone || '';

          const appointmentTime = fmt(a.appointmentDateTime);
          const appointmentId = a.apptId || a.id || 'N/A';

          const notes = a.note || '—';

          // Status-based styling
          const getStatusColor = (status) => {
            switch (status) {
              case 'SCHEDULED': return 'from-blue-500 to-blue-600';
              case 'CONFIRMED': return 'from-green-500 to-green-600';
              case 'DONE': return 'from-emerald-500 to-emerald-600';
              case 'CANCELLED': return 'from-red-500 to-red-600';
              case 'NO_SHOW': return 'from-gray-500 to-gray-600';
              default: return 'from-gray-400 to-gray-500';
            }
          };

          const isToday = new Date(a.appointmentDateTime).toDateString() === new Date().toDateString();
          const isPast = new Date(a.appointmentDateTime) < new Date();

          return (
            <div
              key={key}
              className={`group relative rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                isToday
                  ? 'border-pink-200 bg-gradient-to-br from-pink-50 to-white shadow-md'
                  : 'border-gray-100 bg-white shadow-sm hover:border-pink-200'
              }`}
            >
              {/* Status indicator bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r ${getStatusColor(a.status)}`} />

              <div className="p-4">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">#{appointmentId}</h4>
                    {isToday && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
                        Hôm nay
                      </span>
                    )}
                    {isPast && !isToday && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        Đã qua
                      </span>
                    )}
                  </div>
                  {statusInfo && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getStatusColor(a.status)}`} />
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-xs font-semibold ${
                        isToday ? 'bg-white/90 text-gray-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                <div className="mb-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-gray-400 text-xs">👤</span>
                    <span className="font-medium text-gray-900 truncate">{customerName}</span>
                  </div>
                  {customerPhone && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-gray-400 text-xs">📞</span>
                      <span className="text-gray-600">{customerPhone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="text-gray-400 text-xs">⏰</span>
                    <span className="text-gray-600">{appointmentTime}</span>
                  </div>
                </div>

                {/* Notes */}
                {notes !== '—' && (
                  <div className="mb-3">
                    <div className="flex items-start gap-1.5">
                      <span className="text-gray-400 text-xs mt-0.5">📝</span>
                      <p className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1.5 leading-relaxed">
                        {notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-all duration-200"
                    onClick={() => onViewDetail?.(a)}
                  >
                    <span>👁️</span>
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
