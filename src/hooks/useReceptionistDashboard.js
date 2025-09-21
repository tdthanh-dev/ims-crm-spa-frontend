import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardApi, customersApi, appointmentsApi } from '@/services';

// util tạo nhãn ngày dd/MM lùi N ngày
const lastNDaysLabels = (n) => {
  const f = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' });
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return f.format(d); // dd/MM
  });
};

export const useReceptionistDashboard = () => {
  const [data, setData] = useState({
    todayAppointments: [],
    pendingRequests: [],
    recentCustomers: [],
    // BE new:
    stats: {},                           // Map<String, Long>
    appointmentStatusMap: {},            // Map<String, Long>
    appointmentTrendList: [],            // List<Long> (7)
    customerTiersMap: {},                // Map<String, Long>
    revenueTrendList: [],                // List<Long> (30)

    loading: true,
    error: null
  });

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const [
        appointmentsRes,
        allDash
      ] = await Promise.allSettled([
        appointmentsApi.getTodayAppointments(),     // có thể content hoặc array
        dashboardApi.getDashboardData()             // chứa stats + charts(Map/List) + performance(Map)
      ]);

      const appts = appointmentsRes.status === 'fulfilled'
        ? (appointmentsRes.value?.content || appointmentsRes.value || [])
        : [];

      const dash = allDash.status === 'fulfilled' ? allDash.value : {
        stats: {},
        charts: { appointmentStatus: {}, appointmentTrend: [], customerTiers: {}, revenueTrend: [] },
        performance: {}
      };

      setData(prev => ({
        ...prev,
        todayAppointments: Array.isArray(appts) ? appts : [],
        // 2 mảng này chưa có API -> giữ chỗ
        pendingRequests: Array.isArray(prev.pendingRequests) ? prev.pendingRequests : [],
        recentCustomers: Array.isArray(prev.recentCustomers) ? prev.recentCustomers : [],

        stats: dash.stats || {},
        appointmentStatusMap: dash.charts.appointmentStatus || {},
        appointmentTrendList: dash.charts.appointmentTrend || [],
        customerTiersMap: dash.charts.customerTiers || {},
        revenueTrendList: dash.charts.revenueTrend || [],

        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('❌ Error fetching receptionist dashboard data:', error);
      setData(prev => ({
        ...prev,
        todayAppointments: [],
        pendingRequests: [],
        recentCustomers: [],
        stats: {},
        appointmentStatusMap: {},
        appointmentTrendList: [],
        customerTiersMap: {},
        revenueTrendList: [],
        loading: false,
        error: 'Không thể tải dữ liệu dashboard. Vui lòng thử lại.'
      }));
    }
  }, []);

  // Customer search
  const handleCustomerSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const res = await customersApi.searchCustomers(searchTerm);
      setSearchResults(res.content || []);
    } catch (e) {
      console.error('Error searching customers:', e);
    }
  }, [searchTerm]);

  // Status badge colors
  const getAppointmentStatusStyle = useCallback((status) => {
    const styles = {
      SCHEDULED: { background: '#dbeafe', color: '#1e40af' },
      CONFIRMED: { background: '#dcfce7', color: '#166534' },
      IN_PROGRESS: { background: '#e0e7ff', color: '#5b21b6' },
      DONE: { background: '#d1fae5', color: '#065f46' },
      CANCELLED: { background: '#fee2e2', color: '#991b1b' }
    };
    return styles[status] || { background: '#f3f4f6', color: '#374151' };
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ====== Chart-ready data (từ Map/List) ======
  const appointmentStatusChart = useMemo(() => {
    const m = data.appointmentStatusMap || {};
    const labelOrder = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'DONE', 'CANCELLED'];
    const labels = ['Đã đặt', 'Đã xác nhận', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'];
    const colors = ['#dbeafe', '#dcfce7', '#e0e7ff', '#d1fae5', '#fee2e2'];
    const counts = labelOrder.map(k => Number(m[k] || 0));
    return { labels, counts, colors };
  }, [data.appointmentStatusMap]);

  const appointmentTrendChart = useMemo(() => {
    const counts = Array.isArray(data.appointmentTrendList) ? data.appointmentTrendList.map(n => Number(n || 0)) : [];
    const labels = lastNDaysLabels(7);
    return { labels, counts };
  }, [data.appointmentTrendList]);

  const customerTiersChart = useMemo(() => {
    const m = data.customerTiersMap || {};
    const labelOrder = ['REGULAR', 'SILVER', 'GOLD', 'VIP', 'NONE'];
    const labels = ['Regular', 'Silver', 'Gold', 'VIP', 'Chưa phân hạng'];
    const colors = ['#6b7280', '#9ca3af', '#fbbf24', '#f59e0b', '#d1d5db'];
    const dataArr = labelOrder.map(k => Number(m[k] || 0));
    // cắt phần dư 0 ở cuối để biểu đồ gọn hơn (tuỳ thích)
    const filtered = labels.map((l, i) => ({ l, c: dataArr[i], col: colors[i] })).filter(x => x.c > 0 || x.l !== 'Chưa phân hạng');
    return {
      labels: filtered.map(x => x.l),
      counts: filtered.map(x => x.c),
      colors: filtered.map(x => x.col)
    };
  }, [data.customerTiersMap]);

  return {
    // raw
    data,
    searchTerm,
    searchResults,

    // chart-ready
    appointmentStatusChart,
    appointmentTrendChart,
    customerTiersChart,

    // actions
    setSearchTerm,
    fetchDashboardData,
    handleCustomerSearch,
    getAppointmentStatusStyle
  };
};
