import React, { useState, useEffect } from 'react';
import {
  CreditCard, ShoppingCart, Users, Package,
  TrendingUp, TrendingDown, RefreshCw,
  Eye, Zap, Download, Activity,
  Filter, Settings
} from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  // State for fetched data
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Function to fetch all dashboard data from the API
  const fetchDashboardData = async () => {
    setRefreshing(true);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/orders');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const orders = await response.json();

      // Calculate dynamic stats from the data
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalOrders = orders.length;
      const uniqueCustomers = new Set(orders.map(order => `${order.firstName} ${order.lastName}`)).size;
      const productsSold = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

      const dynamicStats = [
        { title: 'Total Revenue', value: `KSh ${totalRevenue.toFixed(2)}`, change: '+12.5%', icon: 'CreditCard', color: 'primary', bgColor: 'primary' },
        { title: 'Total Orders', value: totalOrders.toString(), change: '+8.2%', icon: 'ShoppingCart', color: 'info', bgColor: 'info' },
        { title: 'New Customers', value: uniqueCustomers.toString(), change: '-2.1%', icon: 'Users', color: 'success', bgColor: 'success' },
        { title: 'Products Sold', value: productsSold.toString(), change: '+15.3%', icon: 'Package', color: 'warning', bgColor: 'warning' },
      ];

      // Map recent orders from the JSON
      const dynamicRecentOrders = orders.map(order => {
        const createdAt = new Date(order.created_at);
        const now = new Date();
        const diffInHours = Math.round((now - createdAt) / (1000 * 60 * 60));
        const timeAgo = `${diffInHours} hours ago`;
        return {
          id: `#00${order.id}`,
          customer: `${order.firstName} ${order.lastName}`,
          amount: `KSh ${parseFloat(order.total).toFixed(2)}`,
          status: 'completed', // Default status for now
          time: timeAgo,
        };
      });

      // Aggregate top products from the JSON
      const productMap = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productMap[item.product_name]) {
            productMap[item.product_name] = { sales: 0, revenue: 0 };
          }
          productMap[item.product_name].sales += item.quantity;
          productMap[item.product_name].revenue += parseFloat(item.price);
        });
      });
      
      const dynamicTopProducts = Object.keys(productMap).map(productName => ({
        name: productName,
        sales: productMap[productName].sales,
        revenue: `KSh ${productMap[productName].revenue.toFixed(2)}`,
        trend: '+20%', // Mock trend as it's not in the data
        category: 'N/A' // Category not in data
      }));

      setStats(dynamicStats);
      setRecentOrders(dynamicRecentOrders);
      setTopProducts(dynamicTopProducts);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load data. Please ensure the local server is running.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]); // Re-fetch data when the selected period changes

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="alert alert-danger text-center shadow-sm p-4" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please check your console for more details.</p>
        </div>
      </div>
    );
  }

  // Helper function to render a badge for the status
  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: "bg-success text-success",
      pending: "bg-warning text-warning",
      failed: "bg-danger text-danger",
    };
    return (
      <span className={`badge bg-opacity-10 ${statusClasses[status] || 'bg-secondary text-secondary'}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      {/* Bootstrap CSS (Assumed to be loaded in index.html) */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container-fluid py-4">

          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold text-white mb-2">
                    <Activity className="me-3" size={32} />
                    Dashboard Overview
                  </h1>
                  <p className="text-white-50 mb-0">Welcome back! Here's what's happening with your business today.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="form-select form-select-sm bg-white bg-opacity-90"
                    style={{ minWidth: '140px' }}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <button
                    onClick={handleRefresh}
                    className={`btn btn-light btn-sm ${refreshing ? 'disabled' : ''}`}
                    style={{ minWidth: '44px', height: '38px' }}
                  >
                    <RefreshCw size={18} className={refreshing ? 'spinner-border spinner-border-sm' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            {stats.map((stat, index) => (
              <div key={stat.title} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`p-3 rounded-3 bg-${stat.bgColor} bg-opacity-10`}>
                        <span className={`text-${stat.color}`}>{stat.icon === 'CreditCard' ? <CreditCard size={24} /> : stat.icon === 'ShoppingCart' ? <ShoppingCart size={24} /> : stat.icon === 'Users' ? <Users size={24} /> : stat.icon === 'Package' ? <Package size={24} /> : null}</span>
                      </div>
                      <div className={`badge ${stat.change.startsWith('-') ? 'bg-danger' : 'bg-success'} bg-opacity-10 ${stat.change.startsWith('-') ? 'text-danger' : 'text-success'} d-flex align-items-center gap-1`}>
                        {stat.change.startsWith('-') ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                        {stat.change}
                      </div>
                    </div>
                    <h6 className="text-muted mb-2 fw-medium">{stat.title}</h6>
                    <h3 className="fw-bold mb-0 text-dark">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="row g-4 mb-4">

            {/* Recent Orders */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">
                    <ShoppingCart className="me-2" size={20} />
                    Recent Orders
                  </h5>
                  <button className="btn btn-outline-primary btn-sm">
                    <Eye size={16} className="me-1" />
                    View All
                  </button>
                </div>
                <div className="card-body pt-0">
                  {recentOrders.map((order, index) => (
                    <div key={order.id} className={`d-flex justify-content-between align-items-center py-3 ${index !== recentOrders.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                          <Users size={20} className="text-muted" />
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold">{order.customer}</h6>
                          <div className="d-flex align-items-center gap-2">
                            <small className="text-primary fw-medium">{order.id}</small>
                            <small className="text-muted">• {order.time}</small>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold mb-1">{order.amount}</div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
                  <h5 className="mb-0 fw-bold">
                    <Package className="me-2" size={20} />
                    Top Products
                  </h5>
                  <button className="btn btn-outline-secondary btn-sm">
                    <Filter size={16} />
                  </button>
                </div>
                <div className="card-body pt-0">
                  {topProducts.map((product, index) => (
                    <div key={index} className={`py-3 ${index !== topProducts.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 fw-semibold">{product.name}</h6>
                          <small className="text-muted">{product.category}</small>
                        </div>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          {product.trend}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">{product.sales} sales</small>
                        <span className="fw-bold">{product.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="card-header bg-transparent border-0 py-3">
                  <h5 className="mb-0 fw-bold">
                    <Zap className="me-2" size={20} />
                    Quick Actions
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center gap-2 border-2">
                        <Package size={24} />
                        <span className="fw-medium">Add Product</span>
                      </button>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <button className="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center gap-2 border-2">
                        <Eye size={24} />
                        <span className="fw-medium">View Orders</span>
                      </button>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <button className="btn btn-outline-success w-100 py-3 d-flex flex-column align-items-center gap-2 border-2">
                        <Download size={24} />
                        <span className="fw-medium">Export Data</span>
                      </button>
                    </div>
                    <div className="col-lg-3 col-md-4 col-sm-6">
                      <button className="btn btn-outline-secondary w-100 py-3 d-flex flex-column align-items-center gap-2 border-2">
                        <Settings size={24} />
                        <span className="fw-medium">Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
      />

      {/* Custom Styles */}
      <style>{`
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

        @media (max-width: 768px) {
          .display-5 {
            font-size: 1.8rem;
          }

          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
