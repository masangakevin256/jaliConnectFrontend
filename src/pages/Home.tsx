import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { 
  FiArrowRight, FiUsers, FiShield, FiHeart, FiMessageCircle, 
  FiCalendar, FiClock, FiAward, FiBookOpen, FiSun, FiMoon,
  FiActivity, FiCompass, FiFeather, FiWind, FiCoffee, FiSmile,
  FiZap, FiTrendingUp, FiLock, FiUserCheck, FiVideo, FiPhone,
  FiMessageSquare, FiPieChart, FiThumbsUp, FiStar, FiGlobe,
  FiHome, FiBattery, FiCloud, FiDroplet, FiLeaf, FiCheckCircle
} from 'react-icons/fi';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      {/* Hero Section - Warm & Inviting with Teal Gradient */}
      <section style={{ 
        background: 'linear-gradient(135deg, #F4F8F6 0%, #E8F3F0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }} className="py-5">
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(46, 196, 182, 0.03)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(244, 162, 97, 0.03)',
          zIndex: 0
        }} />
        
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="pe-lg-4">
                <span className="badge mb-4 px-3 py-2" style={{ 
                  backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                  color: '#2EC4B6',
                  fontWeight: '500',
                  borderRadius: '50px'
                }}>
                  🌱 Your mental wellness journey starts here
                </span>
                <h1 className="display-4 fw-bold mb-4" style={{ color: '#1F2D2B', lineHeight: '1.2' }}>
                  Find your balance with{' '}
                  <span style={{ 
                    color: '#2EC4B6', 
                    borderBottom: '3px solid #F4A261', 
                    display: 'inline-block', 
                    paddingBottom: '0.25rem' 
                  }}>
                    compassionate care
                  </span>
                </h1>
                <p className="lead mb-4" style={{ color: '#5F6F6C', fontSize: '1.25rem', maxWidth: '90%' }}>
                  JaliConnect is more than a therapy platform—it's a safe harbor for your mental wellness journey. 
                  We provide a confidential space where you can connect with licensed therapists, track your emotional well-being, 
                  and discover evidence-based tools for healing and growth. Whether you're navigating anxiety, depression, 
                  relationship challenges, or simply seeking personal growth, our compassionate professionals are here to support you 
                  every step of the way.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    size="lg"
                    style={{ 
                      backgroundColor: '#2EC4B6', 
                      borderColor: '#2EC4B6',
                      padding: '0.75rem 2rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(46, 196, 182, 0.25)'
                    }}
                    onClick={() => navigate('/register/user')}
                    className="rounded-3 px-4 fw-500"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#28a99d';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(46, 196, 182, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2EC4B6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(46, 196, 182, 0.25)';
                    }}
                  >
                    Begin your healing journey <FiArrowRight className="ms-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    onClick={() => navigate('/about')}
                    style={{ 
                      borderColor: '#5F6F6C', 
                      color: '#1F2D2B',
                      padding: '0.75rem 2rem',
                      fontWeight: '500',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(5px)'
                    }}
                    className="rounded-3 px-4 fw-500"
                  >
                    Learn more about our approach
                  </Button>
                </div>
                
                {/* Enhanced Trust indicators */}
                <div className="d-flex gap-4 mt-5 flex-wrap">
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                      padding: '8px', 
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}>
                      <FiShield style={{ color: '#2EC4B6' }} />
                    </div>
                    <span style={{ color: '#5F6F6C' }}>HIPAA-compliant & 100% Confidential</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                      padding: '8px', 
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}>
                      <FiUserCheck style={{ color: '#2EC4B6' }} />
                    </div>
                    <span style={{ color: '#5F6F6C' }}>Licensed & vetted therapists</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                      padding: '8px', 
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}>
                      <FiClock style={{ color: '#2EC4B6' }} />
                    </div>
                    <span style={{ color: '#5F6F6C' }}>24/7 messaging & support</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Peaceful moment of self-reflection in a calm environment, representing the healing journey" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ 
                    maxHeight: '500px', 
                    width: '100%', 
                    objectFit: 'cover',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-20px', 
                  right: '-20px', 
                  width: '150px', 
                  height: '150px', 
                  backgroundColor: '#F4A261', 
                  borderRadius: '50%', 
                  opacity: 0.1,
                  zIndex: -1
                }} />
                <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  left: '-20px', 
                  width: '100px', 
                  height: '100px', 
                  backgroundColor: '#2EC4B6', 
                  borderRadius: '50%', 
                  opacity: 0.1,
                  zIndex: -1
                }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Welcome Message - Enhanced */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <div style={{ 
                padding: '2rem', 
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #F4F8F6 0%, #FFFFFF 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
              }}>
                <FiHeart size={48} style={{ color: '#F4A261', marginBottom: '1.5rem' }} />
                <p style={{ color: '#1F2D2B', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                  "Mental health is not a destination, but a continuous journey of self-discovery and healing. 
                  At JaliConnect, we believe that everyone deserves access to compassionate, personalized mental health care. 
                  Whether you're taking your first steps or continuing your path to wellness, we're here to walk alongside you, 
                  providing support, understanding, and evidence-based care every step of the way."
                </p>
                <p className="mt-4" style={{ color: '#2EC4B6', fontWeight: '500', fontSize: '1.1rem' }}>
                  — The JaliConnect Care Team
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section - Enhanced with more detail */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8F6 100%)'
      }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                How we support your mental wellness
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '2.5rem' }}>
                Comprehensive care that fits your life
              </h2>
              <p className="text-muted" style={{ color: '#5F6F6C', fontSize: '1.1rem' }}>
                We understand that every mental health journey is unique. That's why we offer multiple ways to connect, 
                grow, and heal—all tailored to your specific needs and comfort level.
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0" style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(46, 196, 182, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
              }}>
                <Card.Body className="p-4">
                  <div className="mb-4" style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiMessageCircle size={30} style={{ color: '#2EC4B6' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Talk it out, your way
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    Connect with licensed therapists through multiple channels that match your comfort level:
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2 d-flex align-items-center">
                      <FiVideo className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Video sessions for face-to-face connection</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiPhone className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Phone calls when you need a voice</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiMessageSquare className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Messaging for flexible, asynchronous support</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0" style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(244, 162, 97, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
              }}>
                <Card.Body className="p-4">
                  <div className="mb-4" style={{
                    backgroundColor: 'rgba(244, 162, 97, 0.1)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiHeart size={30} style={{ color: '#F4A261' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Track your wellness journey
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    Monitor your mental health with our comprehensive tracking tools:
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2 d-flex align-items-center">
                      <FiSmile className="me-2" style={{ color: '#F4A261' }} />
                      <span style={{ color: '#5F6F6C' }}>Daily mood check-ins with pattern recognition</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiPieChart className="me-2" style={{ color: '#F4A261' }} />
                      <span style={{ color: '#5F6F6C' }}>Personalized insights and progress reports</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiTrendingUp className="me-2" style={{ color: '#F4A261' }} />
                      <span style={{ color: '#5F6F6C' }}>Celebrate milestones and track improvements</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0" style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(46, 196, 182, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.03)';
              }}>
                <Card.Body className="p-4">
                  <div className="mb-4" style={{
                    backgroundColor: 'rgba(46, 196, 182, 0.1)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiCalendar size={30} style={{ color: '#2EC4B6' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Flexible scheduling for real life
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    We know life doesn't follow a 9-to-5 schedule. That's why we offer:
                  </Card.Text>
                  <ul className="list-unstyled mt-3">
                    <li className="mb-2 d-flex align-items-center">
                      <FiSun className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Early morning sessions before work</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiCoffee className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Lunch break appointments</span>
                    </li>
                    <li className="mb-2 d-flex align-items-center">
                      <FiMoon className="me-2" style={{ color: '#2EC4B6' }} />
                      <span style={{ color: '#5F6F6C' }}>Evening and weekend availability</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section - Enhanced */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #F4F8F6 0%, #E8F3F0 100%)'
      }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                Your path to wellness
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Start your journey in three simple steps</h2>
              <p style={{ color: '#5F6F6C' }}>We've made it easy to begin—no complicated forms, no waiting lists</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 position-relative" 
                     style={{ 
                       width: '90px', 
                       height: '90px', 
                       background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                       boxShadow: '0 10px 20px rgba(46, 196, 182, 0.2)'
                     }}>
                  <span style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 'bold' }}>1</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Create your confidential account</h4>
                <p style={{ color: '#5F6F6C', maxWidth: '280px', margin: '0 auto' }}>
                  Sign up in less than 2 minutes—all we need is basic information to get started. 
                  Your privacy is paramount: all data is encrypted and protected by HIPAA-compliant security.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" 
                     style={{ 
                       width: '90px', 
                       height: '90px', 
                       background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)',
                       boxShadow: '0 10px 20px rgba(244, 162, 97, 0.2)'
                     }}>
                  <span style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 'bold' }}>2</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Find your ideal therapist</h4>
                <p style={{ color: '#5F6F6C', maxWidth: '280px', margin: '0 auto' }}>
                  Browse our diverse network of licensed professionals specializing in anxiety, depression, 
                  trauma, relationships, and more. Filter by specialty, approach, and availability.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" 
                     style={{ 
                       width: '90px', 
                       height: '90px', 
                       background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                       boxShadow: '0 10px 20px rgba(46, 196, 182, 0.2)'
                     }}>
                  <span style={{ color: '#FFFFFF', fontSize: '2.2rem', fontWeight: 'bold' }}>3</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Begin your healing journey</h4>
                <p style={{ color: '#5F6F6C', maxWidth: '280px', margin: '0 auto' }}>
                  Start with a free 15-minute consultation, then begin regular sessions with unlimited messaging, 
                  wellness exercises, and progress tracking tailored to your needs.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section - Enhanced */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Supportive therapy session in a calm, welcoming environment" 
                  className="img-fluid rounded-4 shadow"
                  style={{ 
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  width: '120px',
                  height: '120px',
                  background: '#F4A261',
                  borderRadius: '50%',
                  opacity: 0.1,
                  zIndex: -1
                }} />
              </div>
            </Col>
            <Col lg={6}>
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                What sets us apart
              </span>
              <h2 className="fw-bold mb-4" style={{ color: '#1F2D2B' }}>Why thousands choose JaliConnect</h2>
              
              <div className="d-flex mb-4">
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <FiAward size={24} style={{ color: '#2EC4B6' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Qualified, compassionate professionals</h5>
                  <p style={{ color: '#5F6F6C' }}>
                    All our therapists are fully licensed (LCSW, LPC, LMFT, PsyD, PhD) with a minimum of 3 years clinical experience. 
                    Each professional undergoes rigorous vetting, background checks, and ongoing supervision.
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <FiLock size={24} style={{ color: '#2EC4B6' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Enterprise-grade security & privacy</h5>
                  <p style={{ color: '#5F6F6C' }}>
                    Your confidentiality is non-negotiable. We use bank-level 256-bit encryption, secure data storage, 
                    and comply with HIPAA, GDPR, and international privacy standards.
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <FiBookOpen size={24} style={{ color: '#2EC4B6' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Holistic wellness resources</h5>
                  <p style={{ color: '#5F6F6C' }}>
                    Access our comprehensive wellness library with guided meditations, CBT exercises, 
                    journaling prompts, and educational content created by mental health experts.
                  </p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div style={{
                  backgroundColor: 'rgba(46, 196, 182, 0.1)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  flexShrink: 0
                }}>
                  <FiGlobe size={24} style={{ color: '#2EC4B6' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Culturally sensitive & inclusive care</h5>
                  <p style={{ color: '#5F6F6C' }}>
                    Our therapists represent diverse backgrounds, languages, and specialties—including LGBTQ+ affirming care, 
                    BIPOC mental health, and culturally-specific approaches.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Conditions We Treat - New Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #F4F8F6 0%, #FFFFFF 100%)'
      }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                Specialized care for your needs
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Conditions we help with</h2>
              <p style={{ color: '#5F6F6C' }}>Our therapists specialize in a wide range of mental health concerns</p>
            </Col>
          </Row>

          <Row className="g-3">
            {[
              { icon: FiCloud, name: 'Anxiety & Panic Disorders', desc: 'General anxiety, social anxiety, panic attacks, phobias' },
              { icon: FiDroplet, name: 'Depression & Mood Disorders', desc: 'Major depression, bipolar disorder, seasonal affective disorder' },
              { icon: FiZap, name: 'Trauma & PTSD', desc: 'Childhood trauma, complex PTSD, acute stress, abuse recovery' },
              { icon: FiHeart, name: 'Relationships', desc: 'Couples counseling, family conflict, attachment issues, boundaries' },
              { icon: FiCoffee, name: 'Stress & Burnout', desc: 'Work stress, academic pressure, caregiver burnout, life balance' },
              { icon: FiMoon, name: 'Grief & Loss', desc: 'Bereavement, pet loss, divorce recovery, life transitions' }
            ].map((condition, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 border-0" style={{ 
                  borderRadius: '20px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(46, 196, 182, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.02)';
                }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        backgroundColor: 'rgba(46, 196, 182, 0.1)',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}>
                        <condition.icon size={20} style={{ color: '#2EC4B6' }} />
                      </div>
                      <h6 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>{condition.name}</h6>
                    </div>
                    <p style={{ color: '#5F6F6C', fontSize: '0.95rem', marginLeft: '52px' }}>{condition.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                Real stories, real healing
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>What our community says</h2>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 h-100" style={{ 
                borderRadius: '24px',
                backgroundColor: '#F4F8F6',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
              }}>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} style={{ color: '#F4A261', fill: '#F4A261' }} className="me-1" />
                    ))}
                  </div>
                  <p style={{ color: '#5F6F6C', fontStyle: 'italic' }} className="mb-3">
                    "I was nervous about starting therapy, but my counselor made me feel completely at ease. 
                    Being able to message between sessions has been a game-changer for my anxiety."
                  </p>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      SK
                    </div>
                    <div>
                      <p className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>Sarah K.</p>
                      <p style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>Member for 6 months</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="border-0 h-100" style={{ 
                borderRadius: '24px',
                backgroundColor: '#F4F8F6',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
              }}>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} style={{ color: '#F4A261', fill: '#F4A261' }} className="me-1" />
                    ))}
                  </div>
                  <p style={{ color: '#5F6F6C', fontStyle: 'italic' }} className="mb-3">
                    "The flexibility to have sessions early in the morning before work fits perfectly with my schedule. 
                    I've made more progress in 3 months than I did in years of traditional therapy."
                  </p>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      MR
                    </div>
                    <div>
                      <p className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>Michael R.</p>
                      <p style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>Member for 1 year</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="border-0 h-100" style={{ 
                borderRadius: '24px',
                backgroundColor: '#F4F8F6',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
              }}>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} style={{ color: '#F4A261', fill: '#F4A261' }} className="me-1" />
                    ))}
                  </div>
                  <p style={{ color: '#5F6F6C', fontStyle: 'italic' }} className="mb-3">
                    "Finding a therapist who understands my cultural background made all the difference. 
                    I finally feel truly heard and understood. This platform changed my life."
                  </p>
                  <div className="d-flex align-items-center">
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)', 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      marginRight: '12px'
                    }}>
                      EM
                    </div>
                    <div>
                      <p className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>Elena M.</p>
                      <p style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>Member for 8 months</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ Preview - New Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #F4F8F6 0%, #E8F3F0 100%)'
      }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <span className="badge mb-3 px-3 py-2" style={{ 
                backgroundColor: 'rgba(46, 196, 182, 0.1)', 
                color: '#2EC4B6',
                borderRadius: '50px'
              }}>
                Common questions
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Answers to your questions</h2>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="mb-4" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.02)'
              }}>
                <h5 style={{ color: '#1F2D2B', fontWeight: '600' }} className="mb-2">
                  How do I know if online therapy is right for me?
                </h5>
                <p style={{ color: '#5F6F6C', marginBottom: '0' }}>
                  Online therapy can be effective for most people seeking mental health support. It's particularly helpful 
                  for those with busy schedules, mobility limitations, or who feel more comfortable in their own environment. 
                  Research shows online therapy is just as effective as in-person sessions for conditions like anxiety and depression. 
                  We offer a free consultation to help you decide if it's the right fit.
                </p>
              </div>

              <div className="mb-4" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.02)'
              }}>
                <h5 style={{ color: '#1F2D2B', fontWeight: '600' }} className="mb-2">
                  How much does it cost?
                </h5>
                <p style={{ color: '#5F6F6C', marginBottom: '0' }}>
                  We believe mental health care should be accessible. Plans start at $10/week, with options for financial assistance. 
                  Many insurance plans are accepted, and we provide transparent pricing with no hidden fees. 
                  All plans include unlimited messaging, and you can cancel or change your plan at any time.
                </p>
              </div>

              <div className="mb-4" style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.02)'
              }}>
                <h5 style={{ color: '#1F2D2B', fontWeight: '600' }} className="mb-2">
                  What if I don't connect with my therapist?
                </h5>
                <p style={{ color: '#5F6F6C', marginBottom: '0' }}>
                  The therapeutic relationship is crucial—if you don't feel a connection, we'll help you find a better match at no additional cost. 
                  We encourage starting with a free consultation to ensure compatibility, but we understand that sometimes it takes a few tries 
                  to find the right fit. Your comfort and progress are our priorities.
                </p>
              </div>

              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/faq')}
                  style={{ 
                    color: '#2EC4B6', 
                    textDecoration: 'none', 
                    fontWeight: '500',
                    fontSize: '1.1rem'
                  }}
                >
                  View all FAQs <FiArrowRight className="ms-1" />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Get Started Section - Enhanced with teal gradient */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-50px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-40px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }} />

        {/* Get Started Section - Enhanced with teal gradient */}
  <section className="py-5" style={{ 
  background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
  position: 'relative',
  overflow: 'hidden'
}}>
  {/* Decorative circles */}
  <div style={{
    position: 'absolute',
    top: '-100px',
    right: '-50px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 0
  }} />
  <div style={{
    position: 'absolute',
    bottom: '-80px',
    left: '-40px',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    zIndex: 0
  }} />

  <Container style={{ position: 'relative', zIndex: 1 }}>
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <Card className="border-0 text-center" style={{ 
          borderRadius: '32px', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }}>
          <Card.Body className="p-5">
            <div className="mb-4">
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiHeart size={40} style={{ color: '#FFFFFF' }} />
              </div>
            </div>
            <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '2.2rem' }}>
              Ready to start your healing journey?
            </h2>
            <p className="mb-4" style={{ color: '#5F6F6C', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Join a community of over 50,000 individuals who've found support, healing, and growth through JaliConnect. 
              Take the first step—it's confidential, secure, and completely judgment-free.
            </p>
            
            <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
              <div className="d-flex align-items-center">
                <FiCheckCircle style={{ color: '#2EC4B6' }} className="me-1" />
                <span style={{ color: '#5F6F6C' }}>Free 30 days of trial</span>
              </div>
              <div className="d-flex align-items-center">
                <FiCheckCircle style={{ color: '#2EC4B6' }} className="me-1" />
                <span style={{ color: '#5F6F6C' }}>No commitment</span>
              </div>
              <div className="d-flex align-items-center">
                <FiCheckCircle style={{ color: '#2EC4B6' }} className="me-1" />
                <span style={{ color: '#5F6F6C' }}>Cancel anytime</span>
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                size="lg"
                onClick={() => navigate('/register/user')}
                style={{ 
                  backgroundColor: '#2EC4B6', 
                  borderColor: '#2EC4B6',
                  padding: '0.75rem 2.5rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 6px rgba(46, 196, 182, 0.25)'
                }}
                className="rounded-3 px-4 py-2"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a99d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2EC4B6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create your free account
              </Button>
              <Button 
                size="lg"
                variant="outline-secondary"
                onClick={() => navigate('/login/user')}
                style={{ 
                  borderColor: '#5F6F6C', 
                  color: '#1F2D2B',
                  padding: '0.75rem 2.5rem',
                  fontWeight: '500',
                  backgroundColor: '#FFFFFF'
                }}
                className="rounded-3 px-4 py-2"
              >
                Sign in to existing account
              </Button>
            </div>

            <p className="mt-4" style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              Your information is protected by enterprise-grade security.
            </p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
  </section>
      </section>
    </>
  );
};