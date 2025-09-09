// src/components/ProductsAdmin.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { ChevronDown } from 'react-feather';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Point your API base to your local backend
const API_BASE = "https://api.mwanamama.org/api/v1";

const ProductsAdmin = () => {
  const { admin, adminToken, isAuthenticated } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination, Sorting, Filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    isNew: false,
    isBestSeller: false,
    inStock: false
  });

// Add this method to your ProductsAdmin component

const createAuthAxios = useCallback(() => {
  console.log("Creating axios instance");
  console.log("adminToken:", adminToken ? `${adminToken.substring(0, 20)}...` : 'null');
  console.log("isAuthenticated:", isAuthenticated);
  
  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });

  // Add response interceptor to handle auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Authentication failed - token may be expired or invalid");
        // You might want to redirect to login or refresh token here
        // logout(); // if you have a logout function
      }
      return Promise.reject(error);
    }
  );

  return instance;
}, [adminToken, isAuthenticated]);

// Also add this method to check token validity
const checkTokenValidity = useCallback(() => {
  if (!adminToken) {
    console.log("No admin token found");
    return false;
  }

  try {
    // Decode JWT without verification (just to check format and expiration)
    const payload = JSON.parse(atob(adminToken.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      console.log("Token has expired");
      return false;
    }
    
    console.log("Token is valid until:", new Date(payload.exp * 1000));
    return true;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
}, [adminToken]);

// Call this in your useEffect
useEffect(() => {
  if (!checkTokenValidity()) {
    setError("Authentication token is invalid or expired. Please log in again.");
    return;
  }
  // ... rest of your fetch logic
}, [checkTokenValidity, /* other dependencies */]);

  // 2. Fetch dynamic products based on filters, sort, and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated || !adminToken) {
        return;
      }
      
      setLoading(true);
      setError('');

      const params = {
        page: currentPage - 1,
        size: productsPerPage,
        sort: `${sortField},${sortOrder}`,
        search: searchTerm || undefined,
        isNew: filterOptions.isNew || undefined,
        isBestSeller: filterOptions.isBestSeller || undefined,
        inStock: filterOptions.inStock || undefined
      };

      try {
        console.log("📥 Fetching products for admin:", admin?.email, "with params:", params);
        const authAxios = createAuthAxios();
        
        const res = await authAxios.get(`/products/list`, { params });
        const result = res.data;
        
        setProducts(result.content || result.data || []);
        setTotalProducts(result.totalElements || result.totalCount || 0);
        
        console.log("✅ Products fetched successfully:", (result.content || result.data || []).length);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
        setError(`Failed to load products. ${err.response?.data?.message || err.message}`);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [createAuthAxios, currentPage, productsPerPage, sortField, sortOrder, searchTerm, filterOptions, isAuthenticated, adminToken, admin?.email]);

  // Helper functions
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(price);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilterOptions((prev) => ({ ...prev, [name]: checked }));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
        </li>
      );
    }
    return (
      <nav>
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
          </li>
          {pages}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    );
  };

  const getSortIcon = (field) => {
    if (sortField === field) return sortOrder === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up';
    return '';
  };
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || "-";
  const getSubCategoryName = (id) => subcategories.find(s => s.id === id)?.name || "-";
  const getBrandName = (id) => brands.find(b => b.id === id)?.name || "-";

  // Show loading if not authenticated yet
  if (!isAuthenticated) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="mb-1">Product Management</h2>
              <p className="text-muted mb-0">
                Manage your product inventory • Logged in as: <strong>{admin?.email}</strong>
              </p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-primary">
                Total Products: {totalProducts}
              </span>
              <span className="badge bg-success">
                Admin: {admin?.role || 'Administrator'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={loading}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="d-flex gap-2 align-items-center">
            <small className="text-muted">Filters:</small>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                name="isNew"
                id="isNew"
                checked={filterOptions.isNew}
                onChange={handleFilterChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="isNew">New</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                name="isBestSeller"
                id="isBestSeller"
                checked={filterOptions.isBestSeller}
                onChange={handleFilterChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="isBestSeller">Best Seller</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                name="inStock"
                id="inStock"
                checked={filterOptions.inStock}
                onChange={handleFilterChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="inStock">In Stock</label>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
        </div>
      )}

      {/* Products Table */}
      <div className="row">
        <div className="col">
          <div className="card shadow-sm">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading products...</p>
                </div>
              ) : !Array.isArray(products) || products.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam display-1 text-muted"></i>
                  <h4 className="mt-3">No Products Found</h4>
                  <p className="text-muted">
                    {searchTerm ? `No products found matching "${searchTerm}". Try adjusting your search.` : 'No products available. Check your filters or external API connection.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th onClick={() => handleSort('id')} style={{cursor:'pointer'}}>
                          Code <i className={`bi ${getSortIcon('id')}`}></i>
                        </th>
                        <th onClick={() => handleSort('name')} style={{cursor:'pointer'}}>
                          Product <i className={`bi ${getSortIcon('name')}`}></i>
                        </th>
                        <th>Category</th>
                        <th>Sub-Category</th>
                        <th>Brand</th>
                        <th onClick={() => handleSort('price')} style={{cursor:'pointer'}}>
                          Price <i className={`bi ${getSortIcon('price')}`}></i>
                        </th>
                        <th onClick={() => handleSort('stock')} style={{cursor:'pointer'}}>
                          Stock <i className={`bi ${getSortIcon('stock')}`}></i>
                        </th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <span className="badge bg-light text-dark">#{product.id}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.imageUrl && (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    objectFit: 'cover', 
                                    borderRadius: '6px',
                                    marginRight: '12px'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div>
                                <div className="fw-semibold">{product.name}</div>
                                {product.description && (
                                  <small className="text-muted">
                                    {product.description.length > 50 
                                      ? `${product.description.substring(0, 50)}...` 
                                      : product.description
                                    }
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {getCategoryName(product.categoryId)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {getSubCategoryName(product.subCategoryId)}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {getBrandName(product.brandId)}
                            </span>
                          </td>
                          <td>
                            <strong className="text-success">{formatPrice(product.price)}</strong>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div>
                                <small className="text-muted text-decoration-line-through">
                                  {formatPrice(product.originalPrice)}
                                </small>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              {product.isNew && <span className="badge bg-primary">New</span>}
                              {product.isBestSeller && <span className="badge bg-success">Best Seller</span>}
                              {product.isOnSale && <span className="badge bg-danger">On Sale</span>}
                              {product.stock === 0 && <span className="badge bg-secondary">Out of Stock</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {renderPagination()}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {products.length > 0 && (
        <div className="row mt-4">
          <div className="col">
            <div className="card bg-light">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 col-6">
                    <h5 className="mb-0">{products.length}</h5>
                    <small className="text-muted">Products Displayed</small>
                  </div>
                  <div className="col-md-3 col-6">
                    <h5 className="mb-0">{products.filter(p => p.stock > 0).length}</h5>
                    <small className="text-muted">In Stock</small>
                  </div>
                  <div className="col-md-3 col-6">
                    <h5 className="mb-0">{products.filter(p => p.stock === 0).length}</h5>
                    <small className="text-muted">Out of Stock</small>
                  </div>
                  <div className="col-md-3 col-6">
                    <h5 className="mb-0">
                      {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                    </h5>
                    <small className="text-muted">Total Inventory Value</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;