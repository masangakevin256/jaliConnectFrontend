import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Layout/Navbar';
import { Button } from '../components/UI/Button';
import { FormInput } from '../components/UI/FormInput';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { FiLock, FiUser, FiMail, FiShield } from 'react-icons/fi';
import type { LoginPayload } from '../types';

interface LoginPageProps {
  role: 'user' | 'counselor' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
  const navigate = useNavigate();
  const { setAuth, auth } = useAuth();
  const [formData, setFormData] = useState<LoginPayload>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Navigate after auth state is updated
  useEffect(() => {
    if (loginSuccess && auth?.accessToken) {
      toast.success('Redirecting to dashboard...');
      const timer = setTimeout(() => {
        if (role === 'user') navigate('/dashboard');
        else if (role === 'counselor') navigate('/counselor');
        else navigate('/admin');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, auth, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLoginSuccess(false);

    try {
      let response;
      if (role === 'user') {
        response = await authService.loginUser(formData);
      } else if (role === 'counselor') {
        response = await authService.loginCounselor(formData);
      } else {
        response = await authService.loginAdmin(formData);
      }

      setAuth(response);
      toast.success('Login successful!');
      setLoginSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
      setLoginSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    return role === 'user' ? 'User' : role === 'counselor' ? 'Counselor' : 'Admin';
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'user': return <FiUser size={24} style={{ color: '#2EC4B6' }} />;
      case 'counselor': return <FiMail size={24} style={{ color: '#F4A261' }} />;
      case 'admin': return <FiShield size={24} style={{ color: '#5F6F6C' }} />;
      default: return <FiUser size={24} style={{ color: '#2EC4B6' }} />;
    }
  };

  const getRoleColor = () => {
    switch(role) {
      case 'user': return '#2EC4B6';
      case 'counselor': return '#F4A261';
      case 'admin': return '#5F6F6C';
      default: return '#2EC4B6';
    }
  };

  const getRegisterRoute = () => {
    return `/register/${role}`;
  };

  // Demo credentials for testing
  const fillDemoCredentials = () => {
    if (role === 'user') {
      setFormData({ username: 'demo_user', password: 'demo123' });
    } else if (role === 'counselor') {
      setFormData({ username: 'demo_counselor', password: 'demo123' });
    } else {
      setFormData({ username: 'demo_admin', password: 'demo123' });
    }
  };

  return (
    <>
      <Navbar />
      <section style={{ backgroundColor: '#F4F8F6' }} className="min-vh-100 d-flex align-items-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {/* Back to home link */}
              <div className="mb-4">
                <a 
                  href="/" 
                  className="text-decoration-none"
                  style={{ color: '#5F6F6C' }}
                >
                  ← Back to home
                </a>
              </div>

              <Card className="border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                {/* Header with role-specific color */}
                <div style={{ 
                  backgroundColor: getRoleColor(),
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <div className="d-inline-flex align-items-center justify-content-center mb-3">
                    <div style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getRoleIcon()}
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1 text-white">{getRoleLabel()} Login</h2>
                  <p className="text-white opacity-75 mb-0">Welcome back to JaliConnect</p>
                </div>

                <Card.Body className="p-5" style={{ backgroundColor: '#FFFFFF' }}>
                  {error && (
                    <Alert 
                      variant="danger" 
                      className="rounded-3 border-0 mb-4"
                      style={{ backgroundColor: '#fee9e7', color: '#dc3545' }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <FormInput
                      label="Username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      icon={<FiUser style={{ color: '#5F6F6C' }} />}
                    />

                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      icon={<FiLock style={{ color: '#5F6F6C' }} />}
                    />

                    {/* Demo credentials button - remove in production */}
                    <div className="text-end mb-3">
                      <Button
                        variant="link"
                        onClick={fillDemoCredentials}
                        style={{ color: '#2EC4B6', textDecoration: 'none', fontSize: '0.9rem' }}
                        className="p-0"
                      >
                        Use demo credentials
                      </Button>
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-3 fw-500 py-3 mb-3"
                      style={{ 
                        backgroundColor: getRoleColor(), 
                        borderColor: getRoleColor(),
                        transition: 'all 0.3s ease'
                      }}
                      loading={loading}
                    >
                      Sign in
                    </Button>

                    <div className="text-center">
                      <p className="mb-2" style={{ color: '#5F6F6C' }}>
                        Don't have an account?{' '}
                        <a 
                          href={getRegisterRoute()} 
                          className="text-decoration-none fw-500"
                          style={{ color: getRoleColor() }}
                        >
                          Create account
                        </a>
                      </p>

                      {role === 'user' && (
                        <a 
                          href="/forgot-password" 
                          className="text-decoration-none small"
                          style={{ color: '#5F6F6C' }}
                        >
                          Forgot your password?
                        </a>
                      )}
                    </div>
                  </Form>

                  {/* Security note */}
                  <div className="mt-4 pt-3 text-center border-top" style={{ borderColor: '#EAF3F1 !important' }}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <FiLock size={14} style={{ color: '#5F6F6C' }} />
                      <span style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>
                        Your information is encrypted and secure
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Role switcher for testing */}
              {/* <div className="mt-4 text-center">
                <span style={{ color: '#5F6F6C', fontSize: '0.9rem' }}>Testing: </span>
                <a 
                  href="/login/user" 
                  className="text-decoration-none mx-2"
                  style={{ color: role === 'user' ? '#2EC4B6' : '#5F6F6C', fontWeight: role === 'user' ? 'bold' : 'normal' }}
                >
                  User
                </a>
                <span style={{ color: '#5F6F6C' }}>|</span>
                <a 
                  href="/login/counselor" 
                  className="text-decoration-none mx-2"
                  style={{ color: role === 'counselor' ? '#F4A261' : '#5F6F6C', fontWeight: role === 'counselor' ? 'bold' : 'normal' }}
                >
                  Counselor
                </a>
                <span style={{ color: '#5F6F6C' }}>|</span>
                <a 
                  href="/login/admin" 
                  className="text-decoration-none mx-2"
                  style={{ color: role === 'admin' ? '#5F6F6C' : '#5F6F6C', fontWeight: role === 'admin' ? 'bold' : 'normal' }}
                >
                  Admin
                </a>
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .form-control:focus {
          border-color: ${getRoleColor()};
          box-shadow: 0 0 0 0.2rem ${role === 'user' ? 'rgba(46, 196, 182, 0.25)' : 
            role === 'counselor' ? 'rgba(244, 162, 97, 0.25)' : 'rgba(95, 111, 108, 0.25)'};
        }
      `}</style>
    </>
  );
};