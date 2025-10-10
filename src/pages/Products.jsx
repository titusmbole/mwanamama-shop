import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import {
  Search, SlidersHorizontal, ArrowDownWideNarrow, Grid3X3, List, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductListCard from '../components/ProductListCard';
import { BASE_URL } from '../utils/helpers';
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/300x200.png?text=Product+Image';

// Skeleton Component for a single product card
const ProductCardSkeleton = () => (
  <div className="card h-100 shadow-sm border-0">
    <div className="card-img-top bg-light" style={{ height: '200px', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
    <div className="card-body">
      <div className="bg-light rounded mb-2" style={{ height: '20px', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
      <div className="bg-light rounded mb-2" style={{ height: '16px', width: '80%', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
      <div className="bg-light rounded mb-3" style={{ height: '24px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
      <div className="d-flex gap-2">
        <div className="bg-light rounded flex-grow-1" style={{ height: '36px', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
        <div className="bg-light rounded" style={{ height: '36px', width: '36px', animation: 'pulse 1.5s ease-in-out infinite alternate' }}></div>
      </div>
    </div>
  </div>
);

const Products = () => {
  const { adminToken } = useAdminAuth();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const authToken = adminToken || (user?.token || localStorage.getItem('userToken'));

  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastToastId, setLastToastId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State for sectional pagination
  const [sectionPages, setSectionPages] = useState({});
  const productsPerSection = 12;

  const { cartItems, wishlistItems, addToCart, toggleWishlist } = useCart();

  // Custom toast handler to prevent duplicates
  const showToast = (message, type = 'success') => {
    if (lastToastId) {
      toast.dismiss(lastToastId);
    }
    
    const toastId = toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    setLastToastId(toastId);
  };
  
  // Dedicated event handler for adding a product to the cart
  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`✅ ${product.name} added to cart!`, 'success');
  };

  // Dedicated event handler for toggling a product in the wishlist
  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      showToast(`💔 ${product.name} removed from wishlist.`, 'error');
    } else {
      showToast(`❤️ ${product.name} added to wishlist!`, 'info');
    }
  };
  
  // Custom logic for quick view add to cart
  const handleQuickViewAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      inStock: product.inStock
    });
    showToast(`✅ ${product.name} added to cart!`, 'success');
    handleCloseQuickView();
  };
  
  // Custom logic for quick view toggle wishlist
  const handleQuickViewToggleWishlist = (product) => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews
    });
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      showToast(`💔 ${product.name} removed from wishlist.`, 'error');
    } else {
      showToast(`❤️ ${product.name} added to wishlist!`, 'info');
    }
  };


  const sectionColors = useMemo(() => ([
    'bg-primary',
    'bg-info',
    'bg-success',
    'bg-warning',
    'bg-danger',
    'bg-secondary',
  ]), []);

  // Improved shuffle function with Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const transformAndAugmentProducts = useCallback((data) => {
    let productsArray = [];
    if (data.content && Array.isArray(data.content)) {
      productsArray = data.content;
    } else if (Array.isArray(data)) {
      productsArray = data;
    } else if (data.products && Array.isArray(data.products)) {
      productsArray = data.products;
    } else if (data.data && Array.isArray(data.data)) {
      productsArray = data.data;
    }

    // Use a Set to store unique product IDs
    const uniqueProductIds = new Set();
    const uniqueProducts = [];

    productsArray.forEach(product => {
      // Only add the product if its ID hasn't been seen before
      if (product.id && !uniqueProductIds.has(product.id)) {
        uniqueProductIds.add(product.id);
        
        const unitPrice = parseFloat(product.unitPrice || 0);
        const availableStock = parseInt(product.currentStock || 0) - parseInt(product.reservedStock || 0);
        
        uniqueProducts.push({
          id: product.id,
          itemCode: product.itemCode || `ITEM-${product.id}`,
          name: product.itemName || product.name || 'Unnamed Product',
          description: product.description || 'High-quality product with excellent features.',
          brandName: product.brandName || 'Unknown Brand',
          image: product.imageUrl || PLACEHOLDER_IMAGE_URL,
          price: unitPrice,
          rating: parseFloat(product.rating || (Math.random() * 1.5 + 3.5).toFixed(1)),
          reviews: parseInt(product.reviewCount || product.reviews || Math.floor(Math.random() * 100) + 10),
          category: product.category?.categoryName || 'General',
          categoryCode: product.category?.categoryCode || '',
          subCategory: product.subCategory?.subCategoryName || '',
          currentStock: parseInt(product.currentStock || 0),
          reservedStock: parseInt(product.reservedStock || 0),
          availableStock: availableStock,
          inStock: availableStock > 0,
          isNew: Math.random() > 0.7,
          isBestSeller: Math.random() > 0.8,
          isFeatured: Math.random() > 0.5,
          isTrending: Math.random() > 0.6,
          isBackInStock: Math.random() > 0.8 && availableStock > 0,
          tags: product.tags || []
        });
      }
    });
    
    return uniqueProducts;
  }, []);

  // Fetch all products with pagination
  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!authToken) {
        throw new Error("Authentication required. Please log in to view products.");
      }
      
      const response = await axios.get(`${BASE_URL}/products/list`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        params: {
          size: 200, // Fetch a larger batch to improve local search
          sortBy: 'id',
          sortDirection: 'ASC'
        }
      });
      
      const transformed = transformAndAugmentProducts(response.data);
      setAllProducts(transformed);
      
    } catch (err) {
      setError(err.message || "Failed to fetch products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [authToken, transformAndAugmentProducts]);

  // Search products via local filtering (debounced)
  const searchProducts = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.brandName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setSearching(false);
  }, [allProducts]);

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchProducts]);

  // Initial fetch on component mount and on manual refresh
  useEffect(() => {
    fetchAllProducts();
  }, [authToken, refreshKey, fetchAllProducts]);
  
  // Create categorized products with exactly 12 products per section
  const categorizedProducts = useMemo(() => {
    if (allProducts.length === 0) return {};

    const shuffledProducts = shuffleArray([...allProducts]);

    const categories = {};
    const productsPerSection = 12;
    
    const sectionNames = [
      'Recommended for You',
      'Trending Products', 
      'New Arrivals',
      'Back in Stock',
      'Best Seller',
      'Featured Products',
      'Top Products'
    ];

    let usedProductIds = new Set();

    sectionNames.forEach((sectionName) => {
      const availableProducts = shuffledProducts.filter(product => !usedProductIds.has(product.id));
      const sectionProducts = availableProducts.slice(0, productsPerSection * 3); // Fetch more for scrolling
      
      sectionProducts.forEach(product => usedProductIds.add(product.id));
      
      categories[sectionName] = sectionProducts;
    });

    categories['All Products'] = [...allProducts];
    
    return categories;
  }, [allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const categorySlug = searchParams.get('category');
    const subCategoryName = searchParams.get('subcategory');

    let baseProducts = searchQuery.trim() ? searchResults : (categorizedProducts['All Products'] || []);

    if (categorySlug) {
      baseProducts = baseProducts.filter(product =>
        product.categoryCode?.toLowerCase() === categorySlug.toLowerCase() ||
        product.category?.toLowerCase().replace(/[^a-z0-9]/g, '-') === categorySlug.toLowerCase()
      );
    }

    if (subCategoryName) {
      baseProducts = baseProducts.filter(product =>
        product.subCategory?.toLowerCase().replace(/[^a-z0-9]/g, '-') === subCategoryName.toLowerCase()
      );
    }

    baseProducts = baseProducts.filter(product => {
      const productPrice = product.price;
      return productPrice >= minPrice && productPrice <= maxPrice;
    });

    switch (sortOrder) {
      case 'price-asc':
        baseProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        baseProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        baseProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        baseProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    return baseProducts;
  }, [categorizedProducts, sortOrder, minPrice, maxPrice, searchQuery, searchResults, location.search]);

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setSelectedProduct(null);
  };

  // Refs for each carousel container
  const carouselRefs = useRef({});
  const getCarouselRef = (section) => {
    if (!carouselRefs.current[section]) {
      carouselRefs.current[section] = React.createRef();
    }
    return carouselRefs.current[section];
  };

  const handleSectionNext = (sectionName) => {
    const carouselRef = getCarouselRef(sectionName);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('.product-card-col').offsetWidth;
      carouselRef.current.scrollLeft += cardWidth * 6;
      setSectionPages(prev => ({ ...prev, [sectionName]: (prev[sectionName] || 0) + 1 }));
    }
  };
  
  const handleSectionPrev = (sectionName) => {
    const carouselRef = getCarouselRef(sectionName);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('.product-card-col').offsetWidth;
      carouselRef.current.scrollLeft -= cardWidth * 6;
      setSectionPages(prev => ({ ...prev, [sectionName]: Math.max(0, (prev[sectionName] || 0) - 1) }));
    }
  };

  const sections = [
    'All Products',
    'Recommended for You',
    'Trending Products',
    'Back in Stock',
    'Best Seller',
    'Featured Products',
    'Top Products',
    'New Arrivals'
  ];

  if (loading) {
    return (
      <div className="container-fluid py-5 px-4">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="col">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
        <div className="text-center py-5">
          <p className="mt-3 h5">Loading all products...</p>
          <small className="text-muted">Fetching all available products to enable local search and filtering.</small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-5 px-4">
        <div className="alert alert-danger text-center mx-auto" role="alert" style={{ maxWidth: '600px' }}>
          <h4 className="alert-heading">Error Loading Products</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3" 
            onClick={() => setRefreshKey(prev => prev + 1)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .product-carousel-container {
            position: relative;
            overflow: hidden;
          }
          .product-carousel-row {
            display: flex;
            overflow-x: auto;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          .product-carousel-row::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          .product-card-col {
            flex-shrink: 0;
            padding: 0 0.5rem;
          }
          .carousel-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            opacity: 0.7;
            transition: opacity 0.2s;
            border-radius: 50%;
            height: 40px;
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            border: 1px solid #dee2e6;
            cursor: pointer;
          }
          .carousel-nav-btn:hover {
            opacity: 1;
          }
          .carousel-nav-btn.prev {
            left: 0;
          }
          .carousel-nav-btn.next {
            right: 0;
          }
          .product-grid-container {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
          .product-list-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          /* Responsive adjustments for columns */
          @media (min-width: 1400px) {
            .product-card-col {
              width: calc(100% / 6 - 1rem);
            }
          }
          @media (min-width: 1200px) and (max-width: 1399.98px) {
            .product-card-col {
              width: calc(100% / 5 - 1rem);
            }
          }
          @media (min-width: 992px) and (max-width: 1199.98px) {
            .product-card-col {
              width: calc(100% / 4 - 1rem);
            }
          }
          @media (min-width: 768px) and (max-width: 991.98px) {
            .product-card-col {
              width: calc(100% / 3 - 1rem);
            }
          }
          @media (min-width: 576px) and (max-width: 767.98px) {
            .product-card-col {
              width: calc(100% / 2 - 1rem);
            }
          }
          @media (max-width: 575.98px) {
            .product-card-col {
              width: 100%;
            }
          }
        `}
      </style>
      <div className="container-fluid py-4 px-1">
        {/* Search, Filter, and View Controls */}
        <div className="bg-light p-2 rounded-3 mb-4">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg pe-5"
                  placeholder="Search products by name, description, category, or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderRadius: '25px', borderColor: '#e0e6ed' }}
                />
                {searching ? (
                  <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Searching...</span>
                    </div>
                  </div>
                ) : (
                  <Search 
                    size={20} 
                    className="text-muted position-absolute top-50 end-0 translate-middle-y me-3"
                  />
                )}
              </div>
              {searchQuery && (
                <small className="text-muted mt-1 d-block">
                  {searching ? 'Searching...' : `Found ${searchResults.length} results for "${searchQuery}"`}
                </small>
              )}
            </div>

            <div className="col-lg-6">
              <div className="d-flex gap-3 justify-content-lg-end">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    type="button"
                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </button>
                </div>

                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="sortDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderRadius: '25px' }}
                  >
                    <ArrowDownWideNarrow size={18} className="me-2" />
                    Sort
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="sortDropdown">
                    <li><h6 className="dropdown-header">Sort by</h6></li>
                    <li><button className={`dropdown-item ${sortOrder === 'default' ? 'active' : ''}`} onClick={() => setSortOrder('default')}>Default</button></li>
                    <li><button className={`dropdown-item ${sortOrder === 'price-asc' ? 'active' : ''}`} onClick={() => setSortOrder('price-asc')}>Price: Low to High</button></li>
                    <li><button className={`dropdown-item ${sortOrder === 'price-desc' ? 'active' : ''}`} onClick={() => setSortOrder('price-desc')}>Price: High to Low</button></li>
                    <li><button className={`dropdown-item ${sortOrder === 'rating-desc' ? 'active' : ''}`} onClick={() => setSortOrder('rating-desc')}>Rating: High to Low</button></li>
                    <li><button className={`dropdown-item ${sortOrder === 'name-asc' ? 'active' : ''}`} onClick={() => setSortOrder('name-asc')}>Name: A to Z</button></li>
                  </ul>
                </div>
                
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="filterDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderRadius: '25px' }}
                  >
                    <SlidersHorizontal size={18} className="me-2" />
                    Filter
                  </button>
                  <div className="dropdown-menu dropdown-menu-end p-3 shadow" style={{ minWidth: '280px' }}>
                    <h6 className="dropdown-header px-0 mb-3">Price Range (KSh)</h6>
                    <div className="d-flex align-items-center justify-content-between mb-3 gap-2">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                      />
                      <span className="fw-bold">-</span>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm flex-grow-1"
                        onClick={() => {
                          setMinPrice(0);
                          setMaxPrice(25000);
                        }}
                      >
                        Reset
                      </button>
                      <button className="btn btn-primary btn-sm flex-grow-1">Apply</button>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-outline-success"
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  title="Refresh products"
                >
                  🔄
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamically Render Product Sections */}
        {sections.map((section, index) => {
          let productsToDisplay = [];
          
          if (section === 'All Products') {
            productsToDisplay = filteredAndSortedProducts;
          } else if (searchQuery.trim()) {
            // If a search is active, hide all other sections
            return null;
          } else {
            productsToDisplay = categorizedProducts[section] || [];
          }
          
          if (productsToDisplay.length === 0) {
            return null;
          }

          // Slice the products based on the current page for the section
          const currentPage = sectionPages[section] || 0;
          const start = currentPage * 6;
          const end = start + 6;
          const hasMore = end < productsToDisplay.length;

          const bgColor = sectionColors[index % sectionColors.length];
          
          return (
            <div key={`${section}-${refreshKey}`} className="mb-5">
              <div className={`p-2 rounded-3 mb-4 text-white d-flex justify-content-between align-items-center ${bgColor}`}>
                <div>
                  <h2 className="display-6 fw-bold mb-0" style={{ fontSize: '1.75rem' }}>{section}</h2>
                  <small className="opacity-75">({productsToDisplay.length} products)</small>
                </div>
                <Link to="#" className="text-white text-decoration-none d-flex align-items-center">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="product-carousel-container">
                <div 
                  ref={getCarouselRef(section)}
                  className="product-carousel-row"
                >
                  {productsToDisplay.map(product => (
                    <div key={`${section}-${product.id}-${refreshKey}`} className="product-card-col">
                      {viewMode === 'grid' ? (
                        <ProductCard 
                          product={product} 
                          onViewDetails={handleViewProductDetails}
                          addToCart={() => handleAddToCart(product)}
                          toggleWishlist={() => handleToggleWishlist(product)}
                          cartItems={cartItems}
                          wishlistItems={wishlistItems}
                        />
                      ) : (
                        <ProductListCard
                          product={product}
                          onViewDetails={handleViewProductDetails}
                          addToCart={() => handleAddToCart(product)}
                          toggleWishlist={() => handleToggleWishlist(product)}
                          cartItems={cartItems}
                          wishlistItems={wishlistItems}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Previous Button */}
                {(sectionPages[section] || 0) > 0 && (
                  <button 
                    className="btn btn-light carousel-nav-btn prev shadow-sm"
                    onClick={() => handleSectionPrev(section)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                
                {/* Next Button */}
                {hasMore && (
                  <button 
                    className="btn btn-light carousel-nav-btn next shadow-sm"
                    onClick={() => handleSectionNext(section)}
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedProduct && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCloseQuickView}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Quick View</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseQuickView}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h3>{selectedProduct.name}</h3>
                    <div className="d-flex align-items-center mb-3">
                      <div className="d-flex me-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < Math.floor(selectedProduct.rating) ? '#ffd700' : '#ddd' }}>
                            ★
                          </span>
                        ))}
                      </div>
                      <small className="text-muted">({selectedProduct.reviews} reviews)</small>
                    </div>
                    <p className="text-muted">{selectedProduct.description}</p>
                    <div className="mb-3">
                      <span className="h4 text-primary">KSh {selectedProduct.price.toLocaleString()}</span>
                    </div>
                    <div className="mb-3">
                      <strong>Brand:</strong> {selectedProduct.brandName}<br/>
                      <strong>Category:</strong> {selectedProduct.category}<br/>
                      <strong>Stock:</strong> {selectedProduct.availableStock > 0 ? `${selectedProduct.availableStock} available` : 'Out of stock'}
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-primary flex-grow-1"
                        onClick={() => handleQuickViewAddToCart(selectedProduct)}
                        disabled={!selectedProduct.inStock}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleQuickViewToggleWishlist(selectedProduct)}
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Toast Container */}
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
      />
    </>
  );
};

export default Products;
