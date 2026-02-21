import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { aiService } from '../../services/aiService';
import { FiSend, FiMessageCircle, FiCpu, FiUser, FiHelpCircle } from 'react-icons/fi';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AIModule: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'assistant', content: 'Hi! I\'m your AI wellness assistant. How can I support you today?' },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
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
    if (!input.trim()) return;

    const userMessage: AIMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.chat({
        message: input,
        history: messages,
      });
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to get AI response';
      toast.error(message);
      
      // Add error message from assistant
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    // Small delay to ensure state updates
    setTimeout(() => {
      const form = document.querySelector('form');
      form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <Card className="border-0 h-100" style={{ 
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#F4F8F6',
        padding: '1.25rem',
        borderBottom: '1px solid #EAF3F1'
      }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ 
            backgroundColor: '#2EC4B6',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiCpu size={20} color="white" />
          </div>
          <div>
            <h5 className="fw-bold mb-1" style={{ color: '#1F2D2B' }}>AI Wellness Assistant</h5>
            <p className="mb-0" style={{ color: '#5F6F6C', fontSize: '0.85rem' }}>
              <span style={{ color: '#2EC4B6' }}>●</span> Online • Here to help
            </p>
          </div>
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-0">
        {/* Messages Area */}
        <div style={{ 
          flexGrow: 1,
          overflowY: 'auto',
          maxHeight: '400px',
          padding: '1.5rem',
          backgroundColor: '#FFFFFF'
        }}>
          <ListGroup variant="flush" className="bg-transparent">
            {messages.map((msg, idx) => (
              <ListGroup.Item
                key={idx}
                className={`border-0 bg-transparent py-2 px-0 ${
                  msg.role === 'user' ? 'text-end' : 'text-start'
                }`}
              >
                <div className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  {msg.role === 'assistant' && (
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#EAF3F1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '8px',
                      flexShrink: 0
                    }}>
                      <FiCpu size={16} style={{ color: '#2EC4B6' }} />
                    </div>
                  )}
                  <div
                    style={{ 
                      maxWidth: '75%',
                      padding: '0.75rem 1rem',
                      borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      backgroundColor: msg.role === 'user' ? '#2EC4B6' : '#F4F8F6',
                      color: msg.role === 'user' ? 'white' : '#1F2D2B',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.content}
                    <div style={{ 
                      fontSize: '0.7rem', 
                      marginTop: '4px',
                      opacity: 0.7,
                      color: msg.role === 'user' ? 'white' : '#5F6F6C'
                    }}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#2EC4B6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '8px',
                      flexShrink: 0
                    }}>
                      <FiUser size={16} color="white" />
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))}
            {loading && (
              <ListGroup.Item className="border-0 bg-transparent py-2">
                <div className="d-flex align-items-center gap-2">
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: '#EAF3F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FiCpu size={16} style={{ color: '#2EC4B6' }} />
                  </div>
                  <div className="d-flex gap-1">
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#2EC4B6',
                      animation: 'pulse 1.5s infinite'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#2EC4B6',
                      animation: 'pulse 1.5s infinite 0.2s'
                    }} />
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#2EC4B6',
                      animation: 'pulse 1.5s infinite 0.4s'
                    }} />
                  </div>
                </div>
              </ListGroup.Item>
            )}
            <div ref={messagesEndRef} />
          </ListGroup>
        </div>

        {/* Quick Questions */}
        <div style={{ 
          padding: '1rem 1.5rem',
          backgroundColor: '#F4F8F6',
          borderTop: '1px solid #EAF3F1',
          borderBottom: '1px solid #EAF3F1'
        }}>
          <p className="mb-2 small" style={{ color: '#5F6F6C' }}>Quick questions:</p>
          <div className="d-flex flex-wrap gap-2">
            {[
              'How to manage stress?',
              'Breathing exercises',
              'Sleep tips',
              'Anxiety help'
            ].map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(question)}
                className="btn btn-sm"
                style={{ 
                  backgroundColor: '#FFFFFF',
                  color: '#1F2D2B',
                  border: '1px solid #EAF3F1',
                  borderRadius: '20px',
                  padding: '0.25rem 1rem',
                  fontSize: '0.85rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2EC4B6';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#2EC4B6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#1F2D2B';
                  e.currentTarget.style.borderColor = '#EAF3F1';
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div style={{ padding: '1.5rem' }}>
          <Form onSubmit={handleSendMessage}>
            <div className="d-flex gap-2">
              <Form.Control
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={loading}
                style={{ 
                  borderRadius: '24px',
                  border: '1px solid #EAF3F1',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#F4F8F6',
                  color: '#1F2D2B'
                }}
                className="shadow-sm"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                style={{ 
                  backgroundColor: '#2EC4B6', 
                  borderColor: '#2EC4B6',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  transition: 'all 0.3s ease'
                }}
                className="shadow-sm"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#28a99d'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
              >
                <FiSend size={18} color="white" />
              </Button>
            </div>
          </Form>
          
          {/* Disclaimer */}
          <div className="text-center mt-3">
            <small style={{ color: '#5F6F6C', fontSize: '0.75rem' }}>
              <FiHelpCircle size={12} className="me-1" />
              AI assistant provides general wellness information. Not a substitute for professional medical advice.
            </small>
          </div>
        </div>
      </Card.Body>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .form-control:focus {
          border-color: #2EC4B6;
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.25);
        }
      `}</style>
    </Card>
  );
};