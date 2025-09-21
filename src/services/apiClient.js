import axios from 'axios';
import { API_BASE_URL } from '@/config/constants';
import { getAccessToken, getRefreshToken, clearAuthData, saveAuthData } from '@/utils/auth';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const showErrorToast = (message, type = 'error') => {
  alert(message);
};

const isNetworkError = (error) => {
  return !error.response && error.code === 'NETWORK_ERROR';
};

const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED';
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config._retry) {
      config._retry = 0;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isNetworkError(error) || isTimeoutError(error)) {
      const maxRetries = 3;
      const currentRetry = originalRequest._retry || 0;
      if (currentRetry < maxRetries) {
        const delay = Math.pow(2, currentRetry) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        originalRequest._retry = currentRetry + 1;
        return apiClient(originalRequest);
      } else {
        showErrorToast('Không thể kết nối, vui lòng kiểm tra lại.', 'error');
        return Promise.reject(error);
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400: {
          const errorMessage = data?.message || data?.error || 'Dữ liệu không hợp lệ';
          showErrorToast(errorMessage);
          break;
        }
        case 401:
          if (originalRequest._retry) {
            clearAuthData();
            showErrorToast('Phiên đăng nhập đã hết hạn.', 'warning');
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
            return Promise.reject(error);
          }
          if (!isRefreshing) {
            isRefreshing = true;
            try {
              const refreshToken = getRefreshToken();
              if (!refreshToken) {
                clearAuthData();
                showErrorToast('Phiên đăng nhập đã hết hạn.', 'warning');
                setTimeout(() => {
                  window.location.href = '/';
                }, 1500);
                return Promise.reject(error);
              }
              const refreshResponse = await apiClient.post('/auth/refresh', {
                refreshToken: refreshToken
              });
              if (refreshResponse.data && refreshResponse.data.success) {
                const newAuthData = refreshResponse.data.data;
                saveAuthData(newAuthData);
                const newToken = newAuthData.accessToken;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
              } else {
                throw new Error('Invalid refresh response');
              }
            } catch (refreshError) {
              clearAuthData();
              showErrorToast('Phiên đăng nhập đã hết hạn.', 'warning');
              setTimeout(() => {
                window.location.href = '/';
              }, 1500);
              processQueue(refreshError, null);
              return Promise.reject(error);
            } finally {
              isRefreshing = false;
            }
          }
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                if (token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(apiClient(originalRequest));
              },
              reject: (err) => {
                reject(err);
              }
            });
          });
        case 403: {
          const permissionError = data?.message || data?.error || 'Không có quyền truy cập';
          showErrorToast(permissionError, 'error');
          break;
        }
        case 404:
          showErrorToast('Không tìm thấy tài nguyên', 'warning');
          break;
        case 422: {
          const validationErrors = data?.errors || data?.message || 'Dữ liệu không hợp lệ';
          showErrorToast(validationErrors);
          break;
        }
        case 429:
          showErrorToast('Quá nhiều yêu cầu. Vui lòng thử lại.', 'warning');
          break;
        case 500:
          showErrorToast('Lỗi máy chủ nội bộ.', 'error');
          break;
        case 502:
        case 503:
        case 504:
          showErrorToast('Máy chủ đang bận. Vui lòng thử lại sau.', 'warning');
          break;
        default: {
          const defaultMessage = data?.message || data?.error || `Lỗi không xác định (${status})`;
          showErrorToast(defaultMessage);
          break;
        }
      }
    } else {
      showErrorToast('Không thể kết nối đến máy chủ.', 'error');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
