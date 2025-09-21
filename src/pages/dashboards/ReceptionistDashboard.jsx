// filepath: src/pages/dashboards/ReceptionistDashboard.jsx
import React from 'react';
import { useReceptionistDashboard } from '@/hooks/useReceptionistDashboard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const ReceptionistDashboard = () => {
  const {
    data,
    searchTerm,
    searchResults,
    setSearchTerm,
    fetchDashboardData,
    handleCustomerSearch,
    getAppointmentStatusStyle,
    // chart-ready
    appointmentStatusChart,
    appointmentTrendChart,
    customerTiersChart,
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

  if (data.loading) {
    return (
      <div className="p-6">
        <div className="grid place-items-center py-24">
          <div className="h-10 w-10 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
          <p className="mt-4 text-gray-700">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data.stats || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🛎️ Receptionist Dashboard</h1>
        <p className="text-gray-600">Quản lý hoạt động hàng ngày và hỗ trợ khách hàng</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Lịch hẹn hôm nay" value={stats.todayAppointments ?? (Array.isArray(data.todayAppointments) ? data.todayAppointments.length : 0)} />
        <StatCard label="Yêu cầu chờ xử lý" value={stats.pendingRequests ?? (Array.isArray(data.pendingRequests) ? data.pendingRequests.length : 0)} />
        <StatCard label="Hoàn thành" value={stats.todayCompleted ?? 0} />
        <StatCard label="Lịch hẹn tuần" value={stats.weekAppointments ?? 0} />
        <StatCard label="Khách hàng active" value={stats.activeCustomers ?? 0} />
        <StatCard label="Khách mới hôm nay" value={stats.newCustomersToday ?? 0} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ===== Today Appointments (sticky header + show 5 rows + scroll) ===== */}
        <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
          <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
            <h2 className="text-base font-semibold text-gray-900">
              📅 Lịch hẹn hôm nay {`(${Array.isArray(data.todayAppointments) ? data.todayAppointments.length : 0})`}
            </h2>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center rounded-xl bg-white text-pink-700 border border-pink-200 px-3 py-1.5 text-xs font-medium hover:bg-pink-50"
            >
              ↻ Tải lại
            </button>
          </header>

          {/* hiển thị tối đa ~5 item rồi cuộn */}
          <div className="p-4 max-h-[520px] overflow-y-auto scroll-smooth">
            {Array.isArray(data.todayAppointments) && data.todayAppointments.length === 0 ? (
              <EmptyState icon="🗓️" title="Không có lịch hẹn nào hôm nay" />
            ) : (
              <div className="space-y-3">
                {(Array.isArray(data.todayAppointments) ? data.todayAppointments.slice(0, 5) : []).map((apt, idx) => {
                  const statusStyle = getAppointmentStatusStyle(apt.status);
                  const key = apt.apptId ?? apt.id ?? idx;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 border-l-4 border-l-pink-400 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-[1px] transition"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-pink-100 text-pink-700 font-semibold">
                          {fmtTime(apt.startAt)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-gray-900 font-semibold truncate">{apt.customerName || 'Khách hàng'}</div>
                          <div className="text-gray-600 text-sm truncate">{apt.serviceName || 'Dịch vụ'}</div>
                          <div className="text-gray-500 text-xs truncate">{apt.technicianName || 'Chưa phân công'}</div>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm border"
                          style={{ background: statusStyle.background, color: statusStyle.color }}
                        >
                          {(apt.status || '').replace('_', ' ') || '—'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {Array.isArray(data.todayAppointments) && data.todayAppointments.length > 5 && (
                  <div className="pt-1">
                    <span className="text-xs text-gray-500">
                      Hiển thị 5 lịch hẹn gần nhất · Tổng {data.todayAppointments.length}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ===== Pending Requests ===== */}
        <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
          <header className="sticky top-0 z-10 px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
            <h2 className="text-base font-semibold text-gray-900">
              📞 Yêu cầu tư vấn chờ xử lý ({data.pendingRequests.length})
            </h2>
          </header>
          <div className="p-4">
            {data.pendingRequests.length === 0 ? (
              <EmptyState icon="🤖" title="Không có yêu cầu nào chờ xử lý" />
            ) : (
              <div className="space-y-3">
                {data.pendingRequests.map((request) => (
                  <div
                    key={request.leadId}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow transition"
                  >
                    <div className="min-w-0">
                      <div className="text-gray-900 font-medium truncate">{request.fullName}</div>
                      <div className="text-gray-700 text-sm truncate">{request.phone}</div>
                      <div className="text-gray-600 text-sm truncate">{request.note}</div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${
                            request.customerId ? 'bg-pink-50 text-pink-800 border-pink-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                        >
                          {request.customerId ? 'Khách cũ' : 'Khách mới'}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <button className="mt-2 inline-flex items-center rounded-xl bg-pink-500 text-white px-3 py-1.5 text-xs font-medium hover:bg-pink-600">
                        Xử lý
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ===== Customer Search ===== */}
        <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
          <header className="px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
            <h2 className="text-base font-semibold text-gray-900">🔍 Tìm kiếm khách hàng</h2>
          </header>
          <div className="p-4">
            <form onSubmit={handleCustomerSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500/70 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button type="submit" className="rounded-xl border border-gray-200 text-gray-800 px-3 py-2 hover:bg-gray-50">
                🔍
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Kết quả tìm kiếm:</h4>
                <div className="space-y-2">
                  {searchResults.map((customer) => (
                    <div
                      key={customer.customerId ?? customer.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm"
                    >
                      <div className="min-w-0">
                        <div className="text-gray-900 font-medium truncate">{customer.fullName}</div>
                        <div className="text-gray-600 truncate">
                          {customer.phone} {customer.email ? `- ${customer.email}` : ''}
                        </div>
                      </div>
                      <button className="shrink-0 inline-flex items-center rounded-xl border border-gray-200 text-gray-800 px-3 py-1.5 hover:bg-gray-50">
                        Xem
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ===== Charts: Appointment Status ===== */}
        {appointmentStatusChart.counts.some((v) => v > 0) && (
          <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
            <header className="px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
              <h2 className="text-base font-semibold text-gray-900">📊 Phân bố trạng thái lịch hẹn</h2>
            </header>
            <div className="p-4">
              <div className="h-64">
                <Doughnut
                  data={{
                    labels: appointmentStatusChart.labels,
                    datasets: [{ data: appointmentStatusChart.counts, backgroundColor: appointmentStatusChart.colors, borderWidth: 1 }],
                  }}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ===== Charts: Appointment Trend 7 days ===== */}
        {appointmentTrendChart.counts.length > 0 && (
          <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
            <header className="px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
              <h2 className="text-base font-semibold text-gray-900">📈 Xu hướng lịch hẹn 7 ngày</h2>
            </header>
            <div className="p-4">
              <div className="h-64">
                <Line
                  data={{
                    labels: appointmentTrendChart.labels,
                    datasets: [
                      {
                        label: 'Số lịch hẹn',
                        data: appointmentTrendChart.counts,
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236,72,153,0.12)',
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{ responsive: true, scales: { y: { beginAtZero: true } } }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ===== Charts: Customer Tiers ===== */}
        {customerTiersChart.counts.length > 0 && (
          <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm">
            <header className="px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
              <h2 className="text-base font-semibold text-gray-900">👑 Phân loại khách hàng</h2>
            </header>
            <div className="p-4">
              <div className="h-64">
                <Doughnut
                  data={{
                    labels: customerTiersChart.labels,
                    datasets: [{ data: customerTiersChart.counts, backgroundColor: customerTiersChart.colors, borderWidth: 1 }],
                  }}
                  options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ===== Daily Overview ===== */}
        <section className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-sm xl:col-span-2">
          <header className="px-4 py-3 border-b border-gray-100 bg-white/90 rounded-t-2xl">
            <h2 className="text-base font-semibold text-gray-900">📊 Tổng quan chi tiết</h2>
          </header>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <OverviewItem
                label="Lịch hẹn hôm nay:"
                value={stats.todayAppointments ?? (Array.isArray(data.todayAppointments) ? data.todayAppointments.length : 0)}
              />
              <OverviewItem label="Đã check-in:" value={stats.todayCheckIns ?? 0} />
              <OverviewItem label="Hoàn thành:" value={stats.todayCompleted ?? 0} />
              <OverviewItem label="Không đến:" value={stats.todayNoShows ?? 0} />
              <OverviewItem label="Yêu cầu chờ xử lý:" value={stats.pendingRequests ?? data.pendingRequests.length} />
              <OverviewItem label="Khách hàng mới hôm nay:" value={stats.newCustomersToday ?? 0} />
              <OverviewItem label="Tổng khách hàng:" value={stats.totalCustomers ?? 0} />
              <OverviewItem label="Khách hàng active:" value={stats.activeCustomers ?? 0} />
            </div>
          </div>
        </section>
      </div>

      {/* Error banner */}
      {data.error && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          <span>⚠️ {data.error}</span>
          <button
            onClick={fetchDashboardData}
            className="rounded-xl bg-white text-red-700 border border-red-200 px-3 py-1.5 text-sm hover:bg-red-100"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;

/* ---------- Presentational components ---------- */
const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur p-4 shadow-sm hover:shadow transition">
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

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
