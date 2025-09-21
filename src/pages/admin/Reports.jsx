import React from 'react';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { formatCurrencyVN } from '@/utils/formatters';
import { useReports } from '@/hooks/useReports';


const Reports = () => {
  const {
    reportData,
    dateRange,
    activeTab,
    setDateRange,
    setActiveTab,
    loadReportData,
    exportToCSV,
    handleRetry
  } = useReports();

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalCustomers}</p>
              <p className="text-sm text-gray-600">Tổng khách hàng</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+{reportData.overview.newCustomers} mới</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalAppointments}</p>
              <p className="text-sm text-gray-600">Tổng lịch hẹn</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">{reportData.overview.completedAppointments} hoàn thành</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrencyVN(reportData.overview.totalRevenue)}</p>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-purple-600">
              {Math.round((reportData.overview.completedAppointments / reportData.overview.totalAppointments) * 100) || 0}% hoàn thành
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.overview.totalAppointments > 0
                  ? Math.round((reportData.overview.completedAppointments / reportData.overview.totalAppointments) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-600">lịch hẹn</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">💰</span>
            Doanh thu theo dịch vụ
          </h3>
          <div className="space-y-4">
            {reportData.revenue.slice(0, 5).map((item, index) => {
              const maxAmount = Math.max(...reportData.revenue.map(r => r.amount));
              const percentage = (item.amount / maxAmount) * 100;
              return (
                <div key={item.service} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.service}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrencyVN(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">👨‍🔧</span>
            Lịch hẹn theo kỹ thuật viên
          </h3>
          <div className="space-y-4">
            {reportData.appointmentsByTechnician?.slice(0, 5).map((item, index) => {
              const maxCount = Math.max(...reportData.appointmentsByTechnician.map(t => t.count));
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={item.technician} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.technician}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count} lịch</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">📅</span>
          Báo cáo lịch hẹn
        </h3>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          onClick={() => exportToCSV(reportData.appointments, 'appointments-report.csv')}
        >
          <span className="mr-2">📊</span>
          Xuất CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kỹ thuật viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.appointments.map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.serviceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.technicianName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTimeVN(appointment.startAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reportData.appointments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu lịch hẹn</h3>
          <p className="text-gray-500">Thử thay đổi khoảng thời gian để xem dữ liệu khác</p>
        </div>
      )}
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">💰</span>
          Báo cáo doanh thu
        </h3>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          onClick={() => exportToCSV(reportData.revenue, 'revenue-report.csv')}
        >
          <span className="mr-2">📊</span>
          Xuất CSV
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.revenue.map((item) => {
                const totalRevenue = reportData.revenue.reduce((sum, r) => sum + r.amount, 0);
                const percentage = totalRevenue > 0 ? ((item.amount / totalRevenue) * 100).toFixed(1) : 0;

                return (
                  <tr key={item.service} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrencyVN(item.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">{percentage}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reportData.revenue.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu doanh thu</h3>
          <p className="text-gray-500">Thử thay đổi khoảng thời gian để xem dữ liệu khác</p>
        </div>
      )}
    </div>
  );

  const renderCustomersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="mr-2">👥</span>
          Danh sách khách hàng
        </h3>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
          onClick={() => exportToCSV(reportData.customers, 'customers-report.csv')}
        >
          <span className="mr-2">📊</span>
          Xuất CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportData.customers.map(customer => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-semibold text-blue-600">
                  {customer.fullName?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{customer.fullName}</h4>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">📞 Điện thoại:</span>
                <span className="text-gray-900">{customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">📧 Email:</span>
                <span className="text-gray-900">{customer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">🏆 Hạng:</span>
                <span className="text-gray-900">{customer.tier?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">⭐ Điểm:</span>
                <span className="text-gray-900">{customer.totalPoints || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reportData.customers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu khách hàng</h3>
          <p className="text-gray-500">Không tìm thấy khách hàng nào trong hệ thống</p>
        </div>
      )}
    </div>
  );

  if (reportData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">📊</span>
            Báo cáo & Phân tích
          </h1>
          <p className="mt-2 text-gray-600">Phân tích dữ liệu và hiệu suất kinh doanh</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                onClick={loadReportData}
              >
                <span className="mr-2">🔄</span>
                Cập nhật
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                📈 Tổng quan
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appointments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('appointments')}
              >
                📅 Lịch hẹn
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'revenue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('revenue')}
              >
                💰 Doanh thu
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('customers')}
              >
                👥 Khách hàng
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'appointments' && renderAppointmentsTab()}
          {activeTab === 'revenue' && renderRevenueTab()}
          {activeTab === 'customers' && renderCustomersTab()}
        </div>

        {/* Error Banner */}
        {reportData.error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="text-red-800 font-medium">{reportData.error}</span>
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
      </div>
    </div>
  );
};

export default Reports;
