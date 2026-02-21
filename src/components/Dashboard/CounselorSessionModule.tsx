import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Spinner, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { sessionService } from '../../services/sessionService';
import type { Session } from '../../types';

export const CounselorSessionModule: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // In a real app, get counselor ID from auth context
      const data = await sessionService.getCounselorSessions('');
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async (sessionId: string) => {
    try {
      const updated = await sessionService.autoAssignSession(sessionId);
      setSessions(sessions.map((s) => (s.id === sessionId ? updated : s)));
      toast.success('Session assigned!');
    } catch (error) {
      toast.error('Failed to assign session');
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-4">Active Sessions</Card.Title>

        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : sessions.length === 0 ? (
          <p className="text-muted">No sessions assigned yet</p>
        ) : (
          <ListGroup variant="flush">
            {sessions.map((session) => (
              <ListGroup.Item key={session.id} className="border-0 py-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-bold mb-1">Session {session.id.slice(0, 8)}</h6>
                    <small className="text-muted">
                      User: {session.user_id}
                    </small>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <Badge bg={session.status === 'active' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                    {session.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleAutoAssign(session.id)}
                      >
                        Assign
                      </Button>
                    )}
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};
