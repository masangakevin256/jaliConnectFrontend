import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Navbar } from '../components/Layout/Navbar';
import { Button } from '../components/UI/Button';
import { FormInput } from '../components/UI/FormInput';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { RegisterAdminPayload } from '../types';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      toast.success('Admin registration successful!');
      navigate('/admin');
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
      <section style={{ background: 'linear-gradient(135deg, #f7f9fc 0%, #f0f8f7 100%)' }} className="min-vh-100 d-flex align-items-center py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={5}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <h2 className="fw-bold mb-2">Admin Registration</h2>
                    <p className="text-muted">System administrator setup</p>
                  </div>

                  {error && <Alert variant="danger" className="rounded-2 border-0">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <FormInput
                      label="Username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose your username"
                      required
                    />

                    <FormInput
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />

                    <FormInput
                      label="Registration Code"
                      name="registration_code"
                      type="password"
                      value={formData.registration_code}
                      onChange={handleChange}
                      placeholder="Enter the admin registration code"
                      required
                    />

                    <FormInput
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />

                    <FormInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 rounded-2 fw-500 py-2"
                      loading={loading}
                    >
                      Register Admin
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Already registered?{' '}
                      <a href="/login/admin" className="text-decoration-none fw-500">
                        Login here
                      </a>
                    </p>
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
