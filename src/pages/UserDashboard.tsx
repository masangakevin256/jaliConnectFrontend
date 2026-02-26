import React, { useState, useEffect } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { OverviewCards } from '../components/Dashboard/OverviewCards';
import { CheckinModule } from '../components/Dashboard/CheckinModule';
import { SessionModule } from '../components/Dashboard/SessionModule';
import { ChatModule } from '../components/Dashboard/ChatModule';
import { AIModule } from '../components/Dashboard/AIModule';
import { FeedbackModule } from '../components/Dashboard/FeedbackModule';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { MoodTrackingCard } from '../components/Dashboard/MoodTrackingCard';
import { MeditationCard } from '../components/Dashboard/MeditationCard';
import { CalmNotificationCard } from '../components/Dashboard/CalmNotificationCard';
import { NotificationModule } from '../components/Dashboard/NotificationModule';
import { jwtDecode } from "jwt-decode";
import type { jwtPayload } from "../types";
import {
  FiHome,
  FiHeart,
  FiCalendar,
  FiMessageSquare,
  FiCpu,
  FiUser,
  FiBell,
  FiSun,
  FiCoffee,
  FiMoon
} from 'react-icons/fi';

export const UserDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userName, setUserName] = useState<string>('there');
  const [userData, setUserData] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Your Dashboard | JaliConnect";

    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode<jwtPayload>(token);
      const user = decoded.userInfo;
      setUserData(user);

      // Try to get username from multiple possible locations
      const username = user?.username || (user as any)?.name || (user as any)?.email?.split('@')[0] || 'there';
      setUserName(username);

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/");
    }

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let icon = null;

    if (hour < 5) {
      timeGreeting = 'Late night';
      icon = <FiMoon style={{ color: 'var(--text-secondary)' }} />;
    } else if (hour < 12) {
      timeGreeting = 'Good morning';
      icon = <FiSun style={{ color: 'var(--accent-peach)' }} />;
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
      icon = <FiSun style={{ color: 'var(--accent-peach)' }} />;
    } else if (hour < 21) {
      timeGreeting = 'Good evening';
      icon = <FiCoffee style={{ color: 'var(--text-secondary)' }} />;
    } else {
      timeGreeting = 'Good night';
      icon = <FiMoon style={{ color: 'var(--primary-teal)' }} />;
    }

    setGreeting(timeGreeting);
    setGreetingIcon(icon);

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
      minute: '2-digit',
      hour12: true
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

  const getDailyQuote = () => {
    const quotes = [
      "Your feelings are valid, and you're not alone.",
      "Small steps every day lead to big changes.",
      "Be kind to yourself—you're doing the best you can.",
      "Healing isn't linear, and that's okay.",
      "You showed up today, and that's what matters.",
      "Every moment is a fresh beginning.",
      "Your journey is uniquely yours—embrace it.",
      "Progress, not perfection."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
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
        return <ProfileSection userData={userData} />;
      default:
        return (
          <div className="dashboard-overview">
            <div className="mb-4">
              <CalmNotificationCard />
            </div>

            {/* Daily Inspiration */}
            <div className="mb-4 p-4" style={{
              backgroundColor: 'var(--bg-white)',
              borderRadius: 'var(--radius-lg)',
              borderLeft: '4px solid var(--accent-lavender)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <p className="mb-0" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6 }}>
                "{getDailyQuote()}"
              </p>
            </div>

            {/* Overview Cards Section */}
            <section className="mb-5" id="overview">
              <OverviewCards />
            </section>

            {/* Notifications Display */}
            <section className="mb-5" id="notifications">
              <NotificationModule />
            </section>

            {/* Main Dashboard Grid */}
            <Row className="g-4">
              {/* Left Column - Core Health tracking */}
              <Col lg={6}>
                <div className="d-flex flex-column gap-4">

                  <MoodTrackingCard />
                  <MeditationCard />

                  <div className="dashboard-card" id="sessions">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                        <FiCalendar className="me-2" style={{ color: 'var(--primary-teal)' }} />
                        Your upcoming sessions
                      </h5>
                      <button
                        onClick={() => navigate('/dashboard/sessions')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                      >
                        Schedule new
                      </button>
                    </div>
                    <SessionModule />
                  </div>
                </div>
              </Col>

              {/* Right Column - Chat and AI */}
              <Col lg={6}>
                <div className="d-flex flex-column gap-4">

                  <div className="dashboard-card" id="checkins">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                        <FiHeart className="me-2" style={{ color: 'var(--accent-peach)' }} />
                        Historical Check-ins
                      </h5>
                      <button
                        onClick={() => navigate('/dashboard/checkins')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                      >
                        View history
                      </button>
                    </div>
                    <CheckinModule />
                  </div>

                  <div className="dashboard-card" id="chat">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                        <FiMessageSquare className="me-2" style={{ color: 'var(--primary-teal)' }} />
                        Recent conversations
                      </h5>
                      <button
                        onClick={() => navigate('/dashboard/chat')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                      >
                        See all
                      </button>
                    </div>
                    <ChatModule compact />
                  </div>

                  <div className="dashboard-card" id="ai">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                        <FiCpu className="me-2" style={{ color: 'var(--accent-lavender)' }} />
                        Wellness companion
                      </h5>
                      <button
                        onClick={() => navigate('/dashboard/ai')}
                        className="btn btn-link p-0 text-decoration-none"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                      >
                        Chat now
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
                <div className="dashboard-card" style={{ backgroundColor: 'var(--bg-white)', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h5 className="fw-semibold mb-0" style={{ color: 'var(--text-main)' }}>
                      Help us improve
                    </h5>
                  </div>
                  <p className="mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Your feedback helps us create a better experience for everyone.
                  </p>
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
      {/* Welcome Header - More personal */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col>
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)'
              }}>
                <span style={{ fontSize: '24px' }}>🌿</span>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <h2 className="fw-semibold mb-0" style={{ color: 'var(--text-main)', fontSize: '1.8rem' }}>
                    {greeting}
                  </h2>
                  {greetingIcon}
                </div>
                <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {formatDate(currentTime)} at {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <button className="btn btn-light rounded-circle p-2" style={{
                border: '1px solid #EAF3F1',
                backgroundColor: '#FFFFFF',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiBell size={18} style={{ color: '#5F6F6C' }} />
              </button>
            </div>
          </Col>
        </Row>

        {/* Personalized welcome message - shows briefly */}
        {showWelcome && (
          <div className="mt-3 p-3" style={{
            backgroundColor: '#EAF3F1',
            borderRadius: '12px',
            animation: 'fadeOut 5s forwards'
          }}>
            <p className="mb-0" style={{ color: '#2D3F3B' }}>
              👋 Welcome back, {userName}! We're here to support you today.
            </p>
          </div>
        )}
      </div>

      {/* Tab Navigation - Simpler styling */}
      <div className="mb-4">
        <Nav variant="pills" activeKey={getActiveKey()} onSelect={handleTabChange} className="gap-2">
          <Nav.Item>
            <Nav.Link eventKey="overview" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'overview' ? '#2EC4B6' : 'transparent',
              color: getActiveKey() === 'overview' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1',
              transition: 'all 0.2s ease'
            }}>
              <FiHome className="me-2" style={{ fontSize: '0.9rem' }} /> Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="checkins" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'checkins' ? '#F4A261' : 'transparent',
              color: getActiveKey() === 'checkins' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1'
            }}>
              <FiHeart className="me-2" /> Check-ins
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="sessions" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'sessions' ? '#2EC4B6' : 'transparent',
              color: getActiveKey() === 'sessions' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1'
            }}>
              <FiCalendar className="me-2" /> Sessions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chat" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'chat' ? '#2EC4B6' : 'transparent',
              color: getActiveKey() === 'chat' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1'
            }}>
              <FiMessageSquare className="me-2" /> Messages
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ai" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'ai' ? '#F4A261' : 'transparent',
              color: getActiveKey() === 'ai' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1'
            }}>
              <FiCpu className="me-2" /> AI Companion
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="profile" style={{
              borderRadius: '40px',
              padding: '0.6rem 1.2rem',
              backgroundColor: getActiveKey() === 'profile' ? '#2EC4B6' : 'transparent',
              color: getActiveKey() === 'profile' ? 'white' : '#5F6F6C',
              border: '1px solid #EAF3F1'
            }}>
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
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        .dashboard-card {
          background-color: #FFFFFF;
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid #EDF1F0;
          transition: all 0.2s ease;
        }
        
        .dashboard-card:hover {
          border-color: #D0E0DC;
        }
        
        .nav-pills .nav-link:hover {
          background-color: #F4F8F6 !important;
          color: #2D3F3B !important;
        }
        
        h5.fw-semibold {
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        /* Remove Bootstrap's default tab styling */
        .nav-pills .nav-link.active, 
        .nav-pills .show > .nav-link {
          background-color: transparent;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F4F8F6;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C0D4CF;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9FB7B0;
        }
      `}</style>
    </DashboardLayout>
  );
};