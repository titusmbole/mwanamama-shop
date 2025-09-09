// src/contexts/UnifiedAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UnifiedAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an UnifiedAuthProvider');
  }
  return context;
};

// Role-based permissions
const ROLE_PERMISSIONS = {
  admin: {
    canViewAllUsers: true,
    canManageCategories: true,
    canManageProducts: true,
    canViewReports: true,
    canManageOrders: true,
    canManageStaff: true,
    dashboardRoute: '/admin/dashboard'
  },
  manager: {
    canViewAllUsers: false,
    canManageCategories: true,
    canManageProducts: true,
    canViewReports: true,
    canManageOrders: true,
    canManageStaff: false,
    dashboardRoute: '/manager/dashboard'
  },
  storekeeper: {
    canViewAllUsers: false,
    canManageCategories: false,
    canManageProducts: true,
    canViewReports: false,
    canManageOrders: true,
    canManageStaff: false,
    dashboardRoute: '/storekeeper/dashboard'
  },
  staff: {
    canViewAllUsers: false,
    canManageCategories: false,
    canManageProducts: false,
    canViewReports: false,
    canManageOrders: true,
    canManageStaff: false,
    dashboardRoute: '/staff/dashboard'
  },
  customer: {
    canViewAllUsers: false,
    canManageCategories: false,
    canManageProducts: false,
    canViewReports: false,
    canManageOrders: false,
    canManageStaff: false,
    dashboardRoute: '/customer/profile'
  }
};

export const UnifiedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 Initializing unified auth...");

      const storedUser = localStorage.getItem('userData');
      const storedToken = localStorage.getItem('authToken');

      console.log("💾 Stored token:", !!storedToken);
      console.log("💾 Stored user data:", !!storedUser);

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("✅ Valid user data found:", parsedUser);

          const role = parsedUser.role || 'customer';
          
          setUser(parsedUser);
          setToken(storedToken);
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.customer);
          setIsAuthenticated(true);

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          console.log("🔐 Authorization header set for role:", role);
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
          logout();
        }
      } else {
        console.log("ℹ️ No stored session found");
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, authToken) => {
    try {
      console.log("🔐 Login called with:", {
        hasToken: !!authToken,
        user: userData,
        role: userData?.role
      });

      if (!authToken || !userData) {
        throw new Error('Token and user data are required');
      }

      const role = userData.role || 'customer';

      // Store in localStorage
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Verify storage
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      if (!storedToken || !storedUser) {
        throw new Error('Failed to store authentication data');
      }

      console.log("💾 Authentication data stored successfully");

      // Update state
      setUser(userData);
      setToken(authToken);
      setUserRole(role);
      setPermissions(ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.customer);
      setIsAuthenticated(true);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      console.log("✅ Authentication successful for role:", role);
      return true;

    } catch (error) {
      console.error('❌ Login error:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out user...");

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];

    // Reset state
    setUser(null);
    setToken(null);
    setUserRole(null);
    setPermissions({});
    setIsAuthenticated(false);

    console.log("✅ User logged out successfully");
  };

  // Universal login function
  const loginUser = async (credentials, loginType = 'staff') => {
    try {
      console.log(`🔑 Logging in ${loginType}...`, credentials);

      let endpoint;
      
      // Determine endpoint based on login type
      switch (loginType) {
        case 'customer':
          endpoint = 'https://api.mwanamama.org/api/v1/auth/customer/login';
          break;
        case 'staff':
        case 'admin':
        case 'manager':
        case 'storekeeper':
        default:
          endpoint = 'https://api.mwanamama.org/api/v1/auth/login';
          break;
      }

      const response = await axios.post(endpoint, credentials);

      console.log("📥 API Response:", response.data);
      console.log("📥 Response Status:", response.status);

      const responseData = response.data;
      let userData, authToken, message;

      // Handle different response structures
      if (responseData.admin && responseData.token) {
        userData = responseData.admin;
        authToken = responseData.token;
        message = responseData.message;
      } else if (responseData.user && responseData.token) {
        userData = responseData.user;
        authToken = responseData.token;
        message = responseData.message;
      } else if (responseData.data && responseData.data.user && responseData.data.token) {
        userData = responseData.data.user;
        authToken = responseData.data.token;
        message = responseData.message;
      } else if (responseData.token) {
        // Token-only response
        authToken = responseData.token;
        message = responseData.message || "Login successful";
        
        // Create basic user object
        userData = {
          username: credentials.username || credentials.email,
          email: credentials.email,
          role: loginType === 'customer' ? 'customer' : 'staff'
        };
      } else {
        console.log("❌ Unexpected response structure:", responseData);
        return { success: false, message: "Unexpected response from server" };
      }

      console.log("🔍 Extracted user:", userData);
      console.log("🔍 Extracted token:", !!authToken);
      console.log("🔍 User role:", userData?.role);

      if (authToken && userData) {
        const loggedIn = await login(userData, authToken);
        if (loggedIn) {
          console.log("✅ Login successful");
          return { 
            success: true, 
            message: message || "Login successful",
            role: userData.role,
            dashboardRoute: ROLE_PERMISSIONS[userData.role]?.dashboardRoute || '/dashboard'
          };
        } else {
          return { success: false, message: "Failed to store authentication data" };
        }
      } else {
        console.log("❌ Missing token or user data");
        return { success: false, message: message || "Invalid credentials" };
      }

    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
      
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please try again."
      };
    }
  };

  // Register function
  const register = async (userData, userType = 'customer') => {
    try {
      console.log(`📝 Registering new ${userType}...`);

      let endpoint;
      
      switch (userType) {
        case 'customer':
          endpoint = 'https://api.mwanamama.org/api/v1/auth/customer/register';
          break;
        case 'staff':
        default:
          endpoint = 'https://api.mwanamama.org/api/v1/auth/register';
          break;
      }

      const response = await axios.post(endpoint, {
        ...userData,
        role: userType
      });

      if (response.data.success || response.data.token) {
        const { token, user, admin } = response.data;
        const registeredUser = user || admin;
        
        if (token && registeredUser) {
          await login(registeredUser, token);
          console.log("✅ Registration successful");
          return { success: true, message: 'Registration successful!' };
        }
      }
      
      return { 
        success: false, 
        message: response.data.message || 'Registration failed' 
      };

    } catch (error) {
      console.error("❌ Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Role checking utilities
  const hasPermission = (permission) => {
    return permissions[permission] || false;
  };

  const isRole = (role) => {
    return userRole === role;
  };

  const isStaffMember = () => {
    return ['admin', 'manager', 'storekeeper', 'staff'].includes(userRole);
  };

  const isCustomer = () => {
    return userRole === 'customer';
  };

  // Verify token
  const verifyToken = async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      logout();
      return false;
    }

    try {
      const response = await axios.get('https://api.mwanamama.org/api/v1/auth/verify', {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (response.data.success) {
        console.log("✅ Token is valid");
        return true;
      } else {
        console.log("❌ Token validation failed");
        logout();
        return false;
      }
    } catch (error) {
      console.error("❌ Token verification error:", error);
      logout();
      return false;
    }
  };

  const value = {
    // State
    user,
    token,
    loading,
    isAuthenticated,
    userRole,
    permissions,

    // Actions
    login,
    logout,
    loginUser,
    register,
    verifyToken,

    // Role utilities
    hasPermission,
    isRole,
    isStaffMember,
    isCustomer,

    // Role constants
    ROLES: Object.keys(ROLE_PERMISSIONS)
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};