import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - tambah token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - improved error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }

    const status = error.response?.status;
    const errorMessage = error.response?.data?.message?.toLowerCase() || '';

    // Handle 401 Unauthorized
    if (status === 401) {
      const isTokenError = 
        errorMessage.includes('token expired') ||
        errorMessage.includes('token invalid') ||
        errorMessage.includes('unauthenticated') ||
        errorMessage.includes('authentication failed');

      if (isTokenError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login?session=expired";
        }
      }
    }

    // Handle 419 CSRF token mismatch (for Laravel)
    if (status === 419) {
      console.warn('CSRF token mismatch');
      // You might want to refresh the page or get new CSRF token
    }

    // Handle 429 Too Many Requests
    if (status === 429) {
      return Promise.reject({
        message: 'Too many requests. Please try again later.',
        isRateLimit: true
      });
    }

    // Handle 500 Internal Server Error
    if (status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        isServerError: true
      });
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/register", userData),
  verifyOtp: (data) => api.post("/verify-otp", data),
  resendOtp: (phone) => api.post("/resend-otp", { phone }),
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  getMe: () => api.get("/me"),
  forgotPassword: (phone) => api.post("/forgot-password", { phone }),
  verifyResetOtp: (data) => api.post("/verify-reset-otp", data),
  resetPassword: (data) => api.post("/reset-password", data),
  
  // Refresh token method (if implemented in backend)
  refreshToken: () => api.post("/refresh-token"),
};

// Export the instance for other APIs to use
export default api;