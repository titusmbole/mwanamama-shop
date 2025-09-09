// src/contexts/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore from localStorage on first load
  useEffect(() => {
    const initializeAuth = () => {
      console.log("🔄 Initializing admin auth...");

      const savedAdmin = localStorage.getItem("admin");
      const savedToken = localStorage.getItem("adminToken");

      console.log("💾 Stored admin token:", !!savedToken);
      console.log("💾 Stored admin data:", !!savedAdmin);

      if (savedAdmin && savedToken) {
        try {
          const parsedAdmin = JSON.parse(savedAdmin);
          console.log("✅ Valid admin data found:", parsedAdmin);

          setAdmin(parsedAdmin);
          setAdminToken(savedToken);
          setIsAuthenticated(true);

          // Set axios default header
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
          console.log("🔐 Admin authorization header set");
        } catch (error) {
          console.error("❌ Error parsing admin data:", error);
          logout(); // Clear invalid data
        }
      } else {
        console.log("ℹ️ No stored admin session found");
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (adminData, token) => {
    try {
      console.log("🔐 Admin context login called with:", {
        hasToken: !!token,
        hasAdmin: !!adminData,
      });

      if (!token || !adminData) {
        throw new Error("Token and admin data are required");
      }

      // Store in localStorage
      localStorage.setItem("admin", JSON.stringify(adminData));
      localStorage.setItem("adminToken", token);

      // Verify storage worked
      const storedToken = localStorage.getItem("adminToken");
      const storedAdmin = localStorage.getItem("admin");

      if (!storedToken || !storedAdmin) {
        throw new Error("Failed to store authentication data");
      }

      console.log("💾 Admin authentication data stored successfully");

      // Update state
      setAdmin(adminData);
      setAdminToken(token);
      setIsAuthenticated(true);

      // Set axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("✅ Admin authentication successful");
      return true;
    } catch (error) {
      console.error("❌ Login error in admin context:", error);
      logout(); // Clean up
      return false;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out admin...");

    // Clear localStorage
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    // Clear axios header
    delete axios.defaults.headers.common["Authorization"];

    // Reset state
    setAdmin(null);
    setAdminToken(null);
    setIsAuthenticated(false);

    console.log("✅ Admin logged out successfully");
  };

  // Verify token validity
  const verifyToken = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      logout();
      return false;
    }

    try {
      // Updated to match your API endpoint
      const response = await axios.get(
        "https://api.mwanamama.org/api/v1/auth/verify",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        console.log("✅ Admin token is valid");
        return true;
      } else {
        console.log("❌ Admin token validation failed");
        logout();
        return false;
      }
    } catch (error) {
      console.error("❌ Admin token verification error:", error);
      logout();
      return false;
    }
  };

  // Login admin - Updated to match your API
  const loginAdmin = async (credentials) => {
    try {
      console.log("🔑 Logging in admin with credentials:", credentials);
  
      const response = await axios.post(
        "https://api.mwanamama.org/api/v1/auth/login", // ✅ Updated endpoint
        credentials
      );
  
      console.log("📥 API Response:", response.data);
      console.log("📥 Response Status:", response.status);
  
      const responseData = response.data;
      
      // Check different possible response structures
      let admin, token, message;
      
      if (responseData.admin && responseData.token) {
        // Structure: { admin: {...}, token: "...", message: "..." }
        admin = responseData.admin;
        token = responseData.token;
        message = responseData.message;
      } else if (responseData.data && responseData.data.admin && responseData.data.token) {
        // Structure: { data: { admin: {...}, token: "..." }, message: "..." }
        admin = responseData.data.admin;
        token = responseData.data.token;
        message = responseData.message;
      } else if (responseData.user && responseData.token) {
        // Structure: { user: {...}, token: "...", message: "..." }
        admin = responseData.user;
        token = responseData.token;
        message = responseData.message;
      } else if (responseData.token) {
        // Structure: { token: "..." } - Only token provided
        token = responseData.token;
        message = responseData.message || "Login successful";
        
        // Create a basic admin object from the credentials or decode token
        admin = {
          username: credentials.username,
          role: "admin", // Default role
          // Add other properties as needed
        };
        
        console.log("🔍 Token-only response, created admin object:", admin);
      } else {
        console.log("❌ Unexpected response structure:", responseData);
        return { success: false, message: "Unexpected response from server" };
      }
      
      console.log("🔍 Extracted admin:", admin);
      console.log("🔍 Extracted token:", !!token);
  
      if (token && admin) {
        const loggedIn = login(admin, token);
        if (loggedIn) {
          console.log("✅ Admin login successful");
          return { success: true, message: message || "Login successful" };
        } else {
          console.log("❌ Login function failed");
          return { success: false, message: "Failed to store authentication data" };
        }
      } else {
        console.log("❌ Missing token or admin data in response");
        return { success: false, message: message || "Invalid credentials" };
      }
    } catch (error) {
      console.error("❌ Admin login error:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  // Update profile
  const updateProfile = async (updateData) => {
    try {
      console.log("📝 Updating admin profile...");

      // Updated to match your API endpoint pattern
      const response = await axios.put(
        "https://api.mwanamama.org/api/v1/auth/profile",
        updateData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      if (response.data.success) {
        const updatedAdmin = response.data.admin;
        setAdmin(updatedAdmin);
        localStorage.setItem("admin", JSON.stringify(updatedAdmin));
        console.log("✅ Admin profile updated successfully");
        return { success: true, message: "Profile updated successfully!" };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("❌ Admin profile update error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Profile update failed. Please try again.",
      };
    }
  };

  const value = {
    admin,
    adminToken,
    loading,
    isAuthenticated,
    login,
    logout,
    loginAdmin,
    verifyToken,
    updateProfile,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};