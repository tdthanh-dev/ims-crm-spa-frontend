import { useState, useCallback } from 'react';

// Validation rules
export const validationRules = {
  required: (message = 'Trường này là bắt buộc') => (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  },

  email: (message = 'Email không hợp lệ') => (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  phone: (message = 'Số điện thoại không hợp lệ') => (value) => {
    if (!value) return null;
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return message || `Tối thiểu ${min} ký tự`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return message || `Tối đa ${max} ký tự`;
    }
    return null;
  },

  number: (message = 'Phải là số') => (value) => {
    if (!value) return null;
    if (isNaN(value) || value === '') {
      return message;
    }
    return null;
  },

  positiveNumber: (message = 'Phải là số dương') => (value) => {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return message;
    }
    return null;
  },

  date: (message = 'Ngày không hợp lệ') => (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return message;
    }
    return null;
  },

  futureDate: (message = 'Ngày phải trong tương lai') => (value) => {
    if (!value) return null;
    const date = new Date(value);
    const now = new Date();
    if (date <= now) {
      return message;
    }
    return null;
  },

  custom: (validator, message) => (value) => {
    if (!value) return null;
    if (!validator(value)) {
      return message;
    }
    return null;
  }
};

// Custom hook for form validation
export const useFormValidation = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate a single field
  const validateField = useCallback((fieldName, value) => {
    const rules = validationSchema[fieldName];
    if (!rules || !Array.isArray(rules)) {
      return null;
    }

    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
    return null;
  }, [validationSchema]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationSchema]);

  // Handle field change
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Validate field on blur
    const error = validateField(fieldName, values[fieldName]);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, [values, validateField]);

  // Set multiple values at once
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Check if form is valid
  const isValid = Object.keys(validationSchema).every(fieldName => {
    const error = validateField(fieldName, values[fieldName]);
    return !error;
  });

  // Check if form has been touched
  const isTouched = Object.keys(touched).length > 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isTouched,
    handleChange,
    handleBlur,
    validateForm,
    setValues: setFormValues,
    reset
  };
};

export default useFormValidation;
