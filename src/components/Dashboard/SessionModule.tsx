import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { sessionService } from '../../services/sessionService';
import { useAuth } from '../../hooks/useAuth';
import type { Session } from '../../types';
import { FiCalendar, FiClock, FiUser, FiCopy, FiPlus, FiMessageSquare } from 'react-icons/fi';

export const SessionModule: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getUserSessions(user?.id || '');
      setSessions(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to load sessions';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = async () => {
    try {
      setCreating(true);
      await sessionService.createSession({ user_id: user?.id || '' });
      toast.success('Session requested successfully!');
      await loadSessions();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to request session';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'completed':
      case 'closed': return 'status-closed';
      default: return 'status-closed';
    }
  };

  return (
    <Card className="jali-card animate-up">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
            <div className="stat-icon bg-primary-light text-primary-teal">
              <FiCalendar />
            </div>
            <div>
              <h3 className="mb-0 fs-5">Your Sessions</h3>
              <p className="text-secondary small mb-0">Manage your counseling appointments</p>
            </div>
          </div>
          <Button
            onClick={handleRequestSession}
            disabled={creating}
            className="btn-jali btn-jali-primary py-2 px-3"
          >
            {creating ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <FiPlus className="me-1" />
                <span className="d-none d-sm-inline">New Session</span>
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading your sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4 border border-dashed">
            <FiMessageSquare className="fs-1 text-muted mb-3 opacity-25" />
            <p className="text-secondary mb-3">No active sessions found.</p>
            <Button
              variant="outline-primary"
              className="btn-jali-outline btn-sm"
              onClick={handleRequestSession}
            >
              Request your first session
            </Button>
          </div>
        ) : (
          <div className="sessions-list d-flex flex-column gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="session-item p-3 rounded-4 border bg-white hover-shadow transition-base">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-main">Session #{session.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`status-badge ${getStatusClass(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3 text-secondary small">
                      <span className="d-flex align-items-center gap-1">
                        <FiClock className="text-primary-teal" />
                        {new Date(session.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {session.counselor_id && (
                        <span className="d-flex align-items-center gap-1">
                          <FiUser className="text-primary-teal" />
                          Counselor ID: {session.counselor_id.slice(0, 6)}...
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="p-1 text-primary-teal border-0 bg-transparent opacity-75 hover-opacity-100"
                    title="Copy Session ID"
                    onClick={() => {
                      navigator.clipboard.writeText(session.id);
                      toast.success('ID copied!');
                    }}
                  >
                    <FiCopy size={18} />
                  </Button>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Button size="sm" className="btn-jali btn-jali-outline py-1 px-3 fs-tiny">
                    View Details
                  </Button>
                  {session.status === 'active' && (
                    <Button size="sm" className="btn-jali btn-jali-primary py-1 px-3 fs-tiny">
                      Join Chat
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>

      <style>{`
        .hover-shadow:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light) !important;
          transform: translateX(5px);
        }
        .fs-tiny { font-size: 0.75rem; }
        .hover-opacity-100:hover { opacity: 1 !important; }
        .sessions-list { max-height: 400px; overflow-y: auto; padding-right: 4px; }
      `}</style>
    </Card>
  );
};
