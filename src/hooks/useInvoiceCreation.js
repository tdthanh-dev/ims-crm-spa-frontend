import { useState, useEffect } from 'react';
import { invoiceService, customerCaseService } from '@/services';

// Tránh lệch múi giờ khi dùng <input type="date">
const toMiddayISO = (yyyyMmDd) => {
  if (!yyyyMmDd) return null;
  const d = new Date(yyyyMmDd);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
};

// Các trạng thái hợp lệ theo BE
export const BE_ALLOWED_STATUSES = ['DRAFT', 'UNPAID', 'PAID', 'VOID'];

export const useInvoiceCreation = ({
  customerId,
  isOpen,
  onClose,
  onInvoiceCreated,
  currentUser,
  selectedCase
}) => {
  // Form state
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    caseId: '',
    userId: '',
    totalAmount: 0,
    status: 'DRAFT',
    notes: '',
    dueDate: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerCases, setCustomerCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);

  // Reset form khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    fetchCustomerCases();

    const computedUserId =
      currentUser?.staffId || currentUser?.userId || currentUser?.id || '';

    const initialCaseId = selectedCase ? selectedCase.caseId : '';
    const initialTotal =
      selectedCase
        ? (selectedCase.remainingAmount ||
           selectedCase.totalAmount ||
           selectedCase.totalCost || 0)
        : 0;

    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 30);
    const defaultDueYmd = defaultDue.toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      customerId: customerId || '',
      caseId: initialCaseId,
      userId: computedUserId,
      totalAmount: initialTotal,
      status: 'DRAFT',
      notes: '',
      dueDate: defaultDueYmd
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, customerId, selectedCase, currentUser]);

  // API: lấy danh sách hồ sơ
  const fetchCustomerCases = async () => {
    if (!customerId) return;
    try {
      setCasesLoading(true);
      const response = await customerCaseService.getByCustomerId(customerId);
      setCustomerCases(response?.content || []);
    } catch (err) {
      console.error('❌ Error fetching customer cases:', err);
      setError('Không thể tải danh sách hồ sơ điều trị');
    } finally {
      setCasesLoading(false);
    }
  };

  // Validate field
  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case 'customerId':
        if (!value) errors.customerId = 'Customer ID là bắt buộc';
        break;
      case 'caseId':
        if (!value) {
          errors.caseId = 'Case ID là bắt buộc';
        } else {
          const exists = customerCases.some(c => c.caseId?.toString() === value?.toString());
          if (!exists) errors.caseId = 'Case không tồn tại';
        }
        break;
      case 'status':
        if (!BE_ALLOWED_STATUSES.includes(value)) {
          errors.status = 'Trạng thái không hợp lệ';
        }
        break;
      case 'totalAmount':
        if (!value || Number(value) <= 0) {
          errors.totalAmount = 'Tổng tiền phải lớn hơn 0';
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(errors, fieldErrors);
    });
    if (Object.keys(errors).length) {
      setError('Vui lòng sửa các lỗi trong form');
      return false;
    }
    setError(null);
    return true;
  };

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    console.log("📝 FormData trước khi gửi:", formData);

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const rawUserId = formData.userId;
      const apiData = {
        customerId: parseInt(formData.customerId),
        caseId: parseInt(formData.caseId),
        ...(rawUserId ? { userId: parseInt(rawUserId) } : {}),
        totalAmount: parseFloat(formData.totalAmount),
        status: formData.status || 'DRAFT',
        notes: formData.notes?.trim() || null,
        dueDate: formData.dueDate ? toMiddayISO(formData.dueDate) : null
      };

      console.log("📤 Payload gửi BE:", JSON.stringify(apiData, null, 2));

      const response = await invoiceService.create(apiData);

      console.log("📥 Response từ BE:", response);

      onInvoiceCreated?.(response);
      resetForm();
      onClose?.();
    } catch (err) {
      console.error('❌ Error creating invoice:', err);
      let errorMessage = 'Không thể tạo hóa đơn';
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (err.response?.data?.error) errorMessage = err.response.data.error;
      else if (err.response?.status === 400) errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const resetForm = () => {
    const computedUserId =
      currentUser?.staffId || currentUser?.userId || currentUser?.id || '';
    setFormData({
      customerId: customerId || '',
      caseId: selectedCase ? selectedCase.caseId : '',
      userId: computedUserId,
      totalAmount: selectedCase
        ? (selectedCase.remainingAmount ||
           selectedCase.totalAmount ||
           selectedCase.totalCost || 0)
        : 0,
      status: 'DRAFT',
      notes: '',
      dueDate: ''
    });
    setError(null);
  };

  // Utils
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(Number(amount || 0));

  return {
    formData,
    loading,
    error,
    customerCases,
    casesLoading,
    handleInputChange,
    handleSubmit,
    handleClose,
    formatCurrency,
    validateForm
  };
};
