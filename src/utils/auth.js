// Enhanced auth utilities with token refresh support
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const TOKEN_EXPIRE_KEY = 'token_expires_at';

/**
 * Save authentication data to sessionStorage
 * @param {Object} authResponse - Response from login API
 */
export const saveAuthData = (authResponse) => {
  console.log('💾 Saving auth data:', authResponse);

  const {
    accessToken,
    refreshToken,
    userInfo,
    expiresIn
  } = authResponse;

  if (accessToken) {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    console.log('✅ Access token saved');

    // Calculate expiration time (expiresIn is in seconds)
    if (expiresIn) {
      const expiresAt = Date.now() + (expiresIn * 1000);
      sessionStorage.setItem(TOKEN_EXPIRE_KEY, expiresAt.toString());
      console.log('✅ Token expiration time saved');
    }
  }

  if (refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    console.log('✅ Refresh token saved');
  }

  if (userInfo) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    console.log('✅ User info saved');
  }
};

/**
 * Get access token from storage
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token from storage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if token is expired
 * @returns {boolean} True if token is expired or will expire in next 5 minutes
 */
export const isTokenExpired = () => {
  const expiresAt = sessionStorage.getItem(TOKEN_EXPIRE_KEY);
  if (!expiresAt) return true;

  const expireTime = parseInt(expiresAt);
  const now = Date.now();

  // Consider token expired if it expires in next 5 minutes
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  return now >= (expireTime - bufferTime);
};

/**
 * Get time until token expires (in milliseconds)
 * @returns {number|null} Time until expiration or null if no expiration time
 */
export const getTokenTimeUntilExpiry = () => {
  const expiresAt = sessionStorage.getItem(TOKEN_EXPIRE_KEY);
  if (!expiresAt) return null;

  const expireTime = parseInt(expiresAt);
  const now = Date.now();

  return Math.max(0, expireTime - now);
};

/**
 * Get user data from storage
 * @returns {Object|null} User object or null
 */
export const getUserData = () => {
  const userData = sessionStorage.getItem(USER_KEY);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated and token is not expired
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  const user = getUserData();
  const isExpired = isTokenExpired();

  console.log('🔍 Checking authentication:', {
    hasToken: !!token,
    hasUser: !!user,
    isExpired: isExpired
  });

  return !!(token && user && !isExpired);
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  console.log('🧹 Clearing auth data');

  // Clear all auth-related keys
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRE_KEY);

  // Clear legacy keys if any
  sessionStorage.removeItem('_auth_session');
  sessionStorage.removeItem('_refresh_session');
  sessionStorage.removeItem('_user_session');
  sessionStorage.removeItem('_expires_session');

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  console.log('✅ Auth data cleared');
};

/**
 * Get complete auth data
 * @returns {Object|null} Auth data object or null
 */
export const getAuthData = () => {
  const token = getAccessToken();
  const user = getUserData();

  if (token && user) {
    return {
      accessToken: token,
      user: user
    };
  }

  return null;
};