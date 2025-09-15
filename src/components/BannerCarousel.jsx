// src/components/BannerCarousel.jsx
// Enhanced BannerCarousel component with shopping functionality and skeleton loader

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Star, Eye, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// --- Skeleton Loader Component ---
const SkeletonLoader = () => {
  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-12">
          <div 
            className="position-relative overflow-hidden rounded-4 shadow-lg bg-white"
            style={{ minHeight: '500px' }}
          >
            <div className="row g-0 h-100">
              <div className="col-lg-7 col-xl-6 d-flex align-items-center">
                <div className="p-5 w-100">
                  {/* Badge skeleton */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="skeleton-shimmer me-2" style={{ width: '20px', height: '20px', borderRadius: '50%' }}></div>
                    <div className="skeleton-shimmer me-2" style={{ width: '120px', height: '28px', borderRadius: '20px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '80px', height: '24px', borderRadius: '20px' }}></div>
                  </div>

                  {/* Title skeleton */}
                  <div className="mb-3">
                    <div className="skeleton-shimmer mb-2" style={{ width: '85%', height: '48px', borderRadius: '8px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '65%', height: '48px', borderRadius: '8px' }}></div>
                  </div>

                  {/* Brand skeleton */}
                  <div className="mb-3">
                    <div className="skeleton-shimmer" style={{ width: '200px', height: '20px', borderRadius: '4px' }}></div>
                  </div>

                  {/* Rating skeleton */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="d-flex gap-1 me-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-shimmer" style={{ width: '16px', height: '16px', borderRadius: '2px' }}></div>
                      ))}
                    </div>
                    <div className="skeleton-shimmer" style={{ width: '100px', height: '16px', borderRadius: '4px' }}></div>
                  </div>

                  {/* Description skeleton */}
                  <div className="mb-4">
                    <div className="skeleton-shimmer mb-2" style={{ width: '100%', height: '20px', borderRadius: '4px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '80%', height: '20px', borderRadius: '4px' }}></div>
                  </div>

                  {/* Price skeleton */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="skeleton-shimmer" style={{ width: '150px', height: '36px', borderRadius: '6px' }}></div>
                    </div>
                    <div className="skeleton-shimmer" style={{ width: '100px', height: '24px', borderRadius: '20px' }}></div>
                  </div>

                  {/* Buttons skeleton */}
                  <div className="d-flex gap-3">
                    <div className="skeleton-shimmer" style={{ width: '160px', height: '50px', borderRadius: '25px' }}></div>
                    <div className="skeleton-shimmer" style={{ width: '140px', height: '50px', borderRadius: '25px' }}></div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-xl-6 position-relative">
                <div className="position-relative h-100 d-flex align-items-center justify-content-center p-4">
                  {/* Background circle skeleton */}
                  <div 
                    className="position-absolute skeleton-shimmer"
                    style={{
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(1.2)',
                      opacity: 0.3
                    }}
                  />
                  
                  {/* Main image skeleton */}
                  <div 
                    className="position-relative skeleton-shimmer"
                    style={{
                      width: '350px',
                      height: '350px',
                      borderRadius: '1rem'
                    }}
                  />

                  {/* Status badge skeleton */}
                  <div 
                    className="position-absolute skeleton-shimmer"
                    style={{
                      top: '20%',
                      right: '10%',
                      width: '80px',
                      height: '32px',
                      borderRadius: '0.75rem'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation buttons skeleton */}
            <div className="skeleton-shimmer position-absolute top-50 start-0 translate-middle-y ms-3" 
                 style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
            <div className="skeleton-shimmer position-absolute top-50 end-0 translate-middle-y me-3" 
                 style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>

            {/* Pagination dots skeleton */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
              <div className="d-flex align-items-center gap-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="skeleton-shimmer"
                    style={{
                      width: index === 0 ? '32px' : '8px',
                      height: '8px',
                      borderRadius: '4px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End Skeleton Loader Component ---

// --- New Modal Component ---
const ProductDetailsModal = ({ product, onClose, onAddToCart, showPrice }) => {
  if (!product) return null;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-dialog-custom modal-xl modal-dialog-centered">
        <div className="modal-content-custom rounded-4 shadow-lg border-0">
          <div className="modal-header-custom p-4 border-bottom-0 position-relative">
            <h5 className="modal-title fw-bold text-dark">{product.name || product.title}</h5>
            <button type="button" className="btn-close-custom" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body-custom p-4">
            <div className="row g-4">
              <div className="col-md-6 d-flex justify-content-center align-items-center">
                {showPrice ? (
                  <div 
                    className="rounded-4 overflow-hidden shadow-sm"
                    style={{ width: '100%', maxWidth: '400px', height: 'auto', aspectRatio: '1 / 1' }}
                  >
                    <img src={product.image} alt={product.title} className="w-100 h-100 object-fit-cover" />
                  </div>
                ) : (
                  // Inside BannerCarousel.jsx, find the main display block and replace it with this:

<div 
  className="position-relative rounded-4 overflow-hidden shadow-lg"
  style={{
    width: '350px',
    height: '350px',
    transform: imageLoaded ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-5deg)',
    opacity: imageLoaded ? 1 : 0,
    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer'
  }}
  onClick={handleLearnMore}
  title="Click to view details"
>
  <img
    src={currentBanner.image}
    alt={currentBanner.title}
    className="w-100 h-100 object-fit-cover"
    onLoad={() => setImageLoaded(true)}
    onError={(e) => {
      // Fallback image in case the main image fails to load
      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop';
      setImageLoaded(true);
    }}
  />
</div>
                )}
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <span className="badge bg-primary text-white px-3 py-1 rounded-pill fw-semibold me-2">{product.category}</span>
                  {product.brandName && (
                    <span className="text-primary small fw-semibold">by {product.brandName}</span>
                  )}
                </div>
                <h2 className="fw-bold mb-2 display-6">{product.title}</h2>
                <div className="d-flex align-items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={`${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                  <span className="ms-2 text-muted small fw-semibold">{product.rating}</span>
                  <span className="text-muted small ms-2">({product.reviews} reviews)</span>
                </div>
                <p className="text-muted mb-4">{product.description}</p>
                
                <div className="mb-4">
                  {showPrice ? (
                    <h3 className="h2 fw-bold text-success">KSh {product.unitPrice.toLocaleString()}</h3>
                  ) : (
                    <small className="text-muted fst-italic">Log in to see price</small>
                  )}
                  <div className="mt-2">
                    <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'} fw-normal`}>
                      {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="btn btn-lg px-5 py-3 fw-semibold text-white border-0 rounded-pill shadow-sm"
                    disabled={!product.inStock}
                    style={{
                      background: product.gradient,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ShoppingBag size={20} className="me-2" />
                    Add to Cart
                  </button>
                  <button onClick={onClose} className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold rounded-pill">
                    <X size={18} className="me-2" />
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End New Modal Component ---

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
];

const BannerCarousel = ({ onViewDetails }) => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPrice, setShowPrice] = useState(false); 

  const [modalProduct, setModalProduct] = useState(null);

  const { addToCart } = useCart();

  const getAuthToken = () => {
    try {
      const { useAdminAuth } = require('../contexts/AdminAuthContext');
      const { adminToken } = useAdminAuth();
      if (adminToken) return adminToken;
    } catch (error) {
      // AdminAuthContext not available
    }

    try {
      const { useAuth } = require('../contexts/AuthContext');
      const { token } = useAuth();
      if (token) return token;
    } catch (error) {
      // AuthContext not available
    }

    return localStorage.getItem('adminToken') || localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  const getFallbackProducts = () => {
    return [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop',
        title: 'Premium Wireless Headphones',
        subtitle: 'NEW ARRIVAL',
        description: 'Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation.',
        cta: 'Shop Now',
        gradient: gradients[0],
        unitPrice: 299.99,
        rating: 4.8,
        reviews: 456,
        category: 'Electronics',
        brandName: 'AudioTech',
        inStock: true,
        stockCount: 25,
        name: 'Premium Wireless Headphones',
        price: 299.99
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        title: 'Smart Watch Pro',
        subtitle: 'NEW ARRIVAL',
        description: 'Stay connected and track your fitness with advanced health monitoring features.',
        cta: 'Shop Now',
        gradient: gradients[1],
        unitPrice: 399.99,
        rating: 4.6,
        reviews: 324,
        category: 'Electronics',
        brandName: 'TechPro',
        inStock: true,
        stockCount: 15,
        name: 'Smart Watch Pro',
        price: 399.99
      }
    ];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const authToken = getAuthToken();
        const isLoggedIn = !!authToken; 
        setShowPrice(isLoggedIn); 

        // Conditional API endpoint based on login status
        const apiUrl = isLoggedIn 
          ? 'https://api.mwanamama.org/api/v1/products/list' 
          : 'https://api.mwanamama.org/api/v1/products/list/all/for/ecommerce';

        const config = isLoggedIn ? {
          headers: { 'Authorization': `Bearer ${authToken}` }
        } : {};

        const response = await axios.get(apiUrl, config);

        let productsArray;
        if (response.data.content && Array.isArray(response.data.content)) {
          productsArray = response.data.content;
        } else if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data.products && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data;
        } else {
          productsArray = [];
        }

        const productsWithImages = productsArray.filter(product => 
          product.imageUrl && 
          product.imageUrl.trim() !== '' && 
          product.imageUrl !== '/api/placeholder/300/200'
        );

        if (productsWithImages.length === 0) {
          throw new Error('No products with images found to display from API. Using fallback data.');
        }

        const shuffledProducts = productsWithImages.sort(() => 0.5 - Math.random());
        let selectedProducts;
        if (shuffledProducts.length >= 5) {
          selectedProducts = shuffledProducts.slice(0, 5);
        } else {
          selectedProducts = [...shuffledProducts];
        }

        const bannerData = selectedProducts.map((product, index) => {
          const originalPrice = parseFloat(product.unitPrice || product.price || 0);

          return {
            id: product.id,
            image: product.imageUrl,
            title: product.itemName || 'Premium Product',
            subtitle: 'NEW ARRIVAL',
            description: product.description || 'High-quality product with excellent features and premium materials.',
            cta: 'Shop Now',
            gradient: gradients[index % gradients.length],
            unitPrice: originalPrice,
            rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
            reviews: Math.floor(Math.random() * 500) + 50,
            category: product.category?.categoryName || 'Featured',
            subCategory: product.subCategory?.subCategoryName || '',
            brandName: product.brandName || 'Premium Brand',
            itemCode: product.itemCode || '',
            stockCount: Math.max(1, parseInt(product.currentStock || 0) - parseInt(product.reservedStock || 0)),
            inStock: (parseInt(product.currentStock || 0) - parseInt(product.reservedStock || 0)) > 0,
            name: product.itemName || 'Premium Product',
            price: originalPrice
          };
        });

        setBanners(bannerData);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Displaying fallback data.');
        setBanners(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  const handleShopNow = async () => {
    const currentBanner = banners[current];
    if (isAddingToCart || !currentBanner.inStock) return;

    setIsAddingToCart(true);

    try {
      const cartItem = {
        id: currentBanner.id,
        name: currentBanner.name || currentBanner.title,
        description: currentBanner.description,
        price: currentBanner.price || currentBanner.unitPrice,
        image: currentBanner.image,
        quantity: 1,
        inStock: currentBanner.inStock,
        brandName: currentBanner.brandName,
        category: currentBanner.category,
        itemCode: currentBanner.itemCode
      };

      await addToCart(cartItem);

      toast.success(
        <div>
          <strong>{currentBanner.name || currentBanner.title}</strong> added to cart!
          <div className="mt-2">
            <button 
              className="btn btn-sm btn-primary me-2"
              onClick={() => {
                window.location.hash = '#/cart';
                toast.dismiss();
              }}
            >
              View Cart
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => toast.dismiss()}
            >
              Continue Shopping
            </button>
          </div>
        </div>,
        {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false
        }
      );

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLearnMore = () => {
    setModalProduct(banners[current]);
  };

  const handleCloseModal = () => {
    setModalProduct(null);
  };

  const handleAddToCartFromModal = async (product) => {
    try {
        await addToCart({
            id: product.id,
            name: product.name || product.title,
            description: product.description,
            price: product.price || product.unitPrice,
            image: product.image,
            quantity: 1,
            inStock: product.inStock,
            brandName: product.brandName,
            category: product.category,
            itemCode: product.itemCode
        });

        toast.success(
            <div>
                <strong>{product.name || product.title}</strong> added to cart!
            </div>,
            { autoClose: 3000 }
        );
        handleCloseModal();
    } catch (error) {
        console.error('Error adding to cart from modal:', error);
        toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const prev = () => {
    setImageLoaded(false);
    setCurrent((current - 1 + banners.length) % banners.length);
  };
  
  const next = () => {
    setImageLoaded(false);
    setCurrent((current + 1) % banners.length);
  };

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      setImageLoaded(false);
      setCurrent((current) => (current + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  useEffect(() => {
    const timer = setTimeout(() => setImageLoaded(true), 200);
    return () => clearTimeout(timer);
  }, [current]);

  if (loading) {
    return <SkeletonLoader />;
  }

  const currentBanner = banners[current];

  if (!currentBanner) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger text-center rounded-4" style={{ minHeight: '500px' }} role="alert">
              <div className="d-flex flex-column justify-content-center h-100">
                <h4 className="alert-heading">No Products Found</h4>
                <p>We were unable to load any products at this time. Please check your internet connection or try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
      
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <div 
              className="position-relative overflow-hidden rounded-4 shadow-lg bg-white"
              style={{ minHeight: '500px' }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background: currentBanner.gradient,
                  opacity: 0.05,
                  transition: 'all 1s ease'
                }}
              />

              <div className="row g-0 h-100">
                <div className="col-lg-7 col-xl-6 d-flex align-items-center">
                  <div className="p-5">
                    <div 
                      className="d-flex align-items-center mb-3"
                      style={{
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.1s'
                      }}
                    >
                      <Sparkles size={18} className="me-2 text-warning" />
                      <span className="badge text-dark fw-semibold px-3 py-2 rounded-pill me-2" 
                        style={{
                          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                          fontSize: '0.75rem',
                          letterSpacing: '0.5px'
                        }}>
                        {'NEW ARRIVAL'}
                      </span>
                      {currentBanner.category && (
                        <span className="badge bg-secondary text-white px-2 py-1 rounded-pill small">
                          {currentBanner.category}
                        </span>
                      )}
                    </div>

                    <h1 
                      className="display-5 fw-bold text-dark mb-2 lh-sm"
                      style={{
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.2s'
                      }}
                    >
                      {currentBanner.title}
                    </h1>

                    {(currentBanner.brandName || currentBanner.itemCode) && (
                      <div 
                        className="mb-3"
                        style={{
                          transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                          opacity: imageLoaded ? 1 : 0,
                          transition: 'all 0.6s ease 0.22s'
                        }}
                      >
                        {currentBanner.brandName && (
                          <span className="text-primary fw-semibold me-3">by {currentBanner.brandName}</span>
                        )}
                        {currentBanner.itemCode && (
                          <span className="text-muted small">Code: {currentBanner.itemCode}</span>
                        )}
                      </div>
                    )}

                    <div 
                      className="d-flex align-items-center mb-3"
                      style={{
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.25s'
                      }}
                    >
                      <div className="d-flex align-items-center me-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={`${i < Math.floor(currentBanner.rating) ? 'text-warning' : 'text-muted'}`}
                            fill={i < Math.floor(currentBanner.rating) ? 'currentColor' : 'none'}
                          />
                        ))}
                        <span className="ms-2 text-muted small fw-semibold">{currentBanner.rating}</span>
                      </div>
                      <span className="text-muted small">({currentBanner.reviews} reviews)</span>
                    </div>

                    <p 
                      className="text-muted mb-4 lh-sm"
                      style={{
                        fontSize: '1.1rem',
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.3s',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {currentBanner.description}
                    </p>

                    <div 
                      className="mb-4"
                      style={{
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.35s'
                      }}
                    >
                      {showPrice ? (
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <span className="h2 fw-bold text-success mb-0">
                            KSh {currentBanner.unitPrice.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="mb-2">
                          <small className="text-muted fst-italic">Log in to see price</small>
                        </div>
                      )}
                      
                      <div className="mt-2">
                        <span className={`badge ${currentBanner.inStock ? 'bg-success' : 'bg-danger'} fw-normal`}>
                          {currentBanner.inStock ? `${currentBanner.stockCount} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    <div 
                      style={{
                        transform: imageLoaded ? 'translateY(0)' : 'translateY(1rem)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.4s'
                      }}
                    >
                      <button 
                        onClick={handleShopNow}
                        className="btn btn-lg px-5 py-3 fw-semibold text-white border-0 rounded-pill shadow-sm me-3"
                        disabled={!currentBanner.inStock || isAddingToCart}
                        style={{
                          background: currentBanner.inStock ? currentBanner.gradient : '#6c757d',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          minWidth: '160px'
                        }}
                        onMouseEnter={(e) => {
                          if (currentBanner.inStock && !isAddingToCart) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                      >
                        {isAddingToCart ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding...
                          </>
                        ) : !currentBanner.inStock ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingBag size={20} className="me-2" />
                            {currentBanner.cta}
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={handleLearnMore}
                        className="btn btn-outline-secondary btn-lg px-4 py-3 fw-semibold rounded-pill"
                        style={{ fontSize: '1.1rem' }}
                      >
                        <Eye size={18} className="me-2" />
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5 col-xl-6 position-relative">
                  <div className="position-relative h-100 d-flex align-items-center justify-content-center p-4">
                    <div 
                      className="position-absolute rounded-circle"
                      style={{
                        width: '300px',
                        height: '300px',
                        background: currentBanner.gradient,
                        opacity: 0.1,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) scale(1.2)',
                        transition: 'all 1s ease'
                      }}
                    />
                    
                    {showPrice ? (
                      <div 
                        className="position-relative rounded-4 overflow-hidden shadow-lg"
                        style={{
                          width: '350px',
                          height: '350px',
                          transform: imageLoaded ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-5deg)',
                          opacity: imageLoaded ? 1 : 0,
                          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          cursor: 'pointer'
                        }}
                        onClick={handleLearnMore}
                        title="Click to view details"
                      >
                        <img
                          src={currentBanner.image}
                          alt={currentBanner.title}
                          className="w-100 h-100 object-fit-cover"
                          onLoad={() => setImageLoaded(true)}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop';
                            setImageLoaded(true);
                          }}
                        />
                        <div 
                          className="position-absolute bottom-0 start-0 w-100 h-50"
                          style={{
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.1))'
                          }}
                        />
                        
                        <div 
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.opacity = 1}
                          onMouseLeave={(e) => e.target.style.opacity = 0}
                        >
                          <div className="text-center text-white">
                            <Eye size={32} className="mb-2" />
                            <div>View Details</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="position-relative rounded-4 overflow-hidden shadow-lg d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{
                          width: '350px',
                          height: '350px',
                          transform: 'scale(1)',
                          opacity: 1,
                          transition: 'all 0.8s',
                          cursor: 'pointer'
                        }}
                        onClick={handleLearnMore}
                        title="Click to view details"
                      >
                        <div className="text-center">
                          <Eye size={32} className="mb-2" />
                          <div>Image available after login</div>
                        </div>
                      </div>
                    )}

                    <div 
                      className="position-absolute bg-white rounded-3 shadow-sm p-3"
                      style={{
                        top: '20%',
                        right: '10%',
                        transform: imageLoaded ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0)',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'all 0.6s ease 0.5s'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className={`${currentBanner.inStock ? 'bg-success' : 'bg-danger'} rounded-circle me-2`} style={{ width: '8px', height: '8px' }} />
                        <small className={`fw-semibold ${currentBanner.inStock ? 'text-success' : 'text-danger'}`}>
                          {currentBanner.inStock ? 'In Stock' : 'Out of Stock'}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {banners.length > 1 && (
                <>
                  <button 
                    onClick={prev}
                    className="btn position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle border-0 shadow-sm"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button 
                    onClick={next}
                    className="btn position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle border-0 shadow-sm"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {banners.length > 1 && (
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <div className="d-flex align-items-center gap-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setImageLoaded(false);
                          setCurrent(index);
                        }}
                        className="border-0 rounded-pill"
                        style={{
                          width: index === current ? '32px' : '8px',
                          height: '8px',
                          backgroundColor: index === current ? '#007bff' : 'rgba(0,123,255,0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductDetailsModal 
        product={modalProduct} 
        onClose={handleCloseModal}
        onAddToCart={handleAddToCartFromModal}
        showPrice={showPrice} 
      />

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossOrigin="anonymous"></script>

      <style jsx>{`
        .object-fit-cover {
          object-fit: cover;
        }
        
        .btn:hover {
          transform: translateY(-2px) !important;
        }
        
        @media (max-width: 991.98px) {
          .col-lg-7 {
            order: 2;
          }
          .col-lg-5 {
            order: 1;
          }
        }

        /* --- Skeleton Loader Styles --- */
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Dark mode skeleton styles */
        @media (prefers-color-scheme: dark) {
          .skeleton-shimmer {
            background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
            background-size: 200% 100%;
          }
        }
        /* --- End Skeleton Loader Styles --- */

        /* --- Custom Modal Styles --- */
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-dialog-custom {
          max-width: 900px;
          margin: 1.75rem auto;
          position: relative;
          pointer-events: none;
          animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .modal-content-custom {
          position: relative;
          display: flex;
          flex-direction: column;
          background-color: var(--bs-body-bg);
          background-clip: padding-box;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 0.5rem;
          outline: 0;
          pointer-events: auto;
        }

        .modal-header-custom {
          padding: 1.5rem 1.5rem 0.5rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body-custom {
          padding: 1.5rem;
        }

        .btn-close-custom {
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        
        .btn-close-custom:hover {
          opacity: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* --- End Custom Modal Styles --- */
      `}</style>
    </>
  );
};

export default BannerCarousel;