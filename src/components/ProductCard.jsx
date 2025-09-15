// src/components/ProductCard.js
import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

// Use a placeholder image URL
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Product+Image';

const ProductCard = ({ 
  product, 
  onViewDetails, 
  addToCart, 
  toggleWishlist, 
  cartItems, 
  wishlistItems,
  showPrice // This is the key prop
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine the product's state based on the props
  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const isProductInCart = cartItems.some(item => item.id === product.id);

  const productName = product.name || product.title || 'Product Name';
  const productDescription = product.description || 'No description available';
  const productPrice = parseFloat(product.price || 0);
  const rating = parseFloat(product.rating || 4.5);
  const reviews = parseInt(product.reviews || product.reviewCount || 0);
  
  // Use the image from props, or the placeholder as a fallback
  const productImage = product.image || product.imageUrl || PLACEHOLDER_IMAGE_URL;

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div className="h-100">
      <div 
        className="card h-100 border-0 shadow-sm position-relative overflow-hidden"
        style={{
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="position-absolute top-0 start-0 z-3 p-2">
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

        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(); }} 
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle p-2 z-3 border-0"
          style={{
            width: '35px',
            height: '35px',
            backgroundColor: isWishlisted ? '#ff4757' : 'rgba(255,255,255,0.9)'
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? 'white' : 'none'} 
            color={isWishlisted ? 'white' : '#666'} 
          />
        </button>

        <div className="position-relative overflow-hidden" onClick={() => onViewDetails(product)}>
          {hasError ? (
            <div 
              className="card-img-top d-flex align-items-center justify-content-center bg-light"
              style={{ height: '180px' }}
            >
              <div className="text-center text-muted">
                <img src={PLACEHOLDER_IMAGE_URL} alt="Placeholder" style={{ height: '180px', objectFit: 'cover' }} />
              </div>
            </div>
          ) : (
            <img
              src={productImage}
              className="card-img-top"
              alt={productName}
              onError={handleImageError}
              style={{
                height: '180px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
            />
          )}
          
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            <button 
              className="btn btn-light rounded-circle me-2 p-2"
              onClick={() => onViewDetails(product)}
              title="Quick view"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex me-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(rating) ? '#ffd700' : 'none'}
                  color={i < Math.floor(rating) ? '#ffd700' : '#ddd'}
                />
              ))}
            </div>
            <small className="text-muted" style={{ fontSize: '10px' }}>
              ({reviews > 0 ? reviews : 'No reviews'})
            </small>
          </div>

          <h6 className="card-title fw-bold mb-2" style={{color: '#2c3e50', fontSize: '13px', lineHeight: '1.2'}}>
            {productName.length > 45 ? `${productName.substring(0, 45)}...` : productName}
          </h6>

          <p
            className="card-text text-muted small mb-3 flex-grow-1"
            style={{
              fontSize: '11px',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.2'
            }}
          >
            {productDescription}
          </p>

          <div className="mt-auto">
            <div className="mb-2">
              {showPrice ? (
                <span className="h6 fw-bold mb-0" style={{color: '#667eea', fontSize: '14px'}}>
                  KSh {productPrice.toLocaleString()}
                </span>
              ) : (
                <small className="text-muted fst-italic"></small>
              )}
              {product.originalPrice && product.originalPrice > productPrice && (
                <>
                  <span className="text-muted text-decoration-line-through small ms-2" style={{ fontSize: '11px' }}>
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="badge bg-success ms-2" style={{ fontSize: '10px' }}>
                    {Math.round(((product.originalPrice - productPrice) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            
            {product.brandName && (
              <div className="mb-2">
                <small className="text-muted" style={{ fontSize: '10px' }}>Brand: {product.brandName}</small>
              </div>
            )}
          </div>

          {product.inStock === false && (
            <div className="mb-2">
              <span className="badge bg-danger" style={{ fontSize: '10px' }}>Out of Stock</span>
            </div>
          )}

          {product.availableStock > 0 && product.availableStock <= 5 && (
            <div className="mb-2">
              <small className="text-warning" style={{ fontSize: '10px' }}>Only {product.availableStock} left in stock!</small>
            </div>
          )}

          <button 
            className="btn mt-2 text-white fw-semibold w-100"
            style={{
              background: product.inStock === false 
                ? '#6c757d' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '11px'
            }}
            onClick={(e) => { e.stopPropagation(); addToCart(); }}
            disabled={isProductInCart || product.inStock === false}
          >
            {isProductInCart ? (
              <>
                <ShoppingCart size={12} className="me-1" />
                In Cart
              </>
            ) : product.inStock === false ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={12} className="me-1" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;