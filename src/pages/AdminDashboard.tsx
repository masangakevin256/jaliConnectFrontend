import React from 'react';
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { OverviewCards } from '../components/Dashboard/OverviewCards';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { FiUsers, FiUserCheck, FiShield, FiActivity, FiSettings, FiServer, FiDatabase } from 'react-icons/fi';

export const AdminDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();

  const renderContent = () => {
    switch (tab) {
      case 'users':
        return (
          <Card className="jali-card animate-up">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="stat-icon bg-primary-light text-primary-teal">
                  <FiUsers />
                </div>
                <h5 className="fw-bold mb-0">User Management</h5>
              </div>
              <Table responsive hover className="jali-table align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-500 text-main">alice_w</td>
                    <td className="text-secondary small">alice@example.com</td>
                    <td className="text-secondary small">Feb 10, 2024</td>
                    <td><span className="status-badge status-active">Active</span></td>
                    <td className="text-end">
                      <Button size="sm" className="btn-jali btn-jali-outline py-1 px-3 fs-tiny">Edit</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      case 'counselors':
        return (
          <Card className="jali-card animate-up">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="stat-icon bg-accent-light text-accent-orange">
                  <FiUserCheck />
                </div>
                <h5 className="fw-bold mb-0">Counselor Directory</h5>
              </div>
              <Table responsive hover className="jali-table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialty</th>
                    <th>Sessions</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-500 text-main">Dr. Robert</td>
                    <td className="text-secondary small">Anxiety</td>
                    <td className="text-secondary small">45</td>
                    <td className="text-end">
                      <Button size="sm" className="btn-jali btn-jali-primary py-1 px-3 fs-tiny">Manage</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      case 'profile':
        return <ProfileSection />;
      default:
        return (
          <div className="space-y-4">
            <OverviewCards />
            <Row className="g-4 mt-2">
              <Col md={6}>
                <Card className="jali-card h-100 animate-up">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <FiSettings className="text-primary-teal" />
                      <h6 className="fw-bold text-main mb-0">System Health</h6>
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                        <div className="d-flex align-items-center gap-2">
                          <FiServer className="text-secondary" />
                          <span className="fw-500">Server Status</span>
                        </div>
                        <Badge bg="success" className="rounded-pill px-3">Online</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                        <div className="d-flex align-items-center gap-2">
                          <FiDatabase className="text-secondary" />
                          <span className="fw-500">Database</span>
                        </div>
                        <Badge bg="success" className="rounded-pill px-3">Connected</Badge>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="jali-card h-100 animate-up" style={{ animationDelay: '100ms' }}>
                  <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center py-5">
                    <div className="stat-icon bg-accent-light text-accent-orange mb-3" style={{ width: '56px', height: '56px' }}>
                      <FiActivity />
                    </div>
                    <h6 className="fw-bold text-main mb-2">Recent Activity</h6>
                    <p className="small mb-0 text-secondary text-center">No security alerts or unusual patterns detected today.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 animate-up">
        <h2 className="fw-bold mb-1">Administration</h2>
        <p className="text-secondary">Monitor system activity and manage staff.</p>
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
