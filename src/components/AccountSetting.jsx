import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, MapPin, Camera, Save, Eye, EyeOff, Bell, Shield, CreditCard, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import axios from 'axios';

const BASE_URL = 'https://api.mwanamama.org/api/v1';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  const [addresses, setAddresses] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    security: true
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: regularUser, token: regularUserToken } = useAuth();
  const { admin, adminToken } = useAdminAuth();

  const user = admin || regularUser;
  const token = adminToken || regularUserToken;

  // Fetch user data and addresses on component mount
  useEffect(() => {
    if (!user || !token || !user.id) {
      console.warn('User, token, or user ID is missing. Skipping API calls.');
      setIsLoading(false);
      setError('You must be logged in to view your account settings.');
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [profileResponse, addressesResponse] = await Promise.all([
          axios.get(`${BASE_URL}/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/users/${user.id}/addresses`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const fetchedProfile = profileResponse.data;
        const fetchedAddresses = addressesResponse.data;

        setProfileData({
          firstName: fetchedProfile.firstName || '',
          lastName: fetchedProfile.lastName || '',
          email: fetchedProfile.email || '',
          phone: fetchedProfile.phone || '',
          dateOfBirth: fetchedProfile.dateOfBirth || '',
          gender: fetchedProfile.gender || '',
          profileImage: fetchedProfile.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        });

        setAddresses(fetchedAddresses);

      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${BASE_URL}/users/${user.id}`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Profile updated successfully:', response.data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${BASE_URL}/users/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    } catch (err) {
      console.error('Failed to change password:', err);
      setError('Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const newValue = !notifications[key];
    setNotifications(prev => ({ ...prev, [key]: newValue }));
    
    // API call to update notification preferences
    try {
      await axios.put(`${BASE_URL}/users/notifications`, { [key]: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      // Revert the state change if the API call fails
      setNotifications(prev => ({ ...prev, [key]: !newValue }));
      setError('Failed to update notification settings. Please try again.');
    }
  };

  const addAddress = () => {
    const newAddress = {
      id: addresses.length + 1, // Placeholder for a real ID from API
      type: 'home',
      title: 'New Address',
      address: '',
      city: '',
      postalCode: '',
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
    // In a real app, this would be an API POST call
  };

  const updateAddress = (id, updatedAddress) => {
    // This would be a PUT/PATCH API call
    setAddresses(addresses.map(addr => addr.id === id ? { ...addr, ...updatedAddress } : addr));
  };

  const deleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsLoading(true);
      setError(null);
      try {
        await axios.delete(`${BASE_URL}/addresses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(addresses.filter(addr => addr.id !== id));
        alert('Address deleted successfully!');
      } catch (err) {
        console.error('Failed to delete address:', err);
        setError('Failed to delete address. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const setDefaultAddress = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.put(`${BASE_URL}/addresses/${id}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
      alert('Default address set successfully!');
    } catch (err) {
      console.error('Failed to set default address:', err);
      setError('Failed to set default address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newProfileImage = e.target.result;
        setProfileData(prev => ({ ...prev, profileImage: newProfileImage }));
        // API call to upload image
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  if (isLoading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading account data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="container my-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-2" style={{color: '#2c3e50'}}>
            <User className="me-2" size={32} />
            Account Settings
          </h2>
          <p className="text-muted">Manage your account information and preferences</p>
        </div>

        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`list-group-item list-group-item-action border-0 d-flex align-items-center py-3 ${
                          activeTab === tab.id ? 'active' : ''
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          backgroundColor: activeTab === tab.id ? '#667eea' : 'transparent',
                          color: activeTab === tab.id ? 'white' : '#2c3e50'
                        }}
                      >
                        <IconComponent size={20} className="me-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="fw-bold mb-4" style={{color: '#2c3e50'}}>Profile Information</h4>
                    
                    <div className="text-center mb-4">
                      <div className="position-relative d-inline-block">
                        <img
                          src={profileData.profileImage}
                          alt="Profile"
                          className="rounded-circle"
                          style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                        <label 
                          htmlFor="profileImage"
                          className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle p-2"
                          style={{width: '40px', height: '40px'}}
                        >
                          <Camera size={16} />
                        </label>
                        <input
                          type="file"
                          id="profileImage"
                          className="d-none"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <p className="text-muted mt-2 small">Click the camera icon to change your profile picture</p>
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">First Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData(prev => ({...prev, firstName: e.target.value}))}
                            style={{borderRadius: '10px'}}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Last Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData(prev => ({...prev, lastName: e.target.value}))}
                            style={{borderRadius: '10px'}}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address</label>
                        <div className="position-relative">
                          <Mail size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                          <input
                            type="email"
                            className="form-control form-control-lg ps-5"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                            style={{borderRadius: '10px'}}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Phone Number</label>
                        <div className="position-relative">
                          <Phone size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                          <input
                            type="tel"
                            className="form-control form-control-lg ps-5"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                            style={{borderRadius: '10px'}}
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control form-control-lg"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData(prev => ({...prev, dateOfBirth: e.target.value}))}
                            style={{borderRadius: '10px'}}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">Gender</label>
                          <select
                            className="form-select form-select-lg"
                            value={profileData.gender}
                            onChange={(e) => setProfileData(prev => ({...prev, gender: e.target.value}))}
                            style={{borderRadius: '10px'}}
                          >
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn text-white px-4 py-2"
                        disabled={isLoading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          borderRadius: '25px'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} className="me-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold mb-0" style={{color: '#2c3e50'}}>Delivery Addresses</h4>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={addAddress}
                        style={{borderRadius: '25px'}}
                      >
                        Add New Address
                      </button>
                    </div>

                    <div className="row">
                      {addresses.length > 0 ? (
                        addresses.map(address => (
                          <div key={address.id} className="col-md-6 mb-4">
                            <div className={`card border-2 ${address.isDefault ? 'border-primary' : 'border-light'}`}>
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <h6 className="fw-bold mb-0">{address.title}</h6>
                                  {address.isDefault && (
                                    <span className="badge bg-primary">Default</span>
                                  )}
                                </div>
                                
                                <p className="mb-2">{address.address}</p>
                                <p className="mb-3 text-muted">{address.city}, {address.postalCode}</p>
                                
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => console.log('Edit address', address.id)}
                                  >
                                    Edit
                                  </button>
                                  {!address.isDefault && (
                                    <button 
                                      className="btn btn-sm btn-outline-success"
                                      onClick={() => setDefaultAddress(address.id)}
                                    >
                                      Set Default
                                    </button>
                                  )}
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => deleteAddress(address.id)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center text-muted py-5">
                          No addresses found. Add a new one to get started.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h4 className="fw-bold mb-4" style={{color: '#2c3e50'}}>Security Settings</h4>
                    
                    <div className="card border-0 bg-light mb-4">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Change Password</h5>
                        <form onSubmit={handlePasswordChange}>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Current Password</label>
                            <div className="position-relative">
                              <Lock size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted z-2" />
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                className="form-control form-control-lg ps-5 pe-5"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                                placeholder="Enter current password"
                                style={{borderRadius: '10px'}}
                              />
                              <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                                onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                              >
                                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">New Password</label>
                            <div className="position-relative">
                              <Lock size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted z-2" />
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                className="form-control form-control-lg ps-5 pe-5"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                                placeholder="Enter new password"
                                style={{borderRadius: '10px'}}
                              />
                              <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                                onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                              >
                                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label fw-semibold">Confirm New Password</label>
                            <div className="position-relative">
                              <Lock size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted z-2" />
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                className="form-control form-control-lg ps-5 pe-5"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                                placeholder="Confirm new password"
                                style={{borderRadius: '10px'}}
                              />
                              <button
                                type="button"
                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                                onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                              >
                                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn text-white px-4 py-2"
                            disabled={isLoading}
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '25px'
                            }}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Updating...
                              </>
                            ) : (
                              'Change Password'
                            )}
                          </button>
                        </form>
                      </div>
                    </div>

                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="fw-bold mb-1">Two-Factor Authentication</h5>
                            <p className="text-muted mb-0">Add an extra layer of security to your account</p>
                          </div>
                          <button className="btn btn-outline-primary" style={{borderRadius: '25px'}}>
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h4 className="fw-bold mb-4" style={{color: '#2c3e50'}}>Notification Preferences</h4>
                    
                    <div className="list-group list-group-flush">
                      <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        <div>
                          <h6 className="fw-bold mb-1">Order Updates</h6>
                          <p className="text-muted mb-0 small">Get notified about your order status</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notifications.orderUpdates}
                            onChange={() => handleNotificationChange('orderUpdates')}
                          />
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        <div>
                          <h6 className="fw-bold mb-1">Promotions & Deals</h6>
                          <p className="text-muted mb-0 small">Receive notifications about special offers</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notifications.promotions}
                            onChange={() => handleNotificationChange('promotions')}
                          />
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        <div>
                          <h6 className="fw-bold mb-1">Newsletter</h6>
                          <p className="text-muted mb-0 small">Weekly newsletter with new products and tips</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notifications.newsletter}
                            onChange={() => handleNotificationChange('newsletter')}
                          />
                        </div>
                      </div>

                      <div className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                        <div>
                          <h6 className="fw-bold mb-1">Security Alerts</h6>
                          <p className="text-muted mb-0 small">Important security notifications</p>
                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notifications.security}
                            onChange={() => handleNotificationChange('security')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div>
                    <h4 className="fw-bold mb-4" style={{color: '#2c3e50'}}>Privacy Settings</h4>
                    
                    <div className="card border-0 bg-light mb-4">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Data & Privacy</h5>
                        <div className="d-grid gap-3">
                          <button className="btn btn-outline-primary text-start" style={{borderRadius: '10px'}}>
                            Download My Data
                          </button>
                          <button className="btn btn-outline-warning text-start" style={{borderRadius: '10px'}}>
                            Request Account Deletion
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Account Visibility</h5>
                        <div className="form-check mb-2">
                          <input className="form-check-input" type="checkbox" id="profileVisible" defaultChecked />
                          <label className="form-check-label" htmlFor="profileVisible">
                            Make my profile visible to other users
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input className="form-check-input" type="checkbox" id="purchaseHistory" />
                          <label className="form-check-label" htmlFor="purchaseHistory">
                            Share purchase history for recommendations
                          </label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="analytics" defaultChecked />
                          <label className="form-check-label" htmlFor="analytics">
                            Allow analytics for better user experience
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;