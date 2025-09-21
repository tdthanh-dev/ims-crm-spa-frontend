/**
 * Convert array date format to Date object
 * @param {Array} dateArray - Date array [year, month, day, hour, minute, second, nanosecond]
 * @returns {Date} - Date object
 */
export const convertArrayToDate = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
    return new Date();
  }
  
  // Array format: [year, month, day, hour, minute, second, nanosecond]
  // Note: month is 0-indexed in JavaScript Date constructor
  const [year, month, day, hour, minute, second] = dateArray;
  return new Date(year, month - 1, day, hour, minute, second);
};

/**
 * Get relative time from a date string or array
 * @param {string|Array} dateInput - Date string or array to convert
 * @returns {Object} - Object with timeText and urgencyLevel
 */
export const getRelativeTime = (dateInput) => {
  const now = new Date();
  let date;
  
  if (Array.isArray(dateInput)) {
    date = convertArrayToDate(dateInput);
  } else {
    date = new Date(dateInput);
  }
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);

  let timeText = '';
  let urgencyLevel = 'fresh'; // fresh, normal, warning, urgent, critical

  if (diffInSeconds < 60) {
    timeText = 'vừa xong';
    urgencyLevel = 'fresh';
  } else if (diffInMinutes < 60) {
    timeText = `${diffInMinutes} phút trước`;
    urgencyLevel = diffInMinutes <= 30 ? 'fresh' : 'normal';
  } else if (diffInHours < 24) {
    timeText = diffInHours === 1 ? '1 tiếng trước' : `${diffInHours} tiếng trước`;
    urgencyLevel = diffInHours <= 2 ? 'normal' : 'warning';
  } else if (diffInDays === 1) {
    timeText = 'hôm qua';
    urgencyLevel = 'warning';
  } else if (diffInDays <= 6) {
    timeText = `${diffInDays} ngày trước`;
    urgencyLevel = diffInDays <= 3 ? 'warning' : 'urgent';
  } else if (diffInWeeks === 1) {
    timeText = '1 tuần trước';
    urgencyLevel = 'urgent';
  } else if (diffInWeeks <= 4) {
    timeText = `${diffInWeeks} tuần trước`;
    urgencyLevel = 'critical';
  } else {
    timeText = date.toLocaleDateString('vi-VN');
    urgencyLevel = 'critical';
  }

  return { timeText, urgencyLevel };
};

/**
 * Format date to Vietnamese locale
 * @param {string|Date|Array} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDateVN = (date) => {
  let dateObj;
  
  if (Array.isArray(date)) {
    dateObj = convertArrayToDate(date);
  } else {
    dateObj = new Date(date);
  }
  
  return dateObj.toLocaleDateString('vi-VN');
};

/**
 * Format datetime to Vietnamese locale
 * @param {string|Date|Array} date - Date to format
 * @returns {string} - Formatted datetime string
 */
export const formatDateTimeVN = (date) => {
  let dateObj;
  
  if (Array.isArray(date)) {
    dateObj = convertArrayToDate(date);
  } else {
    dateObj = new Date(date);
  }
  
  return dateObj.toLocaleString('vi-VN');
};