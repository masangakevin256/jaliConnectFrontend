import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiHome,
  FiMessageSquare,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiHeart,
  FiCpu,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiBell,
} from 'react-icons/fi';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isUser, isCounselor, isAdmin, user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/counselor' && location.pathname === '/counselor') return true;
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.startsWith(path) && path !== '/';
  };

  const getUserMenuItems = () => [
    { icon: FiHome, label: 'Overview', path: '/dashboard', end: true },
    { icon: FiHeart, label: 'Mood & Check-ins', path: '/dashboard/checkins' },
    { icon: FiCalendar, label: 'My Sessions', path: '/dashboard/sessions' },
    { icon: FiMessageSquare, label: 'Messages', path: '/dashboard/chat' },
    { icon: FiCpu, label: 'AI Assistant', path: '/dashboard/ai' },
    { icon: FiTrendingUp, label: 'Progress', path: '/dashboard/progress' },
    { icon: FiUser, label: 'Profile', path: '/dashboard/profile' },
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const getCounselorMenuItems = () => [
    { icon: FiHome, label: 'Dashboard', path: '/counselor', end: true },
    { icon: FiCalendar, label: 'Session Schedule', path: '/counselor/sessions' },
    { icon: FiUsers, label: 'My Clients', path: '/counselor/users' },
    { icon: FiMessageSquare, label: 'Messages', path: '/counselor/chat' },
    { icon: FiBarChart2, label: 'Analytics', path: '/counselor/analytics' },
    { icon: FiUser, label: 'Profile', path: '/counselor/profile' },
    { icon: FiSettings, label: 'Settings', path: '/counselor/settings' },
  ];

  const getAdminMenuItems = () => [
    { icon: FiHome, label: 'Overview', path: '/admin', end: true },
    { icon: FiUsers, label: 'User Management', path: '/admin/users' },
    { icon: FiUsers, label: 'Counselor Management', path: '/admin/counselors' },
    { icon: FiBarChart2, label: 'Analytics', path: '/admin/analytics' },
    { icon: FiSettings, label: 'System Settings', path: '/admin/settings' },
    { icon: FiUser, label: 'Profile', path: '/admin/profile' },
  ];

  const getMenuItems = () => {
    if (isUser) return getUserMenuItems();
    if (isCounselor) return getCounselorMenuItems();
    if (isAdmin) return getAdminMenuItems();
    return [];
  };

  const menuItems = getMenuItems();

  const getRoleColor = () => {
    if (isUser) return '#2EC4B6';
    if (isCounselor) return '#F4A261';
    if (isAdmin) return '#5F6F6C';
    return '#2EC4B6';
  };

  const getRoleLabel = () => {
    if (isUser) return 'User';
    if (isCounselor) return 'Counselor';
    if (isAdmin) return 'Admin';
    return '';
  };

  const handleLogout = () => {
    logout();
    // Additional logout logic if needed
  };

  return (
    <div className="d-flex flex-column h-100" style={{ 
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #EAF3F1'
    }}>
      {/* Brand Section */}
      <div className="py-4 px-4" style={{ borderBottom: '1px solid #EAF3F1' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#2EC4B6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiHeart size={18} color="white" />
          </div>
          <h5 className="fw-bold mb-0">
            <span style={{ color: '#2EC4B6' }}>Jali</span>
            <span style={{ color: '#1F2D2B' }}>Connect</span>
          </h5>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="p-4" style={{ borderBottom: '1px solid #EAF3F1' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px',
            backgroundColor: getRoleColor(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-1" style={{ color: '#1F2D2B' }}>
              {user?.username || 'User'}
            </h6>
            <div className="d-flex align-items-center gap-1">
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%',
                backgroundColor: getRoleColor(),
                display: 'inline-block'
              }} />
              <span style={{ color: '#5F6F6C', fontSize: '0.8rem' }}>
                {getRoleLabel()}
              </span>
            </div>
          </div>
          <FiBell style={{ color: '#5F6F6C', cursor: 'pointer' }} size={18} />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-grow-1 py-3">
        <div className="px-4 mb-3">
          <span style={{ color: '#5F6F6C', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Main Menu
          </span>
        </div>
        <ListGroup variant="flush" className="bg-transparent">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <ListGroup.Item 
              key={path} 
              className="border-0 bg-transparent px-3 py-1"
            >
              <Link
                to={path}
                className={`nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 text-decoration-none transition-all ${
                  isActive(path) ? 'active' : ''
                }`}
                style={{
                  backgroundColor: isActive(path) ? `${getRoleColor()}15` : 'transparent',
                  color: isActive(path) ? getRoleColor() : '#5F6F6C',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.backgroundColor = '#F4F8F6';
                    e.currentTarget.style.color = '#1F2D2B';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#5F6F6C';
                  }
                }}
              >
                <Icon size={18} />
                <span style={{ fontSize: '0.95rem', fontWeight: isActive(path) ? '500' : '400' }}>
                  {label}
                </span>
                {isActive(path) && (
                  <div style={{ 
                    width: '4px', 
                    height: '4px', 
                    borderRadius: '50%',
                    backgroundColor: getRoleColor(),
                    marginLeft: 'auto'
                  }} />
                )}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Support Section */}
        <div className="px-4 mt-4 mb-3">
          <span style={{ color: '#5F6F6C', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Support
          </span>
        </div>
        <ListGroup variant="flush" className="bg-transparent">
          <ListGroup.Item className="border-0 bg-transparent px-3 py-1">
            <Link
              to="/dashboard/feedback"
              className="nav-link rounded-3 px-3 py-2 d-flex align-items-center gap-3 text-decoration-none"
              style={{ color: '#5F6F6C' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F4F8F6';
                e.currentTarget.style.color = '#1F2D2B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#5F6F6C';
              }}
            >
              <FiHelpCircle size={18} />
              <span style={{ fontSize: '0.95rem' }}>Help & Support</span>
            </Link>
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Logout Section */}
      <div className="p-4" style={{ borderTop: '1px solid #EAF3F1' }}>
        <button
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center gap-3 rounded-3"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #EAF3F1',
            color: '#dc3545',
            padding: '0.75rem 1rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee9e7';
            e.currentTarget.style.borderColor = '#dc3545';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#EAF3F1';
          }}
        >
          <FiLogOut size={18} />
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Logout</span>
        </button>
        
        {/* Version Info */}
        <div className="text-center mt-3">
          <span style={{ color: '#5F6F6C', fontSize: '0.7rem' }}>
            Version 2.0.0
          </span>
        </div>
      </div>

      <style>{`
        .nav-link {
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          background-color: #F4F8F6 !important;
          color: #1F2D2B !important;
        }
        .nav-link.active {
          background-color: ${getRoleColor()}15 !important;
          color: ${getRoleColor()} !important;
        }
      `}</style>
    </div>
  );
};