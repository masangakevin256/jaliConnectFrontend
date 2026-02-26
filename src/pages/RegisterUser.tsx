import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Layout/Navbar';
import { Button } from '../components/UI/Button';
import { FormInput } from '../components/UI/FormInput';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiPhone, FiCalendar, FiCheckCircle, FiShield } from 'react-icons/fi';
import type { RegisterUserPayload } from '../types';

export const RegisterUser: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState<RegisterUserPayload & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age_group: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthValid = password.length >= 8;

    const strengthCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar, lengthValid].filter(Boolean).length;

    if (strengthCount >= 4) setPasswordStrength('strong');
    else if (strengthCount >= 2) setPasswordStrength('medium');
    else setPasswordStrength('weak');
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'strong': return '#2EC4B6';
      case 'medium': return '#F4A261';
      case 'weak': return '#dc3545';
      default: return '#5F6F6C';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      console.log(payload);
      const response = await authService.registerUser(payload);
      setAuth(response);
      toast.success('Registration successful! Welcome to JaliConnect');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section style={{ backgroundColor: '#F4F8F6' }} className="min-vh-100 d-flex align-items-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={6}>
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
                {/* Header with brand color */}
                <div style={{ 
                  backgroundColor: '#2EC4B6',
                  padding: '2rem',
                  textAlign: 'center'
                }}>
                  <div className="d-inline-flex align-items-center justify-content-center mb-3">
                    <div style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      width: '70px',
                      height: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FiCheckCircle size={32} color="white" />
                    </div>
                  </div>
                  <h2 className="fw-bold mb-2 text-white">Begin Your Journey</h2>
                  <p className="text-white opacity-75 mb-0">Create your account in just a few steps</p>
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
                    {/* Username field */}
                    <FormInput
                      label="Username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                      icon={<FiUser style={{ color: '#5F6F6C' }} />}
                    />

                    <Row>
                      <Col md={6}>
                        {/* Email field */}
                        <FormInput
                          label="Email (optional)"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          icon={<FiMail style={{ color: '#5F6F6C' }} />}
                        />
                      </Col>
                      <Col md={6}>
                        {/* Phone field */}
                        <FormInput
                          label="Phone(optional)"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+254 XXX XXX XXX"
                          icon={<FiPhone style={{ color: '#5F6F6C' }} />}
                        />
                      </Col>
                    </Row>

                    {/* Age group select */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-500 mb-2" style={{ color: '#1F2D2B' }}>
                        <FiCalendar className="me-2" style={{ color: '#2EC4B6' }} />
                        Age Group
                      </Form.Label>
                      <Form.Select
                        name="age_group"
                        value={formData.age_group}
                        onChange={handleChange}
                        style={{ 
                          borderRadius: '12px',
                          borderColor: '#EAF3F1',
                          padding: '0.75rem',
                          color: '#1F2D2B'
                        }}
                        className="shadow-sm"
                      >
                        <option value="">Select your age group</option>
                        <option value="13-17">13-17 years</option>
                        <option value="18-24">18-24 years</option>
                        <option value="25-35">25-35 years</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Password field with strength indicator */}
                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      icon={<FiLock style={{ color: '#5F6F6C' }} />}
                    />
                    
                    {formData.password && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <div style={{ 
                            height: '4px', 
                            width: '100%', 
                            backgroundColor: '#EAF3F1',
                            borderRadius: '2px'
                          }}>
                            <div style={{ 
                              height: '4px', 
                              width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                              backgroundColor: getPasswordStrengthColor(),
                              borderRadius: '2px',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <span style={{ color: getPasswordStrengthColor(), fontSize: '0.85rem', textTransform: 'capitalize' }}>
                            {passwordStrength}
                          </span>
                        </div>
                        <small style={{ color: '#5F6F6C' }}>
                          Use at least 8 characters with mix of letters, numbers & symbols
                        </small>
                      </div>
                    )}

                    <FormInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      icon={<FiLock style={{ color: '#5F6F6C' }} />}
                    />

                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <Alert variant="danger" className="py-2 small" style={{ backgroundColor: '#fee9e7', border: 'none' }}>
                        Passwords do not match
                      </Alert>
                    )}

                    {/* Terms and conditions */}
                    <Form.Group className="mb-4">
                      <Form.Check type="checkbox" required>
                        <Form.Check.Input type="checkbox" required />
                        <Form.Check.Label style={{ color: '#5F6F6C' }}>
                          I agree to the <a href="/terms" style={{ color: '#2EC4B6', textDecoration: 'none' }}>Terms of Service</a> and{' '}
                          <a href="/privacy" style={{ color: '#2EC4B6', textDecoration: 'none' }}>Privacy Policy</a>
                        </Form.Check.Label>
                      </Form.Check>
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-3 fw-500 py-3 mb-3"
                      style={{ 
                        backgroundColor: '#2EC4B6', 
                        borderColor: '#2EC4B6',
                        transition: 'all 0.3s ease'
                      }}
                      loading={loading}
                    >
                      Create Account
                    </Button>

                    <div className="text-center">
                      <p className="mb-0" style={{ color: '#5F6F6C' }}>
                        Already have an account?{' '}
                        <a 
                          href="/login/user" 
                          className="text-decoration-none fw-500"
                          style={{ color: '#2EC4B6' }}
                        >
                          Sign in here
                        </a>
                      </p>
                    </div>
                  </Form>

                  {/* Security note */}
                  <div className="mt-4 pt-3 text-center border-top" style={{ borderColor: '#EAF3F1' }}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <FiShield size={14} style={{ color: '#5F6F6C' }} />
                      <span style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>
                        Your information is encrypted and never shared
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Help text */}
              <div className="text-center mt-4">
                <p style={{ color: '#5F6F6C', fontSize: '0.9rem' }}>
                  Need help? <a href="/contact" style={{ color: '#2EC4B6', textDecoration: 'none' }}>Contact support</a>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .form-control:focus, .form-select:focus {
          border-color: #2EC4B6;
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.25);
        }
        .form-check-input:checked {
          background-color: #2EC4B6;
          border-color: #2EC4B6;
        }
        .form-check-input:focus {
          border-color: #2EC4B6;
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.25);
        }
      `}</style>
    </>
  );
};