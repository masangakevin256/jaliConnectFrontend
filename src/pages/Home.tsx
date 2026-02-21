import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Layout/Navbar';
import { FiArrowRight, FiUsers, FiShield, FiHeart, FiMessageCircle, FiCalendar, FiClock, FiAward, FiBookOpen } from 'react-icons/fi';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      {/* Hero Section - Warm & Inviting */}
      <section style={{ backgroundColor: '#F4F8F6' }} className="py-5">
        <Container>
          <Row className="align-items-center min-vh-50 py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="pe-lg-4">
                <span className="badge mb-4 px-3 py-2" style={{ backgroundColor: '#EAF3F1', color: '#1F2D2B', fontWeight: '500' }}>
                  🌱 Your wellness journey starts here
                </span>
                <h1 className="display-4 fw-bold mb-4" style={{ color: '#1F2D2B', lineHeight: '1.2' }}>
                  Find your balance with{' '}
                  <span style={{ color: '#2EC4B6', borderBottom: '3px solid #F4A261', display: 'inline-block', paddingBottom: '0.25rem' }}>
                    compassionate care
                  </span>
                </h1>
                <p className="lead mb-4" style={{ color: '#5F6F6C', fontSize: '1.25rem', maxWidth: '90%' }}>
                  JaliConnect is a safe, confidential space where you can connect with licensed therapists, 
                  track your mental wellness journey, and find the support you need—all from the comfort of your own space.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Button
                    size="lg"
                    style={{ 
                      backgroundColor: '#2EC4B6', 
                      borderColor: '#2EC4B6',
                      padding: '0.75rem 2rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => navigate('/register/user')}
                    className="rounded-3 px-4 fw-500 shadow-sm"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#28a99d'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
                  >
                    Begin your journey <FiArrowRight className="ms-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline-secondary"
                    onClick={() => navigate('/about')}
                    style={{ 
                      borderColor: '#5F6F6C', 
                      color: '#1F2D2B',
                      padding: '0.75rem 2rem',
                      fontWeight: '500'
                    }}
                    className="rounded-3 px-4 fw-500"
                  >
                    Learn more
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="d-flex gap-4 mt-5">
                  <div className="d-flex align-items-center">
                    <FiShield style={{ color: '#2EC4B6' }} className="me-2" />
                    <span style={{ color: '#5F6F6C' }}>100% Confidential</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiUsers style={{ color: '#2EC4B6' }} className="me-2" />
                    <span style={{ color: '#5F6F6C' }}>Licensed therapists</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiClock style={{ color: '#2EC4B6' }} className="me-2" />
                    <span style={{ color: '#5F6F6C' }}>24/7 Availability</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Peaceful moment of self-reflection in a calm environment" 
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ 
                    maxHeight: '500px', 
                    width: '100%', 
                    objectFit: 'cover',
                    borderRadius: '24px'
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-20px', 
                  right: '-20px', 
                  width: '120px', 
                  height: '120px', 
                  backgroundColor: '#F4A261', 
                  borderRadius: '50%', 
                  opacity: 0.1,
                  zIndex: -1
                }} />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Welcome Message */}
      <section className="py-4" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <p style={{ color: '#5F6F6C', fontSize: '1.2rem', fontStyle: 'italic' }}>
                "Taking the first step toward mental wellness is an act of courage. 
                We're here to walk alongside you, every step of the way."
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section - Soft & Approachable */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <span className="badge mb-3 px-3 py-2" style={{ backgroundColor: '#EAF3F1', color: '#1F2D2B' }}>
                How we support you
              </span>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '2.5rem' }}>
                Care that fits your life
              </h2>
              <p className="text-muted" style={{ color: '#5F6F6C', fontSize: '1.1rem' }}>
                Whether you're taking the first step or continuing your journey, we're here to help
              </p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 border-0" style={{ backgroundColor: '#F4F8F6', borderRadius: '20px' }}>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <FiMessageCircle size={36} style={{ color: '#2EC4B6' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Talk it out
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    Connect with licensed therapists through video, phone, or messaging. 
                    Choose the communication style that feels most comfortable for you.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0" style={{ backgroundColor: '#F4F8F6', borderRadius: '20px' }}>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <FiHeart size={36} style={{ color: '#F4A261' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Track progress
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    Monitor your mental wellness journey with personalized insights, 
                    mood tracking, and gentle check-ins that celebrate your progress.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100 border-0" style={{ backgroundColor: '#F4F8F6', borderRadius: '20px' }}>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <FiCalendar size={36} style={{ color: '#2EC4B6' }} />
                  </div>
                  <Card.Title className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '1.4rem' }}>
                    Flexible scheduling
                  </Card.Title>
                  <Card.Text style={{ color: '#5F6F6C' }}>
                    Book sessions that work with your schedule. Morning, evening, 
                    or weekend appointments available to fit your lifestyle.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ backgroundColor: '#F4F8F6' }}>
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>How JaliConnect works</h2>
              <p style={{ color: '#5F6F6C' }}>Simple steps to start your wellness journey</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-4" 
                     style={{ width: '80px', height: '80px', backgroundColor: '#EAF3F1' }}>
                  <span style={{ color: '#2EC4B6', fontSize: '2rem', fontWeight: 'bold' }}>1</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Create your account</h4>
                <p style={{ color: '#5F6F6C' }}>
                  Sign up in minutes. All your information is kept private and confidential.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-4" 
                     style={{ width: '80px', height: '80px', backgroundColor: '#EAF3F1' }}>
                  <span style={{ color: '#2EC4B6', fontSize: '2rem', fontWeight: 'bold' }}>2</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Find your therapist</h4>
                <p style={{ color: '#5F6F6C' }}>
                  Browse licensed professionals who specialize in what you're going through.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="rounded-circle bg-white d-flex align-items-center justify-content-center mx-auto mb-4" 
                     style={{ width: '80px', height: '80px', backgroundColor: '#EAF3F1' }}>
                  <span style={{ color: '#2EC4B6', fontSize: '2rem', fontWeight: 'bold' }}>3</span>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: '#1F2D2B' }}>Start your journey</h4>
                <p style={{ color: '#5F6F6C' }}>
                  Begin sessions and track your progress toward better mental health.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Supportive therapy session" 
                className="img-fluid rounded-4 shadow"
                style={{ borderRadius: '24px' }}
              />
            </Col>
            <Col lg={6}>
              <h2 className="fw-bold mb-4" style={{ color: '#1F2D2B' }}>Why choose JaliConnect?</h2>
              
              <div className="d-flex mb-4">
                <FiAward size={28} style={{ color: '#2EC4B6' }} className="me-3 flex-shrink-0" />
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Qualified professionals</h5>
                  <p style={{ color: '#5F6F6C' }}>All our therapists are licensed and vetted for your peace of mind.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <FiShield size={28} style={{ color: '#2EC4B6' }} className="me-3 flex-shrink-0" />
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Safe & confidential</h5>
                  <p style={{ color: '#5F6F6C' }}>Your privacy is our priority. All sessions are secure and private.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <FiBookOpen size={28} style={{ color: '#2EC4B6' }} className="me-3 flex-shrink-0" />
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1F2D2B' }}>Resources & tools</h5>
                  <p style={{ color: '#5F6F6C' }}>Access wellness resources, exercises, and tools to support your journey.</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Get Started Section - User Only */}
      <section className="py-5" style={{ backgroundColor: '#EAF3F1' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="border-0 text-center" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <Card.Body className="p-5">
                  <div className="mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019418-b400bb2ab074?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                      alt="Person starting their wellness journey" 
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  </div>
                  <h2 className="fw-bold mb-3" style={{ color: '#1F2D2B', fontSize: '2rem' }}>
                    Ready to start your journey?
                  </h2>
                  <p className="mb-4" style={{ color: '#5F6F6C', fontSize: '1.1rem' }}>
                    Join thousands of others who've found support and healing through JaliConnect. 
                    Your first step toward better mental health is just a click away.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/register/user')}
                      style={{ backgroundColor: '#2EC4B6', borderColor: '#2EC4B6' }}
                      className="rounded-3 px-4 py-2"
                    >
                      Create free account
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline-secondary"
                      onClick={() => navigate('/login/user')}
                      style={{ borderColor: '#5F6F6C', color: '#1F2D2B' }}
                      className="rounded-3 px-4 py-2"
                    >
                      Sign in
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};