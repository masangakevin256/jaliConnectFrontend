import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { sessionService } from '../../services/sessionService';
import { useAuth } from '../../hooks/useAuth';
import type { Session } from '../../types';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiCopy, 
  FiPlus, 
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiArrowRight,
  FiVideo,
  FiPhone,
  FiMail
} from 'react-icons/fi';

interface SessionCardProps {
  session: Session;
  onAction: (sessionId: string, action: 'join' | 'details' | 'reschedule') => void;
}

const SessionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          label: 'Live Now',
          color: '#2EC4B6',
          bg: '#E8F6F4',
          icon: FiCheckCircle,
          message: 'Your session is active'
        };
      case 'pending':
        return {
          label: 'Waiting',
          color: '#F4A261',
          bg: '#FEF7E9',
          icon: FiLoader,
          message: 'Finding you a counselor'
        };
      case 'completed':
        return {
          label: 'Completed',
          color: '#8A9D9A',
          bg: '#F0F5F4',
          icon: FiCheckCircle,
          message: 'Session completed'
        };
      case 'scheduled':
        return {
          label: 'Upcoming',
          color: '#2EC4B6',
          bg: '#E8F6F4',
          icon: FiCalendar,
          message: 'Session scheduled'
        };
      default:
        return {
          label: status,
          color: '#8A9D9A',
          bg: '#F0F5F4',
          icon: FiAlertCircle,
          message: 'Session closed'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '40px',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: '0.8rem',
        fontWeight: 500,
        border: `1px solid ${config.color}20`
      }}
      title={config.message}
    >
      <Icon size={12} />
      {config.label}
    </div>
  );
};

const SessionCard: React.FC<SessionCardProps> = ({ session, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: string) => {
    const sessionDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (sessionDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (sessionDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return sessionDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: sessionDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeRemaining = (date: string) => {
    const sessionTime = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = sessionTime - now;
    
    if (diff < 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return 'Starting soon';
  };

  const timeRemaining = session.scheduled_time ? getTimeRemaining(session.scheduled_time) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '24px',
        border: `2px solid ${isHovered ? '#2EC4B620' : '#EDF1F0'}`,
        padding: '20px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => setShowActions(!showActions)}
    >
      {/* Decorative gradient line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        background: session.status === 'active' 
          ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
          : session.status === 'pending'
          ? 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)'
          : 'linear-gradient(135deg, #E0E7E5 0%, #EDF1F0 100%)'
      }} />

      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-3">
          {/* Session icon with status indicator */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: session.status === 'active' 
              ? '#E8F6F4'
              : session.status === 'pending'
              ? '#FEF7E9'
              : '#F0F5F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {session.status === 'active' ? (
              <FiVideo size={24} style={{ color: '#2EC4B6' }} />
            ) : session.status === 'pending' ? (
              <FiLoader size={24} style={{ color: '#F4A261' }} />
            ) : (
              <FiMessageSquare size={24} style={{ color: '#8A9D9A' }} />
            )}
            
            {/* Live indicator for active sessions */}
            {session.status === 'active' && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#2EC4B6',
                  border: '2px solid white'
                }}
              />
            )}
          </div>

          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: '#2D3F3B',
                marginBottom: 0 
              }}>
                {session.counselor_name || 'Finding a counselor...'}
              </h4>
              <SessionStatusBadge status={session.status} />
            </div>
            
            <div className="d-flex align-items-center gap-3" style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
              {session.scheduled_time ? (
                <>
                  <span className="d-flex align-items-center gap-1">
                    <FiCalendar size={14} />
                    {formatDate(session.scheduled_time)}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <FiClock size={14} />
                    {formatTime(session.scheduled_time)}
                  </span>
                </>
              ) : (
                <span className="d-flex align-items-center gap-1">
                  <FiClock size={14} />
                  Requested {formatDate(session.created_at)}
                </span>
              )}
            </div>

            {/* Time remaining indicator */}
            {timeRemaining && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  color: '#2EC4B6',
                  background: '#E8F6F4',
                  padding: '4px 12px',
                  borderRadius: '40px',
                  display: 'inline-block'
                }}
              >
                {timeRemaining}
              </motion.div>
            )}
          </div>
        </div>

        {/* Copy button - only on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(session.id);
                toast.success('Session ID copied', {
                  icon: '📋',
                  style: { borderRadius: '20px' }
                });
              }}
              style={{
                background: 'white',
                border: '1px solid #EDF1F0',
                borderRadius: '30px',
                padding: '8px 12px',
                color: '#8A9D9A',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <FiCopy size={14} />
              Copy ID
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons - expand on click */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #EDF1F0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAction(session.id, 'details')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '40px',
                  border: '1px solid #EDF1F0',
                  background: 'white',
                  color: '#5F6F6C',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                View Details <FiArrowRight size={14} />
              </motion.button>

              {session.status === 'active' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction(session.id, 'join')}
                  style={{
                    padding: '8px 24px',
                    borderRadius: '40px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(46, 196, 182, 0.3)'
                  }}
                >
                  Join Session <FiVideo size={14} />
                </motion.button>
              )}

              {session.status === 'pending' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction(session.id, 'reschedule')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '40px',
                    border: 'none',
                    background: '#FEF7E9',
                    color: '#F4A261',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Reschedule
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SessionModule: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getUserSessions(user?.id || '');
      setSessions(data);
    } catch (error: any) {
      toast.error('Unable to load sessions. Please try again.', {
        icon: '🫂',
        style: { borderRadius: '20px' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = async () => {
    try {
      setCreating(true);
      await sessionService.createSession({ user_id: user?.id || '' });
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'white',
            borderRadius: '30px',
            padding: '16px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
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
            <FiCheckCircle style={{ color: '#2EC4B6' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#2D3F3B', marginBottom: 4 }}>
              Session requested!
            </p>
            <p style={{ fontSize: '0.9rem', color: '#8A9D9A', marginBottom: 0 }}>
              We'll match you with a counselor soon
            </p>
          </div>
        </motion.div>
      ));
      await loadSessions();
    } catch (error: any) {
      toast.error('Unable to request session. Please try again later.');
    } finally {
      setCreating(false);
    }
  };

  const handleSessionAction = (sessionId: string, action: 'join' | 'details' | 'reschedule') => {
    switch (action) {
      case 'join':
        toast.success('Joining session...');
        // Navigate to chat/video
        break;
      case 'details':
        // Show detailed modal
        break;
      case 'reschedule':
        // Open reschedule modal
        break;
    }
  };

  const filteredSessions = sessions.filter(session => {
    switch (filter) {
      case 'active': return session.status === 'active';
      case 'upcoming': return session.status === 'scheduled' || session.status === 'pending';
      case 'past': return session.status === 'completed' || session.status === 'closed';
      default: return true;
    }
  });

  const stats = {
    active: sessions.filter(s => s.status === 'active').length,
    upcoming: sessions.filter(s => s.status === 'scheduled' || s.status === 'pending').length,
    completed: sessions.filter(s => s.status === 'completed').length
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0" style={{ 
        borderRadius: '32px',
        background: 'white',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(46, 196, 182, 0.08)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '24px',
          borderBottom: '1px solid #F0F5F4',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FCFEFD 100%)'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #E8F6F4 0%, #D4F0EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiCalendar style={{ color: '#2EC4B6', fontSize: '1.4rem' }} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 600, 
                  color: '#2D3F3B',
                  marginBottom: 2
                }}>
                  Your Sessions
                </h3>
                <p style={{ color: '#8A9D9A', fontSize: '0.9rem', marginBottom: 0 }}>
                  {stats.active} active · {stats.upcoming} upcoming · {stats.completed} completed
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRequestSession}
                disabled={creating}
                style={{
                  background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(46, 196, 182, 0.2)'
                }}
              >
                {creating ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <FiPlus size={18} />
                    <span>Request Session</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Filter chips */}
          <div className="d-flex gap-2 mt-3">
            {[
              { key: 'all', label: 'All Sessions' },
              { key: 'active', label: 'Active' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterOption.key as any)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '40px',
                  border: 'none',
                  background: filter === filterOption.key ? '#2EC4B6' : '#F5F9F8',
                  color: filter === filterOption.key ? 'white' : '#5F6F6C',
                  fontSize: '0.85rem',
                  fontWeight: filter === filterOption.key ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {filterOption.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card.Body style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: '40px',
                  height: '40px',
                  margin: '0 auto 16px',
                  border: '3px solid #E8F6F4',
                  borderTopColor: '#2EC4B6',
                  borderRadius: '50%'
                }}
              />
              <p style={{ color: '#8A9D9A' }}>Loading your sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#F9FCFB',
                borderRadius: '24px'
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                background: '#E8F6F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <FiMessageSquare size={32} style={{ color: '#2EC4B6' }} />
              </div>
              <h4 style={{ color: '#2D3F3B', marginBottom: '8px', fontWeight: 500 }}>
                No {filter !== 'all' ? filter : ''} sessions
              </h4>
              <p style={{ color: '#8A9D9A', marginBottom: '24px', maxWidth: '300px', margin: '0 auto 24px' }}>
                {filter === 'all' 
                  ? 'Start your wellness journey by requesting your first session'
                  : `You don't have any ${filter} sessions at the moment`}
              </p>
              {filter === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRequestSession}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '40px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(46, 196, 182, 0.2)'
                  }}
                >
                  Request Your First Session
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div style={{ 
              maxHeight: '500px', 
              overflowY: 'auto', 
              paddingRight: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <AnimatePresence>
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onAction={handleSessionAction}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card.Body>

        {/* Footer with quick stats */}
        {sessions.length > 0 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #F0F5F4',
            background: '#FAFCFB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#8A9D9A'
          }}>
            <span>
              ✨ You've had {sessions.filter(s => s.status === 'completed').length} sessions so far
            </span>
            <span>
              {sessions.filter(s => s.status === 'active').length > 0 && (
                <span style={{ color: '#2EC4B6' }}>
                  🔴 {sessions.filter(s => s.status === 'active').length} active now
                </span>
              )}
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};