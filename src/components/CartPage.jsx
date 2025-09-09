// src/components/CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Shield, Truck, RotateCcw, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartItem from './CartItem';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateItemQuantity, 
    toggleWishlist 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEW: State for loading
  const navigate = useNavigate();

  // NEW: Simulate data fetching with a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Wait 1 second to simulate loading

    return () => clearTimeout(timer);
  }, []);

  const handleMoveToWishlist = (item) => {
    toggleWishlist(item);
    removeFromCart(item.id);
  };
 
  const applyPromoCode = () => {
    if (!promoCode.trim()) return;
    
    setIsCheckingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      const validCodes = {
        'SAVE10': { type: 'percentage', value: 10, description: '10% off your order' },
        'FLAT500': { type: 'fixed', value: 500, description: 'KSh 500 off your order' },
      };

      if (validCodes[promoCode.toUpperCase()]) {
        setAppliedPromo({
          code: promoCode.toUpperCase(),
          ...validCodes[promoCode.toUpperCase()]
        });
      } else {
        alert('Invalid promo code');
      }
      setIsCheckingPromo(false);
    }, 1000);
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout'); 
    } else {
      alert("Your cart is empty!");
    }
  };
  
  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'fixed') {
      discount = appliedPromo.value;
    }
  }

  // UPDATED: Shipping cost and calculation removed
  const total = subtotal - discount;

  // NEW: Skeleton Loader Component
  const CartSkeleton = () => (
    <div className="row">
      <div className="col-lg-8">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="card mb-4 shadow-sm border-0 animated-bg" style={{height: '150px'}}>
            <div className="card-body">
              <div className="row g-0 h-100">
                <div className="col-md-3 animated-bg-shimmer rounded" style={{ height: '120px' }}></div>
                <div className="col-md-9 d-flex flex-column justify-content-center p-3">
                  <div className="animated-bg-shimmer mb-2 rounded" style={{ height: '20px', width: '80%' }}></div>
                  <div className="animated-bg-shimmer mb-2 rounded" style={{ height: '16px', width: '60%' }}></div>
                  <div className="animated-bg-shimmer rounded" style={{ height: '16px', width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 sticky-top" style={{top: '20px'}}>
          <div className="card-body">
            <div className="animated-bg-shimmer rounded mb-3" style={{ height: '30px', width: '70%' }}></div>
            <div className="animated-bg-shimmer rounded mb-2" style={{ height: '16px', width: '100%' }}></div>
            <div className="animated-bg-shimmer rounded mb-2" style={{ height: '16px', width: '80%' }}></div>
            <div className="animated-bg-shimmer rounded mb-4" style={{ height: '16px', width: '90%' }}></div>
            <div className="animated-bg-shimmer rounded" style={{ height: '50px', width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <style>
        {`
          .animated-bg {
            background-color: #f6f7f9;
            animation: pulse-bg 1s infinite;
          }
          .animated-bg-shimmer {
            background-color: #e2e4e6;
            animation: pulse-bg 1s infinite;
          }
          @keyframes pulse-bg {
            0% { background-color: #e2e4e6; }
            50% { background-color: #f6f7f9; }
            100% { background-color: #e2e4e6; }
          }
        `}
      </style>

      <div className="container my-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
            <ShoppingCart className="me-2" size={32} />
            Shopping Cart
          </h2>
          <p className="text-muted">
            {isLoading ? 'Loading...' : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {isLoading ? (
          <CartSkeleton />
        ) : cartItems.length > 0 ? (
          <div className="row">
            <div className="col-lg-8">
              <div className="mb-4">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    // Pass the context functions as props
                    onUpdateQuantity={updateItemQuantity}
                    onRemove={removeFromCart}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                ))}
              </div>

              <button 
                onClick={() => navigate('/products')}
                className="btn btn-outline-primary"
                style={{borderRadius: '25px'}}
              >
                Continue Shopping
              </button>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
                <div className="card-header bg-white border-0">
                  <h5 className="fw-bold mb-0" style={{color: '#2c3e50'}}>Order Summary</h5>
                </div>
                
                <div className="card-body">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Promo Code</label>
                    {!appliedPromo ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button 
                          className="btn btn-outline-primary"
                          onClick={applyPromoCode}
                          disabled={isCheckingPromo}
                        >
                          {isCheckingPromo ? 'Checking...' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center bg-success bg-opacity-10 p-3 rounded">
                        <div>
                          <strong className="text-success">{appliedPromo.code}</strong>
                          <small className="d-block text-muted">{appliedPromo.description}</small>
                        </div>
                        <button className="btn btn-sm btn-outline-danger" onClick={removePromoCode}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>You saved</span>
                        <span>-KSh {savings.toLocaleString()}</span>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Promo discount</span>
                        <span>-KSh {discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <hr />
                    
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold fs-5">Total</span>
                      <span className="fw-bold fs-5" style={{color: '#667eea'}}>
                        KSh {total.toLocaleString()}
                      </span>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="btn text-white w-100 py-3 mb-3"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '25px'
                      }}
                    >
                      Proceed to Checkout
                      <ArrowRight size={18} className="ms-2" />
                    </button>

                    <div className="row text-center small text-muted">
                      <div className="col-4">
                        <Shield size={24} className="text-success mb-1 d-block mx-auto" />
                        <small>Secure Payment</small>
                      </div>
                      <div className="col-4">
                        <Truck size={24} className="text-primary mb-1 d-block mx-auto" />
                        <small>Fast Delivery</small>
                      </div>
                      <div className="col-4">
                        <RotateCcw size={24} className="text-warning mb-1 d-block mx-auto" />
                        <small>Easy Returns</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-4">
              <ShoppingCart size={80} className="text-muted" />
            </div>
            <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Your cart is empty</h3>
            <p className="text-muted mb-4">
              Add items to your cart to get started with your order
            </p>
            <button 
              onClick={() => navigate('/products')}
              className="btn text-white px-5 py-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;