import { Navbar as BSNavbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiLogOut, FiUser, FiSettings, FiHome, FiInfo, FiMail } from 'react-icons/fi';

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

  return (
    <BSNavbar 
      bg="white" 
      expand="lg" 
      className={`border-bottom py-2 sticky-top ${isHomePage ? '' : 'shadow-sm'}`}
      style={{ 
        height: 'var(--navbar-height)',
        backgroundColor: '#FFFFFF !important'
      }}
    >
      <Container fluid className="px-4">
        {/* Brand always visible */}
        <BSNavbar.Brand 
          href="/" 
          className="fw-bold fs-5"
          style={{ cursor: 'pointer' }}
        >
          <span style={{ color: '#2EC4B6' }}>Jali</span>
          <span style={{ color: '#1F2D2B' }}>Connect</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links - Only show on home page for now */}
          {isHomePage && !isAuthenticated && (
            <Nav className="mx-auto">
              <Nav.Link 
                href="/" 
                className="mx-2" 
                style={{ color: '#5F6F6C' }}
              >
                <FiHome className="me-1" /> Home
              </Nav.Link>
              <Nav.Link 
                href="/about" 
                className="mx-2" 
                style={{ color: '#5F6F6C' }}
              >
                <FiInfo className="me-1" /> About
              </Nav.Link>
              <Nav.Link 
                href="/contact" 
                className="mx-2" 
                style={{ color: '#5F6F6C' }}
              >
                <FiMail className="me-1" /> Contact
              </Nav.Link>
            </Nav>
          )}

          <Nav className="ms-auto align-items-center gap-3">
            {!isAuthenticated && isHomePage && (
              <>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/login/user')}
                  style={{ 
                    borderColor: '#5F6F6C', 
                    color: '#1F2D2B',
                    padding: '0.5rem 1.5rem'
                  }}
                  className="rounded-3"
                >
                  Sign in
                </Button>
                <Button 
                  onClick={() => navigate('/register/user')}
                  style={{ 
                    backgroundColor: '#2EC4B6', 
                    borderColor: '#2EC4B6',
                    padding: '0.5rem 1.5rem'
                  }}
                  className="rounded-3"
                >
                  Get started
                </Button>
              </>
            )}

            {isAuthenticated && !shouldHideLogout ? (
              <NavDropdown
                title={
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '35px', 
                        height: '35px', 
                        backgroundColor: '#EAF3F1',
                        color: '#2EC4B6'
                      }}
                    >
                      <FiUser size={18} />
                    </div>
                    <span className="fw-500 d-none d-md-block" style={{ color: '#1F2D2B' }}>
                      {user?.username || 'User'}
                    </span>
                  </div>
                }
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item 
                  onClick={() => navigate(`/${user?.role}/profile`)} 
                  className="py-2"
                  style={{ color: '#1F2D2B' }}
                >
                  <FiUser className="me-2" style={{ color: '#2EC4B6' }} /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => navigate(`/${user?.role}/settings`)} 
                  className="py-2"
                  style={{ color: '#1F2D2B' }}
                >
                  <FiSettings className="me-2" style={{ color: '#2EC4B6' }} /> Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item 
                  onClick={handleLogout} 
                  className="py-2"
                  style={{ color: '#dc3545' }}
                >
                  <FiLogOut className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : isAuthenticated && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleLogout} 
                className="d-flex align-items-center gap-2 rounded-3"
                style={{ borderColor: '#dc3545' }}
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
                  Sign up
                </Button>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>

      <style>{`
        .navbar {
          background-color: #FFFFFF !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .nav-link {
          color: #5F6F6C !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-link:hover {
          color: #2EC4B6 !important;
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #EAF3F1 !important;
        }
        .dropdown-item:active {
          background-color: #2EC4B6 !important;
          color: white !important;
        }
        .navbar-toggler {
          border: 1px solid #EAF3F1;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.1);
        }
      `}</style>
    </BSNavbar>
  );
};