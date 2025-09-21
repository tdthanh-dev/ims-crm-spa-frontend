// filepath: admin-spa-management/src/pages/appointments/AppointmentCalendar.jsx
import React from 'react';
import { useAppointmentCalendar } from '@/hooks/useAppointmentCalendar';

const AppointmentCalendar = ({ userRole }) => {
  const {
    appointments,
    loading,
    error,
    currentDate,
    viewMode,
    fetchAppointments,
    navigateDate,
    setViewMode,
    getStatusStyle,
    formatTimeRange,
    stats,
    hasAppointments,
    currentPeriodLabel
  } = useAppointmentCalendar();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          📅 Lịch hẹn
        </h1>
        <div className="flex items-center gap-2">
          <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
          <DateNavigator
            label={currentPeriodLabel}
            onPrev={() => navigateDate(-1)}
            onNext={() => navigateDate(1)}
            onToday={() => setViewMode(viewMode)} // Hook đã reset currentDate về hôm nay khi đổi view
          />
          {(userRole === 'ADMIN' || userRole === 'RECEPTIONIST') && (
            <button className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
              ➕ Đặt lịch mới
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Hôm nay" value={stats.today} />
        <StatCard label="Hoàn thành" value={stats.completed} />
        <StatCard label="Đang chờ" value={stats.pending} />
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-10 text-gray-600">
          <span className="h-5 w-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mr-3" />
          Đang tải lịch hẹn...
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50 text-red-700">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchAppointments}
            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Appointments */}
      {!loading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Lịch hẹn ({appointments.length})
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <LegendPill text="Đã lên lịch" emoji="📅" />
              <LegendPill text="Đã xác nhận" emoji="✅" />
              <LegendPill text="Hoàn thành" emoji="✔️" />
              <LegendPill text="Đã hủy" emoji="❌" />
            </div>
          </div>

          {hasAppointments ? (
            <div className="grid grid-cols-1 gap-3">
              {appointments.map((appointment) => {
                const key = appointment.apptId || `${appointment.appointmentDateTime}-${appointment.customerName || ''}`;
                const statusStyle = getStatusStyle(appointment.status);

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    {/* Time block */}
                    <div className="sm:w-64">
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.appointmentDateTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(appointment.appointmentDateTime).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        Lịch hẹn với {appointment.customerName || 'Khách hàng'}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <span>👤 {appointment.customerName || 'Khách hàng'}</span>
                        {appointment.customerPhone && (
                          <span className="ml-4">📞 {appointment.customerPhone}</span>
                        )}
                      </div>
                      {appointment.note && (
                        <div className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {appointment.note}
                        </div>
                      )}
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span
                        className="inline-flex px-2 py-1 rounded-full text-xs font-medium"
                        style={{ background: statusStyle.background, color: statusStyle.color }}
                      >
                        {statusLabel(appointment.status)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="px-2 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-900">
                          👁️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              <div className="text-3xl mb-2">📭</div>
              <p>Không có lịch hẹn nào trong khoảng thời gian này</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ========== Subcomponents ========== */

const ViewSwitcher = ({ viewMode, setViewMode }) => (
  <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
    {[
      { key: 'day', label: 'Ngày' },
      { key: 'week', label: 'Tuần' },
      { key: 'month', label: 'Tháng' },
    ].map(({ key, label }) => (
      <button
        key={key}
        className={`px-3 py-1.5 text-sm ${
          viewMode === key ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setViewMode(key)}
      >
        {label}
      </button>
    ))}
  </div>
);

const DateNavigator = ({ label, onPrev, onNext, onToday }) => (
  <div className="inline-flex items-center gap-2">
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
      <button className="px-3 py-1.5 text-sm bg-white text-gray-700 hover:bg-gray-50" onClick={onPrev}>
        ←
      </button>
      <div className="px-3 py-1.5 text-sm bg-gray-50 text-gray-700 min-w-[10rem] text-center">
        {label}
      </div>
      <button className="px-3 py-1.5 text-sm bg-white text-gray-700 hover:bg-gray-50" onClick={onNext}>
        →
      </button>
    </div>
    <button
      className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
      onClick={onToday}
      title="Hôm nay"
    >
      Hôm nay
    </button>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 text-center">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const LegendPill = ({ emoji, text }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
    <span>{emoji}</span>
    {text}
  </span>
);

const statusLabel = (s) => {
  switch (s) {
    case 'SCHEDULED': return 'Đã lên lịch';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'DONE': return 'Hoàn thành';
    case 'CANCELLED': return 'Đã hủy';
    case 'NO_SHOW': return 'Không đến';
    default: return s || 'Trạng thái';
  }
};

export default AppointmentCalendar;
