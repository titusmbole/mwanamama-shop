// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 Initializing user auth...");
      
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');

      console.log("💾 Stored token:", !!token);
      console.log("💾 Stored user data:", !!userData);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("✅ Valid user data found:", parsedUser);
          
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Set axios default header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log("🔐 User authorization header set");
          
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
          logout(); // Clear invalid data
        }
      } else {
        console.log("ℹ️ No stored user session found");
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (token, userData) => {
    try {
      console.log("🔐 User context login called with:", { 
        hasToken: !!token, 
        user: userData 
      });

      if (!token || !userData) {
        throw new Error('Token and user data are required');
      }

      // Store in localStorage
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Verify storage worked
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userData');
      
      if (!storedToken || !storedUser) {
        throw new Error('Failed to store authentication data');
      }

      console.log("💾 User authentication data stored successfully");

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log("✅ User authentication successful");
      return true;
      
    } catch (error) {
      console.error('❌ Login error in user context:', error);
      logout(); // Clean up any partial data
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out user...");
    
    // Clear localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    console.log("✅ User logged out successfully");
  };

  // Register new user
  const register = async (userData) => {
    try {
      console.log("📝 Registering new user...");
      
      const response = await axios.post('http://localhost:4000/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        await login(token, user);
        console.log("✅ User registration successful");
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Login existing user
  const loginUser = async (credentials) => {
    try {
      console.log("🔑 Logging in user...");
      
      const response = await axios.post('http://localhost:4000/api/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        await login(token, user);
        console.log("✅ User login successful");
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // Verify token is still valid
  const verifyToken = async () => {
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      logout();
      return false;
    }

    try {
      const response = await axios.get('http://localhost:4000/api/auth/verify');
      
      if (response.data.success) {
        console.log("✅ User token is valid");
        return true;
      } else {
        console.log("❌ User token validation failed");
        logout();
        return false;
      }
    } catch (error) {
      console.error("❌ User token verification error:", error);
      logout();
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      console.log("📝 Updating user profile...");
      
      const response = await axios.put('http://localhost:4000/api/auth/profile', updateData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        console.log("✅ Profile updated successfully");
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed. Please try again.' 
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
    loginUser,
    verifyToken,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};