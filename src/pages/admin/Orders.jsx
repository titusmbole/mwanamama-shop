// src/pages/Orders.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api/orders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch orders (items are included by your backend controller)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE);
      // schema is snake_case; add a temporary status since schema has no status column
      const withStatus = data.map((o) => ({ ...o, status: o.status || "Completed" }));
      setOrders(withStatus);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: "bg-warning text-dark",
      Completed: "bg-success",
      Processing: "bg-primary",
      Cancelled: "bg-danger",
    };
    return `badge ${statusClasses[status] || "bg-secondary"}`;
  };

  // Search + (optional) status filter
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        `${order.firstName} ${order.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `#${order.id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Stats
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
    [orders]
  );
  const completedCount = useMemo(
    () => orders.filter((o) => o.status === "Completed").length,
    [orders]
  );
  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "Pending").length,
    [orders]
  );

  // Actions
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.error("Error deleting order:", e);
      alert("Failed to delete order.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editOrder) return;
    setSaving(true);
    try {
      // backend expects { customerInfo: {...}, orderInfo: {...} }
      const payload = {
        customerInfo: {
          firstName: editOrder.firstName,
          lastName: editOrder.lastName,
          branch: editOrder.branch,
          phoneNumber: editOrder.phoneNumber,
          numberOfMonths: Number(editOrder.numberOfMonths),
          location: editOrder.location,
          groupName: editOrder.groupName,
          creditOfficer: editOrder.creditOfficer,
        },
        orderInfo: {
          subtotal: Number(editOrder.subtotal),
          shipping: Number(editOrder.shipping),
          tax: Number(editOrder.tax),
          total: Number(editOrder.total),
          // if you allow editing items, include items: editOrder.items
        },
      };
  
      await axios.put(`${API_BASE}/${editOrder.id}`, payload);
      await fetchOrders();
      setEditOrder(null);
    } catch (e) {
      console.error("Error updating order:", e.response?.data || e.message);
      alert("Failed to update order.");
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 mb-0 text-dark fw-bold">
                <i className="bi bi-bag-check me-2"></i>Orders Management
              </h2>
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>New Order
              </button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title text-white-50">Total Orders</h6>
                        <h3 className="mb-0">{orders.length}</h3>
                      </div>
                      <div className="align-self-center">
                        <i className="bi bi-bag-check fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title text-white-50">Completed</h6>
                        <h3 className="mb-0">{completedCount}</h3>
                      </div>
                      <div className="align-self-center">
                        <i className="bi bi-check-circle fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm bg-warning text-dark">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title text-dark opacity-75">Pending</h6>
                        <h3 className="mb-0">{pendingCount}</h3>
                      </div>
                      <div className="align-self-center">
                        <i className="bi bi-clock fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 mb-3">
                <div className="card border-0 shadow-sm bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="card-title text-white-50">Total Revenue</h6>
                        <h3 className="mb-0">KSh {totalRevenue.toLocaleString()}</h3>
                      </div>
                      <div className="align-self-center">
                        <i className="bi bi-cash-stack fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search orders..."
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
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-secondary w-100" onClick={fetchOrders}>
                      <i className="bi bi-arrow-repeat me-2"></i>Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="mb-0">Orders List</h5>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center p-4">Loading orders...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0 fw-semibold">Order ID</th>
                          <th className="border-0 fw-semibold">Customer</th>
                          <th className="border-0 fw-semibold">Date</th>
                          <th className="border-0 fw-semibold">Amount</th>
                          <th className="border-0 fw-semibold">Status</th>
                          <th className="border-0 fw-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="fw-bold text-primary">#{order.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bi bi-person text-muted"></i>
                                </div>
                                {order.firstName} {order.lastName}
                              </div>
                            </td>
                            <td className="text-muted">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="fw-semibold">KSh {Number(order.total).toLocaleString()}</td>
                            <td>
                              <span className={getStatusBadge(order.status)}>{order.status}</span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="View"
                                  onClick={() => setViewOrder(order)}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit"
                                  onClick={() => setEditOrder(order)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                  onClick={() => handleDelete(order.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center text-muted py-4">
                              No orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="card-footer bg-white border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </small>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className="page-item">
                        <button className="page-link" disabled>
                          Previous
                        </button>
                      </li>
                      <li className="page-item active">
                        <button className="page-link">1</button>
                      </li>
                      <li className="page-item">
                        <button className="page-link" disabled>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      

      {/* View Modal (Bootstrap-styled overlay) */}
      {viewOrder && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order #{viewOrder.id}</h5>
                <button type="button" className="btn-close" onClick={() => setViewOrder(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-2"><strong>Customer:</strong> {viewOrder.firstName} {viewOrder.lastName}</div>
                    <div className="mb-2"><strong>Phone:</strong> {viewOrder.phoneNumber}</div>
                    <div className="mb-2"><strong>Branch:</strong> {viewOrder.branch}</div>
                    <div className="mb-2"><strong>Location:</strong> {viewOrder.location}</div>
                    <div className="mb-2"><strong>Group Name:</strong> {viewOrder.groupName}</div>
                    <div className="mb-2"><strong>Credit Officer:</strong> {viewOrder.creditOfficer}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2"><strong>Subtotal:</strong> KSh {Number(viewOrder.subtotal).toLocaleString()}</div>
                    <div className="mb-2"><strong>Shipping:</strong> KSh {Number(viewOrder.shipping).toLocaleString()}</div>
                    <div className="mb-2"><strong>Tax:</strong> KSh {Number(viewOrder.tax).toLocaleString()}</div>
                    <div className="mb-2"><strong>Total:</strong> <span className="fw-bold text-primary">KSh {Number(viewOrder.total).toLocaleString()}</span></div>
                    <div className="mb-2"><strong>Status:</strong> <span className={getStatusBadge(viewOrder.status)}>{viewOrder.status}</span></div>
                    <div className="mb-2"><strong>Date:</strong> {viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleString() : "-"}</div>
                  </div>
                </div>

                <hr />
                <h6 className="fw-semibold mb-3">Order Items</h6>
                {Array.isArray(viewOrder.items) && viewOrder.items.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewOrder.items.map((it) => (
                          <tr key={it.id}>
                            <td>{it.product_name}</td>
                            <td className="text-end">{it.quantity}</td>
                            <td className="text-end">KSh {Number(it.price).toLocaleString()}</td>
                            <td className="text-end">KSh {Number(it.price * it.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted">No items found for this order.</div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewOrder(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOrder && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Order #{editOrder.id}</h5>
                  <button type="button" className="btn-close" onClick={() => setEditOrder(null)} />
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">First Name</label>
                      <input className="form-control" name="firstName" value={editOrder.firstName || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Last Name</label>
                      <input className="form-control" name="lastName" value={editOrder.lastName || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Branch</label>
                      <input className="form-control" name="branch" value={editOrder.branch || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Phone Number</label>
                      <input className="form-control" name="phoneNumber" value={editOrder.phoneNumber || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Number of Months</label>
                      <input type="number" className="form-control" name="numberOfMonths" value={editOrder.numberOfMonths || 0} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Location</label>
                      <input className="form-control" name="location" value={editOrder.location || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Group Name</label>
                      <input className="form-control" name="groupName" value={editOrder.groupName || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Credit Officer</label>
                      <input className="form-control" name="creditOfficer" value={editOrder.creditOfficer || ""} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Subtotal</label>
                      <input type="number" step="0.01" className="form-control" name="subtotal" value={editOrder.subtotal || 0} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Shipping</label>
                      <input type="number" step="0.01" className="form-control" name="shipping" value={editOrder.shipping || 0} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-medium">Tax</label>
                      <input type="number" step="0.01" className="form-control" name="tax" value={editOrder.tax || 0} onChange={handleEditChange} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label fw-medium">Total</label>
                      <input type="number" step="0.01" className="form-control" name="total" value={editOrder.total || 0} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" type="button" onClick={() => setEditOrder(null)}>Cancel</button>
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Icons (for your existing icons) */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
      />
    </>
  );
};

export default Orders;
