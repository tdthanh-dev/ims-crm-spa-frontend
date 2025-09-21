// filepath: src/pages/dashboards/ReceptionistDashboard.jsx
import React from 'react';
import { useReceptionistDashboard } from '../../hooks/useReceptionistDashboard.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const ReceptionistDashboard = () => {
  const {
    dashboardData,
    stats,
    upcomingAppointments,
    loading,
    error,
    refreshDashboard,
    fetchOverview,
    fetchTodayAppointments,
    fetchRecentActivities,
    fetchAllDashboardData,
  } = useReceptionistDashboard();

  // ---- Safe time formatter (handles ISO / Date / [y,m,d,H,M,(s,ns)]) ----
  const fmtTime = (val) => {
    if (!val) return '--:--';
    const toDate = (v) => {
      if (Array.isArray(v)) {
        const [y, m, d, H = 0, M = 0, S = 0] = v;
        return new Date(y, (m || 1) - 1, d || 1, H, M, S);
      }
      return v instanceof Date ? v : new Date(v);
    };
    const d = toDate(val);
    return Number.isNaN(d.getTime())
      ? '--:--'
      : d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Loading state
  if (loading.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
              <i className="fas fa-concierge-bell text-white text-2xl animate-pulse"></i>
            </div>
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mx-auto"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Đang tải dashboard...</h3>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <i className="fas fa-concierge-bell text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Receptionist Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Quản lý hoạt động hàng ngày và hỗ trợ khách hàng</p>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4"></div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard label="Tổng lịch hẹn" value={stats.totalAppointments} />
        <StatCard label="Lịch hẹn hôm nay" value={stats.todayAppointments} />
        <StatCard label="Lịch hẹn sắp tới" value={upcomingAppointments.length} />
        <StatCard label="Đang chờ tư vấn" value={stats.pendingConsultations} />
        <StatCard label="Hoạt động gần đây" value={stats.recentActivitiesCount} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ===== Today Appointments ===== */}
        <section className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>

          <header className="relative sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <i className="fas fa-calendar-day text-white"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Lịch hẹn hôm nay
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {dashboardData.todayAppointments?.length || 0}
                </span>
              </h2>
            </div>
            <button
              onClick={refreshDashboard}
              className="group/btn inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm font-medium hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              disabled={loading.appointments}
            >
              {loading.appointments ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <i className="fas fa-sync-alt group-hover/btn:rotate-180 transition-transform duration-300"></i>
                  Tải lại
                </>
              )}
            </button>
          </header>

          {/* Appointment List */}
          <div className="relative p-6 max-h-[520px] overflow-y-auto scroll-smooth">
            {!dashboardData.todayAppointments || dashboardData.todayAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                  <i className="fas fa-calendar-times text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch hẹn nào hôm nay</h3>
                <p className="text-gray-600 text-center">Hôm nay là ngày nghỉ hoặc chưa có lịch hẹn nào được đặt.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.todayAppointments.slice(0, 5).map((apt, idx) => {
                  const key = apt.id || idx;
                  const appointmentTime = apt.appointmentTime;

                  const getStatusConfig = (status) => {
                    switch (status) {
                      case 'SCHEDULED':
                        return {
                          icon: 'fas fa-clock',
                          color: 'text-blue-600',
                          bg: 'bg-blue-50',
                          border: 'border-blue-200',
                          label: 'Đã lên lịch'
                        };
                      case 'CONFIRMED':
                        return {
                          icon: 'fas fa-check-circle',
                          color: 'text-green-600',
                          bg: 'bg-green-50',
                          border: 'border-green-200',
                          label: 'Đã xác nhận'
                        };
                      case 'IN_PROGRESS':
                        return {
                          icon: 'fas fa-play-circle',
                          color: 'text-purple-600',
                          bg: 'bg-purple-50',
                          border: 'border-purple-200',
                          label: 'Đang thực hiện'
                        };
                      case 'DONE':
                        return {
                          icon: 'fas fa-check-double',
                          color: 'text-emerald-600',
                          bg: 'bg-emerald-50',
                          border: 'border-emerald-200',
                          label: 'Hoàn thành'
                        };
                      case 'CANCELLED':
                        return {
                          icon: 'fas fa-times-circle',
                          color: 'text-red-600',
                          bg: 'bg-red-50',
                          border: 'border-red-200',
                          label: 'Đã hủy'
                        };
                      case 'NO_SHOW':
                        return {
                          icon: 'fas fa-user-slash',
                          color: 'text-gray-600',
                          bg: 'bg-gray-50',
                          border: 'border-gray-200',
                          label: 'Không đến'
                        };
                      default:
                        return {
                          icon: 'fas fa-question-circle',
                          color: 'text-gray-600',
                          bg: 'bg-gray-50',
                          border: 'border-gray-200',
                          label: 'Chưa xác định'
                        };
                    }
                  };

                  const statusConfig = getStatusConfig(apt.appointmentStatus);

                  return (
                    <div
                      key={key}
                      className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                              <span className="text-blue-700 font-bold text-sm">
                                {fmtTime(appointmentTime)}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-gray-900 font-semibold truncate">{apt.customerName || 'Khách hàng'}</h4>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.border}`}>
                                <i className={`${statusConfig.icon} ${statusConfig.color}`}></i>
                                <span className={statusConfig.color}>{statusConfig.label}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <i className="fas fa-phone text-xs"></i>
                                {apt.customerPhone || 'Chưa có SĐT'}
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="fas fa-spa text-xs"></i>
                                {apt.serviceName || 'Chưa có dịch vụ'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 rounded-xl bg-gray-100 text-gray-700 px-3 py-1.5 text-xs font-medium hover:bg-gray-200 transition-all duration-200">
                            <i className="fas fa-eye"></i>
                            Xem
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {dashboardData.todayAppointments && dashboardData.todayAppointments.length > 5 && (
                  <div className="pt-1">
                    <span className="text-xs text-gray-500">
                      Hiển thị 5 lịch hẹn gần nhất · Tổng {dashboardData.todayAppointments.length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>



        {/* ===== Recent Activities ===== */}
        <section className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full translate-y-12 -translate-x-12 opacity-20"></div>

          <header className="relative px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                <i className="fas fa-history text-white"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Hoạt động gần đây
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                  {dashboardData.recentActivities?.length || 0}
                </span>
              </h2>
            </div>
          </header>

          <div className="relative p-6">
            {!dashboardData.recentActivities || dashboardData.recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                  <i className="fas fa-history text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có hoạt động nào gần đây</h3>
                <p className="text-gray-600 text-center">Chưa có hoạt động nào được ghi nhận trong 24 giờ qua.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentActivities.slice(0, 5).map((activity, idx) => {
                  const getActivityConfig = (action) => {
                    switch (action) {
                      case 'CREATE':
                        return {
                          icon: 'fas fa-plus-circle',
                          color: 'text-green-600',
                          bg: 'bg-green-50',
                          border: 'border-green-200',
                          label: 'Tạo mới'
                        };
                      case 'UPDATE':
                        return {
                          icon: 'fas fa-edit',
                          color: 'text-blue-600',
                          bg: 'bg-blue-50',
                          border: 'border-blue-200',
                          label: 'Cập nhật'
                        };
                      case 'DELETE':
                        return {
                          icon: 'fas fa-trash-alt',
                          color: 'text-red-600',
                          bg: 'bg-red-50',
                          border: 'border-red-200',
                          label: 'Xóa'
                        };
                      default:
                        return {
                          icon: 'fas fa-info-circle',
                          color: 'text-gray-600',
                          bg: 'bg-gray-50',
                          border: 'border-gray-200',
                          label: 'Khác'
                        };
                    }
                  };

                  const activityConfig = getActivityConfig(activity.action);

                  return (
                    <div
                      key={activity.id || idx}
                      className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activityConfig.color === 'text-green-600' ? 'from-green-100 to-green-200' :
                            activityConfig.color === 'text-blue-600' ? 'from-blue-100 to-blue-200' :
                            activityConfig.color === 'text-red-600' ? 'from-red-100 to-red-200' : 'from-gray-100 to-gray-200'} flex items-center justify-center shadow-sm`}>
                            <i className={`${activityConfig.icon} ${activityConfig.color}`}></i>
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${activityConfig.bg} ${activityConfig.border}`}>
                              <i className={`${activityConfig.icon} text-xs`}></i>
                              {activityConfig.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.entityType || 'Hệ thống'}
                            </span>
                          </div>

                          <p className="text-gray-900 text-sm font-medium mb-2">
                            {activity.details || 'Hoạt động không xác định'}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {activity.performedBy || 'Hệ thống'} • {activity.createdAt ? new Date(activity.createdAt).toLocaleString('vi-VN') : 'Thời gian không xác định'}
                            </span>

                            <button className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 rounded-lg bg-gray-100 text-gray-600 px-2 py-1 text-xs font-medium hover:bg-gray-200 transition-all duration-200">
                              <i className="fas fa-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {dashboardData.recentActivities && dashboardData.recentActivities.length > 5 && (
                  <div className="text-center pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <i className="fas fa-info-circle text-purple-600"></i>
                      <span className="text-sm text-purple-800 font-medium">
                        Hiển thị 5 hoạt động gần nhất • Tổng {dashboardData.recentActivities.length} hoạt động
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-8 relative bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-200 to-red-300 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>

          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">Có lỗi xảy ra</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>

            <button
              onClick={refreshDashboard}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 font-medium hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              disabled={loading.overview}
            >
              {loading.overview ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <i className="fas fa-redo-alt"></i>
                  Thử lại
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;

/* ---------- Presentational components ---------- */
const StatCard = ({ label, value }) => {
  const getIconAndColor = (label) => {
    switch (label) {
      case 'Tổng lịch hẹn':
        return {
          icon: 'fas fa-calendar-alt',
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-50'
        };
      case 'Lịch hẹn hôm nay':
        return {
          icon: 'fas fa-calendar-day',
          gradient: 'from-green-500 to-green-600',
          bg: 'bg-green-50'
        };
      case 'Lịch hẹn sắp tới':
        return {
          icon: 'fas fa-clock',
          gradient: 'from-orange-500 to-orange-600',
          bg: 'bg-orange-50'
        };
      case 'Đang chờ tư vấn':
        return {
          icon: 'fas fa-headset',
          gradient: 'from-purple-500 to-purple-600',
          bg: 'bg-purple-50'
        };
      case 'Hoạt động gần đây':
        return {
          icon: 'fas fa-history',
          gradient: 'from-pink-500 to-pink-600',
          bg: 'bg-pink-50'
        };
      default:
        return {
          icon: 'fas fa-chart-bar',
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-50'
        };
    }
  };

  const { icon, gradient, bg } = getIconAndColor(label);

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${bg}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
            <i className={`${icon} text-white text-lg`}></i>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
              {value}
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
          {label}
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
      </div>
    </div>
  );
};

const OverviewItem = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm">
    <span className="text-gray-700">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

const EmptyState = ({ icon = '📄', title = 'Không có dữ liệu' }) => (
  <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center bg-white">
    <div className="mb-2 text-3xl">{icon}</div>
    <p className="text-gray-600">{title}</p>
  </div>
);
