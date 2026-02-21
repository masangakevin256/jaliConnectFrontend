import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { feedbackService } from '../../services/feedbackService';
import { FiStar, FiMessageCircle, FiHash, FiSend } from 'react-icons/fi';

export const FeedbackModule: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      toast.error('Please enter a session ID');
      return;
    }

    setLoading(true);
    try {
      await feedbackService.createFeedback({
        session_id: sessionId,
        rating,
        comment,
      });
      toast.success('Feedback submitted successfully!');
      setSessionId('');
      setRating(5);
      setComment('');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to submit feedback';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <Card className="jali-card animate-up">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="stat-icon bg-accent-light text-accent-orange">
            <FiMessageCircle />
          </div>
          <div>
            <h3 className="mb-0 fs-5">Session Feedback</h3>
            <p className="text-secondary small mb-0">Tell us how your last session went</p>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-600 text-secondary mb-2">
              <FiHash className="me-2" />
              Session ID
            </Form.Label>
            <Form.Control
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g. 8a2f4c..."
              className="border-light rounded-3 bg-light-focus py-2"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-600 text-secondary mb-3">Rate your experience</Form.Label>
            <div className="rating-selector d-flex align-items-center gap-3 mb-2">
              <div className="stars d-flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`btn border-0 p-0 fs-2 transition-base star-btn ${rating >= value ? 'text-warning' : 'text-muted opacity-25'
                      }`}
                  >
                    <FiStar fill={rating >= value ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <span className="fw-600 text-accent-orange small bg-accent-light px-3 py-1 rounded-pill">
                {ratingLabels[rating as keyof typeof ratingLabels]}
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-600 text-secondary mb-2">
              <FiMessageCircle className="me-2" />
              Your Comments
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What could we improve? What did you like?"
              className="border-light rounded-3 bg-light-focus"
              style={{ resize: 'none' }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn-jali btn-jali-primary w-100 py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              <>
                <FiSend className="me-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </Form>
      </Card.Body>

      <style>{`
        .star-btn { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .star-btn:hover { transform: scale(1.2); opacity: 1; }
        .star-btn:active { transform: scale(0.9); }
        .bg-light-focus:focus {
          background: white;
          border-color: var(--primary-teal) !important;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
      `}</style>
    </Card>
  );
};
