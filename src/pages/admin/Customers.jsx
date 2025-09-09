import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Filter, MoreVertical, 
  Mail, Phone, MapPin, Calendar, Star, 
  ShoppingBag, DollarSign, TrendingUp, Eye,
  Edit, Trash2, Download, Settings, Activity,
  UserCheck, Clock, AlertCircle, RefreshCw
} from 'lucide-react';

const Customers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      joinDate: '2024-01-15',
      totalSpent: 125000,
      totalOrders: 24,
      lastOrder: '2025-08-18',
      status: 'active',
      segment: 'VIP',
      avatar: 'AJ'
    },
    {
      id: 2,
      name: 'Robert Kimani',
      email: 'robert.kimani@email.com',
      phone: '+254 723 456 789',
      location: 'Mombasa, Kenya',
      joinDate: '2024-02-20',
      totalSpent: 89500,
      totalOrders: 18,
      lastOrder: '2025-08-15',
      status: 'active',
      segment: 'Premium',
      avatar: 'RK'
    },
    {
      id: 3,
      name: 'Grace Wanjiku',
      email: 'grace.wanjiku@email.com',
      phone: '+254 734 567 890',
      location: 'Kisumu, Kenya',
      joinDate: '2024-03-10',
      totalSpent: 67300,
      totalOrders: 15,
      lastOrder: '2025-08-12',
      status: 'active',
      segment: 'Regular',
      avatar: 'GW'
    },
    {
      id: 4,
      name: 'Michael Ochieng',
      email: 'michael.ochieng@email.com',
      phone: '+254 745 678 901',
      location: 'Eldoret, Kenya',
      joinDate: '2024-04-05',
      totalSpent: 45800,
      totalOrders: 12,
      lastOrder: '2025-07-28',
      status: 'inactive',
      segment: 'Regular',
      avatar: 'MO'
    },
    {
      id: 5,
      name: 'Sarah Muthoni',
      email: 'sarah.muthoni@email.com',
      phone: '+254 756 789 012',
      location: 'Nakuru, Kenya',
      joinDate: '2024-05-12',
      totalSpent: 156700,
      totalOrders: 31,
      lastOrder: '2025-08-19',
      status: 'active',
      segment: 'VIP',
      avatar: 'SM'
    },
    {
      id: 6,
      name: 'David Kipchoge',
      email: 'david.kipchoge@email.com',
      phone: '+254 767 890 123',
      location: 'Thika, Kenya',
      joinDate: '2024-06-08',
      totalSpent: 32400,
      totalOrders: 8,
      lastOrder: '2025-08-10',
      status: 'new',
      segment: 'New',
      avatar: 'DK'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter.toLowerCase();
    const matchesSegment = segmentFilter === 'All' || customer.segment === segmentFilter;
    return matchesSearch && matchesStatus && matchesSegment;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const newCustomers = customers.filter(c => c.status === 'new').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const stats = [
    { 
      title: 'Total Customers', 
      value: totalCustomers.toString(), 
      icon: <Users size={24} />, 
      color: 'primary',
      change: '+12',
      period: 'this month'
    },
    { 
      title: 'Active Customers', 
      value: activeCustomers.toString(), 
      icon: <UserCheck size={24} />, 
      color: 'success',
      change: '+8',
      period: 'active now'
    },
    { 
      title: 'New Customers', 
      value: newCustomers.toString(), 
      icon: <UserPlus size={24} />, 
      color: 'info',
      change: '+3',
      period: 'this week'
    },
    { 
      title: 'Customer LTV', 
      value: `KSh ${Math.round(totalRevenue / totalCustomers).toLocaleString()}`, 
      icon: <DollarSign size={24} />, 
      color: 'warning',
      change: '+15%',
      period: 'avg. lifetime'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { class: 'bg-success', text: 'Active' },
      'inactive': { class: 'bg-secondary', text: 'Inactive' },
      'new': { class: 'bg-info', text: 'New' }
    };
    return statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
  };

  const getSegmentBadge = (segment) => {
    const segmentConfig = {
      'VIP': { class: 'bg-warning text-dark', text: 'VIP' },
      'Premium': { class: 'bg-primary', text: 'Premium' },
      'Regular': { class: 'bg-secondary', text: 'Regular' },
      'New': { class: 'bg-info', text: 'New' }
    };
    return segmentConfig[segment] || { class: 'bg-secondary', text: 'Regular' };
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Customers...</h5>
        </div>
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
      
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container-fluid py-4">
          
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold text-white mb-2">
                    <Users className="me-3" size={32} />
                    Customer Management
                  </h1>
                  <p className="text-white-50 mb-0">Manage your customers and track their engagement</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    onClick={handleRefresh} 
                    className={`btn btn-light btn-sm ${refreshing ? 'disabled' : ''}`}
                    style={{minWidth: '44px', height: '38px'}}
                  >
                    <RefreshCw size={18} className={refreshing ? 'spinner-border spinner-border-sm' : ''} />
                  </button>
                  <button className="btn btn-success btn-sm">
                    <Download size={18} className="me-2" />
                    Export
                  </button>
                  <button className="btn btn-warning btn-sm">
                    <UserPlus size={18} className="me-2" />
                    Add Customer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10`}>
                        <span className={`text-${stat.color}`}>{stat.icon}</span>
                      </div>
                      <div className="badge bg-success bg-opacity-10 text-success">
                        +{stat.change}
                      </div>
                    </div>
                    <h6 className="text-muted mb-2 fw-medium">{stat.title}</h6>
                    <h3 className="fw-bold mb-1 text-dark">{stat.value}</h3>
                    <small className="text-muted">{stat.period}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Controls */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body">
                  <div className="row g-3 align-items-center">
                    <div className="col-lg-4 col-md-6">
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Search size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search customers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-3">
                      <select 
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="New">New</option>
                      </select>
                    </div>
                    <div className="col-lg-2 col-md-3">
                      <select 
                        className="form-select"
                        value={segmentFilter}
                        onChange={(e) => setSegmentFilter(e.target.value)}
                      >
                        <option value="All">All Segments</option>
                        <option value="VIP">VIP</option>
                        <option value="Premium">Premium</option>
                        <option value="Regular">Regular</option>
                        <option value="New">New</option>
                      </select>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <button className="btn btn-outline-secondary w-100">
                        <Filter size={18} className="me-2" />
                        Advanced
                      </button>
                    </div>
                    <div className="col-lg-2 col-md-6">
                      <div className="btn-group w-100" role="group">
                        <button 
                          className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setViewMode('table')}
                        >
                          Table
                        </button>
                        <button 
                          className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setViewMode('cards')}
                        >
                          Cards
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customers Content */}
          {viewMode === 'table' ? (
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                  <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold">Customers List</h5>
                    <span className="badge bg-light text-dark">{filteredCustomers.length} customers</span>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 fw-semibold">Customer</th>
                            <th className="border-0 fw-semibold">Contact</th>
                            <th className="border-0 fw-semibold">Total Spent</th>
                            <th className="border-0 fw-semibold">Orders</th>
                            <th className="border-0 fw-semibold">Status</th>
                            <th className="border-0 fw-semibold">Segment</th>
                            <th className="border-0 fw-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCustomers.map((customer) => (
                            <tr key={customer.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                       style={{width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold'}}>
                                    {customer.avatar}
                                  </div>
                                  <div>
                                    <div className="fw-semibold">{customer.name}</div>
                                    <small className="text-muted d-flex align-items-center">
                                      <MapPin size={12} className="me-1" />
                                      {customer.location}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="d-flex align-items-center mb-1">
                                    <Mail size={12} className="me-1 text-muted" />
                                    <small>{customer.email}</small>
                                  </div>
                                  <div className="d-flex align-items-center">
                                    <Phone size={12} className="me-1 text-muted" />
                                    <small>{customer.phone}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="fw-bold">KSh {customer.totalSpent.toLocaleString()}</div>
                                <small className="text-muted">Lifetime value</small>
                              </td>
                              <td>
                                <div className="fw-semibold">{customer.totalOrders}</div>
                                <small className="text-muted">orders</small>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(customer.status).class}`}>
                                  {getStatusBadge(customer.status).text}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getSegmentBadge(customer.segment).class}`}>
                                  {getSegmentBadge(customer.segment).text}
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
                                  <button className="btn btn-sm btn-outline-success" title="Contact">
                                    <Mail size={14} />
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger" 
                                    title="Delete"
                                    onClick={() => handleDelete(customer.id)}
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
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '48px', height: '48px', fontSize: '16px', fontWeight: 'bold'}}>
                            {customer.avatar}
                          </div>
                          <div>
                            <h5 className="mb-1">{customer.name}</h5>
                            <small className="text-muted d-flex align-items-center">
                              <MapPin size={12} className="me-1" />
                              {customer.location}
                            </small>
                          </div>
                        </div>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#"><Eye size={14} className="me-2" />View Details</a></li>
                            <li><a className="dropdown-item" href="#"><Edit size={14} className="me-2" />Edit</a></li>
                            <li><a className="dropdown-item" href="#"><Mail size={14} className="me-2" />Contact</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <a 
                                className="dropdown-item text-danger" 
                                href="#"
                                onClick={() => handleDelete(customer.id)}
                              >
                                <Trash2 size={14} className="me-2" />Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Mail size={14} className="me-2 text-muted" />
                          <small className="text-muted">{customer.email}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <Phone size={14} className="me-2 text-muted" />
                          <small className="text-muted">{customer.phone}</small>
                        </div>
                      </div>

                      <div className="row text-center mb-3">
                        <div className="col-4">
                          <div className="border-end">
                            <h6 className="mb-0">KSh {customer.totalSpent.toLocaleString()}</h6>
                            <small className="text-muted">Total Spent</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="border-end">
                            <h6 className="mb-0">{customer.totalOrders}</h6>
                            <small className="text-muted">Orders</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <h6 className="mb-0">{customer.joinDate}</h6>
                          <small className="text-muted">Joined</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className={`badge ${getStatusBadge(customer.status).class}`}>
                          {getStatusBadge(customer.status).text}
                        </span>
                        <span className={`badge ${getSegmentBadge(customer.segment).class}`}>
                          {getSegmentBadge(customer.segment).text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Bootstrap Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" 
      />
      
      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
      
      {/* Custom Styles */}
      <style jsx>{`
        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .btn {
          transition: all 0.2s ease-in-out;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .spinner-border-sm {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .badge {
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(0,0,0,0.02);
        }
        
        @media (max-width: 768px) {
          .display-5 {
            font-size: 1.8rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .btn-group .btn {
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Customers;