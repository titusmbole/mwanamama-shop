// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, ChevronRight,
  Home, Package, Grid3x3, Phone, Mail, Truck, Shield,
  LogIn, UserPlus, Settings, Package2, MapPin, LogOut
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { BASE_URL } from '../utils/helpers';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, wishlistCount } = useCart();
  
  // Get both user and admin contexts
  const { user: regularUser, logout: userLogout } = useAuth();
  const { admin, logout: adminLogout, adminToken } = useAdminAuth();
  
  // Use admin if available, otherwise use regular user
  const user = admin || regularUser;
  const logout = admin ? adminLogout : userLogout;

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setErrorCategories(null);
    try {
      const headers = {};
      
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      
      const userToken = localStorage.getItem('userToken');
      if (!adminToken && userToken) {
        headers['Authorization'] = `Bearer ${userToken}`;
      }

      const response = await fetch(`${BASE_URL}/categories?size=50`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Auth failed, trying public access...');
          const publicResponse = await fetch(`${BASE_URL}/categories?size=50`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          
          if (!publicResponse.ok) {
            const errorData = await publicResponse.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${publicResponse.status}: Failed to fetch categories`);
          }
          
          const data = await publicResponse.json();
          processCategories(data);
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      processCategories(data);
      
    } catch (err) {
      console.error('Categories fetch error:', err);
      setErrorCategories(err.message);
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const processCategories = (data) => {
    let categoriesArray = Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
    const transformedCategories = categoriesArray.map(cat => ({
      id: cat.id,
      name: cat.categoryName || cat.name,
      slug: cat.slug || cat.categoryName?.toLowerCase().replace(/\s+/g, '-'),
      subCategories: cat.subCategories || []
    }));
    setCategories(transformedCategories);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 100);

    return () => clearTimeout(timer);
  }, [adminToken]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setHoveredCategory(null);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };
  
  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
  };

  const handleCategoryLeave = () => {
    setHoveredCategory(null);
  };

  // Updated search handler to correctly pass the query in the URL
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery(''); 
      closeSidebar();
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  
  const getUserDisplayName = () => {
    if (!user) return 'Welcome!';
    
    const possibleNames = [
      user.firstName,
      user.first_name,
      user.name,
      user.fullName,
      user.full_name,
      user.displayName,
      user.display_name,
      user.username,
      user.login,
      user.email?.split('@')[0]
    ];
    
    const displayName = possibleNames.find(name => name && typeof name === 'string' && name.trim());
    
    return displayName || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    
    const displayName = getUserDisplayName();
    if (displayName === 'Welcome!' || displayName === 'User') return 'U';
    
    const nameParts = displayName.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    
    return displayName.charAt(0).toUpperCase();
  };

  const getUserRole = () => {
    if (!user) return '';
    
    if (admin) {
      return user.role || 'Admin';
    }
    
    return user.role || 'Customer';
  };

  const getMegaMenuColumns = (subCategoryCount) => {
    if (subCategoryCount === 0) return 1;
    if (subCategoryCount <= 8) return 1;
    if (subCategoryCount <= 16) return 2;
    if (subCategoryCount <= 24) return 3;
    return 4;
  };

  const retryFetchCategories = () => {
    fetchCategories();
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
        crossOrigin="anonymous" 
      />
      
      <style>
        {`
          .fixed-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1030;
            width: 100%;
          }
          
          body {
            padding-top: 140px !important; 
          }
          
          .main-content-wrapper {
            padding-top: 140px;
            margin-top: -140px;
          }
          
          .sidebar-mega-menu {
            position: fixed;
            top: 0;
            left: 320px;
            height: 100%;
            width: 320px;
            background-color: #f8f9fa;
            border-left: 1px solid #dee2e6;
            z-index: 1050;
            transition: transform 0.3s ease-in-out;
            transform: translateX(0);
            overflow-y: auto;
            padding: 1rem;
          }
          .sidebar-mega-menu.hidden {
            transform: translateX(-100%);
          }
          .mega-menu-grid {
            display: grid;
            gap: 1rem;
            padding: 0.5rem 0;
          }
          .mega-menu-grid.cols-1 {
            grid-template-columns: repeat(1, 1fr);
          }
          .mega-menu-grid.cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .mega-menu-grid.cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
          .mega-menu-grid.cols-4 {
            grid-template-columns: repeat(4, 1fr);
          }
          .mega-menu-link {
            transition: transform 0.2s, color 0.2s, background-color 0.2s;
            padding: 0.5rem;
            border-radius: 0.25rem;
          }
          .mega-menu-link:hover {
            background-color: #e9ecef;
            transform: translateX(5px);
            color: #667eea !important;
          }
          .dropdown-menu {
            max-height: 80vh;
            overflow-y: auto;
          }
          .error-retry-btn {
            background: none;
            border: 1px solid #dc3545;
            color: #dc3545;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .error-retry-btn:hover {
            background-color: #dc3545;
            color: white;
          }
          .user-role-badge {
            font-size: 0.65rem;
            padding: 0.15rem 0.4rem;
            border-radius: 0.75rem;
            background-color: #667eea;
            color: white;
            font-weight: 500;
          }
        `}
      </style>
      
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Main Menu */}
      <div 
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg d-flex flex-column ${isSidebarOpen ? 'translate-x-0' : 'translate-x-n100'}`}
        style={{ 
          width: '320px', 
          zIndex: 1050,
          transition: 'transform 0.3s ease-in-out',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
        onMouseLeave={handleCategoryLeave}
      >
        <div className="p-4 border-bottom" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-white mb-0 fw-bold">Menu</h5>
            <button 
              className="btn btn-light btn-sm rounded-circle p-2"
              onClick={closeSidebar}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-0 overflow-auto flex-grow-1">
          <div className="p-4 bg-light border-bottom">
            <div className="d-flex align-items-center mb-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                style={{
                  width: '50px', 
                  height: '50px',
                  background: user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#6c757d'
                }}
              >
                <span className="text-white fw-bold">{getUserInitials()}</span>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1">
                  <h6 className="mb-0 me-2">Hello, {getUserDisplayName()}!</h6>
                  {user && getUserRole() && (
                    <span className="user-role-badge">{getUserRole()}</span>
                  )}
                </div>
                <small className="text-muted">
                  {user ? user.email || user.username || 'Logged in' : 'Sign in for best experience'}
                </small>
              </div>
            </div>
            
            {user ? (
              <div className="d-flex gap-2">
                <Link to="/account" className="btn btn-primary btn-sm flex-fill" onClick={closeSidebar}>
                  <Settings size={16} className="me-1" />
                  Account
                </Link>
                <button 
                  className="btn btn-outline-secondary btn-sm flex-fill" 
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="me-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-primary btn-sm flex-fill" onClick={closeSidebar}>
                  <LogIn size={16} className="me-1" />
                  Login
                </Link>
              </div>
            )}
          </div>

          <nav className="py-2">
            <Link to="/" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <Home size={20} className="me-3 text-primary" />
              <span className="fw-medium">Home</span>
            </Link>
            <Link to="/products" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <Package size={20} className="me-3 text-primary" />
              <span className="fw-medium">All Products</span>
            </Link>
            
            {isLoadingCategories && (
              <div className="px-4 py-3">
                <div className="d-flex align-items-center text-muted">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Loading categories...
                </div>
              </div>
            )}
            
            {errorCategories && (
              <div className="px-4 py-3">
                <div className="text-danger mb-2 small">
                  Categories unavailable
                </div>
                <button 
                  className="error-retry-btn"
                  onClick={retryFetchCategories}
                >
                  Retry
                </button>
              </div>
            )}
            
            {!isLoadingCategories && !errorCategories && categories.length === 0 && (
              <div className="px-4 py-3 text-muted small">
                No categories available
              </div>
            )}
            
            {!isLoadingCategories && categories.map(cat => (
              <Link
                key={cat.id}
                to={cat.subCategories.length > 0 ? '#' : `/products?category=${cat.slug}`}
                className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom"
                onMouseEnter={() => handleCategoryHover(cat)}
                onClick={cat.subCategories.length > 0 ? (e) => e.preventDefault() : closeSidebar}
              >
                <Grid3x3 size={20} className="me-3 text-primary" />
                <span className="fw-medium">{cat.name}</span>
                {cat.subCategories.length > 0 && (
                  <ChevronRight size={16} className="ms-auto" />
                )}
              </Link>
            ))}

            <Link to="/wishlist" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <Heart size={20} className="me-3 text-danger" />
              <span className="fw-medium">My Wishlist</span>
              {wishlistCount > 0 && (
                <span className="badge bg-danger ms-auto">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/cart" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <ShoppingCart size={20} className="me-3 text-success" />
              <span className="fw-medium">My Cart</span>
              {cartCount > 0 && (
                <span className="badge bg-success ms-auto">{cartCount}</span>
              )}
            </Link>
            <Link to="/orders" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <Package2 size={20} className="me-3 text-info" />
              <span className="fw-medium">My Orders</span>
            </Link>
            <Link to="/contact" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark border-bottom" onClick={closeSidebar}>
              <Phone size={20} className="me-3 text-warning" />
              <span className="fw-medium">Contact Us</span>
            </Link>
          </nav>

          <div className="p-4 bg-light mt-auto">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <div className="d-flex align-items-center mb-2">
              <Phone size={16} className="me-2 text-primary" />
              <small>+254 700 000 000</small>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Mail size={16} className="me-2 text-primary" />
              <small>hello@mwanamama.co.ke</small>
            </div>
            <div className="d-flex align-items-center">
              <MapPin size={16} className="me-2 text-primary" />
              <small>Nairobi, Kenya</small>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Multi-column Mega-Menu */}
      {hoveredCategory && isSidebarOpen && hoveredCategory.subCategories.length > 0 && (
        <div 
          className="sidebar-mega-menu shadow"
          onMouseEnter={() => handleCategoryHover(hoveredCategory)}
          onMouseLeave={handleCategoryLeave}
        >
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom">
            <h6 className="mb-0 fw-bold">{hoveredCategory.name}</h6>
            <Link to={`/products?category=${hoveredCategory.slug}`} className="small text-primary text-decoration-none" onClick={closeSidebar}>
              View All
            </Link>
          </div>
          <div className={`mega-menu-grid cols-${getMegaMenuColumns(hoveredCategory.subCategories.length)}`}>
            {hoveredCategory.subCategories.map((subCat) => (
              <Link
                key={subCat.id}
                to={`/products?category=${hoveredCategory.slug}&subcategory=${subCat.subCategoryName.toLowerCase()}`}
                className="d-block text-decoration-none text-dark mega-menu-link"
                onClick={closeSidebar} // Close sidebar on subcategory click
              >
                <small className="d-flex align-items-center">
                  <ChevronRight size={14} className="me-2 text-primary" />
                  {subCat.subCategoryName}
                </small>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Header - Now Fixed */}
      <header className="fixed-header">
        <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} className="text-white py-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4 d-none d-md-block">
                <div className="d-flex align-items-center small">
                  <Truck size={16} className="me-2" />
                  <span>Free shipping over KSh 5,000</span>
                </div>
              </div>
              <div className="col-12 col-md-4 text-center">
                <div className="d-flex justify-content-center align-items-center small fw-bold">
                  <span className="badge bg-warning text-dark me-2">HOT</span>
                  Up to 70% OFF Summer Sale!
                </div>
              </div>
              <div className="col-md-4 d-none d-md-block text-end">
                <div className="d-flex justify-content-end align-items-center small">
                  <Shield size={16} className="me-2" />
                  <span>Secure Shopping Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container">
            <button
              className="btn btn-outline-primary me-3 d-flex align-items-center"
              onClick={toggleSidebar}
            >
              <Menu size={20} className="me-2" />
              <span className="d-none d-sm-inline">Menu</span>
            </button>

            <Link className="navbar-brand" to="/">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <span className="text-white fw-bold">MEL</span>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold" style={{color: '#667eea'}}>Mwanamama</h4>
                  <small className="text-muted d-none d-md-block">Quality & Style</small>
                </div>
              </div>
            </Link>

            <div className="d-none d-lg-flex me-auto ms-4">
              <nav className="d-flex gap-4">
                <Link to="/" className="text-decoration-none text-dark fw-medium d-flex align-items-center">
                  <Home size={16} className="me-1" />
                  Home
                </Link>
                <Link to="/products" className="text-decoration-none text-dark fw-medium d-flex align-items-center">
                  <Package size={16} className="me-1" />
                  Products
                </Link>
              </nav>
            </div>

            <div className="flex-grow-1 mx-3" style={{maxWidth: '500px'}}>
              <form onSubmit={handleSearch} className="position-relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="form-control form-control-lg border-2 pe-5"
                  placeholder="Search for products, brands..."
                  style={{
                    borderRadius: '25px',
                    borderColor: '#e0e6ed',
                    paddingLeft: '20px'
                  }}
                />
                <button 
                  type="submit"
                  className="btn position-absolute top-50 end-0 translate-middle-y me-2"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '20px',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Search size={18} className="text-white" />
                </button>
              </form>
            </div>

            <div className="d-flex align-items-center gap-3">
              <Link to="/wishlist" className="text-center text-decoration-none">
                <button className="btn btn-outline-light border-0 position-relative p-2">
                  <Heart size={24} style={{color: '#667eea'}} />
                  <span 
                    className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${wishlistCount > 0 ? 'bg-danger' : 'bg-secondary'}`}
                  >
                    {wishlistCount}
                  </span>
                </button>
                <div><small className="text-muted d-none d-lg-block">Wishlist</small></div>
              </Link>

              <Link to="/cart" className="text-center text-decoration-none">
                <button className="btn btn-outline-light border-0 position-relative p-2">
                  <ShoppingCart size={24} style={{color: '#667eea'}} />
                  <span 
                    className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${cartCount > 0 ? 'bg-success' : 'bg-secondary'}`}
                  >
                    {cartCount}
                  </span>
                </button>
                <div><small className="text-muted d-none d-lg-block">Cart</small></div>
              </Link>

              <div className="dropdown">
                <a 
                  href="#"
                  className="btn btn-outline-light border-0 dropdown-toggle d-flex align-items-center p-2" 
                  data-bs-toggle="dropdown"
                >
                  {user ? (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontSize: '12px'
                      }}
                    >
                      <span className="text-white fw-bold">{getUserInitials()}</span>
                      {admin && (
                        <span 
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success"
                          style={{fontSize: '0.5rem', padding: '0.15rem 0.25rem'}}
                        >
                          A
                        </span>
                      )}
                    </div>
                  ) : (
                    <User size={24} style={{color: '#667eea'}} />
                  )}
                </a>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2" style={{minWidth: '280px'}}>
                  <li className="px-3 py-2 bg-light">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-2" 
                        style={{
                          width: '40px', 
                          height: '40px',
                          background: user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#6c757d'
                        }}
                      >
                        <span className="text-white fw-bold">{getUserInitials()}</span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <h6 className="mb-0 me-2">Hello, {getUserDisplayName()}!</h6>
                          {user && getUserRole() && (
                            <span className="user-role-badge">{getUserRole()}</span>
                          )}
                        </div>
                        <small className="text-muted">
                          {user ? user.email || user.username || 'Manage your account' : 'Sign in for best experience'}
                        </small>
                      </div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  
                  {user ? (
                    <>
                      <li>
                        <Link className="dropdown-item py-2" to="/orders">
                          <Package2 size={16} className="me-2" />
                          My Orders
                        </Link>
                      </li>
                      {/* <li>
                        <Link className="dropdown-item py-2" to="/account">
                          <Settings size={16} className="me-2" />
                          Account Settings
                        </Link>
                      </li> */}
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item py-2 w-100 text-start border-0 bg-transparent" onClick={handleLogout}>
                          <LogOut size={16} className="me-2" />
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link className="dropdown-item py-2" to="/login">
                          <LogIn size={16} className="me-2" />
                          Login
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item py-2" to="/orders">
                          <Package2 size={16} className="me-2" />
                          My Orders
                        </Link>
                      </li>
                      {/* <li>
                        <Link className="dropdown-item py-2" to="/account">
                          <Settings size={16} className="me-2" />
                          Account Settings
                        </Link>
                      </li> */}
                    </>
                  )}
                </ul>
                <div>
                  <small className="text-muted d-none d-lg-block">
                    {user ? getUserDisplayName() : 'Account'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
