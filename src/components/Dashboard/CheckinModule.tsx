import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { checkinService } from '../../services/checkinService';
import { FiHeart, FiEdit3, FiSmile, FiCheck, FiClock } from 'react-icons/fi';

interface MoodOption {
  value: number;
  emoji: string;
  label: string;
  message: string;
  color: string;
  bg: string;
  gradient: string;
}

export const CheckinModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'mood' | 'reflect' | 'complete'>('mood');
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [streak, setStreak] = useState<number>(0);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);
  
  const reflectionInputRef = useRef<HTMLTextAreaElement>(null);

  // Mood options with thoughtful design
  const moodOptions: MoodOption[] = [
    { 
      value: 1, 
      emoji: '🌱', 
      label: 'Gentle',
      message: 'It\'s okay to start where you are',
      color: '#9AA6A3',
      bg: '#F0F3F2',
      gradient: 'linear-gradient(135deg, #F0F3F2 0%, #E5EAE8 100%)'
    },
    { 
      value: 2, 
      emoji: '☁️', 
      label: 'Quiet',
      message: 'Some days are softer than others',
      color: '#7F8D8A',
      bg: '#F2F5F4',
      gradient: 'linear-gradient(135deg, #F2F5F4 0%, #E7ECEA 100%)'
    },
    { 
      value: 3, 
      emoji: '🌿', 
      label: 'Present',
      message: 'You showed up today',
      color: '#5F6F6C',
      bg: '#F4F8F6',
      gradient: 'linear-gradient(135deg, #F4F8F6 0%, #E9EFED 100%)'
    },
    { 
      value: 4, 
      emoji: '✨', 
      label: 'Bright',
      message: 'Glimmers of light find their way',
      color: '#F4A261',
      bg: '#FEF7E9',
      gradient: 'linear-gradient(135deg, #FEF7E9 0%, #FDEFD9 100%)'
    },
    { 
      value: 5, 
      emoji: '🌟', 
      label: 'Radiant',
      message: 'Your warmth touches the world',
      color: '#2EC4B6',
      bg: '#E8F6F4',
      gradient: 'linear-gradient(135deg, #E8F6F4 0%, #D9F0EC 100%)'
    },
  ];

  // Check for existing streak on mount
  useEffect(() => {
    const lastCheck = localStorage.getItem('lastCheckin');
    const currentStreak = localStorage.getItem('checkinStreak');
    
    if (lastCheck) {
      setLastCheckin(lastCheck);
      const daysSinceLast = Math.floor((Date.now() - new Date(lastCheck).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLast <= 1) {
        setStreak(Number(currentStreak) || 0);
      } else {
        setStreak(0);
      }
    }
  }, []);

  // Focus reflection input when step changes
  useEffect(() => {
    if (currentStep === 'reflect' && reflectionInputRef.current) {
      reflectionInputRef.current.focus();
    }
  }, [currentStep]);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    setCurrentStep('reflect');
  };

  const handleReflectionSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      await checkinService.createCheckIn({ 
        mood: selectedMood.value, 
        note: reflection 
      });

      // Update streak
      const today = new Date().toDateString();
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('lastCheckin', today);
      localStorage.setItem('checkinStreak', String(newStreak));

      // Success feedback
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          style={{
            background: 'white',
            borderRadius: '100px',
            padding: '12px 24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid #EAF3F1'
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
            <FiCheck style={{ color: '#2EC4B6' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#2D3F3B', marginBottom: 2 }}>
              You're doing amazing
            </p>
            <p style={{ fontSize: '0.85rem', color: '#8A9D9A', marginBottom: 0 }}>
              {newStreak} day streak • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </motion.div>
      ), { duration: 4000 });

      setCurrentStep('complete');
      
      // Reset after showing completion
      setTimeout(() => {
        setCurrentStep('mood');
        setSelectedMood(null);
        setReflection('');
      }, 2000);
      
    } catch (error: any) {
      toast.error('Unable to save check-in', {
        icon: '🫂',
        style: {
          borderRadius: '20px',
          background: '#FFF0F0',
          color: '#5F5F5F',
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkipReflection = () => {
    handleReflectionSubmit();
  };

  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning check-in';
    if (hour < 17) return 'Afternoon check-in';
    if (hour < 21) return 'Evening check-in';
    return 'Night check-in';
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
        
        {/* Header with streak */}
        <div style={{ 
          padding: '20px 24px',
          borderBottom: '1px solid #F0F5F4',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FCFEFD 100%)'
        }}>
          <div className="d-flex align-items-center justify-content-between">
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
                <FiHeart style={{ color: '#2EC4B6', fontSize: '1.4rem' }} />
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 600, 
                  color: '#2D3F3B',
                  marginBottom: 2,
                  letterSpacing: '-0.01em'
                }}>
                  {getTimeBasedMessage()}
                </h3>
                <div className="d-flex align-items-center gap-2">
                  <FiClock style={{ color: '#8A9D9A', fontSize: '0.9rem' }} />
                  <span style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
                    {streak > 0 ? `${streak} day streak` : 'Start your streak today'}
                  </span>
                </div>
              </div>
            </div>
            {lastCheckin && (
              <span style={{ 
                fontSize: '0.8rem', 
                color: '#8A9D9A',
                background: '#F5F9F8',
                padding: '6px 12px',
                borderRadius: '40px'
              }}>
                Last: {new Date(lastCheckin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        <Card.Body style={{ padding: '32px' }}>
          <AnimatePresence mode="wait">
            {/* Mood Selection Step */}
            {currentStep === 'mood' && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{ 
                  color: '#5F6F6C', 
                  marginBottom: '24px',
                  fontSize: '1rem',
                  lineHeight: 1.5
                }}>
                  Take a gentle moment to notice how you're feeling. 
                  There's no right or wrong answer—just your truth.
                </p>

                <div className="d-flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
                  {moodOptions.map((mood) => (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMoodSelect(mood)}
                      style={{
                        flex: 1,
                        minWidth: '100px',
                        background: mood.bg,
                        border: 'none',
                        borderRadius: '24px',
                        padding: '20px 12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>
                        {mood.emoji}
                      </span>
                      <span style={{ 
                        fontWeight: 600,
                        color: mood.color,
                        fontSize: '1rem',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {mood.label}
                      </span>
                      <span style={{ 
                        fontSize: '0.8rem',
                        color: '#8A9D9A',
                        lineHeight: 1.3
                      }}>
                        {mood.message}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reflection Step */}
            {currentStep === 'reflect' && selectedMood && (
              <motion.div
                key="reflect"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{
                  background: selectedMood.bg,
                  borderRadius: '24px',
                  padding: '24px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '3rem', marginBottom: '8px', display: 'block' }}>
                    {selectedMood.emoji}
                  </span>
                  <p style={{ 
                    color: selectedMood.color,
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    marginBottom: 0
                  }}>
                    {selectedMood.message}
                  </p>
                </div>

                <Form.Group className="mb-4">
                  <Form.Label style={{ 
                    color: '#2D3F3B',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FiEdit3 style={{ color: '#2EC4B6' }} />
                    Would you like to reflect? (optional)
                  </Form.Label>
                  <Form.Control
                    ref={reflectionInputRef}
                    as="textarea"
                    rows={4}
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="What's present for you right now? Any thoughts, sensations, or feelings you'd like to acknowledge..."
                    style={{
                      borderRadius: '20px',
                      border: '1px solid #EAF3F1',
                      padding: '16px',
                      fontSize: '0.95rem',
                      resize: 'none',
                      background: '#FAFCFB'
                    }}
                  />
                </Form.Group>

                <div className="d-flex gap-3">
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleReflectionSubmit}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                        border: 'none',
                        borderRadius: '40px',
                        padding: '14px 24px',
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'white',
                        boxShadow: '0 8px 16px rgba(46, 196, 182, 0.2)'
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Complete check-in'}
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      onClick={handleSkipReflection}
                      disabled={isSubmitting}
                      style={{
                        padding: '14px 24px',
                        borderRadius: '40px',
                        border: '1px solid #EAF3F1',
                        background: 'white',
                        color: '#5F6F6C',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      Skip
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Completion Step */}
            {currentStep === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', padding: '20px' }}
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
                  <FiCheck style={{ color: '#2EC4B6', fontSize: '2rem' }} />
                </motion.div>
                <h4 style={{ color: '#2D3F3B', marginBottom: '8px', fontWeight: 600 }}>
                  Thank you for checking in
                </h4>
                <p style={{ color: '#8A9D9A' }}>
                  You're building a beautiful practice of self-awareness
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Body>

        {/* Subtle footer note */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #F0F5F4',
          background: '#FAFCFB',
          fontSize: '0.85rem',
          color: '#8A9D9A',
          textAlign: 'center'
        }}>
          ✨ Your check-ins help you see your journey over time
        </div>
      </Card>
    </motion.div>
  );
};