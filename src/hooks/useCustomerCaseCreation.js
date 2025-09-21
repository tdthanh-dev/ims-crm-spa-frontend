import { useState, useEffect } from 'react';
import { customerCaseService, servicesService } from '@/services';
import { CASE_STATUS_MAP } from '@/config/constants';

/**
 * Custom hook for Customer Case Creation Modal logic
 * Handles form state, validation, API calls, and business logic
 */
export const useCustomerCaseCreation = ({ customerId, isOpen, onClose, onCaseCreated }) => {
  // Form state
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    serviceId: '',
    status: 'INTAKE', // Default status
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: '',
    notes: ''
  });

  // UI state
  const [validation, setValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  // Helper functions
  const getStatusDescription = (status) => {
    const descriptions = {
      'INTAKE': 'Hồ sơ mới được tạo',
      'IN_PROGRESS': 'Quá trình điều trị đang diễn ra',
      'COMPLETED': 'Đã hoàn thành điều trị',
      'ON_HOLD': 'Tạm dừng điều trị',
      'CANCELLED': 'Hủy bỏ điều trị'
    };
    return descriptions[status] || '';
  };

  const statusOptions = Object.keys(CASE_STATUS_MAP).map(key => ({
    value: key,
    label: CASE_STATUS_MAP[key].label,
    description: getStatusDescription(key)
  }));

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        customerId: customerId || ''
      }));
      fetchServices();
    }
  }, [isOpen, customerId]);

  // API functions
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await servicesService.getActive();
      setServices(response?.content || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ');
    } finally {
      setServicesLoading(false);
    }
  };

  // Validation functions
  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'customerId':
        if (!value) {
          errors.customerId = 'Customer ID là bắt buộc';
        }
        break;

      case 'serviceId':
        if (!value) {
          errors.serviceId = 'Dịch vụ là bắt buộc';
        }
        break;

      case 'status':
        if (!value) {
          errors.status = 'Trạng thái là bắt buộc';
        }
        break;

      case 'startDate':
        if (!value) {
          errors.startDate = 'Ngày bắt đầu là bắt buộc';
        }
        break;

      case 'endDate':
        if (value && formData.startDate && new Date(value) < new Date(formData.startDate)) {
          errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        }
        break;

      case 'notes':
        if (value && value.length > 1000) {
          errors.notes = 'Ghi chú không được vượt quá 1000 ký tự';
        }
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

    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Event handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate field
    const fieldErrors = validateField(field, value);
    setValidation(prev => ({
      ...prev,
      ...fieldErrors,
      [field]: fieldErrors[field] ? fieldErrors[field] : undefined
    }));

    // Special validation for end date when start date changes
    if (field === 'startDate' && formData.endDate) {
      const endDateErrors = validateField('endDate', formData.endDate);
      setValidation(prev => ({
        ...prev,
        ...endDateErrors
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Vui lòng sửa các lỗi trong form');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Creating customer case with data:', formData);

      // Format data for API
      const apiData = {
        customerId: parseInt(formData.customerId),
        serviceId: parseInt(formData.serviceId),
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        notes: formData.notes?.trim() || null
      };

      const response = await customerCaseService.create(apiData);

      console.log('Customer case created successfully:', response);

      if (onCaseCreated) {
        onCaseCreated(response);
      }

      // Reset form
      resetForm();
      onClose();

    } catch (err) {
      console.error('Error creating customer case:', err);

      let errorMessage = 'Không thể tạo hồ sơ điều trị';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Hồ sơ điều trị này đã tồn tại';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // Utility functions
  const resetForm = () => {
    setFormData({
      customerId: customerId || '',
      serviceId: '',
      status: 'INTAKE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setValidation({});
    setError(null);
  };

  const getSelectedService = () => {
    return services.find(service => service.serviceId.toString() === formData.serviceId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Return all state and functions needed by the UI component
  return {
    // State
    formData,
    validation,
    loading,
    error,
    services,
    servicesLoading,
    statusOptions,

    // Computed values
    selectedService: getSelectedService(),

    // Event handlers
    handleInputChange,
    handleSubmit,
    handleClose,

    // Utility functions
    formatCurrency,
    getStatusDescription
  };
};