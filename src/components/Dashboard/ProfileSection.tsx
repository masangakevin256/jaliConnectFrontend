import React, { useState } from 'react';
import { Card, Form, Row, Col, Alert, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Button } from '../UI/Button';
import { FormInput } from '../UI/FormInput';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import {
  FiUser,
  FiMail,
  FiLock,
  FiCamera,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiSmartphone,
  FiKey,
  FiBell,
  FiGlobe,
  FiCalendar,
  FiStar,
  FiAward,
  FiTrendingUp
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProfileSection: React.FC = () => {
  const { user, auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      emailAlerts: true,
      sessionReminders: true,
      wellnessTips: false,
      marketingEmails: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Check password strength when new password changes
      if (name === 'newPassword') {
        checkPasswordStrength(value);
      }
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
    switch (passwordStrength) {
      case 'strong': return '#2EC4B6';
      case 'medium': return '#F4A261';
      case 'weak': return '#dc3545';
      default: return '#5F6F6C';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'strong': return 'Strong password';
      case 'medium': return 'Medium strength';
      case 'weak': return 'Weak password';
      default: return '';
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id || user?.user_id;
    if (!userId) {
      toast.error('User ID not found');
      return;
    }
    setLoading(true);

    try {
      await userService.updateUser(userId, {
        username: formData.username,
        email: formData.email,
        phone: formData.phone
      });

      if (auth && user) {
        setAuth({
          ...auth,
          user: {
            ...user,
            username: formData.username,
            email: formData.email,
            phone: formData.phone
          }
        });
      }

      toast.success('Profile updated successfully!', {
        icon: '✨',
        style: { borderRadius: '20px' }
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id || user?.user_id;
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        icon: '❌',
        style: { borderRadius: '20px' }
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long', {
        icon: '🔒',
        style: { borderRadius: '20px' }
      });
      return;
    }

    setPasswordLoading(true);

    try {
      await userService.updateUser(userId, {
        password: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password changed successfully!', {
        icon: '✅',
        style: { borderRadius: '20px' }
      });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setPasswordStrength('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Sending verification email...',
        success: 'Verification email sent! Check your inbox',
        error: 'Failed to send verification email',
      },
      {
        style: { borderRadius: '20px' }
      }
    );
  };

  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const lastActive = 'Today at 10:30 AM';

  // Privacy tooltip component
  const PrivacyTooltip = ({ children, message }: { children: React.ReactNode, message: string }) => (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip style={{ backgroundColor: '#2D3F3B', color: 'white', borderRadius: '12px' }}>{message}</Tooltip>}
    >
      <span style={{ cursor: 'help' }}>{children}</span>
    </OverlayTrigger>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="profile-section"
    >
      {/* Profile Header Card with Cover Photo */}
      <Card className="border-0 mb-4" style={{
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
        border: '1px solid rgba(46, 196, 182, 0.08)'
      }}>
        {/* Cover Photo */}
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
          position: 'relative'
        }} />

        {/* Profile Info Overlay */}
        <div style={{
          padding: '0 32px 32px 32px',
          marginTop: '-60px'
        }}>
          <Row className="align-items-end">
            <Col md={8}>
              <div className="d-flex align-items-end gap-4">
                {/* Avatar with upload */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="position-relative"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    background: 'white',
                    padding: '4px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {user?.username ? (
                      <span style={{
                        fontSize: '3rem',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FiUser size={50} color="white" />
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-light rounded-circle position-absolute bottom-0 end-0 p-2 shadow-lg"
                    style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid white'
                    }}
                    onClick={() => toast.success('Avatar upload feature coming soon!')}
                  >
                    <FiCamera size={16} style={{ color: '#2EC4B6' }} />
                  </motion.button>
                </motion.div>

                {/* User Info */}
                <div className="mb-2">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h2 className="fw-bold mb-0" style={{ color: '#2D3F3B', fontSize: '2rem' }}>
                      {user?.username}
                    </h2>
                    <Badge style={{
                      backgroundColor: '#E8F6F4',
                      color: '#2EC4B6',
                      padding: '8px 12px',
                      borderRadius: '30px',
                      fontSize: '0.8rem'
                    }}>
                      <FiCheckCircle className="me-1" size={12} />
                      Active
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span style={{ color: '#8A9D9A', fontSize: '0.95rem' }}>
                      <FiUser className="me-1" size={14} />
                      <span className="text-capitalize">{user?.role || 'User'}</span>
                    </span>
                    <span style={{ color: '#8A9D9A' }}>•</span>
                    <span style={{ color: '#8A9D9A', fontSize: '0.95rem' }}>
                      <FiCalendar className="me-1" size={14} />
                      Member since {joinDate}
                    </span>
                    <span style={{ color: '#8A9D9A' }}>•</span>
                    <span style={{ color: '#8A9D9A', fontSize: '0.95rem' }}>
                      <FiClock className="me-1" size={14} />
                      Last active: {lastActive}
                    </span>
                  </div>

                  {/* Trust badges */}
                  <div className="d-flex gap-2">
                    <Badge style={{
                      backgroundColor: '#F4F8F6',
                      color: '#5F6F6C',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}>
                      <FiShield className="me-1" size={10} />
                      Verified Account
                    </Badge>
                    <Badge style={{
                      backgroundColor: '#F4F8F6',
                      color: '#5F6F6C',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem'
                    }}>
                      <FiStar className="me-1" size={10} />
                      4.8 Rating
                    </Badge>
                  </div>
                </div>
              </div>
            </Col>

            {/* Quick Stats */}
            <Col md={4}>
              <div className="d-flex justify-content-md-end gap-4 mt-4 mt-md-0">
                {[
                  { icon: FiAward, value: '12', label: 'Sessions' },
                  { icon: FiTrendingUp, value: '8', label: 'Check-ins' },
                  { icon: FiStar, value: '4.8', label: 'Rating' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="text-center"
                  >
                    <div className="fw-bold fs-4" style={{ color: '#2EC4B6' }}>{stat.value}</div>
                    <small style={{ color: '#8A9D9A' }}>{stat.label}</small>
                  </motion.div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Profile Tabs */}
      <div className="mb-4" style={{ borderBottom: '1px solid #EDF1F0' }}>
        <div className="d-flex gap-2">
          {[
            { id: 'profile', label: 'Profile Information', icon: FiUser },
            { id: 'security', label: 'Security & Privacy', icon: FiShield },
            { id: 'preferences', label: 'Preferences', icon: FiBell }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #2EC4B6' : '3px solid transparent',
                color: activeTab === tab.id ? '#2EC4B6' : '#8A9D9A',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Privacy Notice Banner */}
            <Alert style={{
              backgroundColor: '#E8F6F4',
              border: '1px solid #2EC4B620',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: '#2EC4B6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiEyeOff size={16} color="white" />
                </div>
                <div>
                  <strong style={{ color: '#2D3F3B' }}>Your information is private</strong>
                  <p style={{ color: '#5F6F6C', fontSize: '0.9rem', marginBottom: 0 }}>
                    Only you can see your email and phone number. We never share your personal information.
                  </p>
                </div>
              </div>
            </Alert>

            <Row className="g-4">
              <Col lg={8}>
                <Card className="border-0" style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #EDF1F0'
                }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-semibold mb-4" style={{ color: '#2D3F3B' }}>
                      Personal Information
                    </h5>

                    <Form onSubmit={handleUpdateProfile}>
                      <Row className="g-4">
                        <Col md={6}>
                          <FormInput
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            icon={<FiUser style={{ color: '#8A9D9A' }} />}
                            disabled
                            helperText="Username cannot be changed"
                          />
                        </Col>

                        <Col md={6}>
                          <div className="position-relative">
                            <FormInput
                              label={
                                <span className="d-flex align-items-center gap-2">
                                  Email Address
                                  <PrivacyTooltip message="Only visible to you">
                                    <FiInfo size={14} style={{ color: '#8A9D9A', cursor: 'help' }} />
                                  </PrivacyTooltip>
                                </span>
                              }
                              name="email"
                              type={showEmail ? 'text' : 'email'}
                              value={formData.email}
                              onChange={handleChange}
                              icon={<FiMail style={{ color: '#8A9D9A' }} />}
                              placeholder="your.email@example.com"
                            />
                            <button
                              type="button"
                              onClick={() => setShowEmail(!showEmail)}
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '42px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8A9D9A'
                              }}
                            >
                              {showEmail ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                          {!formData.email && (
                            <div className="mt-2 d-flex align-items-center gap-2">
                              <FiAlertCircle size={14} style={{ color: '#F4A261' }} />
                              <small style={{ color: '#F4A261' }}>
                                No email set. Add an email to recover your account if you forget your password.
                              </small>
                            </div>
                          )}
                          {formData.email && !user?.emailVerified && (
                            <div className="mt-2">
                              <Button
                                size="sm"
                                onClick={handleVerifyEmail}
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#2EC4B6',
                                  border: '1px solid #2EC4B6',
                                  padding: '4px 12px',
                                  fontSize: '0.8rem'
                                }}
                              >
                                Verify Email
                              </Button>
                            </div>
                          )}
                        </Col>

                        <Col md={6}>
                          <div className="position-relative">
                            <FormInput
                              label={
                                <span className="d-flex align-items-center gap-2">
                                  Phone Number
                                  <PrivacyTooltip message="Only visible to you. Used for appointment reminders.">
                                    <FiInfo size={14} style={{ color: '#8A9D9A', cursor: 'help' }} />
                                  </PrivacyTooltip>
                                </span>
                              }
                              name="phone"
                              type={showPhone ? 'text' : 'tel'}
                              value={formData.phone}
                              onChange={handleChange}
                              icon={<FiSmartphone style={{ color: '#8A9D9A' }} />}
                              placeholder="+1 (555) 123-4567"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPhone(!showPhone)}
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '42px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8A9D9A'
                              }}
                            >
                              {showPhone ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                          <small style={{ color: '#8A9D9A' }}>
                            Used for session reminders (optional)
                          </small>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4">
                        <Button
                          type="submit"
                          loading={loading}
                          style={{
                            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                            border: 'none',
                            borderRadius: '40px',
                            padding: '10px 32px',
                            fontWeight: 500
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Account Summary Card */}
              <Col lg={4}>
                <Card className="border-0 h-100" style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #EDF1F0',
                  background: 'linear-gradient(135deg, #F9FCFB 0%, #FFFFFF 100%)'
                }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-semibold mb-3" style={{ color: '#2D3F3B' }}>
                      Account Summary
                    </h6>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span style={{ color: '#8A9D9A' }}>Member since</span>
                        <span style={{ color: '#2D3F3B', fontWeight: 500 }}>{joinDate}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span style={{ color: '#8A9D9A' }}>Account status</span>
                        <span style={{ color: '#2EC4B6', fontWeight: 500 }}>Active</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span style={{ color: '#8A9D9A' }}>Email verified</span>
                        <span>
                          {user?.emailVerified ? (
                            <FiCheckCircle style={{ color: '#2EC4B6' }} />
                          ) : (
                            <FiAlertCircle style={{ color: '#F4A261' }} />
                          )}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center py-2">
                        <span style={{ color: '#8A9D9A' }}>2FA enabled</span>
                        <span style={{ color: '#F4A261' }}>Not set up</span>
                      </div>
                    </div>

                    <hr style={{ borderColor: '#EDF1F0' }} />

                    {/* Recovery Info */}
                    <div>
                      <h6 className="fw-semibold mb-2" style={{ color: '#2D3F3B', fontSize: '0.9rem' }}>
                        Recovery Options
                      </h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <FiMail size={14} style={{ color: formData.email ? '#2EC4B6' : '#F4A261' }} />
                        <span style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
                          {formData.email ? 'Email set' : 'No email - add for password recovery'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <FiSmartphone size={14} style={{ color: formData.phone ? '#2EC4B6' : '#8A9D9A' }} />
                        <span style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
                          {formData.phone ? 'Phone set' : 'Phone optional'}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Security & Privacy Tab */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Row className="g-4">
              <Col lg={7}>
                <Card className="border-0" style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #EDF1F0'
                }}>
                  <Card.Body className="p-4">
                    <h5 className="fw-semibold mb-4" style={{ color: '#2D3F3B' }}>
                      Change Password
                    </h5>

                    <Form onSubmit={handleChangePassword}>
                      <Row className="g-4">
                        <Col md={12}>
                          <div className="position-relative">
                            <FormInput
                              label="Current Password"
                              name="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={formData.currentPassword}
                              onChange={handleChange}
                              icon={<FiLock style={{ color: '#8A9D9A' }} />}
                              required
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '42px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8A9D9A'
                              }}
                            >
                              {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>
                        </Col>

                        <Col md={6}>
                          <div className="position-relative">
                            <FormInput
                              label="New Password"
                              name="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={formData.newPassword}
                              onChange={handleChange}
                              icon={<FiKey style={{ color: '#8A9D9A' }} />}
                              required
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '42px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8A9D9A'
                              }}
                            >
                              {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>

                          {formData.newPassword && (
                            <div className="mt-2">
                              <div className="d-flex align-items-center gap-2 mb-1">
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
                            </div>
                          )}
                        </Col>

                        <Col md={6}>
                          <div className="position-relative">
                            <FormInput
                              label="Confirm New Password"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              icon={<FiKey style={{ color: '#8A9D9A' }} />}
                              required
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{
                                position: 'absolute',
                                right: '40px',
                                top: '42px',
                                background: 'transparent',
                                border: 'none',
                                color: '#8A9D9A'
                              }}
                            >
                              {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                          </div>

                          {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <motion.small
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              style={{ color: '#dc3545', display: 'block', marginTop: '4px' }}
                            >
                              Passwords do not match
                            </motion.small>
                          )}
                        </Col>
                      </Row>

                      {/* Password Requirements */}
                      <Alert style={{
                        backgroundColor: '#F4F8F6',
                        border: '1px solid #EDF1F0',
                        borderRadius: '16px',
                        marginTop: '24px'
                      }}>
                        <div className="d-flex align-items-start gap-2">
                          <FiInfo size={16} style={{ color: '#8A9D9A', marginTop: '2px' }} />
                          <div>
                            <small style={{ color: '#5F6F6C', display: 'block', marginBottom: '4px' }}>
                              <strong>Password requirements:</strong>
                            </small>
                            <div className="d-flex flex-wrap gap-3">
                              {[
                                { text: 'At least 8 characters', met: formData.newPassword.length >= 8 },
                                { text: 'Uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
                                { text: 'Lowercase letter', met: /[a-z]/.test(formData.newPassword) },
                                { text: 'Number', met: /\d/.test(formData.newPassword) },
                                { text: 'Special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) }
                              ].map((req, idx) => (
                                <span key={idx} style={{ fontSize: '0.8rem', color: req.met ? '#2EC4B6' : '#8A9D9A' }}>
                                  {req.met ? '✓' : '○'} {req.text}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Alert>

                      <div className="d-flex justify-content-end mt-4">
                        <Button
                          type="submit"
                          loading={passwordLoading}
                          disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                          style={{
                            background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)',
                            border: 'none',
                            borderRadius: '40px',
                            padding: '10px 32px',
                            fontWeight: 500,
                            color: '#2D3F3B'
                          }}
                        >
                          Update Password
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Security Tips Card */}
              <Col lg={5}>
                <Card className="border-0 h-100" style={{
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  border: '1px solid #EDF1F0',
                  background: 'linear-gradient(135deg, #F9FCFB 0%, #FFFFFF 100%)'
                }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-semibold mb-3" style={{ color: '#2D3F3B' }}>
                      Security Tips
                    </h6>

                    <div className="mb-4">
                      <div className="d-flex gap-3 mb-3">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#E8F6F4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FiShield size={16} style={{ color: '#2EC4B6' }} />
                        </div>
                        <div>
                          <h6 style={{ fontSize: '0.95rem', color: '#2D3F3B', marginBottom: '4px' }}>
                            Use a strong password
                          </h6>
                          <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
                            Mix letters, numbers, and symbols. Avoid common words.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mb-3">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#FEF7E9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FiMail size={16} style={{ color: '#F4A261' }} />
                        </div>
                        <div>
                          <h6 style={{ fontSize: '0.95rem', color: '#2D3F3B', marginBottom: '4px' }}>
                            Keep your email updated
                          </h6>
                          <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
                            Your email is the only way to recover your account if you forget your password.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex gap-3">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: '#F4F8F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FiClock size={16} style={{ color: '#5F6F6C' }} />
                        </div>
                        <div>
                          <h6 style={{ fontSize: '0.95rem', color: '#2D3F3B', marginBottom: '4px' }}>
                            Regular password changes
                          </h6>
                          <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
                            Update your password every few months for better security.
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr style={{ borderColor: '#EDF1F0' }} />

                    <div>
                      <h6 className="fw-semibold mb-2" style={{ color: '#2D3F3B', fontSize: '0.9rem' }}>
                        Two-Factor Authentication
                      </h6>
                      <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: '12px' }}>
                        Add an extra layer of security to your account.
                      </p>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: 'transparent',
                          color: '#2EC4B6',
                          border: '1px solid #2EC4B6',
                          borderRadius: '30px',
                          padding: '6px 16px'
                        }}
                        onClick={() => toast.success('2FA setup coming soon!')}
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0" style={{
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              border: '1px solid #EDF1F0'
            }}>
              <Card.Body className="p-4">
                <h5 className="fw-semibold mb-4" style={{ color: '#2D3F3B' }}>
                  Notification Preferences
                </h5>

                <Row className="g-4">
                  <Col md={6}>
                    <div className="mb-4">
                      <Form.Check type="switch">
                        <Form.Check.Input
                          type="checkbox"
                          name="emailAlerts"
                          checked={formData.notifications.emailAlerts}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <Form.Check.Label style={{ color: '#2D3F3B', fontWeight: 500 }}>
                          Email Alerts
                          <p style={{ color: '#8A9D9A', fontSize: '0.85rem', marginTop: '4px' }}>
                            Receive important updates about your account
                          </p>
                        </Form.Check.Label>
                      </Form.Check>
                    </div>

                    <div className="mb-4">
                      <Form.Check type="switch">
                        <Form.Check.Input
                          type="checkbox"
                          name="sessionReminders"
                          checked={formData.notifications.sessionReminders}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <Form.Check.Label style={{ color: '#2D3F3B', fontWeight: 500 }}>
                          Session Reminders
                          <p style={{ color: '#8A9D9A', fontSize: '0.85rem', marginTop: '4px' }}>
                            Get notified before your scheduled sessions
                          </p>
                        </Form.Check.Label>
                      </Form.Check>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-4">
                      <Form.Check type="switch">
                        <Form.Check.Input
                          type="checkbox"
                          name="wellnessTips"
                          checked={formData.notifications.wellnessTips}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <Form.Check.Label style={{ color: '#2D3F3B', fontWeight: 500 }}>
                          Wellness Tips
                          <p style={{ color: '#8A9D9A', fontSize: '0.85rem', marginTop: '4px' }}>
                            Daily wellness tips and inspiration
                          </p>
                        </Form.Check.Label>
                      </Form.Check>
                    </div>

                    <div className="mb-4">
                      <Form.Check type="switch">
                        <Form.Check.Input
                          type="checkbox"
                          name="marketingEmails"
                          checked={formData.notifications.marketingEmails}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <Form.Check.Label style={{ color: '#2D3F3B', fontWeight: 500 }}>
                          Marketing Emails
                          <p style={{ color: '#8A9D9A', fontSize: '0.85rem', marginTop: '4px' }}>
                            Updates about new features and services
                          </p>
                        </Form.Check.Label>
                      </Form.Check>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    onClick={() => {
                      toast.success('Preferences saved!');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                      border: 'none',
                      borderRadius: '40px',
                      padding: '10px 32px',
                      fontWeight: 500
                    }}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1) !important;
          outline: none;
        }
        
        .form-check-input:checked {
          background-color: #2EC4B6;
          border-color: #2EC4B6;
        }
        
        .form-check-input:focus {
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1);
        }
      `}</style>
    </motion.div>
  );
};