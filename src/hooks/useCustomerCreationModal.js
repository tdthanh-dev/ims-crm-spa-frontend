import { useState } from 'react';
import { customersService } from '@/services';

/**
 * Custom hook for customer creation modal logic
 * @param {Object} leadData - Pre-fill data from lead
 * @param {Function} onCustomerCreated - Callback when customer is created
 * @param {Function} onClose - Callback to close modal
 * @returns {Object} Hook state and handlers
 */
export const useCustomerCreationModal = (leadData, onCustomerCreated, onClose) => {
  const [formData, setFormData] = useState({
    fullName: leadData?.fullName || '',
    phone: leadData?.phone || '',
    email: leadData?.email || '',
    address: '',
    dob: '',
    gender: 'FEMALE',
    notes: leadData?.note || '',
    isVip: false
  });

  const [validation, setValidation] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateField = (name, value) => {
    const errors = {};

    switch (name) {
      case 'fullName':
        if (!value || value.trim().length < 2) {
          errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
        } else if (value.length > 200) {
          errors.fullName = 'Họ tên không được quá 200 ký tự';
        }
        break;

      case 'phone':
        if (!value) {
          errors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value)) {
          errors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Email không hợp lệ';
        }
        break;

      case 'dob':
        if (value && new Date(value) >= new Date()) {
          errors.dob = 'Ngày sinh phải là ngày trong quá khứ';
        }
        break;

      case 'address':
        if (value && value.length > 500) {
          errors.address = 'Địa chỉ không được quá 500 ký tự';
        }
        break;
    }

    return errors;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Vui lòng sửa các lỗi trong form');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Creating customer with data:', formData);

      // Format data for API (convert empty strings to null for optional fields)
      const apiData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || null,
        address: formData.address?.trim() || null,
        dob: formData.dob || null,
        gender: formData.gender,
        notes: formData.notes?.trim() || null,
        isVip: formData.isVip
      };

      const response = await customersService.create(apiData);

      console.log('Customer created successfully:', response);

      if (onCustomerCreated) {
        onCustomerCreated(response);
      }

      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        gender: 'FEMALE',
        notes: '',
        isVip: false
      });

      onClose();

    } catch (err) {
      console.error('Error creating customer:', err);

      let errorMessage = 'Không thể tạo khách hàng';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Số điện thoại đã tồn tại trong hệ thống';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        fullName: leadData?.fullName || '',
        phone: leadData?.phone || '',
        email: leadData?.email || '',
        address: '',
        dob: '',
        gender: 'FEMALE',
        notes: leadData?.note || '',
        isVip: false
      });
      setValidation({});
      setError(null);
      onClose();
    }
  };

  return {
    formData,
    validation,
    loading,
    error,
    handleInputChange,
    handleSubmit,
    handleClose
  };
};