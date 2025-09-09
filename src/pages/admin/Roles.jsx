// 📁 src/pages/admin/RolesComponent.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield, PlusCircle, Search, RefreshCw, Users, CheckCircle, Clock
} from 'lucide-react';

const RolesComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    status: 'active',
    permissions: []
  });

  const rolesPerPage = 6;

  // ✅ Permissions list
  const allPermissions = [
    'View Users',
    'Create Users',
    'Edit Users',
    'Delete Users',
    'View Orders',
    'Manage Products',
    'View Reports',
    'Configure Settings'
  ];

  // Sample data
  const sampleRoles = [
    {
      id: 1,
      name: 'Admin',
      description: 'Full access',
      status: 'active',
      users: 5,
      permissions: allPermissions
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage orders and products',
      status: 'active',
      users: 3,
      permissions: ['View Users', 'Manage Products', 'View Orders']
    }
  ];

  const stats = [
    { title: 'Total Roles', value: roles.length, icon: <Users size={24} />, color: 'primary' },
    { title: 'Active Roles', value: roles.filter(r => r.status === 'active').length, icon: <CheckCircle size={24} />, color: 'success' },
    { title: 'Inactive Roles', value: roles.filter(r => r.status === 'inactive').length, icon: <Clock size={24} />, color: 'warning' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setRoles(sampleRoles);
      setFilteredRoles(sampleRoles);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = roles.filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || role.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredRoles(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, roles]);

  const currentRoles = filteredRoles.slice(
    (currentPage - 1) * rolesPerPage,
    currentPage * rolesPerPage
  );
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  const handleAddRole = () => {
    if (newRole.name) {
      const newData = {
        ...newRole,
        id: Math.max(...roles.map(r => r.id)) + 1 || 1,
        users: 0
      };
      setRoles(prev => [newData, ...prev]);
      setNewRole({ name: '', description: '', status: 'active', permissions: [] });
      setShowAddModal(false);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole({ ...role });
  };

  const handleUpdateRole = () => {
    if (editingRole) {
      setRoles(prev => prev.map(r => r.id === editingRole.id ? editingRole : r));
      setEditingRole(null);
    }
  };

  const handleDeleteRole = (id) => {
    if (window.confirm('Delete this role?')) {
      setRoles(prev => prev.filter(r => r.id !== id));
    }
  };

  // Checkbox handlers
  const togglePermission = (perm, roleObj, setRoleObj) => {
    const exists = roleObj.permissions.includes(perm);
    let updatedPerms;
    if (exists) {
      updatedPerms = roleObj.permissions.filter(p => p !== perm);
    } else {
      updatedPerms = [...roleObj.permissions, perm];
    }
    setRoleObj(prev => ({ ...prev, permissions: updatedPerms }));
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} />
        <p className="mt-2 text-muted">Loading Roles...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white d-flex align-items-center gap-2 fw-bold">
            <Shield size={30} /> Role Management
          </h2>
          <button onClick={() => setShowAddModal(true)} className="btn btn-success btn-sm">
            <PlusCircle className="me-2" size={18} /> Add Role
          </button>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-4">
          {stats.map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="card border-0 shadow-sm h-100" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body">
                  <div className={`p-3 rounded-3 bg-${s.color} bg-opacity-10 mb-2`}>
                    <span className={`text-${s.color}`}>{s.icon}</span>
                  </div>
                  <h6 className="text-muted fw-medium">{s.title}</h6>
                  <h3 className="fw-bold">{s.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)'}}>
          <div className="card-body row g-3">
            <div className="col-md-6 position-relative">
              <Search className="position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}} size={20} />
              <input
                type="text"
                placeholder="Search role..."
                className="form-control form-control-sm"
                style={{paddingLeft: '45px'}}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select form-select-sm" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-light btn-sm" onClick={() => setRefreshing(true)}>
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="row g-4">
          {currentRoles.map(role => (
            <div className="col-md-6 col-lg-4" key={role.id}>
              <div className="card shadow-sm border-0 h-100" style={{background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)'}}>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold mb-1">{role.name}</h5>
                    <span className={`badge ${role.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{role.status}</span>
                  </div>
                  <p className="text-muted mb-2">{role.description}</p>

                  {/* Display permissions */}
                  <div className="mb-3">
                    {role.permissions.map(p => (
                      <span key={p} className="badge bg-light text-dark border me-1 mb-1">{p}</span>
                    ))}
                  </div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="text-primary small">Users: {role.users}</span>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEditRole(role)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRole(role.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="page-link">Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i+1} className={`page-item ${currentPage === i+1 ? 'active' : ''}`}>
                  <button onClick={() => setCurrentPage(i+1)} className="page-link">{i+1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev+1))} className="page-link">Next</button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Role</h5>
                <button onClick={() => setShowAddModal(false)} className="btn-close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Role Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({...prev, description: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newRole.status}
                    onChange={(e) => setNewRole(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Permissions */}
                <div className="mb-2">
                  <label className="form-label">Permissions</label>
                  {allPermissions.map((perm, idx) => (
                    <div className="form-check" key={idx}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`perm-${idx}`}
                        checked={newRole.permissions.includes(perm)}
                        onChange={() => togglePermission(perm, newRole, setNewRole)}
                      />
                      <label className="form-check-label" htmlFor={`perm-${idx}`}>
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>

              </div>
              <div className="modal-footer">
                <button onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleAddRole} className="btn btn-primary">
                  <PlusCircle className="me-2" size={16} /> Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Role</h5>
                <button onClick={() => setEditingRole(null)} className="btn-close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Role Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={editingRole.description}
                    onChange={(e) => setEditingRole(prev => ({...prev, description: e.target.value}))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editingRole.status}
                    onChange={(e) => setEditingRole(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Permissions list */}
                <div className="mb-2">
                  <label className="form-label">Permissions</label>
                  {allPermissions.map((perm, idx) => (
                    <div className="form-check" key={idx}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`edit-perm-${idx}`}
                        checked={editingRole.permissions.includes(perm)}
                        onChange={() => togglePermission(perm, editingRole, setEditingRole)}
                      />
                      <label className="form-check-label" htmlFor={`edit-perm-${idx}`}>
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setEditingRole(null)} className="btn btn-secondary">Cancel</button>
                <button onClick={handleUpdateRole} className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RolesComponent;
