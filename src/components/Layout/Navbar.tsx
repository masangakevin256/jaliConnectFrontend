import { Navbar as BSNavbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiLogOut, FiUser, FiSettings, FiHome, FiInfo, FiMail,
  FiHeart, FiMessageCircle, FiCalendar, FiActivity, FiShield,
  FiMenu, FiX, FiChevronDown, FiSun, FiMoon, FiBell
} from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('isAuthenticated');
  };

  const hideLogoutRoutes = ['/', '/login', '/register'];
  const shouldHideLogout = hideLogoutRoutes.some(route =>
    location.pathname === route || location.pathname.startsWith(route + '/')
  );

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user?.role) return '/';
    switch (user.role) {
      case 'user': return '/dashboard';
      case 'counselor': return '/counselor';
      case 'admin': return '/admin';
      default: return '/';
    }
  };

  const scrollToSection = (sectionId: string, basePath: string) => {
    if (location.pathname !== basePath) {
      navigate(basePath);
      // Wait for navigation and render, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <BSNavbar
      bg="white"
      expand="lg"
      className={`border-bottom py-2 sticky-top ${isHomePage ? '' : 'shadow-sm'}`}
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: '#FFFFFF !important',
        borderBottom: '1px solid rgba(46, 196, 182, 0.1)'
      }}
    >
      <Container fluid className="px-4">
        {/* Brand with mental health icon */}
        <BSNavbar.Brand
          href="/"
          className="fw-bold fs-5 d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(46, 196, 182, 0.2)'
          }}>
            <FiHeart size={20} style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <span style={{ color: '#2EC4B6', fontWeight: '600' }}>Jali</span>
            <span style={{ color: '#1F2D2B', fontWeight: '500' }}>Connect</span>
          </div>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav">
          <FiMenu size={24} style={{ color: '#2EC4B6' }} />
        </BSNavbar.Toggle>

        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links - Enhanced with more options */}
          {isHomePage && !isAuthenticated && (
            <Nav className="mx-auto">
              <Nav.Link
                href="/"
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiHome className="me-1" /> Home
              </Nav.Link>
              <Nav.Link
                href="/about"
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiInfo className="me-1" /> About
              </Nav.Link>
              <Nav.Link
                href="/how-it-works"
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiActivity className="me-1" /> How It Works
              </Nav.Link>
              <Nav.Link
                href="/resources"
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiHeart className="me-1" /> Resources
              </Nav.Link>
              <Nav.Link
                href="/contact"
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiMail className="me-1" /> Contact
              </Nav.Link>
            </Nav>
          )}

          {/* Authenticated user navigation - Dashboard quick links */}
          {isAuthenticated && user && (
            <Nav className="mx-auto">
              <Nav.Link
                href={getDashboardLink()}
                className="mx-2 d-flex align-items-center"
                style={{ color: '#5F6F6C' }}
              >
                <FiHome className="me-1" /> Dashboard
              </Nav.Link>

              {user.role === 'user' && (
                <>
                  <Nav.Link
                    href="/dashboard/sessions"
                    className="mx-2 d-flex align-items-center"
                    style={{ color: '#5F6F6C' }}
                  >
                    <FiCalendar className="me-1" /> Sessions
                  </Nav.Link>
                  <Nav.Link
                    href="/dashboard/chat"
                    className="mx-2 d-flex align-items-center"
                    style={{ color: '#5F6F6C' }}
                  >
                    <FiMessageCircle className="me-1" /> Messages
                  </Nav.Link>
                </>
              )}

              {user.role === 'counselor' && (
                <>
                  <Nav.Link
                    href="/counselor/sessions"
                    className="mx-2 d-flex align-items-center"
                    style={{ color: '#5F6F6C' }}
                  >
                    <FiCalendar className="me-1" /> My Sessions
                  </Nav.Link>
                  <Nav.Link
                    href="/counselor/insights"
                    className="mx-2 d-flex align-items-center"
                    style={{ color: '#5F6F6C' }}
                  >
                    <FiActivity className="me-1" /> Insights
                  </Nav.Link>
                </>
              )}
            </Nav>
          )}

          <Nav className="ms-auto align-items-center gap-3">
            {/* Unauthenticated state - Home page */}
            {!isAuthenticated && isHomePage && (
              <>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/login/user')}
                  style={{
                    borderColor: '#5F6F6C',
                    color: '#1F2D2B',
                    padding: '0.5rem 1.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="rounded-3"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F4F8F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => navigate('/register/user')}
                  style={{
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    boxShadow: '0 4px 6px rgba(46, 196, 182, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  className="rounded-3"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(46, 196, 182, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(46, 196, 182, 0.25)';
                  }}
                >
                  Start your journey
                </Button>
              </>
            )}

            {/* Authenticated user profile dropdown - Enhanced */}
            {isAuthenticated && !shouldHideLogout ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 2px 4px rgba(46, 196, 182, 0.2)'
                      }}
                    >
                      {user?.username ? user.username.charAt(0).toUpperCase() : <FiUser size={18} />}
                    </div>
                    <div className="d-none d-md-block text-start">
                      <span className="fw-500 d-block" style={{ color: '#1F2D2B', fontSize: '0.9rem' }}>
                        {user?.username || 'User'}
                      </span>
                      <span style={{ color: '#8A9D9A', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                        {user?.role || 'Member'}
                      </span>
                    </div>
                    <FiChevronDown style={{ color: '#8A9D9A' }} size={16} />
                  </div>
                }
                id="profile-dropdown"
                align="end"
                className="profile-dropdown"
              >
                <NavDropdown.Item
                  onClick={() => scrollToSection('overview', `/dashboard`)}
                  className="py-2 d-flex align-items-center"
                  style={{ color: '#1F2D2B' }}
                >
                  <FiHome className="me-2" style={{ color: '#2EC4B6' }} /> Dashboard Home
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => navigate(`/dashboard/profile`)}
                  className="py-2 d-flex align-items-center"
                  style={{ color: '#1F2D2B' }}
                >
                  <FiUser className="me-2" style={{ color: '#2EC4B6' }} /> My Profile
                </NavDropdown.Item>

                {user?.role === 'user' && (
                  <>
                    <NavDropdown.Item
                      onClick={() => scrollToSection('notifications', '/dashboard')}
                      className="py-2 d-flex align-items-center"
                      style={{ color: '#1F2D2B' }}
                    >
                      <FiBell className="me-2" style={{ color: '#2EC4B6' }} /> Notifications
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => scrollToSection('checkins', '/dashboard')}
                      className="py-2 d-flex align-items-center"
                      style={{ color: '#1F2D2B' }}
                    >
                      <FiActivity className="me-2" style={{ color: '#2EC4B6' }} /> Check-ins
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => navigate(`/dashboard/sessions`)}
                      className="py-2 d-flex align-items-center"
                      style={{ color: '#1F2D2B' }}
                    >
                      <FiCalendar className="me-2" style={{ color: '#2EC4B6' }} /> Sessions
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => scrollToSection('chat', '/dashboard')}
                      className="py-2 d-flex align-items-center"
                      style={{ color: '#1F2D2B' }}
                    >
                      <FiMessageCircle className="me-2" style={{ color: '#2EC4B6' }} /> Chat
                    </NavDropdown.Item>
                  </>
                )}

                {user?.role === 'counselor' && (
                  <NavDropdown.Item
                    onClick={() => navigate('/counselor/schedule')}
                    className="py-2 d-flex align-items-center"
                    style={{ color: '#1F2D2B' }}
                  >
                    <FiCalendar className="me-2" style={{ color: '#2EC4B6' }} /> My Schedule
                  </NavDropdown.Item>
                )}

                <NavDropdown.Item
                  onClick={() => navigate(`/dashboard/settings`)}
                  className="py-2 d-flex align-items-center"
                  style={{ color: '#1F2D2B' }}
                >
                  <FiSettings className="me-2" style={{ color: '#2EC4B6' }} /> Settings
                </NavDropdown.Item>

                <NavDropdown.Divider style={{ borderColor: '#EAF3F1' }} />

                <NavDropdown.Item
                  onClick={handleLogout}
                  className="py-2 d-flex align-items-center"
                  style={{ color: '#dc3545' }}
                >
                  <FiLogOut className="me-2" /> Sign out
                </NavDropdown.Item>
              </NavDropdown>
            ) : isAuthenticated && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
                className="d-flex align-items-center gap-2 rounded-3"
                style={{ borderColor: '#dc3545', color: '#dc3545' }}
              >
                <FiLogOut /> Logout
              </Button>
            )}

            {/* Show login/register on non-home pages when not authenticated */}
            {!isAuthenticated && !isHomePage && (
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/login/user')}
                  style={{ borderColor: '#5F6F6C', color: '#1F2D2B' }}
                  className="rounded-3"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => navigate('/register/user')}
                  style={{ backgroundColor: '#2EC4B6', borderColor: '#2EC4B6' }}
                  className="rounded-3"
                >
                  Get started
                </Button>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>

      <style>{`
        .navbar {
          background-color: #FFFFFF !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          box-shadow: 0 4px 12px rgba(46, 196, 182, 0.1);
        }
        .nav-link {
          color: #5F6F6C !important;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          padding: 0.5rem 1rem !important;
        }
        .nav-link:hover {
          color: #2EC4B6 !important;
          background-color: rgba(46, 196, 182, 0.05);
          border-radius: 8px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%);
          transition: width 0.2s ease;
        }
        .nav-link:hover::after {
          width: 30px;
        }
        .dropdown-menu {
          border: none;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          min-width: 220px;
          margin-top: 0.5rem;
          border: 1px solid rgba(46, 196, 182, 0.1);
        }
        .dropdown-item {
          border-radius: 10px;
          transition: all 0.2s ease;
          padding: 0.6rem 1rem;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background-color: rgba(46, 196, 182, 0.08) !important;
          transform: translateX(5px);
        }
        .dropdown-item:active {
          background-color: rgba(46, 196, 182, 0.15) !important;
        }
        .dropdown-divider {
          border-color: rgba(46, 196, 182, 0.1);
          margin: 0.5rem 0;
        }
        .navbar-toggler {
          border: 1px solid rgba(46, 196, 182, 0.3);
          border-radius: 10px;
          padding: 0.5rem;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.15);
          outline: none;
        }
        .navbar-toggler-icon {
          background-image: none;
        }
        .profile-dropdown .dropdown-toggle::after {
          display: none;
        }
        .profile-dropdown .dropdown-toggle {
          padding: 0.25rem 0.5rem;
          border-radius: 40px;
          transition: all 0.2s ease;
        }
        .profile-dropdown .dropdown-toggle:hover {
          background-color: rgba(46, 196, 182, 0.05);
        }
        @media (max-width: 991px) {
          .navbar-collapse {
            background: white;
            padding: 1rem;
            border-radius: 16px;
            margin-top: 0.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(46, 196, 182, 0.1);
          }
          .nav-link {
            padding: 0.75rem 1rem !important;
          }
          .nav-link:hover::after {
            width: 0;
          }
        }
      `}</style>
    </BSNavbar>
  );
};