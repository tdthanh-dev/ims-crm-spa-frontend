import { useState, useEffect } from 'react';
import { authAPI } from '@/services';

export const useAuthForm = (onLogin) => {
  // States
  const [formType, setFormType] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: ['', '', '', '', '', '']
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(240);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentEmailOrPhone, setCurrentEmailOrPhone] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  // Input handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleOtpChange = (index, value) => {
    // Handle full 6-digit paste
    if (value.length === 6 && /^\d{6}$/.test(value)) {
      setFormData((prev) => ({ ...prev, otp: value.split('') }));
      setError('');
      return;
    }

    // Handle single digit input
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));
      setError('');

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    } else {
      // Invalid input, clear the field
      const newOtp = [...formData.otp];
      newOtp[index] = '';
      setFormData((prev) => ({ ...prev, otp: newOtp }));
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (/^\d{6}$/.test(pastedData)) {
      setFormData((prev) => ({ ...prev, otp: pastedData.split('') }));
      setError('');
    } else {
      setError('Mã OTP phải có đúng 6 số');
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formType === 'email') {
        await handleEmailLogin();
      } else if (formType === 'phone') {
        await handlePhoneLogin();
      } else if (formType === 'otp') {
        await handleOtpVerification();
      }
    } catch (err) {
      handleSubmitError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    const res = await authAPI.requestOtp(formData.email, formData.password);
    
    if (res.data?.success) {
      setCurrentEmailOrPhone(formData.email);
      setDisplayEmail(res.data.data.email || formData.email);
      setFormType('otp');
      setOtpTimer(240);
      setIsTimerActive(true);
      setFormData((p) => ({ ...p, otp: ['', '', '', '', '', ''] }));
    } else {
      setError(res.data.error || res.data.message || 'Không thể gửi OTP');
    }
  };

  const handlePhoneLogin = async () => {
    if (!formData.phone || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    const res = await authAPI.requestOtp(formData.phone, formData.password);
    
    if (res.data?.success) {
      setCurrentEmailOrPhone(formData.phone);
      setDisplayEmail(res.data.data.email || formData.phone);
      setFormType('otp');
      setOtpTimer(240);
      setIsTimerActive(true);
      setFormData((p) => ({ ...p, otp: ['', '', '', '', '', ''] }));
    } else {
      setError(res.data.error || res.data.message || 'Không thể gửi OTP');
    }
  };

  const handleOtpVerification = async () => {
    const otpCode = formData.otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã OTP');
      setLoading(false);
      return;
    }

    try {
      const result = await authAPI.verifyOtpAndLogin(currentEmailOrPhone, otpCode);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Xác thực OTP thất bại');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Mã OTP không hợp lệ hoặc đã hết hạn');
      } else if (err.response?.status === 401) {
        setError('Mã OTP không chính xác');
      } else {
        setError('Xác thực OTP thất bại. Vui lòng thử lại');
      }
    }
  };

  const handleSubmitError = (err) => {
    if (err.response?.status === 401) {
      setError('Email/SĐT hoặc mật khẩu không chính xác');
    } else if (err.response?.status === 400) {
      setError(err.response.data?.message || err.response.data?.error || 'Thông tin không hợp lệ');
    } else if (err.response?.status === 500) {
      setError('Lỗi server. Vui lòng thử lại sau');
    } else if (err.code === 'NETWORK_ERROR' || !err.response) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng');
    } else {
      setError('Đã xảy ra lỗi. Vui lòng thử lại');
    }
  };

  // Switch to SMS OTP
  const switchToOtp = async () => {
    if (formType === 'phone' && formData.phone && formData.password) {
      setLoading(true);
      
      try {
        const res = await authAPI.loginOtp(formData.phone, formData.password);
        
        if (res.data?.success) {
          setCurrentEmailOrPhone(formData.phone);
          setDisplayEmail(res.data.data.email || formData.phone);
          setFormType('otp');
          setOtpTimer((res.data.data.remainingMinutes || 4) * 60);
          setIsTimerActive(true);
          setFormData((p) => ({ ...p, otp: ['', '', '', '', '', ''] }));
        } else {
          setError(res.data.error || res.data.message || 'Không thể gửi OTP');
        }
      } catch {
        setError('Không thể gửi mã OTP. Vui lòng thử lại');
      } finally {
        setLoading(false);
      }
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!currentEmailOrPhone) {
      setError('Không thể gửi lại OTP. Vui lòng đăng nhập lại');
      return;
    }

    setLoading(true);
    
    try {
      if (!formData.password) {
        setError('Vui lòng nhập lại mật khẩu để gửi OTP');
        setFormType(currentEmailOrPhone.includes('@') ? 'email' : 'phone');
        setLoading(false);
        return;
      }

      const res = await authAPI.loginOtp(currentEmailOrPhone, formData.password);
      
      if (res.data?.success) {
        setOtpTimer((res.data.data.remainingMinutes || 4) * 60);
        setIsTimerActive(true);
        setFormData((p) => ({ ...p, otp: ['', '', '', '', '', ''] }));
      } else {
        setError(res.data.error || res.data.message || 'Không thể gửi lại OTP');
      }
    } catch {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Form type switchers
  const switchToEmail = () => {
    setFormType('email');
    setError('');
  };

  const switchToPhone = () => {
    setFormType('phone');
    setError('');
  };

  const goBackFromOtp = () => {
    setFormType('phone');
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearError = () => {
    setError('');
  };

  // Return state and handlers
  return {
    // States
    formType,
    formData,
    showPassword,
    error,
    loading,
    otpTimer,
    isTimerActive,
    displayEmail,

    // Handlers
    handleInputChange,
    handleOtpChange,
    handleOtpPaste,
    handleSubmit,
    switchToOtp,
    resendOtp,
    switchToEmail,
    switchToPhone,
    goBackFromOtp,
    togglePasswordVisibility,
    clearError,

    // Computed values
    formattedTimer: `${Math.floor(otpTimer / 60)}:${String(otpTimer % 60).padStart(2, '0')}`,
    isOtpComplete: formData.otp.every(digit => digit !== ''),
    canSubmitEmail: formData.email && formData.password,
    canSubmitPhone: formData.phone && formData.password,
    canSubmitOtp: formData.otp.join('').length === 6
  };
};