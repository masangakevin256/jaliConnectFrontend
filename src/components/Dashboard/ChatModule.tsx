import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../hooks/useAuth';
import { FiSend, FiMessageSquare, FiUser, FiClock, FiInfo, FiArrowLeft } from 'react-icons/fi';
import type { Message } from '../../types';

export const ChatModule: React.FC<{ sessionId?: string; compact?: boolean }> = ({ 
  sessionId: propSessionId, 
  compact = false 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(propSessionId || '');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSessionInput, setShowSessionInput] = useState(!propSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
      // Set up polling for new messages every 10 seconds
      const interval = setInterval(loadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const data = await messageService.getSessionMessages(sessionId);
      setMessages(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to load messages';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const message = await messageService.sendMessage(sessionId, {
        session_id: sessionId,
        content: newMessage,
      });
      setMessages([...messages, message]);
      setNewMessage('');
      toast.success('Message sent!');
      inputRef.current?.focus();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to send message';
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const handleStartChat = () => {
    if (sessionId.trim()) {
      setShowSessionInput(false);
      loadMessages();
    } else {
      toast.error('Please enter a session ID');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && sessionId) {
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <Card className="border-0 h-100" style={{ 
      backgroundColor: '#FFFFFF',
      borderRadius: compact ? '16px' : '24px',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{ 
        backgroundColor: '#F4F8F6',
        padding: compact ? '1rem' : '1.25rem',
        borderBottom: '1px solid #EAF3F1'
      }}>
        <div className="d-flex align-items-center gap-3">
          {showSessionInput && !compact && (
            <button 
              onClick={() => setShowSessionInput(false)}
              className="btn btn-link p-0"
              style={{ color: '#2EC4B6' }}
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <div style={{ 
            width: compact ? '36px' : '40px', 
            height: compact ? '36px' : '40px', 
            borderRadius: '50%',
            backgroundColor: '#2EC4B6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiMessageSquare size={compact ? 16 : 18} color="white" />
          </div>
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0" style={{ color: '#1F2D2B' }}>
              {sessionId ? `Session Chat` : 'Messages'}
            </h6>
            {sessionId && (
              <p className="mb-0" style={{ color: '#5F6F6C', fontSize: '0.8rem' }}>
                Session ID: {sessionId.substring(0, 8)}...
              </p>
            )}
          </div>
          {sessionId && (
            <span style={{ 
              backgroundColor: '#EAF3F1',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              color: '#2EC4B6',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              <FiClock className="me-1" size={12} />
              Live
            </span>
          )}
        </div>
      </div>

      <Card.Body className="d-flex flex-column p-0">
        {!sessionId || showSessionInput ? (
          <div className="p-4">
            <div className="text-center mb-4">
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%',
                backgroundColor: '#EAF3F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <FiMessageSquare size={40} style={{ color: '#2EC4B6' }} />
              </div>
              <h5 style={{ color: '#1F2D2B' }}>Start a Conversation</h5>
              <p style={{ color: '#5F6F6C', fontSize: '0.9rem' }}>
                Enter your session ID to begin chatting with your counselor
              </p>
            </div>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
                style={{ 
                  borderRadius: '12px',
                  border: '1px solid #EAF3F1',
                  padding: '0.75rem 1rem'
                }}
                className="shadow-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                autoFocus
              />
            </Form.Group>
            <Button
              onClick={handleStartChat}
              style={{ 
                backgroundColor: '#2EC4B6', 
                borderColor: '#2EC4B6',
                borderRadius: '12px',
                padding: '0.75rem',
                width: '100%'
              }}
            >
              Start Chat
            </Button>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div style={{ 
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: compact ? '300px' : '400px',
              padding: compact ? '1rem' : '1.5rem',
              backgroundColor: '#FFFFFF'
            }}>
              {loading && messages.length === 0 ? (
                <div className="text-center py-4">
                  <Spinner animation="border" style={{ color: '#2EC4B6' }} />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: '#F4F8F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <FiMessageSquare size={24} style={{ color: '#5F6F6C' }} />
                  </div>
                  <p style={{ color: '#5F6F6C' }}>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date}>
                    <div className="text-center my-3">
                      <span style={{ 
                        backgroundColor: '#F4F8F6',
                        padding: '0.25rem 1rem',
                        borderRadius: '20px',
                        color: '#5F6F6C',
                        fontSize: '0.8rem'
                      }}>
                        {date}
                      </span>
                    </div>
                    {dateMessages.map((msg) => {
                      const isUser = msg.sender === 'user' || msg.sender === user?.username;
                      return (
                        <div
                          key={msg.id}
                          className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          {!isUser && (
                            <div style={{ 
                              width: '32px', 
                              height: '32px', 
                              borderRadius: '50%',
                              backgroundColor: '#F4A261',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                              flexShrink: 0
                            }}>
                              <FiUser size={14} color="white" />
                            </div>
                          )}
                          <div style={{ maxWidth: compact ? '75%' : '70%' }}>
                            <div
                              style={{ 
                                padding: compact ? '0.5rem 0.75rem' : '0.75rem 1rem',
                                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                backgroundColor: isUser ? '#2EC4B6' : '#F4F8F6',
                                color: isUser ? 'white' : '#1F2D2B',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                wordBreak: 'break-word'
                              }}
                            >
                              {msg.content}
                            </div>
                            <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'} mt-1`}>
                              <small style={{ color: '#5F6F6C', fontSize: '0.65rem' }}>
                                {formatTime(msg.created_at)}
                              </small>
                            </div>
                          </div>
                          {isUser && (
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
                              <FiUser size={14} color="white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Indicator (mock) */}
            {!compact && (
              <div className="px-4 py-2">
                <small style={{ color: '#5F6F6C', fontSize: '0.75rem' }}>
                  <FiInfo className="me-1" />
                  Counselor is typing...
                </small>
              </div>
            )}

            {/* Input Area */}
            <div style={{ 
              padding: compact ? '1rem' : '1.5rem',
              borderTop: '1px solid #EAF3F1',
              backgroundColor: '#FFFFFF'
            }}>
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex gap-2">
                  <Form.Control
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={sending}
                    style={{ 
                      borderRadius: '24px',
                      border: '1px solid #EAF3F1',
                      padding: compact ? '0.6rem 1rem' : '0.75rem 1.25rem',
                      backgroundColor: '#F4F8F6',
                      color: '#1F2D2B'
                    }}
                    className="shadow-sm"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    style={{ 
                      backgroundColor: '#2EC4B6', 
                      borderColor: '#2EC4B6',
                      borderRadius: '50%',
                      width: compact ? '40px' : '48px',
                      height: compact ? '40px' : '48px',
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
                    {sending ? (
                      <Spinner size="sm" animation="border" variant="light" />
                    ) : (
                      <FiSend size={compact ? 16 : 18} color="white" />
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </>
        )}
      </Card.Body>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6;
          box-shadow: 0 0 0 0.2rem rgba(46, 196, 182, 0.25);
        }
      `}</style>
    </Card>
  );
};