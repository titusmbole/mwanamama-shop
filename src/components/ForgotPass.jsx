import React, { useState } from 'react';
import { Mail, ArrowLeftCircle } from 'lucide-react';

const ForgotPassword = () => {
  // State to hold the email input value
  const [email, setEmail] = useState('');
  // State to manage the success message display
  const [successMessage, setSuccessMessage] = useState('');
  // State to manage the error message display
  const [errorMessage, setErrorMessage] = useState('');

  // Handle changes to the email input field
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // In a real application, you would send a password reset link to this email.
    // For this example, we'll just simulate a successful process.
    console.log(`Sending password reset link to: ${email}`);
    
    // Simulate a check for a valid email (basic client-side validation)
    if (email && email.includes('@')) {
      // Clear the email input and show a success message
      setEmail('');
      setSuccessMessage('A password reset link has been sent to your email address.');
      // Automatically hide the message after a few seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      // Show an error message for invalid input
      setErrorMessage('Please enter a valid email address.');
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4 py-sm-5 d-flex flex-column align-items-center">
      <div className="container-fluid container-md bg-white rounded-3 shadow-lg p-4 p-sm-5 d-flex flex-column align-items-center">
        
        {/* Forgot Password Form */}
        <div className="w-100" style={{ maxWidth: '450px' }}>
          <h2 className="fs-2 fw-bold text-dark mb-4 text-center">Forgot Password</h2>
          <p className="text-secondary text-center mb-4">
            Enter your email address below to receive a password reset link.
          </p>
          
          {/* Conditional messages */}
          {successMessage && (
            <div className="mb-4 p-3 alert alert-success text-center fw-medium">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3 alert alert-danger text-center fw-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-grid gap-4">
            {/* Email Input */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-3"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label htmlFor="email">Email address</label>
            </div>
            
            {/* Reset Password Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold shadow-sm d-flex justify-content-center align-items-center"
            >
              <Mail className="me-2" />
              Reset Password
            </button>
          </form>

          {/* Back to Login link */}
          <div className="text-center mt-3">
            <a href="/login" className="text-primary text-decoration-none d-flex align-items-center justify-content-center">
              <ArrowLeftCircle className="me-2" size={16} />
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
