import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowUp, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [showScroll, setShowScroll] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscriptionStatus('success');
      setEmail('');
    } else {
      setSubscriptionStatus('error');
    }
  };

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', href: '#' },
      { name: 'Shop All', href: '#' },
      { name: 'New Arrivals', href: '#' },
      { name: 'Best Sellers', href: '#' },
      { name: 'Sale Items', href: '#' },
    ],
    'Customer Service': [
      { name: 'Help Center', href: '#' },
      { name: 'Shipping Info', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Size Guide', href: '#' },
      { name: 'Track Order', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'btn-outline-light' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'btn-outline-light' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'btn-outline-light' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showScroll]);

  return (
    <>
      <footer className="bg-dark text-light position-relative overflow-hidden">
        {/* Newsletter Section */}
        <div className="bg-gradient-newsletter py-5 position-relative">
          <div className="container py-4">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h3 className="display-6 fw-bold text-white mb-3">Stay in the Loop</h3>
                <p className="fs-5 text-white-50 mb-4">Get the latest deals, new arrivals, and exclusive offers delivered to your inbox</p>
                
                <div className="row justify-content-center">
                  <div className="col-md-8 col-lg-6">
                    <div className="input-group input-group-lg bg-white bg-opacity-10 rounded-pill p-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control bg-transparent text-white border-0 placeholder-text-light"
                        placeholder="Enter your email address"
                        style={{fontSize: '1rem'}}
                      />
                      <button
                        onClick={handleSubscribe}
                        className="btn btn-light rounded-pill px-4 fw-semibold"
                        type="button"
                      >
                        <Send size={18} className="me-2" />
                        Subscribe
                      </button>
                    </div>
                    
                    {subscriptionStatus === 'success' && (
                      <div className="alert alert-success mt-3 py-2" role="alert">
                        <small>✨ Thank you for subscribing!</small>
                      </div>
                    )}
                    {subscriptionStatus === 'error' && (
                      <div className="alert alert-danger mt-3 py-2" role="alert">
                        <small>Please enter a valid email address.</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-5">
          <div className="container">
            <div className="row g-4">
              {/* Company Info */}
              <div className="col-lg-4 col-md-6">
                <div className="mb-4">
                  <h4 className="fw-bold text-gradient mb-3">Mwanamama Enterprises Ltd</h4>
                  <p className="text-light opacity-75 lh-lg mb-4">
                    Your trusted online destination for quality products and exceptional service. We're here to make your shopping experience memorable.
                  </p>
                </div>
                
                {/* Social Links */}
                <div className="d-flex gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="btn btn-outline-light rounded-circle social-btn"
                      aria-label={link.label}
                      style={{width: '45px', height: '45px'}}
                    >
                      <link.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links & Customer Service */}
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title} className="col-lg-2 col-md-3 col-sm-6">
                  <h6 className="fw-semibold text-white mb-3">{title}</h6>
                  <ul className="list-unstyled">
                    {links.map((link) => (
                      <li key={link.name} className="mb-2">
                        <a
                          href={link.href}
                          className="text-light opacity-75 text-decoration-none footer-link"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Info */}
              <div className="col-lg-4 col-md-6">
                <h6 className="fw-semibold text-white mb-3">Get in Touch</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon bg-primary bg-opacity-20 rounded-3 p-2 me-3 flex-shrink-0">
                        <Mail size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-light opacity-50 small">Email</div>
                        <a href="mailto:hello@mwanamama.co.ke" className="text-light text-decoration-none footer-link">
                          hello@mwanamama.co.ke
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon bg-success bg-opacity-20 rounded-3 p-2 me-3 flex-shrink-0">
                        <Phone size={18} className="text-success" />
                      </div>
                      <div>
                        <div className="text-light opacity-50 small">Phone</div>
                        <a href="#" className="text-light text-decoration-none footer-link">
                         +254729814363
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="d-flex align-items-start">
                      <div className="contact-icon bg-info bg-opacity-20 rounded-3 p-2 me-3 flex-shrink-0">
                        <MapPin size={18} className="text-info" />
                      </div>
                      <div>
                        <div className="text-light opacity-50 small">Location</div>
                        <div className="text-light">Tana River, Kenya</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top border-secondary py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0 text-light opacity-50 small">
                  © {new Date().getFullYear()} Mwanamama Enterprises Ltd. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-3">
                  <a href="#" className="text-light opacity-50 text-decoration-none small footer-link">Privacy Policy</a>
                  <a href="#" className="text-light opacity-50 text-decoration-none small footer-link">Terms of Service</a>
                  <a href="#" className="text-light opacity-50 text-decoration-none small footer-link">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .bg-gradient-newsletter {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .text-gradient {
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .placeholder-text-light::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
            opacity: 1;
          }
          
          .footer-link {
            transition: all 0.3s ease;
          }
          
          .footer-link:hover {
            opacity: 1 !important;
            color: #667eea !important;
            transform: translateX(5px);
          }
          
          .social-btn {
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .social-btn:hover {
            background-color: #667eea !important;
            border-color: #667eea !important;
            color: #fff !important;
            transform: translateY(-2px);
          }
          
          .contact-icon {
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 99;
            width: 50px;
            height: 50px;
            background: linear-gradient(45deg, #667eea, #764ba2) !important;
            border: none;
            transition: all 0.3s ease;
          }
          
          .back-to-top:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }
        `}</style>
      </footer>
      
      {/* Back to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="btn btn-primary rounded-circle shadow back-to-top d-flex align-items-center justify-content-center"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};

export default Footer;