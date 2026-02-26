// src/components/Modals/CounselorRegistrationModal.tsx
import React, { useState } from 'react';
import { Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../UI/Button';
import { FormInput } from '../UI/FormInput';
import { authService } from '../../services/authService';
import { FiUser, FiLock, FiTag, FiMail, FiPhone, FiAward, FiCheckCircle, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CounselorRegistrationModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess?: (counselor: any) => void;
}

export const CounselorRegistrationModal: React.FC<CounselorRegistrationModalProps> = ({
  show,
  onHide,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialties: '',
    yearsOfExperience: '',
    qualifications: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

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
      default: return '#8A9D9A';
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.username || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in all password fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.specialties || !formData.qualifications) {
        setError('Please fill in all professional details');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        specialties: formData.specialties.split(',').map(s => s.trim()),
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        qualifications: formData.qualifications.split(',').map(q => q.trim()),
        bio: formData.bio
      };

      const response = await authService.registerCounselor(payload);
      
      toast.success('Counselor registered successfully!', {
        icon: '🎉',
        style: { borderRadius: '20px' }
      });
      
      onSuccess?.(response);
      onHide();
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        specialties: '',
        yearsOfExperience: '',
        qualifications: '',
        bio: ''
      });
      setStep(1);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      style={{ borderRadius: '24px' }}
    >
      <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0', padding: '20px 24px' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FEF7E9 0%, #FDEFD9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiUserCheck size={24} style={{ color: '#F4A261' }} />
          </div>
          <div>
            <Modal.Title className="fw-semibold" style={{ color: '#2D3F3B' }}>
              Register New Counselor
            </Modal.Title>
            <small style={{ color: '#8A9D9A' }}>Step {step} of 3</small>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '24px' }}>
        {/* Progress Bar */}
        <div className="mb-4" style={{ height: '4px', backgroundColor: '#EDF1F0', borderRadius: '2px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            style={{
              height: '4px',
              background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
              borderRadius: '2px'
            }}
          />
        </div>

        {error && (
          <Alert variant="danger" className="mb-4" style={{ borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h6 className="fw-semibold mb-3" style={{ color: '#2D3F3B' }}>Basic Information</h6>
              <Row>
                <Col md={6}>
                  <FormInput
                    label="Username *"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    icon={<FiUser style={{ color: '#8A9D9A' }} />}
                    placeholder="johndoe"
                    required
                  />
                </Col>
                <Col md={6}>
                  <FormInput
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<FiMail style={{ color: '#8A9D9A' }} />}
                    placeholder="john@example.com"
                    required
                  />
                </Col>
              </Row>
              <FormInput
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<FiPhone style={{ color: '#8A9D9A' }} />}
                placeholder="+1 (555) 123-4567"
                required
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h6 className="fw-semibold mb-3" style={{ color: '#2D3F3B' }}>Account Security</h6>
              <Row>
                <Col md={6}>
                  <FormInput
                    label="Password *"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<FiLock style={{ color: '#8A9D9A' }} />}
                    placeholder="Create strong password"
                    required
                  />
                  {formData.password && (
                    <div className="mt-2">
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
                          {passwordStrength === 'strong' && 'Strong password'}
                          {passwordStrength === 'medium' && 'Medium strength'}
                          {passwordStrength === 'weak' && 'Weak password'}
                        </small>
                      </div>
                    </div>
                  )}
                </Col>
                <Col md={6}>
                  <FormInput
                    label="Confirm Password *"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<FiLock style={{ color: '#8A9D9A' }} />}
                    placeholder="Confirm your password"
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <small style={{ color: '#dc3545' }}>Passwords do not match</small>
                  )}
                </Col>
              </Row>

              <div className="mt-3 p-3" style={{ backgroundColor: '#F4F8F6', borderRadius: '12px' }}>
                <small style={{ color: '#5F6F6C' }}>
                  <FiCheckCircle className="me-2" style={{ color: '#2EC4B6' }} />
                  Password must be at least 8 characters with a mix of letters, numbers, and symbols
                </small>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h6 className="fw-semibold mb-3" style={{ color: '#2D3F3B' }}>Professional Details</h6>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-500">Specialties *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="e.g., Anxiety, Depression, PTSD, Couples Counseling"
                  rows={2}
                  style={{ borderRadius: '12px', borderColor: '#EDF1F0' }}
                  required
                />
                <small style={{ color: '#8A9D9A' }}>Separate multiple specialties with commas</small>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <FormInput
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    icon={<FiAward style={{ color: '#8A9D9A' }} />}
                    placeholder="e.g., 5"
                  />
                </Col>
                <Col md={6}>
                  <FormInput
                    label="Qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    icon={<FiTag style={{ color: '#8A9D9A' }} />}
                    placeholder="LPC, LCSW, LMFT, etc."
                    required
                  />
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="fw-500">Professional Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your therapeutic approach and experience..."
                  rows={3}
                  style={{ borderRadius: '12px', borderColor: '#EDF1F0' }}
                />
              </Form.Group>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: '1px solid #EDF1F0', padding: '20px 24px' }}>
        <div className="d-flex justify-content-between w-100">
          {step > 1 ? (
            <Button
              variant="outline-secondary"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              style={{ 
                backgroundColor: '#2EC4B6', 
                border: 'none',
                padding: '10px 24px',
                borderRadius: '40px'
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{ 
                background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '40px'
              }}
            >
              {loading ? 'Registering...' : 'Register Counselor'}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};