import { STATUS_MAP, CUSTOMER_TYPE_MAP, CUSTOMER_TYPE_STATUS_MAP } from '@/config/constants';

/**
 * Get status badge component data
 * @param {string} status - Status value
 * @returns {Object} - Object with label and className
 */
export const getStatusInfo = (status) => {
  return STATUS_MAP[status] || { label: status, className: 'status-default' };
};

/**
 * Get customer type display text from source
 * @param {string} source - Source value
 * @returns {string} - Formatted customer type
 */
export const getCustomerType = (source) => {
  return CUSTOMER_TYPE_MAP[source] || source;
};

/**
 * Get customer type status display text
 * @param {string} customerType - Customer type value (NEW, EXISTING, VIP)
 * @returns {string} - Formatted customer type status
 */
export const getCustomerTypeStatus = (customerType) => {
  return CUSTOMER_TYPE_STATUS_MAP[customerType] || customerType;
};

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '-';
  // Add Vietnamese phone number formatting logic if needed
  return phoneNumber;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text || '-';
  return text.substring(0, maxLength) + '...';
};

/**
 * Format currency to Vietnamese locale
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrencyVN = (amount) => {
  if (!amount && amount !== 0) return '0 VNĐ';

  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (error) {
    // Fallback if Intl is not supported
    console.warn('Currency formatting error:', error)
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  }
};

/**
 * Format email or phone number to show partially hidden for security
 * @param {string} emailOrPhone - The email or phone number to format
 * @returns {string} Formatted string with hidden characters
 */
export const formatEmailOrPhoneForDisplay = (emailOrPhone) => {
  if (!emailOrPhone) return '';

  // Check if it's an email (contains @)
  if (emailOrPhone.includes('@')) {
    const [localPart] = emailOrPhone.split('@');

    // Show first 3 characters of local part, hide the rest
    if (localPart.length <= 3) {
      return `${localPart}@****`;
    } else {
      const visiblePart = localPart.substring(0, 3);
      return `${visiblePart}****@****`;
    }
  } else {
    // It's a phone number
    // Remove any spaces, dashes, or other formatting
    const cleanPhone = emailOrPhone.replace(/\D/g, '');

    // Show first 3 digits, hide the middle part, show last 2 digits
    if (cleanPhone.length <= 5) {
      return `${cleanPhone.substring(0, 3)}****`;
    } else {
      const start = cleanPhone.substring(0, 3);
      const end = cleanPhone.substring(cleanPhone.length - 2);
      return `${start}****${end}`;
    }
  }
};

/**
 * Format currency value to Vietnamese Dong
 * @param {number|string} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0 ₫';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
};