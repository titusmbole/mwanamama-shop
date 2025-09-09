// src/components/Wishlist.js
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, X, Star, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const WishlistItem = ({ item, onRemove, onMoveToCart }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isRemoving, setIsRemoving] = React.useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div 
      className={`card mb-4 border-0 shadow-sm overflow-hidden ${isRemoving ? 'opacity-50' : ''}`}
      style={{
        transition: 'all 0.3s ease',
        transform: isRemoving ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      <div className="row g-0">
        {/* Product Image */}
        <div className="col-md-3">
          <div className="position-relative">
            <img
              src={item.image}
              className="img-fluid w-100 h-100"
              alt={item.name}
              style={{ height: '200px', objectFit: 'cover' }}
            />
            {/* Stock status badge */}
            <div className="position-absolute top-0 start-0 m-2">
              <span className={`badge ${item.inStock ? 'bg-success' : 'bg-danger'}`}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <div className="card-body h-100 d-flex flex-column">
            {/* Product Name */}
            <h5 className="card-title fw-bold mb-2" style={{color: '#2c3e50'}}>
              {item.name}
            </h5>

            {/* Rating */}
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex me-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(item.rating) ? '#ffd700' : 'none'}
                    color={i < Math.floor(item.rating) ? '#ffd700' : '#ddd'}
                  />
                ))}
              </div>
              <span className="text-muted small">({item.reviews} reviews)</span>
            </div>

            {/* Description limited to 2 lines */}
            <p 
              className="card-text text-muted small mb-3"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {item.description}
            </p>

            {/* Price */}
            <div className="mb-3">
              <span className="h5 fw-bold me-2" style={{color: '#667eea'}}>
                KSh {item.price.toLocaleString()}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <>
                  <span className="text-muted text-decoration-line-through small me-2">
                    KSh {item.originalPrice.toLocaleString()}
                  </span>
                  <span className="badge bg-success">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="d-flex align-items-center mb-3">
              <span className="me-3 small text-muted">Quantity:</span>
              <div className="d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{width: '35px', height: '35px'}}
                >
                  <Minus size={14} />
                </button>
                <span className="mx-3 fw-bold">{quantity}</span>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  style={{width: '35px', height: '35px'}}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="col-md-3">
          <div className="card-body h-100 d-flex flex-column justify-content-center">
            {/* Add to Cart Button */}
            <button 
              className="btn text-white fw-semibold mb-3 w-100"
              style={{
                background: item.inStock ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#6c757d',
                border: 'none',
                borderRadius: '25px',
                padding: '12px'
              }}
              disabled={!item.inStock}
              onClick={() => onMoveToCart(item, quantity)}
            >
              <ShoppingCart size={18} className="me-2" />
              {item.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Remove Button */}
            <button 
              className="btn btn-outline-danger w-100"
              style={{borderRadius: '25px', padding: '12px'}}
              onClick={handleRemove}
            >
              <Trash2 size={18} className="me-2" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Wishlist component
const Wishlist = () => {
  const { wishlistItems, toggleWishlist, addToCart, clearWishlist } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMoveToCart = (item, quantity) => {
    addToCart({ ...item, quantity: quantity });
    toggleWishlist(item);
  };
  
  const handleRemoveFromWishlist = (itemId) => {
    const itemToRemove = wishlistItems.find(item => item.id === itemId);
    if (itemToRemove) {
      toggleWishlist(itemToRemove);
    }
  };

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    inStockItems.forEach(item => {
      addToCart({ ...item, quantity: 1 });
    });
    clearWishlist();
  };

  const totalItems = wishlistItems.length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  // Skeleton Loader Component
  const WishlistSkeleton = () => (
    <>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm animated-bg" style={{height: '100px'}}></div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm animated-bg" style={{height: '100px'}}></div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="card mb-4 border-0 shadow-sm overflow-hidden animated-bg" style={{height: '200px'}}>
              <div className="row g-0 h-100">
                <div className="col-md-3 animated-bg-shimmer"></div>
                <div className="col-md-6 d-flex flex-column justify-content-center p-3">
                  <div className="animated-bg-shimmer mb-2 rounded" style={{ height: '25px', width: '70%' }}></div>
                  <div className="animated-bg-shimmer mb-2 rounded" style={{ height: '18px', width: '50%' }}></div>
                  <div className="animated-bg-shimmer mb-3 rounded" style={{ height: '14px', width: '90%' }}></div>
                  <div className="animated-bg-shimmer rounded" style={{ height: '14px', width: '40%' }}></div>
                </div>
                <div className="col-md-3 d-flex flex-column justify-content-center p-3">
                  <div className="animated-bg-shimmer mb-3 rounded" style={{ height: '50px', width: '100%' }}></div>
                  <div className="animated-bg-shimmer rounded" style={{ height: '50px', width: '100%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
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
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
              <Heart className="me-2 text-danger" size={32} />
              My Wishlist
            </h2>
            <p className="text-muted">
              {isLoading ? 'Loading...' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your wishlist`}
            </p>
          </div>
          
          {!isLoading && totalItems > 0 && (
            <button 
              className="btn btn-outline-danger"
              onClick={clearWishlist}
              style={{borderRadius: '25px'}}
            >
              <X size={18} className="me-2" />
              Clear All
            </button>
          )}
        </div>

        {isLoading ? (
          <WishlistSkeleton />
        ) : totalItems > 0 ? (
          <>
            {/* Wishlist Summary */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold" style={{color: '#667eea'}}>
                      Total Items
                    </h5>
                    <h3 className="text-dark">{totalItems}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold" style={{color: '#667eea'}}>
                      Total Value
                    </h5>
                    <h3 className="text-dark">KSh {totalValue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="row">
              <div className="col-12">
                {wishlistItems.map(item => (
                  <WishlistItem 
                    key={item.id} 
                    item={item} 
                    onRemove={handleRemoveFromWishlist}
                    onMoveToCart={handleMoveToCart}
                  />
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="row mt-4">
              <div className="col-md-6">
                <button 
                  onClick={() => navigate('/products')}
                  className="btn btn-outline-primary w-100 py-3"
                  style={{borderRadius: '25px'}}
                >
                  Continue Shopping
                </button>
              </div>
              <div className="col-md-6">
                <button 
                  className="btn text-white w-100 py-3"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '25px'
                  }}
                  onClick={handleAddAllToCart}
                >
                  <ShoppingCart size={18} className="me-2" />
                  Add All to Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty Wishlist */
          <div className="text-center py-5">
            <div className="mb-4">
              <Heart size={80} className="text-muted" />
            </div>
            <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>Your wishlist is empty</h3>
            <p className="text-muted mb-4">
              Browse our products and add items you love to your wishlist
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
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;