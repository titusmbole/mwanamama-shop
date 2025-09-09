import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Users, UserPlus, Search, Download, RefreshCw,
  Mail, Phone, MapPin, Calendar, Settings, Eye,
  Edit, Trash2, MoreVertical, Shield, UserCheck,
  AlertCircle, CheckCircle, Clock, Star, Award, Key
} from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal'; // ✅ Import the new component

const API_URL = 'http://localhost:4000/api/users';

const UsersComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '', email: '', role: 'User', status: 'active', phone: '', location: ''
  });

  // ✅ New state for the confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

   // ✅ stats state
   const [userStats, setStats] = useState([]);
   const [statsLoading, setStatsLoading] = useState(true);

  const usersPerPage = 10;

  // ✅ fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`); 
      // expected backend response:
      // { totalUsers: 2847, activeUsers: 2124, newRegistrations: 156, pendingApproval: 23 }
      const data = res.data;

      const formattedStats = [
        {
          title: "Total Users",
          value: data.totalUsers,
          change: "+12.5%", 
          trend: "up",
          icon: <Users size={24} />,
          color: "primary",
          period: "vs last month",
        },
        {
          title: "Active Users",
          value: data.activeUsers,
          change: "+8.3%",
          trend: "up",
          icon: <UserCheck size={24} />,
          color: "success",
          period: "online now",
        },
        {
          title: "New Registrations",
          value: data.newRegistrations,
          change: "+15.2%",
          trend: "up",
          icon: <UserPlus size={24} />,
          color: "info",
          period: "this week",
        },
        {
          title: "Pending Approval",
          value: data.pendingApproval,
          change: "-5.1%",
          trend: "down",
          icon: <Clock size={24} />,
          color: "warning",
          period: "awaiting review",
        },
      ];
      setStats(formattedStats);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setRefreshing(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const userData = Array.isArray(data) ? data : [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setFilteredUsers([]);
      toast.error("Failed to fetch users. Please check your network connection.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, users]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });
  
        if (response.ok) {
          await fetchUsers();
          setNewUser({ name: '', email: '', role: 'User', status: 'active', phone: '', location: '' });
          setShowAddModal(false);
          toast.success("User created successfully! 🎉");
        } else {
          const errorData = await response.json();
          toast.error(`Failed to add user: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error adding user:", error);
        toast.error("Error creating user. Please try again.");
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleViewUser = (user) => {
    setViewingUser({ ...user });
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        const response = await fetch(`${API_URL}/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingUser),
        });
  
        if (response.ok) {
          await fetchUsers();
          setEditingUser(null);
          toast.info("User updated successfully! ✏️");
        } else {
          const errorData = await response.json();
          toast.error(`Failed to update user: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast.error("Error updating user. Please try again.");
      }
    }
  };

  // Handle status toggle (activate/deactivate)
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchUsers();
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully! 🔄`);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to update user status: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status. Please try again.");
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!userToResetPassword) return;

    try {
      const response = await fetch(`${API_URL}/${userToResetPassword.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setShowPasswordResetModal(false);
        setUserToResetPassword(null);
        toast.success("Password reset email sent successfully! 📧");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to reset password: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password. Please try again.");
    }
  };

  // ✅ New handler to show the confirmation modal
  const handleShowDeleteConfirm = (id) => {
    setUserToDeleteId(id);
    setShowConfirmModal(true);
  };

  // ✅ New handler to perform the deletion
  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    if (!userToDeleteId) return;

    try {
      const response = await fetch(`${API_URL}/${userToDeleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUsers();
        toast.warn("User deleted! 🗑️");
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete user: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Please try again.");
    } finally {
      setUserToDeleteId(null);
    }
  };

  // ✅ New handler to cancel the deletion
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDeleteId(null);
    toast.info("Deletion canceled.");
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      pending: 'bg-warning text-dark'
    };
    return badges[status] || 'bg-secondary';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <Shield size={16} />;
      case 'Manager': return <Award size={16} />;
      default: return <UserCheck size={16} />;
    }
  };

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (isLoading) {
    return (
      <>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading Users...</h5>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
      
      <div className="min-vh-100" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container-fluid py-4">
          
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h1 className="display-5 fw-bold text-white mb-2">
                    <Users className="me-3" size={32} />
                    User Management
                  </h1>
                  <p className="text-white-50 mb-0">Manage and monitor all users in your system</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    onClick={handleRefresh} 
                    className={`btn btn-light btn-sm ${refreshing ? 'disabled' : ''}`}
                    style={{minWidth: '44px', height: '38px'}}
                  >
                    <RefreshCw size={18} className={refreshing ? 'spinner-border spinner-border-sm' : ''} />
                  </button>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-success btn-sm"
                  >
                    <UserPlus size={18} className="me-2" />
                    Add User
                  </button>
                  <button className="btn btn-warning btn-sm">
                    <Download size={18} className="me-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="row g-4 mb-4">
            {userStats.map((stat, index) => (
              <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10`}>
                        <span className={`text-${stat.color}`}>{stat.icon}</span>
                      </div>
                      <div className={`badge ${stat.trend === 'up' ? 'bg-success' : 'bg-danger'} bg-opacity-10 ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                        {stat.change}
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

          {/* Filters */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body py-3">
                  <div className="row g-3">
                    <div className="col-lg-6 col-md-12">
                      <div className="position-relative">
                        <Search className="position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}} size={20} />
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Search users by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{paddingLeft: '45px'}}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <select 
                        className="form-select form-select-sm"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="User">User</option>
                      </select>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <select 
                        className="form-select form-select-sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body p-0">
                  {currentUsers.length === 0 ? (
                    <div className="text-center py-5">
                      <Users size={64} className="text-muted mb-3" />
                      <h4 className="text-muted">No users found</h4>
                      <p className="text-muted mb-4">Try adjusting your search criteria</p>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="btn btn-primary"
                      >
                        <UserPlus size={20} className="me-2" />
                        Add First User
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 px-4 py-3">User</th>
                            <th className="border-0 px-4 py-3">Contact</th>
                            <th className="border-0 px-4 py-3">Role</th>
                            <th className="border-0 px-4 py-3">Status</th>
                            <th className="border-0 px-4 py-3">Activity</th>
                            <th className="border-0 px-4 py-3">Stats</th>
                            <th className="border-0 px-4 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user, index) => (
                            <tr key={user.id} className="table-row-hover">
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center gap-3">
                                  <img 
                                    src={user.avatar} 
                                    alt={user.name}
                                    className="rounded-circle"
                                    style={{width: '45px', height: '45px', objectFit: 'cover'}}
                                  />
                                  <div>
                                    <h6 className="fw-bold mb-0">{user.name}</h6>
                                    <small className="text-muted">{user.email}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="small">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <Phone size={12} className="text-muted" />
                                    <span>{user.phone}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <MapPin size={12} className="text-muted" />
                                    <span>{user.location}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center gap-2">
                                  {getRoleIcon(user.role)}
                                  <span className="badge bg-primary">{user.role}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`badge ${getStatusBadge(user.status)}`}>
                                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="small">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <Calendar size={12} className="text-muted" />
                                    <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <Clock size={12} className="text-muted" />
                                    <span>Last: {user.lastActive}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="small">
                                  <div className="fw-bold text-primary">{user.orders} Orders</div>
                                  <div className="fw-bold text-success">KSh {user.totalSpent.toLocaleString()}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="d-flex justify-content-center gap-1">
                                  <button 
                                    className="btn btn-sm btn-outline-info"
                                    title="View User"
                                    onClick={() => handleViewUser(user)}
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    title="Edit User"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                    title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                  >
                                    {user.status === 'active' ? '⏸️' : '▶️'}
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete User"
                                    onClick={() => handleShowDeleteConfirm(user.id)}
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="row">
              <div className="col-12">
                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                        Previous
                      </button>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.location}
                      onChange={(e) => setNewUser(prev => ({...prev, location: e.target.value}))}
                      placeholder="Enter location"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({...prev, role: e.target.value}))}
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={newUser.status}
                      onChange={(e) => setNewUser(prev => ({...prev, status: e.target.value}))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddUser}>
                  <UserPlus size={16} className="me-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editingUser.phone}
                      onChange={(e) => setEditingUser(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingUser.location}
                      onChange={(e) => setEditingUser(prev => ({...prev, location: e.target.value}))}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser(prev => ({...prev, role: e.target.value}))}
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editingUser.status}
                      onChange={(e) => setEditingUser(prev => ({...prev, status: e.target.value}))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>
                  <Edit size={16} className="me-2" />
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewingUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Eye size={20} className="me-2" />
                  User Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setViewingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-12 text-center">
                    <img 
                      src={viewingUser.avatar} 
                      alt={viewingUser.name}
                      className="rounded-circle mb-3"
                      style={{width: '120px', height: '120px', objectFit: 'cover'}}
                    />
                    <h4 className="fw-bold">{viewingUser.name}</h4>
                    <p className="text-muted">{viewingUser.email}</p>
                    <div className="d-flex justify-content-center gap-2">
                      <span className={`badge ${getStatusBadge(viewingUser.status)} fs-6`}>
                        {viewingUser.status.charAt(0).toUpperCase() + viewingUser.status.slice(1)}
                      </span>
                      <span className="badge bg-primary fs-6">{viewingUser.role}</span>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted mb-3">Contact Information</h6>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Mail size={16} className="text-primary" />
                      <span>{viewingUser.email}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Phone size={16} className="text-primary" />
                      <span>{viewingUser.phone}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{viewingUser.location}</span>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted mb-3">Account Information</h6>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Calendar size={16} className="text-success" />
                      <span>Joined: {new Date(viewingUser.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Clock size={16} className="text-warning" />
                      <span>Last Active: {viewingUser.lastActive}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {getRoleIcon(viewingUser.role)}
                      <span>Role: {viewingUser.role}</span>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="fw-bold text-muted mb-3">Activity & Statistics</h6>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <div className="fw-bold text-primary h4">{viewingUser.orders}</div>
                          <small className="text-muted">Total Orders</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <div className="fw-bold text-success h4">KSh {viewingUser.totalSpent.toLocaleString()}</div>
                          <small className="text-muted">Total Spent</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={() => {
                    setUserToResetPassword(viewingUser);
                    setShowPasswordResetModal(true);
                  }}
                >
                  <Key size={16} className="me-2" />
                  Reset Password
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setViewingUser(null);
                    handleEditUser(viewingUser);
                  }}
                >
                  <Edit size={16} className="me-2" />
                  Edit User
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setViewingUser(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Confirmation Modal */}
      {showPasswordResetModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <Key size={20} className="me-2" />
                  Reset Password
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowPasswordResetModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <div className="alert alert-warning">
                    <AlertCircle size={20} className="me-2" />
                    Are you sure you want to reset the password for <strong>{userToResetPassword?.name}</strong>?
                  </div>
                </div>
                <p className="text-muted">
                  A password reset email will be sent to <strong>{userToResetPassword?.email}</strong>. 
                  The user will receive instructions to create a new password.
                </p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowPasswordResetModal(false);
                    setUserToResetPassword(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning" 
                  onClick={handlePasswordReset}
                >
                  <Key size={16} className="me-2" />
                  Send Reset Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ✅ Add the new modal component here */}
      <ConfirmationModal
        show={showConfirmModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this user? This action cannot be undone."
      />

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(102, 126, 234, 0.05) !important;
          transform: scale(1.01);
          transition: all 0.2s ease-in-out;
        }
        
        .btn {
          transition: all 0.2s ease-in-out;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
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

        .modal {
          backdrop-filter: blur(10px);
        }

        .page-link {
          border-radius: 8px;
          margin: 0 2px;
          border: 1px solid #dee2e6;
        }

        .page-item.active .page-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        .dropdown-menu {
          border: none;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .table th {
          font-weight: 600;
          color: #495057;
          background-color: rgba(102, 126, 234, 0.1) !important;
        }

        .table td {
          vertical-align: middle;
          border-color: rgba(0,0,0,0.05);
        }

        .btn-outline-info:hover,
        .btn-outline-primary:hover,
        .btn-outline-success:hover,
        .btn-outline-warning:hover,
        .btn-outline-danger:hover {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .display-5 {
            font-size: 1.8rem;
          }

          .card-body {
            padding: 1rem;
          }

          .btn-group .btn {
            font-size: 0.8rem;
          }

          .modal-dialog {
            margin: 1rem;
          }

          .table-responsive {
            font-size: 0.9rem;
          }

          .d-flex.gap-1 {
            flex-direction: column;
            gap: 0.25rem !important;
          }

          .d-flex.gap-1 .btn {
            width: 100%;
            justify-content: center;
          }
        }

        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .avatar-online {
          position: relative;
        }

        .avatar-online::after {
          content: '';
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #28a745;
          border: 2px solid white;
        }

        .user-stats {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .search-highlight {
          background-color: #fff3cd;
          padding: 0 2px;
          border-radius: 2px;
        }

        .table tbody tr {
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .table tbody tr:last-child {
          border-bottom: none;
        }

        .modal-content {
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom: none;
        }

        .modal-header .btn-close {
          filter: invert(1);
        }

        .alert-warning {
          border-left: 4px solid #ffc107;
          background-color: rgba(255, 193, 7, 0.1);
        }
      `}</style>
    </>
  );
};

export default UsersComponent;