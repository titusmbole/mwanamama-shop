// src/components/AdminHeader.js
import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  Zap,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const { admin, logout } = useAdminAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-dropdown')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // ✅ New function to get initials from a full name
  const getInitialsFromName = (fullName) => {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // ✅ Function to get initials from email
  const getInitialsFromEmail = (email) => {
    if (!email) return 'AD';
    const name = email.split('@')[0];
    return name.length >= 2 ? name.substring(0, 2).toUpperCase() : name.toUpperCase();
  };

  // ✅ Prioritize name, fall back to email
  const initials = admin 
    ? (admin.name ? getInitialsFromName(admin.name) : getInitialsFromEmail(admin.name)) 
    : 'AD';

  const name = admin?.name || 'admin@example.com';
  const role = admin?.role || 'Admin';

  return (
    <>
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: ${collapsed ? '80px' : '280px'};
          right: 0;
          height: 64px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(225, 225, 225, 0.7);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 1000;
          transition: left 0.2s ease;
        }

        @media (max-width: 991px) {
          .header {
            left: 0;
          }
        }

        .btn-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          position: relative;
        }

        .btn-icon:hover {
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
        }

        .search-area {
          position: relative;
          width: 300px;
        }

        @media (max-width: 1199px) {
          .search-area {
            display: none;
          }
        }

        .search-input {
          width: 100%;
          height: 42px;
          padding-left: 40px;
          padding-right: 36px;
          border: 1px solid ${isSearchFocused ? '#3b82f6' : '#e2e8f0'};
          border-radius: 12px;
          background: #f8fafc;
          outline: none;
          font-size: 14px;
        }

        .search-input:focus {
          background: #fff;
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: ${isSearchFocused ? '#3b82f6' : '#64748b'};
        }

        .clear-icon {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
        }

        .time-block {
          text-align: right;
          margin-right: 12px;
        }

        @media (max-width: 767px) {
          .time-block {
            display: none;
          }
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 54px;
          right: 0;
          background: #ffffff;
          width: 240px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          z-index: 2000;
        }

        .dropdown-item {
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: #f5f5f5;
        }

        .badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          max-width: 150px;
        }

        .profile-email {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-role {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 500;
        }
      `}</style>

      <header className="header">
        {/* Left: Toggle + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
          </button>

          <div className="search-area">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <button className="clear-icon" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Time + Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="time-block">
            <div style={{ fontWeight: '600' }}>{formatTime(currentTime)}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(currentTime)}</div>
          </div>

          <button className="btn-icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="btn-icon" title="Notifications">
            <Bell size={18} />
            {notifications > 0 && (
              <span className="badge">{notifications > 9 ? '9+' : notifications}</span>
            )}
          </button>

          <div className="profile-dropdown" style={{ position: 'relative' }}>
            <button
              className="profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#3b82f6',
                  color: '#fff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              >
                {initials}
              </div>
              <div className="profile-info">
                <span className="profile-name" title={name}>{name}</span>
                <span className="profile-role">{role}</span>
              </div>
              <ChevronDown size={14} />
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <UserCircle size={16} /> My Profile
                </div>
                <div className="dropdown-item">
                  <Settings size={16} /> Settings
                </div>
                <div className="dropdown-item">
                  <Zap size={16} /> Activity
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0' }} />
                <div
                  className="dropdown-item"
                  style={{ color: '#dc2626' }}
                  onClick={() => logout()}
                >
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;