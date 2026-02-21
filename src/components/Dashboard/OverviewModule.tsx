import React from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { FiHeart, FiTrendingUp, FiClock } from 'react-icons/fi';

export const OverviewModule: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-4">Welcome, {user?.username}!</Card.Title>
        
        <Alert variant="info" className="rounded-2 border-0 mb-4">
          <strong>Remember:</strong> Your mental health matters. Take care of yourself today.
        </Alert>

        <Row>
          <Col md={6} className="mb-3">
            <div className="p-3 bg-light rounded-2 text-center">
              <FiHeart className="text-danger mb-2" size={32} />
              <h6 className="fw-bold">Check-ins</h6>
              <p className="text-muted mb-0">Track your mood daily</p>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div className="p-3 bg-light rounded-2 text-center">
              <FiClock className="text-primary mb-2" size={32} />
              <h6 className="fw-bold">Sessions</h6>
              <p className="text-muted mb-0">Connect with counselors</p>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div className="p-3 bg-light rounded-2 text-center">
              <FiTrendingUp className="text-success mb-2" size={32} />
              <h6 className="fw-bold">Progress</h6>
              <p className="text-muted mb-0">View your wellness journey</p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
