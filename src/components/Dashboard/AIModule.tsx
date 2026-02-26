import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { aiService } from '../../services/aiService';
import { 
  FiSend, 
  FiCpu, 
  FiUser, 
  FiHelpCircle,
  FiMessageCircle,
  FiHeart,
  FiSun,
  FiMoon,
  FiWind,
  FiActivity,
  FiCoffee,
  FiBookOpen,
  FiMusic,
  FiSmile,
  FiThumbsUp,
  FiClock
} from 'react-icons/fi';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  color: string;
}

const TypingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: '#F4F8F6',
      borderRadius: '24px',
      width: 'fit-content',
      marginBottom: '8px'
    }}
  >
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '4px'
    }}>
      <FiCpu size={16} color="white" />
    </div>
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
      style={{ width: 6, height: 6, backgroundColor: '#2EC4B6', borderRadius: '50%' }}
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
      style={{ width: 6, height: 6, backgroundColor: '#2EC4B6', borderRadius: '50%' }}
    />
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
      style={{ width: 6, height: 6, backgroundColor: '#2EC4B6', borderRadius: '50%' }}
    />
    <span style={{ fontSize: '0.85rem', color: '#5F6F6C', marginLeft: '4px' }}>
      AI is thinking
    </span>
  </motion.div>
);

const MessageBubble: React.FC<{ 
  message: AIMessage; 
  index: number;
  isLast: boolean;
}> = ({ message, index, isLast }) => {
  const isUser = message.role === 'user';
  const [showTime, setShowTime] = useState(false);

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {/* Avatar for AI */}
      {!isUser && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            flexShrink: 0,
            boxShadow: '0 4px 8px rgba(46, 196, 182, 0.2)'
          }}
        >
          <FiCpu size={18} color="white" />
        </motion.div>
      )}

      <div style={{ maxWidth: '75%', position: 'relative' }}>
        {/* Message content */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '14px 18px',
            borderRadius: isUser ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
            background: isUser 
              ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
              : '#F4F8F6',
            color: isUser ? 'white' : '#2D3F3B',
            boxShadow: isUser
              ? '0 4px 12px rgba(46, 196, 182, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.02)',
            wordBreak: 'break-word',
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}
        >
          {message.content}
        </motion.div>

        {/* Timestamp */}
        <AnimatePresence>
          {(showTime || isLast) && message.timestamp && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`d-flex align-items-center mt-1 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
              style={{ gap: '4px' }}
            >
              <span style={{ fontSize: '0.65rem', color: '#8A9D9A' }}>
                {formatTime(message.timestamp)}
              </span>
              {isUser && (
                <FiThumbsUp size={8} style={{ color: '#2EC4B6' }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar for User */}
      {isUser && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            flexShrink: 0,
            boxShadow: '0 4px 8px rgba(244, 162, 97, 0.2)'
          }}
        >
          <FiUser size={18} color="white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const WelcomeSuggestions: React.FC<{ onSelect: (prompt: string) => void }> = ({ onSelect }) => {
  const suggestions = [
    { icon: <FiWind />, text: "Breathing exercises", prompt: "Can you teach me a breathing exercise for anxiety?" },
    { icon: <FiMoon />, text: "Sleep better", prompt: "I'm having trouble sleeping. Any suggestions?" },
    { icon: <FiHeart />, text: "Manage stress", prompt: "How can I manage stress better?" },
    { icon: <FiActivity />, text: "Mindfulness", prompt: "What's a simple mindfulness exercise I can do?" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginTop: '16px'
      }}
    >
      {suggestions.map((suggestion, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion.prompt)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px',
            backgroundColor: '#F9FCFB',
            border: '1px solid #EAF3F1',
            borderRadius: '16px',
            color: '#2D3F3B',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ color: '#2EC4B6', fontSize: '1.1rem' }}>{suggestion.icon}</span>
          {suggestion.text}
        </motion.button>
      ))}
    </motion.div>
  );
};

const WellnessTip: React.FC = () => {
  const tips = [
    "Take a deep breath—you're doing great.",
    "Remember to drink water today 💧",
    "A 5-minute walk can boost your mood.",
    "Practice self-compassion: talk to yourself like you would a friend.",
    "Your feelings are valid, whatever they are.",
    "Small steps lead to big changes.",
    "It's okay to ask for help when you need it."
  ];

  const [tip, setTip] = useState(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={tip}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#FFF9F0',
        borderRadius: '40px',
        fontSize: '0.8rem',
        color: '#F4A261'
      }}
    >
      <FiSun size={14} />
      <span>{tip}</span>
    </motion.div>
  );
};

export const AIModule: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! I\'m your wellness companion. I\'m here to listen, offer support, and share tools for your mental wellness journey. What\'s on your mind today?',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [conversationId] = useState(() => `conv-${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: AIMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);

    try {
      const response = await aiService.chat({
        message: input.trim(),
        history: messages.map(({ role, content }) => ({ role, content })),
        conversationId
      });

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.response || response.message || "I'm here to support you. Could you tell me more about how you're feeling?",
        timestamp: new Date()
      };

      // Simulate natural typing delay based on response length
      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);
      }, Math.min(1000, response.response.length * 10));
      
    } catch (error: any) {
      toast.error('Having trouble connecting. Please try again.', {
        icon: '🫂',
        style: { borderRadius: '20px' }
      });
      
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble responding right now. Would you mind trying again in a moment?',
        timestamp: new Date()
      }]);
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  const handleClearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hi again! I\'m here to support you. How are you feeling today?',
        timestamp: new Date()
      }
    ]);
    setShowSuggestions(true);
    toast.success('Started a fresh conversation', {
      icon: '🌱',
      style: { borderRadius: '20px' }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height: '100%' }}
    >
      <Card className="border-0 h-100" style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: compact ? '20px' : '32px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
        border: '1px solid rgba(46, 196, 182, 0.08)'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #F4F8F6 0%, #FFFFFF 100%)',
          padding: compact ? '16px' : '20px 24px',
          borderBottom: '1px solid #EAF3F1'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                style={{
                  width: compact ? '40px' : '48px',
                  height: compact ? '40px' : '48px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(46, 196, 182, 0.2)'
                }}
              >
                <FiCpu size={compact ? 18 : 20} color="white" />
              </motion.div>
              
              <div>
                <h5 style={{ 
                  fontSize: compact ? '0.95rem' : '1.1rem', 
                  fontWeight: 600, 
                  color: '#2D3F3B',
                  marginBottom: 2
                }}>
                  Wellness Companion
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#2EC4B6'
                    }}
                  />
                  <span style={{ color: '#8A9D9A', fontSize: '0.75rem' }}>
                    Here to support you
                  </span>
                </div>
              </div>
            </div>

            {!compact && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearChat}
                style={{
                  background: 'white',
                  border: '1px solid #EAF3F1',
                  borderRadius: '30px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  color: '#5F6F6C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <FiMessageCircle size={12} />
                New conversation
              </motion.button>
            )}
          </div>

          {/* Wellness tip */}
          {!compact && (
            <div style={{ marginTop: '12px' }}>
              <WellnessTip />
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column p-0" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Messages Area */}
          <div style={{ 
            flexGrow: 1,
            overflowY: 'auto',
            maxHeight: compact ? '350px' : '450px',
            padding: compact ? '16px' : '24px',
            backgroundColor: '#FFFFFF'
          }}>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  index={idx}
                  isLast={idx === messages.length - 1}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {loading && <TypingIndicator />}
            </AnimatePresence>

            {/* Welcome suggestions */}
            {showSuggestions && messages.length === 1 && !loading && (
              <WelcomeSuggestions onSelect={handleQuickQuestion} />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {!compact && messages.length > 1 && (
            <div style={{ 
              padding: '12px 24px',
              backgroundColor: '#F9FCFB',
              borderTop: '1px solid #EAF3F1',
              borderBottom: '1px solid #EAF3F1',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {[
                { icon: <FiWind />, label: 'Breathe', prompt: 'Guide me through a breathing exercise' },
                { icon: <FiMoon />, label: 'Sleep', prompt: 'Help me with sleep' },
                { icon: <FiHeart />, label: 'Anxiety', prompt: 'I feel anxious right now' },
                { icon: <FiBookOpen />, label: 'Journal', prompt: 'Give me a journal prompt' },
                { icon: <FiMusic />, label: 'Calm', prompt: 'Suggest ways to calm down' },
              ].map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickQuestion(action.prompt)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #EAF3F1',
                    borderRadius: '40px',
                    color: '#5F6F6C',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ color: '#2EC4B6' }}>{action.icon}</span>
                  {action.label}
                </motion.button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{ padding: compact ? '16px' : '24px' }}>
            <Form onSubmit={handleSendMessage}>
              <div className="d-flex gap-2">
                <div style={{ flex: 1, position: 'relative' }}>
                  <Form.Control
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={loading ? "AI is thinking..." : "How are you feeling today?"}
                    disabled={loading}
                    style={{ 
                      borderRadius: '40px',
                      border: '2px solid #EAF3F1',
                      padding: compact ? '10px 16px' : '14px 20px',
                      paddingRight: '50px',
                      backgroundColor: '#F9FCFB',
                      fontSize: compact ? '0.9rem' : '0.95rem',
                      transition: 'all 0.2s ease'
                    }}
                    className="shadow-sm"
                  />
                  
                  {/* Input character count */}
                  {input.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.7rem',
                        color: input.length > 500 ? '#F4A261' : '#8A9D9A',
                        backgroundColor: 'white',
                        padding: '2px 6px',
                        borderRadius: '12px'
                      }}
                    >
                      {input.length}/500
                    </motion.div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{
                      background: input.trim() && !loading
                        ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
                        : '#EAF3F1',
                      border: 'none',
                      borderRadius: '30px',
                      width: compact ? '44px' : '52px',
                      height: compact ? '44px' : '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                      boxShadow: input.trim() && !loading
                        ? '0 4px 12px rgba(46, 196, 182, 0.3)'
                        : 'none'
                    }}
                  >
                    <FiSend size={compact ? 16 : 18} color={input.trim() && !loading ? 'white' : '#8A9D9A'} />
                  </Button>
                </motion.div>
              </div>
            </Form>
            
            {/* Disclaimer with animation */}
            <motion.div 
              className="text-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <small style={{ color: '#8A9D9A', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <FiHelpCircle size={10} />
                AI companion provides wellness support. Not a substitute for professional care.
              </small>
            </motion.div>

            {/* Session info */}
            {!compact && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px',
                fontSize: '0.6rem',
                color: '#C0D0CC'
              }}>
                <FiClock size={8} />
                Conversation ID: {conversationId.substring(0, 8)}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1) !important;
          outline: none;
          background-color: white !important;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #F4F8F6;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #C0D4CF;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9FB7B0;
        }
        
        /* Hide scrollbar for quick actions */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  );
};