// src/components/ProductListCard.js
import React, { useState, useRef } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductListCard = ({ product, onViewDetails, onShowToast, showPrice }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, toggleWishlist, wishlistItems } = useCart();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const productName = product.name || product.title || 'Product Name';
  const productDescription = product.description || 'No description available';
  const productPrice = parseFloat(product.price || 0);
  const rating = parseFloat(product.rating || 4.5);
  const reviews = parseInt(product.reviews || product.reviewCount || 0);
  const productImage = product.image || product.imageUrl || '/api/placeholder/300/200';

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      const cartItem = {
        id: product.id,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
        inStock: product.inStock !== false
      };
      
      await addToCart(cartItem);
      
      // if (onShowToast) {
      //   onShowToast(`${productName} added to cart!`, 'success');
      // }
    } catch (error) {
      // console.error('Error adding to cart:', error);
      // if (onShowToast) {
      //   onShowToast('Failed to add item to cart', 'error');
      // }
    } finally {
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: productName,
      price: productPrice,
      image: productImage,
      rating: rating,
      reviews: reviews
    });
    
    // if (onShowToast) {
    //   if (isWishlisted) {
    //     onShowToast(`${productName} removed from wishlist`, 'info');
    //   } else {
    //     onShowToast(`${productName} added to wishlist`, 'success');
    //   }
    // }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="card mb-3 border-0 shadow-sm">
      <div className="row g-0">
        <div className="col-md-3 col-lg-2">
          <div className="position-relative">
            {!imageError ? (
              <img
                src={productImage}
                className="img-fluid rounded-start"
                alt={productName}
                onError={handleImageError}
                style={{
                  height: '200px',
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div 
                className="d-flex align-items-center justify-content-center bg-light rounded-start"
                style={{ height: '200px' }}
              >
                <div className="text-center text-muted">
                  <ShoppingCart size={48} className="opacity-50 mb-2" />
                  <small>Image not available</small>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div className="position-absolute top-0 start-0 p-2">
              {product.isNew && (
                <span className="badge bg-success mb-1 d-block">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="badge bg-warning text-dark mb-1 d-block">BESTSELLER</span>
              )}
              {product.isTrending && (
                <span className="badge bg-info mb-1 d-block">TRENDING</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-7">
          <div className="card-body">
            <h5 className="card-title fw-bold" style={{color: '#2c3e50'}}>
              {productName}
            </h5>
            
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex me-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(rating) ? '#ffd700' : 'none'}
                    color={i < Math.floor(rating) ? '#ffd700' : '#ddd'}
                  />
                ))}
              </div>
              <small className="text-muted">
                ({reviews > 0 ? reviews : 'No reviews'})
              </small>
            </div>
            
            <p className="card-text text-muted mb-2">
              {productDescription.length > 150 
                ? `${productDescription.substring(0, 150)}...` 
                : productDescription
              }
            </p>
            
            {product.brandName && (
              <p className="card-text">
                <small className="text-muted">Brand: {product.brandName}</small>
              </p>
            )}
            
            <p className="card-text">
              <small className="text-muted">Category: {product.category}</small>
            </p>
            
            {product.availableStock > 0 && product.availableStock <= 5 && (
              <div className="mb-2">
                <small className="text-warning fw-bold">
                  Only {product.availableStock} left in stock!
                </small>
              </div>
            )}
          </div>
        </div>
        
        <div className="col-md-3 col-lg-3">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <div className="text-end mb-3">
              {/* UPDATED: Conditional rendering of the price */}
              {showPrice ? (
                <span className="h4 fw-bold" style={{color: '#667eea'}}>
                  KSh {productPrice.toLocaleString()}
                </span>
              ) : (
                <small className="text-muted fst-italic">Log in to see price</small>
              )}
              
              {product.inStock === false && (
                <div className="mt-2">
                  <span className="badge bg-danger">Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                onClick={handleViewDetails}
              >
                <Eye size={16} className="me-2" />
                Quick View
              </button>
              
              <button
                className="btn btn-sm text-white fw-semibold"
                style={{
                  background: product.inStock === false 
                    ? '#6c757d' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
                onClick={handleAddToCart}
                disabled={isAdding || product.inStock === false}
              >
                {isAdding ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Adding...
                  </>
                ) : product.inStock === false ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart size={14} className="me-2" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleToggleWishlist}
                style={{
                  backgroundColor: isWishlisted ? '#ff4757' : 'transparent',
                  color: isWishlisted ? 'white' : '#6c757d',
                  borderColor: isWishlisted ? '#ff4757' : '#6c757d'
                }}
              >
                <Heart
                  size={14}
                  className="me-2"
                  fill={isWishlisted ? 'white' : 'none'}
                />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;