import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '@/config/constants';
import { getAccessToken, clearAuthData, saveAuthData } from '@/utils/auth';

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);

    // Add auth token for protected endpoints
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('With auth token for endpoint:', config.url);
    } else {
      console.log('No auth token available for:', config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.warn('🔴 401 Unauthorized - Redirecting to login');

      // Clear auth data and redirect
      clearAuthData();
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Request OTP for login
  requestOtp: (username, password) =>
    api.post(API_ENDPOINTS.AUTH.REQUEST_OTP, {
      username,
      password,
      purpose: 'LOGIN'
    }),

  // Verify OTP code and get authentication tokens
  verifyOtp: (username, otpCode) =>
    api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      username,
      otpCode
    }),

  // Get current user info
  getCurrentUser: () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },

  // Standard login (without OTP)
  login: (emailOrPhone, password) =>
    api.post(API_ENDPOINTS.AUTH.LOGIN, {
      emailOrPhone,
      password
    }),

  // Complete authentication flow - verify OTP and save auth data
  verifyOtpAndLogin: async (username, otpCode) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
        username,
        otpCode
      });

      console.log('Backend response:', response.data);

      if (response.data && response.data.success) {
        // Extract auth data from response
        const authData = response.data.data;
        console.log('Auth data:', authData);

        // Save authentication data (simplified)
        saveAuthData(authData);

        return {
          success: true,
          message: response.data.message,
          user: authData.userInfo
        };
      }

      return {
        success: false,
        message: response.data.message || 'OTP verification failed'
      };
    } catch (error) {
      console.error('OTP verification error:', error);

      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.error || error.response.data.message || 'OTP verification failed'
        };
      }

      throw error;
    }
  }
};

// Example usage:
/*
// Step 1: Request OTP
const requestOtp = async (username, password) => {
  try {
    const response = await authAPI.requestOtp(username, password);
    if (response.data.success) {
      console.log('OTP sent successfully:', response.data.data);
      return {
        success: true,
        message: response.data.message,
        data: response.data.data
      };
    }
  } catch (error) {
    console.error('Request OTP error:', error);
    throw error;
  }
};

// Step 2a: Manual OTP verification (without auto-saving)
const verifyOtpManual = async (username, otpCode) => {
  try {
    const response = await authAPI.verifyOtp(username, otpCode);
    if (response.data.success) {
      const { accessToken, refreshToken, tokenType, expiresIn, userInfo } = response.data.data;
      // Manually save auth data
      saveAuthData(response.data.data);
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

// Step 2b: Complete authentication (recommended - auto-saves auth data)
const loginWithOtp = async (username, otpCode) => {
  try {
    const result = await authAPI.verifyOtpAndLogin(username, otpCode);
    if (result.success) {
      console.log('Login successful:', result.user.fullName);
      // Auth data is automatically saved
      return result;
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Complete login flow example:
const handleLogin = async () => {
  // Step 1: Send OTP
  await requestOtp("2251120247@ut.edu.vn", "Thanh1410@");
  
  // Step 2: Verify OTP and login
  const loginResult = await loginWithOtp("2251120247@ut.edu.vn", "633652");
  
  // User is now logged in, tokens are saved
  console.log("Logged in user:", loginResult.user);
};
*/

// Leads API (Consultation Requests)
export const leadsAPI = {
  // Get all leads with pagination and sorting
  getAll: (page = 0, size = 20, sortBy = 'leadId', sortDir = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });
    return api.get(`${API_ENDPOINTS.LEADS}?${params}`);
  },

  // Get leads with search functionality
  getAllWithSearch: (page = 0, size = 20, sortBy = 'leadId', sortDir = 'desc', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir
    });

    if (search) {
      params.append('search', search);
    }

    return api.get(`${API_ENDPOINTS.LEADS}?${params}`);
  },

  // Get leads by status
  getByStatus: (status, page = 0, size = 20, sortBy = 'leadId', sortDir = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
      status
    });
    return api.get(`${API_ENDPOINTS.LEADS}?${params}`);
  },

  getById: (id) =>
    api.get(`${API_ENDPOINTS.LEADS}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.LEADS, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.LEADS}/${id}`, data),

  updateStatus: (id, status) =>
    api.put(`${API_ENDPOINTS.LEADS}/${id}/status?status=${status}`, {}),

  delete: (id) =>
    api.delete(`${API_ENDPOINTS.LEADS}/${id}`)
};

// Spa customers API
export const spaCustomersAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.CUSTOMERS}?page=${page}&size=${size}`),

  getById: (id) =>
    api.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.CUSTOMERS, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data),

  search: (searchTerm, page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.CUSTOMERS}?search=${searchTerm}&page=${page}&size=${size}`)
};

// Services API
export const servicesAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.SERVICES}?page=${page}&size=${size}`),

  getById: (id) =>
    api.get(`${API_ENDPOINTS.SERVICES}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.SERVICES, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.SERVICES}/${id}`, data),

  delete: (id) =>
    api.delete(`${API_ENDPOINTS.SERVICES}/${id}`),

  getCategories: () =>
    api.get(`${API_ENDPOINTS.SERVICES}/categories`),

  getActive: () =>
    api.get(`${API_ENDPOINTS.SERVICES}/active`)
};

// Appointments API
export const appointmentsAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}?page=${page}&size=${size}`),

  getById: (id) =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.APPOINTMENTS, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, data),

  updateStatus: (id, status) =>
    api.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}/status?status=${status}`, {}),

  getCalendar: (startDate, endDate) =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/calendar?startDate=${startDate}&endDate=${endDate}`),

  getTechnicianAppointments: (technicianId, page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/technician/${technicianId}?page=${page}&size=${size}`),

  getTodayAppointments: () =>
    api.get(`${API_ENDPOINTS.APPOINTMENTS}/today`)
};

// Invoices API
export const invoicesAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.INVOICES}?page=${page}&size=${size}`),

  getById: (id) =>
    api.get(`${API_ENDPOINTS.INVOICES}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.INVOICES, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.INVOICES}/${id}`, data),

  updateStatus: (id, status) =>
    api.put(`${API_ENDPOINTS.INVOICES}/${id}/status?status=${status}`, {}),

  delete: (id) =>
    api.delete(`${API_ENDPOINTS.INVOICES}/${id}`)
};

// Payments API
export const paymentsAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.PAYMENTS}?page=${page}&size=${size}`),

  getById: (id) =>
    api.get(`${API_ENDPOINTS.PAYMENTS}/${id}`),

  create: (data) =>
    api.post(API_ENDPOINTS.PAYMENTS, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.PAYMENTS}/${id}`, data),

  updateStatus: (id, status) =>
    api.put(`${API_ENDPOINTS.PAYMENTS}/${id}/status?status=${status}`, {}),

  delete: (id) =>
    api.delete(`${API_ENDPOINTS.PAYMENTS}/${id}`)
};

// Audit API
export const auditAPI = {
  getLogs: (page = 0, size = 50) =>
    api.get(`${API_ENDPOINTS.AUDIT}/logs?page=${page}&size=${size}`),

  getLogById: (id) =>
    api.get(`${API_ENDPOINTS.AUDIT}/logs/${id}`)
};

// Tasks API
export const tasksAPI = {
  getAll: (page = 0, size = 20) =>
    api.get(`${API_ENDPOINTS.AUDIT}/tasks?page=${page}&size=${size}`),

  create: (data) =>
    api.post(`${API_ENDPOINTS.AUDIT}/tasks`, data),

  update: (id, data) =>
    api.put(`${API_ENDPOINTS.AUDIT}/tasks/${id}`, data),

  updateStatus: (id, statusData) =>
    api.put(`${API_ENDPOINTS.AUDIT}/tasks/${id}/status`, statusData),

  delete: (id) =>
    api.delete(`${API_ENDPOINTS.AUDIT}/tasks/${id}`)
};


export default api;

// Export API_BASE_URL for use in components
export { API_BASE_URL };

// Individual API modules are now imported separately
// No need to re-export them from here