import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Image, 
  Percent, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  
  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgHover: 'rgba(102, 126, 234, 0.1)'
    },
    { 
      label: 'Products', 
      icon: <Package size={20} />, 
      path: '/admin/products',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgHover: 'rgba(240, 147, 251, 0.1)'
    },
    { 
      label: 'Categories', 
      icon: <Layers size={20} />, 
      path: '/admin/categories',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgHover: 'rgba(79, 172, 254, 0.1)'
    },
    { 
      label: 'Orders', 
      icon: <ShoppingCart size={20} />, 
      path: '/admin/orders',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgHover: 'rgba(67, 233, 123, 0.1)'
    },
    // { 
    //   label: 'Customers', 
    //   icon: <Percent size={20} />, 
    //   path: '/admin/customers',
    //   color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    //   bgHover: 'rgba(168, 237, 234, 0.1)'
    // },
    { 
      label: 'Users', 
      icon: <Percent size={20} />, 
      path: '/admin/users',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgHover: 'rgba(168, 237, 234, 0.1)'
    },
    { 
      label: 'Roles', 
      icon: <Image size={20} />, 
      path: '/admin/roles',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgHover: 'rgba(250, 112, 154, 0.1)'
    },
    { 
      label: 'Report', 
      icon: <Image size={20} />, 
      path: '/admin/reports',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      bgHover: 'rgba(250, 112, 154, 0.1)'
    },
    { 
      label: 'Settings', 
      icon: <Percent size={20} />, 
      path: '/admin/settings',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      bgHover: 'rgba(168, 237, 234, 0.1)'
    },
  ];

  // Initialize Bootstrap tooltips when collapsed
  useEffect(() => {
    if (collapsed && window.bootstrap) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login"); // ✅ redirect here
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`sidebar-backdrop ${collapsed ? '' : 'show'} d-md-none`}
        onClick={() => setCollapsed(true)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          opacity: collapsed ? 0 : 1,
          visibility: collapsed ? 'hidden' : 'visible',
          transition: 'all 0.3s ease'
        }}
      />

      <aside className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Modern Glass Effect Background */}
        <div 
          className="sidebar-glass"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: -1
          }}
        />

        {/* Animated Gradient Background */}
        <div 
          className="sidebar-gradient"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(145deg, 
                rgba(59, 130, 246, 0.08) 0%, 
                rgba(139, 92, 246, 0.08) 35%, 
                rgba(236, 72, 153, 0.08) 70%, 
                rgba(59, 130, 246, 0.08) 100%
              )
            `,
            backgroundSize: '300% 300%',
            animation: 'gradientShift 15s ease infinite',
            zIndex: -1
          }}
        />

        {/* Sidebar Header */}
        <div className="sidebar-brand position-relative">
          {!collapsed ? (
            <div className="d-flex align-items-center brand-expanded">
              <div 
                className="brand-icon d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Sparkles className="text-white position-absolute" size={12} style={{ 
                  top: '6px', 
                  right: '6px',
                  animation: 'sparkle 2s ease-in-out infinite'
                }} />
                <span className="text-white fw-bold fs-4">M</span>
              </div>
              <div>
                <h5 className="mb-0 text-white fw-bold brand-text">Mwanamama</h5>
                <small className="text-white-50 brand-subtitle">Admin Dashboard</small>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center brand-collapsed">
              <div 
                className="brand-icon d-flex align-items-center justify-content-center"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Sparkles className="text-white position-absolute" size={10} style={{ 
                  top: '4px', 
                  right: '4px',
                  animation: 'sparkle 2s ease-in-out infinite'
                }} />
                <span className="text-white fw-bold fs-4">M</span>
              </div>
            </div>
          )}
          
          {/* Modern Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle"
            style={{
              position: 'absolute',
              right: '-16px',
              top: '24px',
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
            }}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            {menuItems.map((item, index) => (
              <li key={item.path} className="nav-item mb-2" style={{ 
                animation: `slideInLeft 0.4s ease-out ${index * 50}ms both` 
              }}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link modern-nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    '--item-color': item.color,
                    '--item-bg-hover': item.bgHover,
                    position: 'relative',
                    padding: collapsed ? '12px' : '12px 20px',
                    margin: '0 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden'
                  }}
                  {...(collapsed ? {
                    'data-bs-toggle': 'tooltip',
                    'data-bs-placement': 'right',
                    'data-bs-title': item.label
                  } : {})}
                >
                  {/* Active indicator */}
                  <div 
                    className="nav-indicator"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: item.color,
                      borderRadius: '0 4px 4px 0',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  <span 
                    className="nav-icon d-flex align-items-center justify-content-center"
                    style={{
                      minWidth: '24px',
                      height: '24px',
                      marginRight: collapsed ? 0 : '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.icon}
                  </span>
                  
                  {!collapsed && (
                    <span 
                      className="nav-text"
                      style={{
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        opacity: collapsed ? 0 : 1
                      }}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Hover effect background */}
                  <div 
                    className="nav-hover-bg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: item.bgHover,
                      borderRadius: '12px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none'
                    }}
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Modern Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout} 
            className="modern-logout-btn w-100 d-flex align-items-center justify-content-center"
            style={{
              padding: collapsed ? '12px' : '12px 16px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontWeight: '500',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            {...(collapsed ? {
              'data-bs-toggle': 'tooltip',
              'data-bs-placement': 'right',
              'data-bs-title': 'Logout'
            } : {})}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span className="ms-2">Logout</span>}
            
            {/* Button shine effect */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s ease'
              }}
              className="btn-shine"
            />
          </button>
        </div>

        {/* Modern Bottom Accent */}
        <div 
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, #667eea 20%, #764ba2 40%, #f093fb 60%, #4facfe 80%, transparent 100%)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}
        />

        <style jsx>{`
          .modern-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 280px;
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1050;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .modern-sidebar.collapsed {
            width: 80px;
          }

          .sidebar-brand {
            padding: 24px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .brand-expanded, .brand-collapsed {
            animation: fadeIn 0.3s ease-out;
          }

          .brand-text {
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .sidebar-nav {
            flex: 1;
            padding: 20px 0;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .sidebar-nav::-webkit-scrollbar {
            width: 4px;
          }

          .sidebar-nav::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }

          .sidebar-nav::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }

          .modern-nav-link {
            color: rgba(255, 255, 255, 0.7) !important;
          }

          .modern-nav-link:hover {
            color: white !important;
            transform: translateX(4px);
          }

          .modern-nav-link:hover .nav-hover-bg {
            opacity: 1;
          }

          .modern-nav-link.active {
            color: white !important;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }

          .modern-nav-link.active .nav-indicator {
            transform: scaleX(1);
          }

          .modern-logout-btn:hover .btn-shine {
            left: 100%;
          }

          @media (max-width: 767.98px) {
            .modern-sidebar {
              transform: translateX(-100%);
            }

            .modern-sidebar:not(.collapsed) {
              transform: translateX(0);
            }
          }

          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 0.5;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1.2) rotate(180deg);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;