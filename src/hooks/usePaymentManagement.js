import { useState, useEffect, useCallback } from 'react';
import { paymentsApi, invoicesApi } from '@/services';
import { useAuth } from '@/hooks/useAuth';

function pickPageContent(res) {
  // chịu nhiều format: {data:{data:{content}}}, {data:{content}}, {content}, array
  return (
    res?.data?.data?.content ??
    res?.data?.content ??
    res?.content ??
    (Array.isArray(res) ? res : [])
  );
}

function tupleToDate(t) {
  // BE gửi [y, m, d, h, min, s, nano?]
  if (Array.isArray(t)) {
    const [y, m, d, hh = 0, mm = 0, ss = 0, ns = 0] = t;
    const ms = Math.floor((ns || 0) / 1e6);
    return new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss, ms);
  }
  if (t == null) return null;
  // string/number/Date -> Date
  return new Date(t);
}

export const usePaymentManagement = () => {
  const { userRole } = useAuth();

  // Raw
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'invoices'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ---- Load theo tab, tránh race khi chuyển tab nhanh
  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'payments') {
          const res = await paymentsApi.getPayments({
            page: 0,
            size: 50,
            sortBy: 'paymentId',
            sortDir: 'desc',
          });

          if (!alive) return;

          const raw = pickPageContent(res);
          const mapped = raw.map((p) => ({
            id: p.paymentId ?? p.id,
            invoiceId: p.invoiceId ?? p.invoice?.invoiceId,
            customerName:
              p.paidByStaffName ||
              p.customerName ||
              (p.invoiceId ? `Hóa đơn #${p.invoiceId}` : '—'),
            amount: p.amount ?? 0,
            paymentMethod: p.method || p.paymentMethod || 'N/A',
            status: p.status || (p.paidAt ? 'COMPLETED' : 'PENDING'),
            createdAt: tupleToDate(p.createdAt ?? p.paidAt),
            notes: p.note || p.notes,
          }));
          setPayments(mapped);
        } else {
          const res = await invoicesApi.getInvoices({
            page: 0,
            size: 20,
            sortBy: 'invoiceId',
            sortDir: 'desc',
          });

          if (!alive) return;

          const raw = pickPageContent(res);
          const mapped = raw.map((inv) => ({
            id: inv.invoiceId ?? inv.id,
            invoiceNumber: inv.invoiceNumber,
            customerId: inv.customerId,
            customerName: inv.customerName ?? '—',
            // Không có phone/serviceName trong payload mẫu → để '—'
            customerPhone: inv.customerPhone ?? '—',
            serviceName: inv.serviceName ?? '—',
            totalAmount: inv.totalAmount ?? 0,
            status: inv.status ?? (inv.paid ? 'PAID' : 'PENDING'),
            displayStatus: inv.displayStatus, // “Đã thanh toán”, “Nháp”, ...
            paymentStatus: inv.paymentStatus, // “Đã thanh toán đầy đủ”, ...
            paid: !!inv.paid,
            overdue: !!inv.overdue,
            balanceDue: inv.balanceDue,
            totalPaid: inv.totalPaid,
            dueDate: tupleToDate(inv.dueDate),
            createdAt: tupleToDate(inv.createdAt),
            updatedAt: tupleToDate(inv.updatedAt),
          }));
          setInvoices(mapped);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        if (!alive) return;
        setError('Có lỗi khi tải dữ liệu. Vui lòng thử lại.');
      } finally {
        if (alive) setLoading(false);
      }
    }

    setSelectedPayment(null);
    load();

    return () => {
      alive = false;
    };
  }, [activeTab]);

  // ---- Update trạng thái (payments)
  const handleStatusUpdate = useCallback(
    async (id, newStatus) => {
      try {
        const statusData = {
          status: newStatus,
          reason: `Updated by ${userRole} at ${new Date().toISOString()}`,
        };

        if (activeTab === 'payments') {
          // optimistic update
          setPayments((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
          );
          await paymentsApi.updatePaymentStatus(id, statusData);
        } else {
          // Nếu có API cập nhật invoice, thêm ở đây
          // await invoicesApi.updateInvoiceStatus(id, statusData);
        }
      } catch (err) {
        console.error('Error updating status:', err);
        // rollback đơn giản: reload tab
        setActiveTab((t) => t);
        throw new Error('Có lỗi khi cập nhật trạng thái');
      }
    },
    [activeTab, userRole]
  );

  // ---- Retry = reload tab hiện tại
  const handleRetry = useCallback(() => {
    setActiveTab((t) => t);
  }, []);

  // ---- Badge trạng thái, phân tab
  const PAYMENT_STATUS = {
    PENDING: { label: 'Chờ xử lý', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    COMPLETED: { label: 'Hoàn thành', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    FAILED: { label: 'Thất bại', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    REFUNDED: { label: 'Hoàn tiền', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    CANCELLED: { label: 'Đã hủy', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  };

  const INVOICE_STATUS = {
    DRAFT: { label: 'Nháp', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
    PENDING: { label: 'Chờ thanh toán', bgColor: 'bg-amber-100', textColor: 'text-amber-800' },
    PAID: { label: 'Đã thanh toán', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    OVERDUE: { label: 'Quá hạn', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    CANCELLED: { label: 'Đã hủy', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  };

  const getStatusBadge = useCallback(
    (status) => {
      const map = activeTab === 'invoices' ? INVOICE_STATUS : PAYMENT_STATUS;
      return map[status] || { label: status || '—', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
    },
    [activeTab]
  );

  // ---- Filters
  const filteredPayments = payments.filter((p) => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      !q || p.customerName?.toLowerCase().includes(q) || String(p.id ?? '').includes(q);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const q = (searchTerm || '').toLowerCase();
    const matchesSearch =
      !q || inv.customerName?.toLowerCase().includes(q) || String(inv.id ?? '').includes(q);
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ---- Permissions
  const canCreate =
    userRole === 'ADMIN' || userRole === 'RECEPTIONIST' || userRole === 'MANAGER';

  return {
    // State
    payments,
    invoices,
    loading,
    error,
    activeTab,
    searchTerm,
    statusFilter,
    selectedPayment,

    // Computed
    filteredPayments,
    filteredInvoices,

    // Actions
    setActiveTab,
    setSearchTerm,
    setStatusFilter,
    setSelectedPayment,
    handleStatusUpdate,
    getStatusBadge,
    handleRetry,

    // Permissions
    userRole,
    canCreate,
  };
};
