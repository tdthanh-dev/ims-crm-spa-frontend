import { useState } from 'react';

export const useSettings = () => {
  const [settings, setSettings] = useState({
    businessInfo: {
      name: 'Spa Thẩm Mỹ ABC',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      phone: '0123 456 789',
      email: 'contact@spaspa.com',
      website: 'www.spaspa.com'
    },
    businessHours: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '08:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '17:00', closed: false }
    },
    systemSettings: {
      autoBackup: true,
      backupFrequency: 'daily',
      maxAppointmentPerDay: 50,
      advanceBookingDays: 30,
      smsNotifications: true,
      emailNotifications: true,
      autoReminders: true
    },
    pricingSettings: {
      currency: 'VND',
      taxRate: 8,
      discountThreshold: 1000000,
      loyaltyPointsRate: 1
    }
  });

  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage('✅ Cài đặt đã được lưu thành công!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('❌ Có lỗi khi lưu cài đặt. Vui lòng thử lại.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessInfo = (field, value) => {
    setSettings(prev => ({
      ...prev,
      businessInfo: {
        ...prev.businessInfo,
        [field]: value
      }
    }));
  };

  const updateBusinessHours = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const updateSystemSettings = (field, value) => {
    setSettings(prev => ({
      ...prev,
      systemSettings: {
        ...prev.systemSettings,
        [field]: value
      }
    }));
  };

  const updatePricingSettings = (field, value) => {
    setSettings(prev => ({
      ...prev,
      pricingSettings: {
        ...prev.pricingSettings,
        [field]: value
      }
    }));
  };

  const getDayName = (day) => {
    const dayNames = {
      monday: 'Thứ Hai',
      tuesday: 'Thứ Ba',
      wednesday: 'Thứ Tư',
      thursday: 'Thứ Năm',
      friday: 'Thứ Sáu',
      saturday: 'Thứ Bảy',
      sunday: 'Chủ Nhật'
    };
    return dayNames[day] || day;
  };

  return {
    // State
    settings,
    activeTab,
    loading,
    message,
    error,

    // Actions
    setActiveTab,
    handleSaveSettings,
    updateBusinessInfo,
    updateBusinessHours,
    updateSystemSettings,
    updatePricingSettings,
    getDayName
  };
};