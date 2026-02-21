import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { checkinService } from '../../services/checkinService';
import { FiHeart, FiEdit3, FiSmile } from 'react-icons/fi';

export const CheckinModule: React.FC = () => {
  const [mood, setMood] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await checkinService.createCheckIn({ mood, note });
      toast.success('Check-in recorded successfully!');
      setMood(3);
      setNote('');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create check-in';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis = {
    1: '😢',
    2: '😔',
    3: '😐',
    4: '🙂',
    5: '😄',
  };

  const moodLabels = {
    1: 'Struggling',
    2: 'Down',
    3: 'Neutral',
    4: 'Good',
    5: 'Excellent',
  };

  return (
    <Card className="jali-card animate-up">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="stat-icon bg-primary-light text-primary-teal">
            <FiHeart />
          </div>
          <div>
            <h3 className="mb-0 fs-5">Daily Check-in</h3>
            <p className="text-secondary small mb-0">How are you feeling right now?</p>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mood-container d-flex justify-content-between align-items-center p-2 bg-light rounded-4 mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMood(value)}
                  className={`btn border-0 rounded-circle p-2 d-flex flex-column align-items-center transition-base ${mood === value ? 'bg-white shadow-sm scale-110' : 'opacity-50 grayscale'
                    }`}
                  style={{ width: '56px', height: '56px', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  <span className="fs-3">{moodEmojis[value as keyof typeof moodEmojis]}</span>
                </button>
              ))}
            </div>
            <div className="text-center">
              <span className={`fw-600 px-3 py-1 rounded-pill bg-primary-light text-primary-teal small`}>
                {moodLabels[mood as keyof typeof moodLabels]}
              </span>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-600 text-secondary mb-2">
              <FiEdit3 className="me-2" />
              Optional Note
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's making you feel this way?"
              className="border-light rounded-3 bg-light-focus"
              style={{ resize: 'none' }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn-jali btn-jali-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSmile className="me-2" />
                Submit Check-in
              </>
            )}
          </Button>
        </Form>
      </Card.Body>

      <style>{`
        .grayscale { filter: grayscale(1); }
        .scale-110 { transform: scale(1.15); }
        .bg-light-focus:focus {
          background: white;
          border-color: var(--primary-teal) !important;
          box-shadow: 0 0 0 4px var(--primary-light);
        }
        .mood-container button:hover {
          filter: grayscale(0);
          opacity: 1;
          transform: translateY(-5px);
        }
      `}</style>
    </Card>
  );
};
