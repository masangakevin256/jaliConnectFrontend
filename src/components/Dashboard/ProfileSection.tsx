import React, { useState } from 'react';
import { Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { Button } from '../UI/Button';
import { FormInput } from '../UI/FormInput';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiCamera, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ProfileSection: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Check password strength when new password changes
        if (name === 'newPassword') {
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

    const getPasswordStrengthText = () => {
        switch(passwordStrength) {
            case 'strong': return 'Strong password';
            case 'medium': return 'Medium strength';
            case 'weak': return 'Weak password';
            default: return '';
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Placeholder for API call
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setPasswordLoading(true);
        // Placeholder for API call
        setTimeout(() => {
            toast.success('Password changed successfully!');
            setFormData(prev => ({ 
                ...prev, 
                currentPassword: '', 
                newPassword: '', 
                confirmPassword: '' 
            }));
            setPasswordStrength('');
            setPasswordLoading(false);
        }, 1000);
    };

    // Format join date (mock data for now)
    const joinDate = new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    return (
        <div className="profile-section">
            {/* Profile Header Card */}
            <Card className="border-0 mb-4" style={{ 
                borderRadius: '24px', 
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #28a99d 100%)',
                    padding: '2.5rem 2rem'
                }}>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center gap-4">
                                {/* Profile Avatar with Upload */}
                                <div className="position-relative">
                                    <div style={{ 
                                        width: '120px', 
                                        height: '120px', 
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        border: '4px solid rgba(255,255,255,0.3)',
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
                                    <button
                                        className="btn btn-light rounded-circle position-absolute bottom-0 end-0 p-2 shadow-sm"
                                        style={{ 
                                            width: '40px', 
                                            height: '40px',
                                            border: '2px solid white'
                                        }}
                                    >
                                        <FiCamera size={16} style={{ color: '#2EC4B6' }} />
                                    </button>
                                </div>

                                {/* User Info */}
                                <div>
                                    <h2 className="fw-bold mb-1 text-white" style={{ fontSize: '2rem' }}>
                                        {user?.username}
                                    </h2>
                                    <p className="text-white opacity-75 mb-2 text-capitalize">
                                        {user?.role} • Member since {joinDate}
                                    </p>
                                    <div className="d-flex gap-3">
                                        <span className="badge px-3 py-2" style={{ 
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            borderRadius: '20px'
                                        }}>
                                            <FiCheckCircle className="me-1" size={12} />
                                            Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            {/* Quick Stats */}
                            <div className="d-flex gap-3 justify-content-md-end mt-4 mt-md-0">
                                <div className="text-center text-white">
                                    <div className="fw-bold fs-4">12</div>
                                    <small>Sessions</small>
                                </div>
                                <div className="text-center text-white">
                                    <div className="fw-bold fs-4">8</div>
                                    <small>Check-ins</small>
                                </div>
                                <div className="text-center text-white">
                                    <div className="fw-bold fs-4">4.8</div>
                                    <small>Rating</small>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* Account Information Card */}
            <Card className="border-0 mb-4" style={{ 
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '8px',
                            backgroundColor: '#EAF3F1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiUser style={{ color: '#2EC4B6' }} size={18} />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>Account Information</h5>
                    </div>

                    <Form onSubmit={handleUpdateProfile}>
                        <Row className="g-4">
                            <Col md={6}>
                                <FormInput
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    icon={<FiUser style={{ color: '#5F6F6C' }} />}
                                    disabled
                                    placeholder="Your username"
                                />
                                <Form.Text style={{ color: '#5F6F6C' }}>
                                    Username cannot be changed
                                </Form.Text>
                            </Col>
                            <Col md={6}>
                                <FormInput
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<FiMail style={{ color: '#5F6F6C' }} />}
                                    placeholder="name@example.com"
                                />
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end mt-4">
                            <Button 
                                type="submit" 
                                loading={loading} 
                                style={{ 
                                    backgroundColor: '#2EC4B6', 
                                    borderColor: '#2EC4B6',
                                    padding: '0.6rem 2rem'
                                }}
                            >
                                Update Profile
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Security Settings Card */}
            <Card className="border-0" style={{ 
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '8px',
                            backgroundColor: '#EAF3F1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiShield style={{ color: '#F4A261' }} size={18} />
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>Security Settings</h5>
                    </div>

                    <Form onSubmit={handleChangePassword}>
                        <Row className="g-4">
                            <Col md={4}>
                                <FormInput
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    icon={<FiLock style={{ color: '#5F6F6C' }} />}
                                    required
                                    placeholder="Enter current password"
                                />
                            </Col>
                            <Col md={4}>
                                <FormInput
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    icon={<FiLock style={{ color: '#5F6F6C' }} />}
                                    required
                                    placeholder="Enter new password"
                                />
                                {formData.newPassword && (
                                    <div className="mt-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ 
                                                height: '4px', 
                                                width: '100px', 
                                                backgroundColor: '#EAF3F1',
                                                borderRadius: '2px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{ 
                                                    height: '4px', 
                                                    width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%',
                                                    backgroundColor: getPasswordStrengthColor(),
                                                    borderRadius: '2px',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                            <small style={{ color: getPasswordStrengthColor() }}>
                                                {getPasswordStrengthText()}
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </Col>
                            <Col md={4}>
                                <FormInput
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    icon={<FiLock style={{ color: '#5F6F6C' }} />}
                                    required
                                    placeholder="Confirm new password"
                                />
                                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                    <small style={{ color: '#dc3545' }}>
                                        Passwords do not match
                                    </small>
                                )}
                            </Col>
                        </Row>

                        {/* Password Requirements */}
                        <Alert variant="light" className="mt-4" style={{ 
                            backgroundColor: '#F4F8F6',
                            border: '1px solid #EAF3F1',
                            borderRadius: '12px'
                        }}>
                            <small style={{ color: '#5F6F6C' }}>
                                <FiClock className="me-2" />
                                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols
                            </small>
                        </Alert>

                        <div className="d-flex justify-content-end mt-4">
                            <Button 
                                type="submit" 
                                variant="secondary"
                                loading={passwordLoading}
                                style={{ 
                                    backgroundColor: '#F4A261', 
                                    borderColor: '#F4A261',
                                    color: '#1F2D2B',
                                    padding: '0.6rem 2rem'
                                }}
                            >
                                Change Password
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <style>{`
                .profile-section .form-control:focus {
                    border-color: #2EC4B6;
                    box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.25);
                }
            `}</style>
        </div>
    );
};