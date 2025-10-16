// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { BASE_URL } from '../utils/helpers';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const { adminToken } = useAdminAuth();
  
  // Get query parameters
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const searchQuery = searchParams.get('search');

  // Build page title based on filters
  const getPageTitle = () => {
    if (category && subcategory) {
      return `${subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    }
    if (category) {
      return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    return 'All Products';
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${BASE_URL}/products?`;
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('size', '50'); // Adjust as needed
      
      url += params.toString();
      
      const headers = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different response structures
      const productsArray = data.content || data.products || data.data || data || [];
      setProducts(Array.isArray(productsArray) ? productsArray : []);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, searchQuery, adminToken]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Loading products...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Error Loading Products</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchProducts}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/" className="text-decoration-none">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/products" className="text-decoration-none">Products</a>
          </li>
          {category && (
            <li className="breadcrumb-item">
              <a 
                href={`/products?category=${category}`} 
                className="text-decoration-none"
              >
                {category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </a>
            </li>
          )}
          {subcategory && (
            <li className="breadcrumb-item active" aria-current="page">
              {subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </li>
          )}
        </ol>
      </nav>

      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-6 mb-2">{getPageTitle()}</h1>
          <p className="text-muted">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
            {category && ` in ${category.replace(/-/g, ' ')}`}
            {subcategory && ` > ${subcategory.replace(/-/g, ' ')}`}
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              Sort By
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Name (A-Z)</a></li>
              <li><a className="dropdown-item" href="#">Name (Z-A)</a></li>
              <li><a className="dropdown-item" href="#">Price (Low to High)</a></li>
              <li><a className="dropdown-item" href="#">Price (High to Low)</a></li>
              <li><a className="dropdown-item" href="#">Newest First</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(category || subcategory || searchQuery) && (
        <div className="mb-4">
          <h6 className="mb-2">Active Filters:</h6>
          <div className="d-flex flex-wrap gap-2">
            {category && (
              <span className="badge bg-primary fs-6 py-2 px-3">
                Category: {category.replace(/-/g, ' ')}
                <a 
                  href="/products" 
                  className="text-white ms-2 text-decoration-none"
                  title="Remove filter"
                >
                  ×
                </a>
              </span>
            )}
            {subcategory && (
              <span className="badge bg-info fs-6 py-2 px-3">
                Subcategory: {subcategory.replace(/-/g, ' ')}
                <a 
                  href={`/products?category=${category}`} 
                  className="text-white ms-2 text-decoration-none"
                  title="Remove filter"
                >
                  ×
                </a>
              </span>
            )}
            {searchQuery && (
              <span className="badge bg-success fs-6 py-2 px-3">
                Search: "{searchQuery}"
                <a 
                  href="/products" 
                  className="text-white ms-2 text-decoration-none"
                  title="Remove filter"
                >
                  ×
                </a>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img 
                    src={product.imageUrl || product.image || '/api/placeholder/300/300'} 
                    className="card-img-top" 
                    alt={product.name || product.title}
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/300';
                    }}
                  />
                  {product.discount && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-truncate" title={product.name || product.title}>
                    {product.name || product.title}
                  </h6>
                  <p className="card-text small text-muted flex-grow-1">
                    {product.description && product.description.length > 80
                      ? `${product.description.substring(0, 80)}...`
                      : product.description || 'No description available'
                    }
                  </p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <span className="h6 text-primary mb-0">
                          KSh {product.price?.toLocaleString() || '0'}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <small className="text-muted text-decoration-line-through ms-1">
                            KSh {product.originalPrice.toLocaleString()}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="d-grid">
                      <button className="btn btn-primary btn-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <svg width="64" height="64" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
            </svg>
          </div>
          <h4 className="text-muted">No products found</h4>
          <p className="text-muted mb-4">
            {category || subcategory || searchQuery
              ? "Try adjusting your filters or search terms"
              : "No products are currently available"
            }
          </p>
          <a href="/products" className="btn btn-primary">
            View All Products
          </a>
        </div>
      )}

      {/* Pagination (if needed) */}
      {products.length > 0 && (
        <nav className="mt-5" aria-label="Products pagination">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex="-1">Previous</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProductsPage;
