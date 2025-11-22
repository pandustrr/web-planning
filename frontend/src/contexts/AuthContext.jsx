import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only clear storage if it's an actual auth error
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.login(credentials);

      // Handle phone verification required
      if (response.data.data?.needs_verification) {
        return {
          success: false,
          needsVerification: true,
          phone: response.data.data.phone,
          message: response.data.message,
        };
      }

      const { user, access_token } = response.data.data;

      // Store auth data
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { 
        success: true, 
        data: response.data,
        user 
      };
    } catch (error) {
      // Handle verification needs from error response
      if (error.response?.data?.data?.needs_verification) {
        return {
          success: false,
          needsVerification: true,
          phone: error.response.data.data.phone,
          message: error.response.data.message,
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again.",
        error: error.response?.data
      };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (userData) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.register(userData);

      return {
        success: true,
        data: response.data,
        needsVerification: true,
        phone: userData.phone,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors,
        error: error.response?.data
      };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const verifyOtp = async (data) => {
    setIsAuthenticating(true);
    try {
      const response = await authAPI.verifyOtp(data);
      
      // If verification includes login (access token provided)
      if (response.data.data?.access_token) {
        const { user, access_token } = response.data.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }

      return { 
        success: true, 
        data: response.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Verification failed",
        error: error.response?.data
      };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const resendOtp = async (phone) => {
    try {
      const response = await authAPI.resendOtp(phone);
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resend OTP",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const forgotPassword = async (phone) => {
    try {
      const response = await authAPI.forgotPassword(phone);
      return { 
        success: true, 
        message: response.data?.message || "Reset instructions sent" 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset instructions",
      };
    }
  };

  const verifyResetOtp = async (data) => {
    try {
      const response = await authAPI.verifyResetOtp(data);
      return { 
        success: true, 
        data: response.data,
        resetToken: response.data.data?.reset_token,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid OTP",
      };
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await authAPI.resetPassword(data);
      return { 
        success: true, 
        message: response.data?.message || "Password reset successfully" 
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
        errors: error.response?.data?.errors
      };
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem("user", JSON.stringify({ ...user, ...userData }));
  };

  const value = {
    user,
    isLoading,
    isAuthenticating,
    login,
    register,
    verifyOtp,
    resendOtp,
    logout,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
    updateUser,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;