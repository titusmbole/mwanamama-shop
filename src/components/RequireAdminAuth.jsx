// src/pages/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Lucide icons
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth(); // ✅ use loginAdmin instead of login
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ✅ Placeholder for social login
  const handleSocialLogin = (provider) => {
    toast.info(`Social login with ${provider} is not implemented yet.`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    
    console.log("🚀 Submitting login form with:", formData);
    
    try {
      // Use loginAdmin from context which handles the API call
      const result = await loginAdmin(formData);
      
      console.log("📋 Login result:", result);
      
      if (result.success) {
        console.log("✅ Login successful, redirecting...");
        
        // Show success toast
        toast.success("🎉 Login successful! Redirecting to dashboard...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Redirect after showing toast
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        console.log("❌ Login failed:", result.message);
        setErrors({ general: result.message || "Login failed" });
        
        // Show error toast
        toast.error(`❌ ${result.message || "Login failed"}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (err) {
      console.error("💥 Unexpected error:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
      
      // Show error toast
      toast.error("💥 An unexpected error occurred. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />

      <div className="min-vh-100 d-flex">
        {/* Left Column - Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            {/* Logo/Header */}
            <div className="text-center mb-4">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                <span className="text-white fw-bold fs-4">MEL</span>
              </div>
              <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>Welcome Back!</h2>
              <p className="text-muted">Sign in to your Mwanamama account</p>
            </div>

            {/* Social Login */}
            {/* <div className="row mb-4">
              <div className="col-6">
                <button 
                  className="btn btn-outline-primary w-100 py-2"
                  onClick={() => handleSocialLogin('google')}
                  style={{borderRadius: '25px'}}
                >
                  <img 
                    src="https://developers.google.com/identity/images/g-logo.png" 
                    alt="Google" 
                    width="20" 
                    className="me-2"
                  />
                  Google
                </button>
              </div>
              <div className="col-6">
                <button 
                  className="btn btn-outline-primary w-100 py-2"
                  onClick={() => handleSocialLogin('facebook')}
                  style={{borderRadius: '25px'}}
                >
                  <span className="text-primary me-2 fw-bold">f</span>
                  Facebook
                </button>
              </div>
            </div> */}

            {/* Divider */}
            <div className="text-center mb-4">
              <div className="position-relative">
                <hr />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                  or continue with username
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              {/* Username Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                  Username
                </label>
                <div className="position-relative">
                  <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
                    <User size={20} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control form-control-lg ps-5 ${errors.username ? 'is-invalid' : ''}`}
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    style={{borderRadius: '15px'}}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                  Password
                </label>
                <div className="position-relative">
                  <span className="position-absolute top-50 start-0 translate-middle-y ms-3 z-2">
                    <Lock size={20} className="text-muted" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control form-control-lg ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    style={{borderRadius: '15px'}}
                  />
                  <button
                    type="button"
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} className="text-muted" />
                    ) : (
                      <Eye size={20} className="text-muted" />
                    )}
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                {/* <a 
                  href="/forgot" 
                  className="text-decoration-none"
                  style={{color: '#667eea'}}
                >
                  Forgot Password?
                </a> */}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn text-white w-100 py-3 mb-4"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '25px'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={20} className="me-2" />
                    Sign In
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              {/* <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <a 
                  href="/register" 
                  className="text-decoration-none fw-semibold"
                  style={{color: '#667eea'}}
                >
                  Sign up here
                  <ArrowRight size={16} className="ms-1" />
                </a>
              </div> */}
            </form>
          </div>
        </div>

        {/* Right Column - Company Branding */}
        <div 
          className="col-md-6 d-flex align-items-center justify-content-center text-white position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            height: '100vh'
          }}
        >
          {/* Background Pattern/Decoration */}
          <div 
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: '0.3'
            }}
          ></div>

          <div className="text-center position-relative z-2 p-4" style={{ maxHeight: '100vh' }}>
            {/* Large Company Logo/Name */}
            <div className="mb-3">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span className="text-white fw-bold" style={{ fontSize: '2rem' }}>MEL</span>
              </div>
              
              <h1 className="display-5 fw-bold mb-2">Mwanamama -Ltd</h1>
              <p className="fs-6 mb-3 opacity-90">Empowering Lives Through Technology</p>
              
              <div className="mb-4">
                <p className="opacity-80 lh-base" style={{ fontSize: '0.9rem' }}>
                  Join thousands of users who trust Mwanamama for their daily needs. 
                  Experience seamless service delivery and innovative solutions designed 
                  just for you.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            {/* <div className="text-start">
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <User size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Personal Account Management</h6>
                    <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Track orders and manage all your preferences in one place</small>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <LogIn size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Lightning Fast Checkout</h6>
                    <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Save time with our express checkout system</small>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>Exclusive Member Benefits</h6>
                    <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Access special deals and member-only offers</small>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Bottom Stats/Social Proof */}
            {/* <div className="pt-3 border-top border-white border-opacity-25">
              <div className="row text-center">
                <div className="col-4">
                  <h5 className="fw-bold mb-0">10K+</h5>
                  <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Active Users</small>
                </div>
                <div className="col-4">
                  <h5 className="fw-bold mb-0">99.9%</h5>
                  <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Uptime</small>
                </div>
                <div className="col-4">
                  <h5 className="fw-bold mb-0">24/7</h5>
                  <small className="opacity-80" style={{ fontSize: '0.75rem' }}>Support</small>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;