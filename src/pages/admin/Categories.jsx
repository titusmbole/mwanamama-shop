import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Tag,
  TrendingUp,
  Eye,
  MoreVertical,
  Grid,
  List,
  Download
} from 'lucide-react';
import { BASE_URL } from '../../utils/helpers';

const Categories = () => {
  const { adminToken } = useAdminAuth(); // Get token from auth context
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', status: 'active' });

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!adminToken) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories');
      }
      const data = await response.json();
      
      // Handle different API response structures
      let categoriesArray;
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data.content && Array.isArray(data.content)) { // ✅ NEW LINE
        categoriesArray = data.content; // ✅ NEW LINE
      } else if (data.categories && Array.isArray(data.categories)) {
        categoriesArray = data.categories;
      } else if (data.data && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else {
        console.log('Unexpected API response structure:', data);
        categoriesArray = [];
      }
      
      // Transform the data to match the component's expected properties
      const transformedCategories = categoriesArray.map(cat => ({
        ...cat,
        name: cat.categoryName, // Map 'categoryName' to 'name'
        status: cat.active ? 'active' : 'inactive', // Map boolean 'active' to string 'status'
        products: cat.subCategories?.length || 0, // A proxy for products, or set to 0 if not available
        revenue: cat.revenue || 'KSh 0' // Default revenue
      }));
  
      setCategories(transformedCategories);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`${BASE_URL}/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete category');
        }
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
      const addedCategory = await response.json();
      setCategories([...categories, {
        ...addedCategory,
        products: 0,
        revenue: 'KSh 0',
        created: new Date().toISOString().split('T')[0]
      }]);
      setShowAddModal(false);
      setNewCategory({ name: '', description: '', status: 'active' });
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCategories = categories.filter(category => {
    // Change logic to use 'categoryName' from the JSON and map it to 'name'
    const matchesSearch = category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || category.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.products || 0), 0);
  const totalRevenue = categories.reduce((sum, cat) => {
    const revenue = parseFloat((cat.revenue || '0').toString().replace(/[^\d.]/g, ''));
    return sum + revenue;
  }, 0);
  const activeCategories = categories.filter(cat => cat.status === 'active').length;

  const stats = [
    { title: 'Total Categories', value: categories.length.toString(), icon: <Tag />, color: 'primary' },
    { title: 'Active Categories', value: activeCategories.toString(), icon: <Package />, color: 'success' },
    { title: 'Total Products', value: totalProducts.toString(), icon: <Grid />, color: 'info' },
    { title: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, icon: <TrendingUp />, color: 'warning' },
  ];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading Categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <h4 className="alert-heading">Connection Error</h4>
        <p>Could not load categories from the API. Please check the network connection or API URL. Error: {error}</p>
        <button className="btn btn-primary mt-3" onClick={fetchCategories}>Retry</button>
      </div>
    );
  }

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h3 mb-1 fw-bold text-dark">
              <Tag size={28} className="me-2 text-primary" />
              Categories Management
            </h2>
            <p className="text-muted mb-0">Manage your product categories efficiently</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary">
              <Download size={18} className="me-2" />
              Export
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="me-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-3">
              <div className={`card border-0 shadow-sm bg-${stat.color} bg-opacity-10 border-${stat.color} border-opacity-25`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className={`text-${stat.color} mb-1 fw-medium`}>{stat.title}</p>
                      <h4 className="mb-0 fw-bold">{stat.value}</h4>
                    </div>
                    <div className={`p-2 bg-${stat.color} bg-opacity-25 rounded`}>
                      <span className={`text-${stat.color}`}>{stat.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Filters and Controls */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-secondary w-100">
                  <Filter size={18} className="me-2" />
                  Filter
                </button>
              </div>
              <div className="col-md-3">
                <div className="btn-group w-100" role="group">
                  <button 
                    className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('table')}
                  >
                    <List size={18} />
                  </button>
                  <button 
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Content */}
        {viewMode === 'table' ? (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Categories List</h5>
              <span className="badge bg-light text-dark">{filteredCategories.length} categories</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 fw-semibold">#</th>
                      <th className="border-0 fw-semibold">Category</th>
                      <th className="border-0 fw-semibold">Products</th>
                      <th className="border-0 fw-semibold">Revenue</th>
                      <th className="border-0 fw-semibold">Status</th>
                      <th className="border-0 fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td className="fw-bold text-primary">#{category.id}</td>
                        <td>
                          <div>
                            <div className="fw-semibold">{category.name}</div>
                            <small className="text-muted">{category.description}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {category.products || 0} items
                          </span>
                        </td>
                        <td className="fw-semibold">{category.revenue || 'KSh 0'}</td>
                        <td>
                          <span className={`badge ${category.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {category.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="View Details">
                              <Eye size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" title="Edit">
                              <Edit size={14} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              title="Delete"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredCategories.map((category) => (
              <div key={category.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-2 bg-primary bg-opacity-10 rounded">
                        <Tag className="text-primary" size={20} />
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                          <MoreVertical size={14} />
                        </button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#"><Eye size={14} className="me-2" />View</a></li>
                          <li><a className="dropdown-item" href="#"><Edit size={14} className="me-2" />Edit</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button 
                              className="dropdown-item text-danger" 
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 size={14} className="me-2" />Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text text-muted">{category.description}</p>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="border-end">
                          <h6 className="mb-0">{category.products || 0}</h6>
                          <small className="text-muted">Products</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <h6 className="mb-0">{category.revenue || 'KSh 0'}</h6>
                        <small className="text-muted">Revenue</small>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`badge ${category.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {category.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <form onSubmit={handleAddCategory} className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Category</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div>
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter category name" 
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Enter description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        value={newCategory.status}
                        onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
      />
      
      {/* Bootstrap JS for dropdowns and modal functionality */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default Categories;
