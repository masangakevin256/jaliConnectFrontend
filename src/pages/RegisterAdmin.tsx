import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Layout/Navbar';
import { Button } from '../components/UI/Button';
import { FormInput } from '../components/UI/FormInput';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { RegisterAdminPayload } from '../types';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiShield, 
  FiEye, 
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';

export const RegisterAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [formData, setFormData] = useState<RegisterAdminPayload & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    registration_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegCode, setShowRegCode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Password strength checker
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength('');
      return;
    }
    
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    const lengthValid = formData.password.length >= 8;

    const strengthCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar, lengthValid].filter(Boolean).length;

    if (strengthCount >= 4) setPasswordStrength('strong');
    else if (strengthCount >= 2) setPasswordStrength('medium');
    else setPasswordStrength('weak');
  }, [formData.password]);

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 'strong': return '#2EC4B6';
      case 'medium': return '#F4A261';
      case 'weak': return '#dc3545';
      default: return '#E0E7E5';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 'strong': return 'Strong password';
      case 'medium': return 'Medium strength';
      case 'weak': return 'Weak password';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field: string) => {
    if (!touchedFields[field]) return null;
    
    switch(field) {
      case 'username':
        return formData.username.length < 3 ? 'Username must be at least 3 characters' : null;
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Invalid email address' : null;
      case 'password':
        return formData.password.length < 8 ? 'Password must be at least 8 characters' : null;
      case 'confirmPassword':
        return formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : null;
      case 'registration_code':
        return formData.registration_code.length < 6 ? 'Registration code must be at least 6 characters' : null;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errors = ['username', 'email', 'password', 'confirmPassword', 'registration_code']
      .map(field => validateField(field))
      .filter(Boolean);

    if (errors.length > 0) {
      setError('Please fix the errors before submitting');
      toast.error('Please check all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await authService.registerAdmin(payload);
      setAuth(response);
      
      // Success notification
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px 24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid #2EC4B6',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            background: '#E8F6F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiCheckCircle style={{ color: '#2EC4B6' }} size={20} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#2D3F3B', marginBottom: 2 }}>
              Admin registration successful!
            </p>
            <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
              Welcome to JaliConnect, {formData.username}
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });
      
      navigate('/admin');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message, {
        icon: '❌',
        style: { borderRadius: '16px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          background: 'linear-gradient(135deg, #F4F8F6 0%, #E8F3F0 100%)',
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
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
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate('/')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#5F6F6C',
                  marginBottom: '1.5rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2EC4B6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#5F6F6C'}
              >
                <FiArrowLeft size={18} />
                Back to Home
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0" style={{ 
                  borderRadius: '32px',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  border: '1px solid rgba(46, 196, 182, 0.08)'
                }}>
                  {/* Card Header with Gradient */}
                  <div style={{
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '24px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <FiShield size={32} color="white" />
                    </motion.div>
                    <h2 className="fw-bold mb-2" style={{ fontSize: '1.8rem' }}>Admin Registration</h2>
                    <p style={{ opacity: 0.9, marginBottom: 0, fontSize: '0.95rem' }}>
                      Create system administrator account
                    </p>
                  </div>

                  <Card.Body className="p-4 p-md-5">
                    {/* Security Notice */}
                    <Alert 
                      style={{ 
                        backgroundColor: '#F4F8F6',
                        border: '1px solid #EAF3F1',
                        borderRadius: '16px',
                        color: '#2D3F3B'
                      }}
                      className="mb-4"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <FiAlertCircle size={20} style={{ color: '#2EC4B6' }} />
                        <small>
                          This registration is for system administrators only. 
                          A valid registration code is required.
                        </small>
                      </div>
                    </Alert>

                    {error && (
                      <Alert 
                        variant="danger" 
                        style={{ 
                          borderRadius: '16px',
                          border: 'none',
                          backgroundColor: '#FFE5E5',
                          color: '#dc3545'
                        }}
                        className="mb-4"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <FiAlertCircle size={18} />
                          <span>{error}</span>
                        </div>
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      {/* Username Field */}
                      <div className="mb-4">
                        <FormInput
                          label="Username"
                          name="username"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                          onBlur={() => handleBlur('username')}
                          placeholder="Choose your username"
                          required
                          icon={<FiUser style={{ color: '#8A9D9A' }} />}
                          error={validateField('username')}
                        />
                      </div>

                      {/* Email Field */}
                      <div className="mb-4">
                        <FormInput
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="Enter your email"
                          required
                          icon={<FiMail style={{ color: '#8A9D9A' }} />}
                          error={validateField('email')}
                        />
                      </div>

                      {/* Registration Code Field */}
                      <div className="mb-4">
                        <div style={{ position: 'relative' }}>
                          <FormInput
                            label="Registration Code"
                            name="registration_code"
                            type={showRegCode ? 'text' : 'password'}
                            value={formData.registration_code}
                            onChange={handleChange}
                            onBlur={() => handleBlur('registration_code')}
                            placeholder="Enter admin registration code"
                            required
                            icon={<FiShield style={{ color: '#8A9D9A' }} />}
                            error={validateField('registration_code')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegCode(!showRegCode)}
                            style={{
                              position: 'absolute',
                              right: '40px',
                              top: '38px',
                              background: 'transparent',
                              border: 'none',
                              color: '#8A9D9A',
                              cursor: 'pointer'
                            }}
                          >
                            {showRegCode ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="mb-4">
                        <div style={{ position: 'relative' }}>
                          <FormInput
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={() => handleBlur('password')}
                            placeholder="Create a strong password"
                            required
                            icon={<FiLock style={{ color: '#8A9D9A' }} />}
                            error={validateField('password')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: '40px',
                              top: '38px',
                              background: 'transparent',
                              border: 'none',
                              color: '#8A9D9A',
                              cursor: 'pointer'
                            }}
                          >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2"
                          >
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ 
                                height: '4px', 
                                width: '100px', 
                                backgroundColor: '#EDF1F0',
                                borderRadius: '2px',
                                overflow: 'hidden'
                              }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: passwordStrength === 'weak' ? '33%' : 
                                           passwordStrength === 'medium' ? '66%' : '100%'
                                  }}
                                  style={{ 
                                    height: '4px', 
                                    backgroundColor: getPasswordStrengthColor(),
                                    borderRadius: '2px'
                                  }}
                                />
                              </div>
                              <small style={{ color: getPasswordStrengthColor() }}>
                                {getPasswordStrengthText()}
                              </small>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="mb-4">
                        <div style={{ position: 'relative' }}>
                          <FormInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={() => handleBlur('confirmPassword')}
                            placeholder="Confirm your password"
                            required
                            icon={<FiLock style={{ color: '#8A9D9A' }} />}
                            error={validateField('confirmPassword')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: 'absolute',
                              right: '40px',
                              top: '38px',
                              background: 'transparent',
                              border: 'none',
                              color: '#8A9D9A',
                              cursor: 'pointer'
                            }}
                          >
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-100 py-3"
                          loading={loading}
                          style={{
                            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                            border: 'none',
                            borderRadius: '40px',
                            fontSize: '1rem',
                            fontWeight: 500,
                            boxShadow: '0 8px 16px rgba(46, 196, 182, 0.2)'
                          }}
                        >
                          Create Admin Account
                        </Button>
                      </motion.div>
                    </Form>

                    {/* Footer Links */}
                    <div className="text-center mt-4">
                      <p style={{ color: '#8A9D9A', marginBottom: '8px', fontSize: '0.9rem' }}>
                        Already have admin access?{' '}
                        <a 
                          href="/login/admin" 
                          style={{ 
                            color: '#2EC4B6', 
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#28a99d'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#2EC4B6'}
                        >
                          Sign in here
                        </a>
                      </p>
                      
                      {/* Security Note */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        marginTop: '1rem',
                        fontSize: '0.75rem',
                        color: '#B0C0BD'
                      }}>
                        <FiShield size={12} />
                        <span>Secure admin registration • Protected by 256-bit encryption</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1) !important;
          outline: none;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #F9FCFB inset;
          transition: background-color 5000s ease-in-out 0s;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};