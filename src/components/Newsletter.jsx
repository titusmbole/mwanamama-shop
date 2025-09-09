import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      // In a real application, you'd send this email to a server
      setSubscriptionStatus('success');
      setEmail('');
    } else {
      setSubscriptionStatus('error');
    }
  };

  return (
    <div className="bg-light py-5 border-bottom border-secondary">
      <div className="container text-center">
        <h3 className="fw-bold mb-3 text-dark">Stay Updated</h3>
        <p className="mb-4 text-secondary">Get the latest deals and new arrivals in your inbox</p>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <form onSubmit={handleSubscribe} className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Your email address"
              />
              <button
                className="btn btn-primary text-white fw-semibold"
                type="submit"
              >
                Subscribe
              </button>
            </form>
            {subscriptionStatus === 'success' && (
              <small className="text-success mt-2 d-block">Thank you for subscribing!</small>
            )}
            {subscriptionStatus === 'error' && (
              <small className="text-danger mt-2 d-block">Please enter a valid email address.</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSubscription;