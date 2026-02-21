import React, { useState, useEffect } from 'react';
import { Row, Col, Tab, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { OverviewCards } from '../components/Dashboard/OverviewCards';
import { CheckinModule } from '../components/Dashboard/CheckinModule';
import { SessionModule } from '../components/Dashboard/SessionModule';
import { ChatModule } from '../components/Dashboard/ChatModule';
import { AIModule } from '../components/Dashboard/AIModule';
import { FeedbackModule } from '../components/Dashboard/FeedbackModule';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { 
  FiHome, 
  FiHeart, 
  FiCalendar, 
  FiMessageSquare, 
  FiCpu, 
  FiUser,
  FiBell,
  FiChevronRight
} from 'react-icons/fi';

export const UserDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleTabChange = (key: string | null) => {
    if (key === 'overview') {
      navigate('/dashboard');
    } else if (key) {
      navigate(`/dashboard/${key}`);
    }
  };

  const getActiveKey = () => {
    if (!tab) return 'overview';
    return tab;
  };

  const renderContent = () => {
    switch (tab) {
      case 'checkins':
        return <CheckinModule />;
      case 'sessions':
        return <SessionModule />;
      case 'chat':
        return <ChatModule />;
      case 'ai':
        return <AIModule />;
      case 'profile':
        return <ProfileSection />;
      default:
        return (
          <div className="dashboard-overview">
            {/* Overview Cards Section */}
            <section className="mb-5">
              <OverviewCards />
            </section>

            {/* Main Dashboard Grid */}
            <Row className="g-4">
              {/* Left Column - Check-ins and Sessions */}
              <Col lg={6}>
                <div className="d-flex flex-column gap-4">
                  <div className="dashboard-card">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
                        <FiHeart className="me-2" style={{ color: '#2EC4B6' }} />
                        Today's Check-in
                      </h5>
                      <button 
                        onClick={() => navigate('/dashboard/checkins')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: '#2EC4B6' }}
                      >
                        View all <FiChevronRight />
                      </button>
                    </div>
                    <CheckinModule />
                  </div>

                  <div className="dashboard-card">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
                        <FiCalendar className="me-2" style={{ color: '#F4A261' }} />
                        Upcoming Sessions
                      </h5>
                      <button 
                        onClick={() => navigate('/dashboard/sessions')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: '#2EC4B6' }}
                      >
                        View all <FiChevronRight />
                      </button>
                    </div>
                    <SessionModule />
                  </div>
                </div>
              </Col>

              {/* Right Column - Chat and AI */}
              <Col lg={6}>
                <div className="d-flex flex-column gap-4">
                  <div className="dashboard-card">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
                        <FiMessageSquare className="me-2" style={{ color: '#2EC4B6' }} />
                        Recent Messages
                      </h5>
                      <button 
                        onClick={() => navigate('/dashboard/chat')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: '#2EC4B6' }}
                      >
                        Open chat <FiChevronRight />
                      </button>
                    </div>
                    <ChatModule compact />
                  </div>

                  <div className="dashboard-card">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
                        <FiCpu className="me-2" style={{ color: '#F4A261' }} />
                        AI Wellness Assistant
                      </h5>
                      <button 
                        onClick={() => navigate('/dashboard/ai')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: '#2EC4B6' }}
                      >
                        Full assistant <FiChevronRight />
                      </button>
                    </div>
                    <AIModule compact />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Feedback Section */}
            <Row className="mt-4">
              <Col>
                <div className="dashboard-card">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
                      Share Your Feedback
                    </h5>
                  </div>
                  <FeedbackModule />
                </div>
              </Col>
            </Row>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center gap-3">
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px',
                backgroundColor: '#EAF3F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiHome size={24} style={{ color: '#2EC4B6' }} />
              </div>
              <div>
                <h2 className="fw-bold mb-1" style={{ color: '#1F2D2B' }}>
                  {greeting}, <span style={{ color: '#2EC4B6' }}>User</span> 👋
                </h2>
                <p style={{ color: '#5F6F6C' }}>
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-3">
              <button className="btn btn-outline-light rounded-circle p-2" style={{
                border: '1px solid #EAF3F1',
                color: '#5F6F6C'
              }}>
                <FiBell size={20} />
              </button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4" style={{ borderBottom: '1px solid #EAF3F1' }}>
        <Nav variant="tabs" activeKey={getActiveKey()} onSelect={handleTabChange} className="border-0">
          <Nav.Item>
            <Nav.Link eventKey="overview" className="border-0">
              <FiHome className="me-2" /> Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="checkins" className="border-0">
              <FiHeart className="me-2" /> Check-ins
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sessions" className="border-0">
              <FiCalendar className="me-2" /> Sessions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chat" className="border-0">
              <FiMessageSquare className="me-2" /> Messages
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ai" className="border-0">
              <FiCpu className="me-2" /> AI Assistant
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" className="border-0">
              <FiUser className="me-2" /> Profile
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {renderContent()}
      </div>

      <style>{`
        .nav-tabs .nav-link {
          color: #5F6F6C;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-tabs .nav-link:hover {
          color: #2EC4B6;
          background-color: #F4F8F6;
        }
        .nav-tabs .nav-link.active {
          color: #2EC4B6;
          background-color: transparent;
          border-bottom: 2px solid #2EC4B6;
        }
        .dashboard-card {
          background-color: #FFFFFF;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          border: 1px solid #EAF3F1;
          transition: all 0.2s ease;
        }
        .dashboard-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
      `}</style>
    </DashboardLayout>
  );
};