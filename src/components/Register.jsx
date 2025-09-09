import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Fair';
        break;
      case 4:
        feedback = 'Good';
        break;
      case 5:
        feedback = 'Strong';
        break;
      default:
        feedback = '';
    }

    setPasswordStrength({ score, feedback });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+254|0)[7][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/admins/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        alert("✅ Registration successful! Please login.");
        window.location.href = "/login"; // redirect to login page
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Server error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSocialLogin = (provider) => {
    console.log(`Register with ${provider}`);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return '#dc3545';
      case 2:
        return '#fd7e14';
      case 3:
        return '#ffc107';
      case 4:
        return '#20c997';
      case 5:
        return '#198754';
      default:
        return '#6c757d';
    }
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      <div className="min-vh-100 d-flex align-items-center py-5" 
           style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-lg" style={{borderRadius: '20px'}}>
                <div className="card-body p-5">
                  {/* Logo and Header */}
                  <div className="text-center mb-4">
                    <div 
                      className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      <span className="text-white fw-bold fs-3">MEL</span>
                    </div>
                    <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>Join Mwanamama!</h2>
                    <p className="text-muted">Create your account and start shopping</p>
                  </div>

                  {/* Social Registration Buttons */}
                  <div className="row mb-4">
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
                        <span className="text-primary me-2">f</span>
                        Facebook
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="text-center mb-4">
                    <div className="position-relative">
                      <hr />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                        or register with email
                      </span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <div>
                    {/* Name Fields */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                          First Name
                        </label>
                        <div className="position-relative">
                          <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
                            <User size={20} className="text-muted" />
                          </span>
                          <input
                            type="text"
                            className={`form-control form-control-lg ps-5 ${errors.firstName ? 'is-invalid' : ''}`}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            style={{borderRadius: '15px'}}
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.lastName ? 'is-invalid' : ''}`}
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          style={{borderRadius: '15px'}}
                        />
                        {errors.lastName && (
                          <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                        Email Address
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <Mail size={20} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className={`form-control form-control-lg ps-5 ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          style={{borderRadius: '15px'}}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                        Phone Number
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <Phone size={20} className="text-muted" />
                        </span>
                        <input
                          type="tel"
                          className={`form-control form-control-lg ps-5 ${errors.phone ? 'is-invalid' : ''}`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+254 700 000 000"
                          style={{borderRadius: '15px'}}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
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
                          placeholder="Create a strong password"
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
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Password strength:</small>
                            <small style={{color: getPasswordStrengthColor()}} className="fw-semibold">
                              {passwordStrength.feedback}
                            </small>
                          </div>
                          <div className="progress" style={{height: '4px'}}>
                            <div 
                              className="progress-bar transition"
                              style={{
                                width: `${(passwordStrength.score / 5) * 100}%`,
                                backgroundColor: getPasswordStrengthColor()
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3 z-2">
                          <Lock size={20} className="text-muted" />
                        </span>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={`form-control form-control-lg ps-5 pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          style={{borderRadius: '15px'}}
                        />
                        <button
                          type="button"
                          className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} className="text-muted" />
                          ) : (
                            <Eye size={20} className="text-muted" />
                          )}
                        </button>
                        {errors.confirmPassword && (
                          <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                      </div>
                    </div>

                    {/* Terms and Newsletter */}
                    <div className="mb-4">
                      <div className="form-check mb-2">
                        <input
                          className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          name="agreeToTerms"
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="agreeToTerms">
                          I agree to the <a href="#" style={{color: '#667eea'}}>Terms & Conditions</a> and <a href="#" style={{color: '#667eea'}}>Privacy Policy</a>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="invalid-feedback d-block">{errors.agreeToTerms}</div>
                        )}
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="subscribeNewsletter"
                          id="subscribeNewsletter"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="subscribeNewsletter">
                          Subscribe to newsletter for exclusive offers and updates
                        </label>
                      </div>
                    </div>

                    {/* Register Button */}
                    <button
                      type="button"
                      className="btn text-white w-100 py-3 mb-4"
                      disabled={isLoading}
                      onClick={handleSubmit}
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
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="me-2" />
                          Create Account
                        </>
                      )}
                    </button>

                    {/* Sign In Link */}
                    <div className="text-center">
                      <span className="text-muted">Already have an account? </span>
                      <a 
                        href="/login" 
                        className="text-decoration-none fw-semibold"
                        style={{color: '#667eea'}}
                      >
                        Sign in here
                        <ArrowRight size={16} className="ms-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="row mt-4 text-white">
                <div className="col-md-4 text-center mb-3">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3 d-inline-block mb-2">
                    <Check size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">Free Account</h6>
                  <small>No monthly fees or hidden charges</small>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3 d-inline-block mb-2">
                    <UserPlus size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">Easy Setup</h6>
                  <small>Get started in just a few minutes</small>
                </div>
                <div className="col-md-4 text-center mb-3">
                  <div className="bg-white bg-opacity-20 rounded-circle p-3 d-inline-block mb-2">
                    <ArrowRight size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">Instant Access</h6>
                  <small>Start shopping immediately</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;