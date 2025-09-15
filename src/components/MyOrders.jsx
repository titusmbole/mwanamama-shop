import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package2, Eye, RotateCcw, Truck, CheckCircle, Clock, XCircle, Search, Filter, Calendar, ChevronDown, Lock } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = "https://api.mwanamama.org/api/v1";

const OrderItem = ({ item }) => {
  const itemPrice = item?.price ?? 0;
  const itemQuantity = item?.quantity ?? 0;
  
  return (
    <div className="d-flex align-items-center border-bottom py-2">
      <img 
        src={item?.imageUrl || `https://placehold.co/50x50/667eea/ffffff?text=No+Img`}
        alt={item?.productName || 'product image'}
        className="rounded"
        style={{width: '50px', height: '50px', objectFit: 'cover'}}
      />
      <div className="ms-3 flex-grow-1">
        <h6 className="mb-1 fw-semibold">{item?.productName || 'Unknown Item'}</h6>
        <small className="text-muted">Qty: {itemQuantity} × KSh {itemPrice.toLocaleString()}</small>
      </div>
      <div className="text-end">
        <div className="fw-bold">KSh {(itemPrice * itemQuantity).toLocaleString()}</div>
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [showItems, setShowItems] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package2 size={16} />;
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        {/* Order Header */}
        <div className="row align-items-center mb-3">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-2">
              <h5 className="fw-bold mb-0 me-3">Order #{order?.orderNumber}</h5>
              <span className={`badge bg-${getStatusColor(order?.status)} d-flex align-items-center`}>
                {getStatusIcon(order?.status)}
                <span className="ms-1">{order?.status}</span>
              </span>
            </div>
            <div className="text-muted small">
              <span className="me-4">
                {/* NOTE: 'dateCreated' is not in the JSON you provided. You will need to confirm the correct key. */}
                <Calendar size={14} className="me-1" />
                Ordered: {new Date(order?.dateCreated).toLocaleDateString()}
              </span>
              {/* NOTE: 'deliveryDate' is not in the JSON you provided. You will need to confirm the correct key. */}
              {order?.deliveryDate && (
                <span>
                  <Truck size={14} className="me-1" />
                  {order.status === 'delivered' ? 'Delivered' : 'Expected'}: {new Date(order?.deliveryDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="fw-bold fs-5 mb-2" style={{color: '#667eea'}}>
              {/* NOTE: 'total' is not in the JSON you provided. It has 'price' at the top level. Consider using `order?.price`. */}
              KSh {order?.price?.toLocaleString() ?? '0.00'}
            </div>
            <small className="text-muted">{order?.items?.length || 0} items</small>
          </div>
        </div>

        {/* Progress Bar - Assuming the API provides a progress field or we can calculate it */}
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">Order Progress</small>
            {/* NOTE: 'progress' is not in the JSON you provided. You will need to confirm the correct key or calculate this. */}
            <small className="text-muted">{order?.progress || 0}% Complete</small>
          </div>
          <div className="progress" style={{height: '6px'}}>
            <div 
              className={`progress-bar bg-${getStatusColor(order?.status)}`}
              style={{width: `${order?.progress || 0}%`}}
            />
          </div>
        </div>

        {/* Quick Items Preview */}
        <div className="d-flex align-items-center mb-3">
          <div className="d-flex">
            {order?.items?.slice(0, 3).map((item, index) => (
              <img
                key={index}
                src={item?.imageUrl || `https://placehold.co/40x40/667eea/ffffff?text=No+Img`}
                alt={item?.productName}
                className="rounded border"
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                  marginLeft: index > 0 ? '-10px' : '0',
                  zIndex: 3 - index
                }}
              />
            ))}
            {order?.items?.length > 3 && (
              <div 
                className="rounded border bg-light d-flex align-items-center justify-content-center text-muted small fw-bold"
                style={{
                  width: '40px',
                  height: '40px',
                  marginLeft: '-10px',
                  zIndex: 0
                }}
              >
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <button 
            className="btn btn-link text-decoration-none ms-3 p-0"
            onClick={() => setShowItems(!showItems)}
            style={{color: '#667eea'}}
          >
            {showItems ? 'Hide' : 'Show'} Items
            <ChevronDown size={16} className={`ms-1 ${showItems ? 'rotate-180' : ''}`} 
                        style={{transition: 'transform 0.3s'}} />
          </button>
        </div>

        {/* Expandable Items List */}
        {showItems && (
          <div className="mb-3">
            <div className="bg-light rounded p-3">
              {order?.items?.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-primary btn-sm">
            <Eye size={16} className="me-1" />
            View Details
          </button>
          
          {order?.status === 'delivered' && (
            <button className="btn btn-outline-success btn-sm">
              <RotateCcw size={16} className="me-1" />
              Buy Again
            </button>
          )}
          
          {/* NOTE: 'canTrack' is not in the JSON you provided. You will need to confirm the correct key. */}
          {order?.canTrack && (
            <button className="btn btn-outline-info btn-sm">
              <Truck size={16} className="me-1" />
              Track Order
            </button>
          )}
          
          {/* NOTE: 'canCancel' is not in the JSON you provided. You will need to confirm the correct key. */}
          {order?.canCancel && (
            <button className="btn btn-outline-danger btn-sm">
              <XCircle size={16} className="me-1" />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for a single order card
const OrderCardSkeleton = () => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-body">
      <div className="row align-items-center mb-3">
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-2">
            <div className="skeleton mb-2" style={{ width: "120px", height: "24px" }} />
            <div className="skeleton ms-3" style={{ width: "80px", height: "20px" }} />
          </div>
          <div className="skeleton" style={{ width: "200px", height: "16px" }} />
        </div>
        <div className="col-md-4 text-md-end">
          <div className="skeleton mb-2 ms-auto" style={{ width: "80px", height: "24px" }} />
          <div className="skeleton ms-auto" style={{ width: "50px", height: "14px" }} />
        </div>
      </div>
      <div className="mb-3">
        <div className="skeleton mb-2" style={{ width: "100%", height: "16px" }} />
        <div className="skeleton" style={{ width: "100%", height: "6px" }} />
      </div>
      <div className="d-flex gap-2 flex-wrap">
        <div className="skeleton" style={{ width: "100px", height: "38px" }} />
        <div className="skeleton" style={{ width: "100px", height: "38px" }} />
        <div className="skeleton" style={{ width: "100px", height: "38px" }} />
      </div>
    </div>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { adminToken } = useAdminAuth();
  const { user } = useAuth();
  const authToken = adminToken || user?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setOrders(response.data?.content || response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
           toast.error("Session expired. Please log in again.");
        } else {
           toast.error("Failed to load orders. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         // Corrected 'item.name' to 'item.productName'
                         order.items?.some(item => item.productName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter?.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders?.length ?? 0,
    delivered: orders?.filter(o => o.status?.toLowerCase() === 'delivered').length ?? 0,
    processing: orders?.filter(o => o.status?.toLowerCase() === 'processing').length ?? 0,
    shipped: orders?.filter(o => o.status?.toLowerCase() === 'shipped').length ?? 0,
    // Corrected 'order.total' to 'order.price' based on JSON model
    totalSpent: orders?.reduce((sum, order) => sum + (order.price || 0), 0) ?? 0
  };

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />

      <div className="container my-5">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
            <Package2 className="me-2" size={32} />
            My Orders
          </h2>
          <p className="text-muted">Track and manage your orders</p>
        </div>

        {/* Order Statistics */}
        <div className="row mb-4">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h3 className="fw-bold mb-1" style={{color: '#667eea'}}>{orderStats.total}</h3>
                <small className="text-muted">Total Orders</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h3 className="fw-bold mb-1 text-success">{orderStats.delivered}</h3>
                <small className="text-muted">Delivered</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mt-3 mt-md-0">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h3 className="fw-bold mb-1 text-warning">{orderStats.processing}</h3>
                <small className="text-muted">Processing</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mt-3 mt-md-0">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <h3 className="fw-bold mb-1" style={{color: '#667eea'}}>
                  KSh {orderStats.totalSpent.toLocaleString()}
                </h3>
                <small className="text-muted">Total Spent</small>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="position-relative">
                  <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Search orders by order ID or product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{borderRadius: '15px'}}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select form-select-lg"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{borderRadius: '15px'}}
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select form-select-lg"
                  value={"all"} // This filter is not implemented yet
                  onChange={(e) => {}}
                  style={{borderRadius: '15px'}}
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        ) : !authToken ? (
          /* "Please Log In" message */
          <div className="text-center py-5">
            <div className="mb-4">
              <Lock size={80} className="text-muted" />
            </div>
            <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>
              Please log in to view your orders
            </h3>
            <p className="text-muted mb-4">
              You need to be authenticated to access this page.
            </p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div>
            {filteredOrders.map(order => (
              // Using order.id as the key, as it is a unique identifier in the JSON
              <OrderCard key={order.id} order={order} />
            ))}
            
            {/* Load More Button - Not functional with current API, but kept for design */}
            <div className="text-center">
              <button 
                className="btn btn-outline-primary px-5 py-2"
                style={{borderRadius: '25px'}}
              >
                Load More Orders
              </button>
            </div>
          </div>
        ) : (
          /* No Orders */
          <div className="text-center py-5">
            <div className="mb-4">
              <Package2 size={80} className="text-muted" />
            </div>
            <h3 className="fw-bold mb-3" style={{color: '#2c3e50'}}>
              {searchTerm || statusFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
            </h3>
            <p className="text-muted mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start shopping to see your orders here'}
            </p>
            <button 
              className="btn text-white px-5 py-3"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        .rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
};

export default Orders;