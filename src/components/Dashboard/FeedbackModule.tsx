import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { feedbackService } from '../../services/feedbackService';
import { sessionService } from '../../services/sessionService';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiStar, 
  FiMessageCircle, 
  FiHash, 
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiThumbsUp,
  FiHeart,
  FiSmile,
  FiMeh,
  FiFrown,
  FiInfo,
  FiClock,
  FiUser
} from 'react-icons/fi';

interface Session {
  id: string;
  counselor_name?: string;
  counselor_id?: string;
  created_at: string;
  status: string;
}

interface FeedbackModuleProps {
  sessionId?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

const RatingEmoji: React.FC<{ rating: number }> = ({ rating }) => {
  switch(rating) {
    case 1: return <FiFrown size={24} />;
    case 2: return <FiMeh size={24} />;
    case 3: return <FiSmile size={24} />;
    case 4: return <FiThumbsUp size={24} />;
    case 5: return <FiHeart size={24} />;
    default: return <FiStar size={24} />;
  }
};

export const FeedbackModule: React.FC<FeedbackModuleProps> = ({ 
  sessionId: propSessionId, 
  onSuccess,
  compact = false 
}) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string>(propSessionId || '');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionSelector, setShowSessionSelector] = useState(!propSessionId);

  useEffect(() => {
    if (!propSessionId) {
      loadRecentSessions();
    }
  }, []);

  const loadRecentSessions = async () => {
    try {
      const sessions = await sessionService.getUserSessions(user?.id || '');
      // Filter to completed sessions from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const completedSessions = sessions.filter(s => 
        s.status === 'completed' && new Date(s.created_at) > thirtyDaysAgo
      );
      setRecentSessions(completedSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const ratingOptions = [
    { value: 1, label: 'Poor', color: '#dc3545', bg: '#FFE5E5', description: 'Session did not meet expectations' },
    { value: 2, label: 'Fair', color: '#F4A261', bg: '#FEF7E9', description: 'Some aspects were helpful' },
    { value: 3, label: 'Good', color: '#5F6F6C', bg: '#F4F8F6', description: 'Session was generally helpful' },
    { value: 4, label: 'Very Good', color: '#2EC4B6', bg: '#E8F6F4', description: 'Session was very beneficial' },
    { value: 5, label: 'Excellent', color: '#2EC4B6', bg: '#E8F6F4', description: 'Exceeded expectations' },
  ];

  const handleRatingSelect = (value: number) => {
    setRating(value);
  };

  const handleSessionSelect = (session: Session) => {
    setSessionId(session.id);
    setSelectedSession(session);
    setShowSessionSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) {
      toast.error('Please select a session', {
        icon: '❓',
        style: { borderRadius: '20px' }
      });
      return;
    }

    if (rating === 0) {
      toast.error('Please rate your experience', {
        icon: '⭐',
        style: { borderRadius: '20px' }
      });
      return;
    }

    setLoading(true);

    try {
      await feedbackService.createFeedback({
        session_id: sessionId,
        rating,
        comment: comment.trim() || undefined,
      });

      // Success animation
      setSubmitted(true);
      
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
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
            <FiCheckCircle style={{ color: '#2EC4B6' }} size={20} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#2D3F3B', marginBottom: 2 }}>
              Thank you for your feedback!
            </p>
            <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
              Your input helps us improve
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });

      if (onSuccess) {
        onSuccess();
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setSessionId('');
        setRating(0);
        setComment('');
        setSubmitted(false);
        setSelectedSession(null);
        setShowSessionSelector(!propSessionId);
      }, 2000);

    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to submit feedback';
      toast.error(message, {
        icon: '❌',
        style: { borderRadius: '20px' }
      });
    } finally {
      setLoading(false);
    }
  };

  const currentRating = ratingOptions.find(r => r.value === (hoverRating || rating)) || ratingOptions[2];

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          padding: compact ? '2rem' : '3rem',
          background: 'linear-gradient(135deg, #F9FCFB 0%, #FFFFFF 100%)',
          borderRadius: '24px',
          border: '1px solid #E8F6F4'
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.5 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            background: '#E8F6F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}
        >
          <FiCheckCircle size={40} style={{ color: '#2EC4B6' }} />
        </motion.div>
        <h5 style={{ color: '#2D3F3B', marginBottom: '8px' }}>Feedback Submitted!</h5>
        <p style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
          Thank you for helping us improve
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0" style={{ 
        borderRadius: compact ? '20px' : '32px',
        background: 'white',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(46, 196, 182, 0.08)'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #F9FCFB 0%, #FFFFFF 100%)',
          padding: compact ? '16px' : '20px 24px',
          borderBottom: '1px solid #EAF3F1'
        }}>
          <div className="d-flex align-items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              style={{
                width: compact ? '40px' : '48px',
                height: compact ? '40px' : '48px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(244, 162, 97, 0.2)'
              }}
            >
              <FiMessageCircle size={compact ? 18 : 20} color="white" />
            </motion.div>
            
            <div>
              <h5 style={{ 
                fontSize: compact ? '0.95rem' : '1.1rem', 
                fontWeight: 600, 
                color: '#2D3F3B',
                marginBottom: 2
              }}>
                Share Your Feedback
              </h5>
              <p style={{ color: '#8A9D9A', fontSize: '0.85rem', marginBottom: 0 }}>
                Your voice helps us create better experiences
              </p>
            </div>
          </div>
        </div>

        <Card.Body style={{ padding: compact ? '20px' : '24px' }}>
          <Form onSubmit={handleSubmit}>
            {/* Session Selection */}
            {showSessionSelector ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Form.Label className="d-flex align-items-center gap-2 mb-3" style={{ color: '#2D3F3B' }}>
                  <FiHash style={{ color: '#2EC4B6' }} />
                  <span style={{ fontWeight: 500 }}>Select a Session</span>
                </Form.Label>

                {recentSessions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentSessions.map((session) => (
                      <motion.button
                        key={session.id}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleSessionSelect(session)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          backgroundColor: '#F9FCFB',
                          border: '1px solid #EDF1F0',
                          borderRadius: '16px',
                          width: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: '#E8F6F4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FiUser size={16} style={{ color: '#2EC4B6' }} />
                          </div>
                          <div className="text-start">
                            <div style={{ fontWeight: 500, color: '#2D3F3B' }}>
                              {session.counselor_name || 'Session with Counselor'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#8A9D9A' }}>
                              <FiClock className="me-1" size={10} />
                              {new Date(session.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge style={{ 
                          backgroundColor: '#E8F6F4',
                          color: '#2EC4B6',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem'
                        }}>
                          Rate
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <Alert style={{ 
                    backgroundColor: '#F9FCFB',
                    border: '1px solid #EDF1F0',
                    borderRadius: '16px'
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <FiInfo style={{ color: '#F4A261' }} />
                      <small style={{ color: '#5F6F6C' }}>
                        No completed sessions found in the last 30 days.
                      </small>
                    </div>
                  </Alert>
                )}

                <div className="text-center mt-3">
                  <small style={{ color: '#8A9D9A' }}>
                    or{' '}
                    <button
                      type="button"
                      onClick={() => setShowSessionSelector(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2EC4B6',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      enter session ID manually
                    </button>
                  </small>
                </div>
              </motion.div>
            ) : (
              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2 mb-2" style={{ color: '#2D3F3B' }}>
                  <FiHash style={{ color: '#2EC4B6' }} />
                  <span style={{ fontWeight: 500 }}>Session ID</span>
                  {!propSessionId && (
                    <button
                      type="button"
                      onClick={() => setShowSessionSelector(true)}
                      style={{
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        color: '#2EC4B6',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Choose from list
                    </button>
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter session ID (e.g., sess_123456)"
                  style={{
                    borderRadius: '16px',
                    border: '2px solid #EDF1F0',
                    padding: '12px 16px',
                    fontSize: '0.95rem',
                    backgroundColor: '#F9FCFB'
                  }}
                  className="shadow-sm"
                  disabled={!!selectedSession}
                />
                {selectedSession && (
                  <div className="mt-2 d-flex align-items-center gap-2">
                    <Badge style={{ 
                      backgroundColor: '#E8F6F4',
                      color: '#2EC4B6',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}>
                      {selectedSession.counselor_name || 'Session selected'}
                    </Badge>
                  </div>
                )}
              </Form.Group>
            )}

            {/* Rating Selection - Enhanced */}
            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center gap-2 mb-3" style={{ color: '#2D3F3B' }}>
                <FiStar style={{ color: '#F4A261' }} />
                <span style={{ fontWeight: 500 }}>How was your experience?</span>
              </Form.Label>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {ratingOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoverRating(option.value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRatingSelect(option.value)}
                    style={{
                      flex: 1,
                      minWidth: '60px',
                      padding: '12px 8px',
                      background: rating >= option.value ? option.bg : '#F9FCFB',
                      border: `2px solid ${rating >= option.value ? option.color : '#EDF1F0'}`,
                      borderRadius: '16px',
                      color: rating >= option.value ? option.color : '#8A9D9A',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RatingEmoji rating={option.value} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>{option.value}</span>
                  </motion.button>
                ))}
              </div>

              {/* Rating description */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoverRating || rating}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: currentRating.bg,
                    borderRadius: '16px',
                    border: `1px solid ${currentRating.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ 
                      fontWeight: 600, 
                      color: currentRating.color,
                      marginRight: '8px'
                    }}>
                      {ratingOptions.find(r => r.value === (hoverRating || rating))?.label}
                    </span>
                    <span style={{ color: '#5F6F6C', fontSize: '0.9rem' }}>
                      {ratingOptions.find(r => r.value === (hoverRating || rating))?.description}
                    </span>
                  </div>
                  {hoverRating > 0 && (
                    <small style={{ color: '#8A9D9A' }}>Click to select</small>
                  )}
                </motion.div>
              </AnimatePresence>
            </Form.Group>

            {/* Comment Section */}
            <Form.Group className="mb-4">
              <Form.Label className="d-flex align-items-center gap-2 mb-2" style={{ color: '#2D3F3B' }}>
                <FiMessageCircle style={{ color: '#2EC4B6' }} />
                <span style={{ fontWeight: 500 }}>Your Comments (Optional)</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={compact ? 3 : 4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts... What went well? What could be improved?"
                style={{
                  borderRadius: '16px',
                  border: '2px solid #EDF1F0',
                  padding: '12px 16px',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  backgroundColor: '#F9FCFB'
                }}
                className="shadow-sm"
              />
              <div className="d-flex justify-content-between mt-1">
                <small style={{ color: '#8A9D9A' }}>
                  Your feedback is anonymous and helps us improve
                </small>
                <small style={{ color: comment.length > 500 ? '#F4A261' : '#8A9D9A' }}>
                  {comment.length}/1000
                </small>
              </div>
            </Form.Group>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading || !sessionId || rating === 0}
                style={{
                  width: '100%',
                  background: !sessionId || rating === 0 || loading
                    ? '#EAF3F1'
                    : 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                  border: 'none',
                  borderRadius: '40px',
                  padding: compact ? '12px' : '14px',
                  fontSize: compact ? '0.95rem' : '1rem',
                  fontWeight: 500,
                  color: !sessionId || rating === 0 || loading ? '#8A9D9A' : 'white',
                  cursor: !sessionId || rating === 0 || loading ? 'not-allowed' : 'pointer',
                  boxShadow: !sessionId || rating === 0 || loading 
                    ? 'none' 
                    : '0 8px 16px rgba(46, 196, 182, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Submit Feedback
                  </>
                )}
              </Button>
            </motion.div>

            {/* Trust message */}
            <div className="text-center mt-3">
              <small style={{ color: '#B0C0BD', fontSize: '0.7rem' }}>
                🔒 Your feedback is confidential and helps improve our services
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1) !important;
          outline: none;
          background-color: white !important;
        }
        
        textarea.form-control {
          min-height: 100px;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F4F8F6;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C0D4CF;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9FB7B0;
        }
      `}</style>
    </motion.div>
  );
};