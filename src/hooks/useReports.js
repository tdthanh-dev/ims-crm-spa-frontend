import { useState, useEffect } from 'react';
import { customersApi, appointmentsApi, invoicesApi, servicesApi } from '@/services';

export const useReports = () => {
  const [reportData, setReportData] = useState({
    overview: {},
    appointments: [],
    revenue: [],
    customers: [],
    services: [],
    appointmentsByTechnician: [],
    loading: true,
    error: null
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    try {
      setReportData(prev => ({ ...prev, loading: true, error: null }));

      // Load all report data in parallel
      const [customersRes, appointmentsRes, invoicesRes, servicesRes] = await Promise.all([
        customersApi.getCustomers({ page: 0, size: 1000, sortBy: 'customerId', sortDir: 'desc' }),
        appointmentsApi.getAppointments({ page: 0, size: 1000, sortBy: 'apptId', sortDir: 'desc' }),
        invoicesApi.getInvoices({ page: 0, size: 1000, sortBy: 'invoiceId', sortDir: 'desc' }),
        servicesApi.getServices({ page: 0, size: 1000, sortBy: 'serviceId', sortDir: 'desc' })
      ]);

      const customers = customersRes.content || [];
      const appointments = appointmentsRes.content || [];
      const invoices = invoicesRes.content || [];
      const services = servicesRes.content || [];

      // Filter data by date range
      const filteredAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.createdAt);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return aptDate >= start && aptDate <= end;
      });

      const filteredInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return invDate >= start && invDate <= end;
      });

      // Calculate overview metrics
      const overview = {
        totalCustomers: customers.length,
        totalAppointments: filteredAppointments.length,
        totalRevenue: filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
        completedAppointments: filteredAppointments.filter(apt => apt.status === 'COMPLETED').length,
        newCustomers: customers.filter(cust => {
          const custDate = new Date(cust.createdAt);
          const start = new Date(dateRange.startDate);
          const end = new Date(dateRange.endDate);
          return custDate >= start && custDate <= end;
        }).length
      };

      // Calculate revenue by service
      const revenueByService = {};
      filteredInvoices.forEach(invoice => {
        const serviceName = invoice.serviceName || 'Unknown Service';
        revenueByService[serviceName] = (revenueByService[serviceName] || 0) + (invoice.totalAmount || 0);
      });

      const revenue = Object.entries(revenueByService)
        .map(([service, amount]) => ({ service, amount }))
        .sort((a, b) => b.amount - a.amount);

      // Calculate appointments by technician
      const appointmentsByTechnician = {};
      filteredAppointments.forEach(apt => {
        const technicianName = apt.technicianName || 'Unknown';
        appointmentsByTechnician[technicianName] = (appointmentsByTechnician[technicianName] || 0) + 1;
      });

      setReportData({
        overview,
        appointments: filteredAppointments,
        revenue,
        customers: customers.slice(0, 50), // Recent customers
        services,
        appointmentsByTechnician: Object.entries(appointmentsByTechnician)
          .map(([technician, count]) => ({ technician, count }))
          .sort((a, b) => b.count - a.count),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error loading report data:', error);
      setReportData(prev => ({
        ...prev,
        loading: false,
        error: 'Có lỗi khi tải dữ liệu báo cáo. Vui lòng thử lại.'
      }));
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleRetry = () => {
    loadReportData();
  };

  return {
    // State
    reportData,
    dateRange,
    activeTab,

    // Actions
    setDateRange,
    setActiveTab,
    loadReportData,
    exportToCSV,
    handleRetry
  };
};