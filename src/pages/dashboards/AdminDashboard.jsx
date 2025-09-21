// filepath: admin-spa-management/src/pages/dashboards/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { dashboardApi } from '@/services';
import { formatDateTimeVN } from '@/utils/dateUtils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

/**
 * Admin Dashboard - Modern Tailwind UI
 * Shows high-level analytics, system health, and management shortcuts
 */
const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalCustomers: 0,
      totalServices: 0,
      todayAppointments: 0,
      activeServices: 0,
      loading: true
    },
    charts: {
      appointmentStatus: [],
      appointmentTrend: [],
      servicePopularity: [],
      customerTiers: [],
      revenueTrend: []
    },
    performance: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all dashboard data at once using new dashboard API
      const dashboardData = await dashboardApi.getDashboardData();

      console.log('📊 Admin Dashboard Data:', dashboardData);

      // Set data from dashboard data
      setData({
        stats: {
          totalCustomers: dashboardData.stats?.totalCustomers || 0,
          totalServices: dashboardData.stats?.totalServices || 0,
          todayAppointments: dashboardData.stats?.todayAppointments || 0,
          activeServices: dashboardData.stats?.activeServices || 0,
          loading: false
        },
        charts: dashboardData.charts || {},
        performance: dashboardData.performance || {}
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(prev => ({
        ...prev,
        stats: { ...prev.stats, loading: false }
      }));
    }
  };

  if (data.stats.loading) {
    return (
      <div className="p-6">
        <div className="grid place-items-center py-24">
          <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
          <p className="mt-4 text-black-700">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black-900">👑 Admin Dashboard</h1>
        <p className="text-black-600">Tổng quan hệ thống và quản lý toàn diện</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Tổng khách hàng" value={data.stats.totalCustomers} icon="👥" />
        <StatCard label="Tổng dịch vụ" value={data.stats.totalServices} icon="💼" />
        <StatCard label="Lịch hẹn hôm nay" value={data.stats.todayAppointments} icon="📅" />
        <StatCard label="Dịch vụ hoạt động" value={data.stats.activeServices} icon="✅" />
        <StatCard label="Doanh thu tháng" value={data.performance?.totalRevenue || 0} icon="💰" />
        <StatCard label="Tỷ lệ hoàn thành" value={`${data.performance?.completionRate || 0}%`} icon="📊" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Appointment Status Chart */}
        {data.charts.appointmentStatus && data.charts.appointmentStatus.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-black-900 mb-4">📊 Trạng thái lịch hẹn</h3>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: data.charts.appointmentStatus.map(item => item.label),
                  datasets: [{
                    data: data.charts.appointmentStatus.map(item => item.count),
                    backgroundColor: ['#dbeafe', '#dcfce7', '#fef3c7', '#d1fae5', '#fee2e2'],
                    borderColor: ['#1e40af', '#166534', '#92400e', '#065f46', '#991b1b'],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Service Popularity Chart */}
        {data.charts.servicePopularity && data.charts.servicePopularity.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-black-900 mb-4">💼 Dịch vụ phổ biến</h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: data.charts.servicePopularity.slice(0, 5).map(item => item.label),
                  datasets: [{
                    label: 'Số lịch hẹn',
                    data: data.charts.servicePopularity.slice(0, 5).map(item => item.count),
                    backgroundColor: '#ec4899',
                    borderColor: '#be185d',
                    borderWidth: 1
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Revenue Trend Chart */}
        {data.charts.revenueTrend && data.charts.revenueTrend.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
            <h3 className="text-lg font-semibold text-black-900 mb-4">💰 Xu hướng doanh thu</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: data.charts.revenueTrend.map(item => item.label),
                  datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: data.charts.revenueTrend.map(item => item.value || 0),
                    borderColor: '#10b981',
                    backgroundColor: '#d1fae5',
                    tension: 0.4,
                    fill: true
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return (value / 1000).toFixed(0) + 'k';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-6">
        <h3 className="text-lg font-semibold text-black-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon="👤"
            label="Quản lý nhân viên"
            onClick={() => window.location.href = '/admin/users'}
          />
          <QuickActionButton
            icon="💼"
            label="Quản lý dịch vụ"
            onClick={() => window.location.href = '/admin/services'}
          />
          <QuickActionButton
            icon="👥"
            label="Quản lý khách hàng"
            onClick={() => window.location.href = '/admin/customers'}
          />
          <QuickActionButton
            icon="📅"
            label="Quản lý lịch hẹn"
            onClick={() => window.location.href = '/admin/appointments'}
          />
          <QuickActionButton
            icon="📊"
            label="Báo cáo"
            onClick={() => window.location.href = '/admin/reports'}
          />
          <QuickActionButton
            icon="⚙️"
            label="Cài đặt"
            onClick={() => window.location.href = '/admin/settings'}
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl shadow-lg border border-primary-100 p-4 hover:shadow-xl transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-black-900">{value}</div>
        <div className="text-sm text-black-600">{label}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors duration-200 border border-primary-200 hover:border-primary-300"
  >
    <div className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-primary-700">{label}</div>
    </div>
  </button>
);


export default AdminDashboard;
