import React from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { OverviewCards } from '../components/Dashboard/OverviewCards';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { ChatModule } from '../components/Dashboard/ChatModule';
import { FiUsers, FiUser, FiArrowRight, FiActivity } from 'react-icons/fi';

export const CounselorDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();


  const renderContent = () => {
    switch (tab) {
      case 'sessions':
        return (
          <Card className="jali-card animate-up">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="stat-icon bg-primary-light text-primary-teal">
                  <FiActivity />
                </div>
                <h5 className="fw-bold mb-0">Active Sessions</h5>
              </div>
              <Table responsive hover className="jali-table align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-500">
                      <FiUser className="me-2 text-muted" />
                      John Doe
                    </td>
                    <td><span className="status-badge status-active">Active</span></td>
                    <td className="text-secondary small">20 mins ago</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        className="btn-jali btn-jali-outline py-1 px-3 fs-tiny"
                        onClick={() => navigate('/dashboard/counselor/chat')}
                      >
                        Open Chat
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-500">
                      <FiUser className="me-2 text-muted" />
                      Jane Smith
                    </td>
                    <td><span className="status-badge status-pending">Waiting</span></td>
                    <td className="text-secondary small">-</td>
                    <td className="text-end">
                      <Button size="sm" className="btn-jali btn-jali-primary py-1 px-3 fs-tiny">
                        Start Session
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      case 'chat':
        return <ChatModule />;
      case 'profile':
        return <ProfileSection />;
      default:
        return (
          <div className="space-y-4">
            <OverviewCards />
            <Row className="g-4 mt-2">
              <Col lg={7}>
                <Card className="jali-card h-100 animate-up">
                  <Card.Body className="p-4 text-center py-5">
                    <div className="stat-icon bg-accent-light text-accent-orange mx-auto mb-3" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                      <FiUsers />
                    </div>
                    <h5 className="fw-bold mb-2">Recent Inquiries</h5>
                    <p className="text-secondary">No new waiting users at the moment.</p>
                    <Button variant="link" className="text-primary-teal fw-600 text-decoration-none small mt-2">
                      View waiting list <FiArrowRight className="ms-1" />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={5}>
                <div className="animate-up" style={{ animationDelay: '100ms' }}>
                  <ChatModule compact />
                </div>
              </Col>
            </Row>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 animate-up">
        <h2 className="fw-bold mb-1">Counselor Panel</h2>
        <p className="text-secondary">Manage your sessions and support your users.</p>
      </div>
      {renderContent()}

      <style>{`
        .jali-table thead { background: var(--bg-main); }
        .jali-table th { border: none; padding: 1rem; color: var(--text-secondary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .jali-table td { padding: 1.25rem 1rem; border-bottom: 1px solid var(--border-light); }
        .fs-tiny { font-size: 0.75rem; }
        .fw-500 { font-weight: 500; }
      `}</style>
    </DashboardLayout>
  );
};
