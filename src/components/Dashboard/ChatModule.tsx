import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { messageService } from '../../services/messageService';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiSend, 
  FiMessageSquare, 
  FiUser, 
  FiClock, 
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiMoreVertical,
  FiPaperclip,
  FiSmile,
  FiInfo,
  FiAlertCircle
} from 'react-icons/fi';
import type { Message } from '../../types';

interface ChatModuleProps {
  sessionId?: string;
  compact?: boolean;
  counselorName?: string;
  counselorAvatar?: string;
  onBack?: () => void;
}

interface MessageGroup {
  date: string;
  messages: Message[];
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
    <span style={{ fontSize: '0.8rem', color: '#5F6F6C', marginLeft: '4px' }}>
      Counselor is typing
    </span>
  </motion.div>
);

const MessageBubble: React.FC<{ 
  message: Message; 
  isUser: boolean;
  showAvatar: boolean;
  timestamp: string;
}> = ({ message, isUser, showAvatar, timestamp }) => {
  const [showTime, setShowTime] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      {/* Avatar for counselor messages */}
      {!isUser && showAvatar && (
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
            marginRight: '8px',
            flexShrink: 0,
            boxShadow: '0 4px 8px rgba(244, 162, 97, 0.2)'
          }}
        >
          <FiUser size={16} color="white" />
        </motion.div>
      )}

      {/* Message content */}
      <div style={{ maxWidth: '70%', position: 'relative' }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            background: isUser 
              ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
              : '#F4F8F6',
            color: isUser ? 'white' : '#2D3F3B',
            boxShadow: isUser
              ? '0 4px 12px rgba(46, 196, 182, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.02)',
            wordBreak: 'break-word',
            position: 'relative'
          }}
        >
          {message.content}
        </motion.div>

        {/* Timestamp and read receipt */}
        <AnimatePresence>
          {(showTime || !isUser) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`d-flex align-items-center mt-1 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
              style={{ gap: '4px' }}
            >
              <span style={{ fontSize: '0.65rem', color: '#8A9D9A' }}>
                {timestamp}
              </span>
              {isUser && message.read && (
                <FiCheckCircle size={10} style={{ color: '#2EC4B6' }} />
              )}
              {isUser && !message.read && (
                <FiCheck size={10} style={{ color: '#8A9D9A' }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar for user messages */}
      {isUser && showAvatar && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            flexShrink: 0,
            boxShadow: '0 4px 8px rgba(46, 196, 182, 0.2)'
          }}
        >
          <FiUser size={16} color="white" />
        </motion.div>
      )}
    </motion.div>
  );
};

const DateDivider: React.FC<{ date: string }> = ({ date }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: '20px 0',
    position: 'relative'
  }}>
    <div style={{ 
      flex: 1, 
      height: '1px', 
      background: 'linear-gradient(90deg, transparent, #EAF3F1, transparent)'
    }} />
    <span style={{ 
      padding: '4px 12px',
      backgroundColor: '#F4F8F6',
      borderRadius: '40px',
      color: '#5F6F6C',
      fontSize: '0.75rem',
      fontWeight: 500,
      margin: '0 12px'
    }}>
      {date}
    </span>
    <div style={{ 
      flex: 1, 
      height: '1px', 
      background: 'linear-gradient(90deg, transparent, #EAF3F1, transparent)'
    }} />
  </div>
);

export const ChatModule: React.FC<ChatModuleProps> = ({ 
  sessionId: propSessionId, 
  compact = false,
  counselorName = 'Counselor',
  counselorAvatar,
  onBack
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>(propSessionId || '');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSessionInput, setShowSessionInput] = useState(!propSessionId);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
      // Simulate real-time connection
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  // Simulate typing indicator
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 10000);
      return () => clearTimeout(typingTimer);
    }
  }, [messages, sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;
    
    try {
      const data = await messageService.getSessionMessages(sessionId);
      setMessages(data);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Failed to load messages:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !sessionId || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      content: messageText,
      sender: user?.username || 'user',
      created_at: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();

    try {
      const message = await messageService.sendMessage(sessionId, {
        session_id: sessionId,
        content: messageText,
      });
      
      // Replace optimistic message with real one
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticMessage.id ? message : msg
        )
      );
      
      toast.success('Message sent', {
        icon: '✨',
        duration: 2000,
        style: { borderRadius: '20px' }
      });
    } catch (error: any) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      toast.error('Failed to send message. Please try again.', {
        icon: '⚠️',
        style: { borderRadius: '20px' }
      });
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleStartChat = () => {
    if (sessionId.trim()) {
      setShowSessionInput(false);
      loadMessages();
    } else {
      toast.error('Please enter a valid session ID');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && sessionId && !sending) {
      e.preventDefault();
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
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
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

  const lastReadMessage = messages.filter(m => m.sender !== user?.username).slice(-1)[0];

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
        {/* Chat Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #F4F8F6 0%, #FFFFFF 100%)',
          padding: compact ? '16px' : '20px 24px',
          borderBottom: '1px solid #EAF3F1'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              {showSessionInput && !compact && onBack && (
                <motion.button
                  whileHover={{ scale: 1.1, x: -3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onBack}
                  style={{
                    background: 'white',
                    border: '1px solid #EAF3F1',
                    borderRadius: '30px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#2EC4B6'
                  }}
                >
                  <FiArrowLeft size={18} />
                </motion.button>
              )}
              
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
                <FiMessageSquare size={compact ? 18 : 20} color="white" />
              </motion.div>
              
              <div>
                <h5 style={{ 
                  fontSize: compact ? '0.95rem' : '1.1rem', 
                  fontWeight: 600, 
                  color: '#2D3F3B',
                  marginBottom: 2
                }}>
                  {sessionId ? counselorName : 'Messages'}
                </h5>
                {sessionId ? (
                  <div className="d-flex align-items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: connectionStatus === 'connected' ? '#2EC4B6' : '#F4A261'
                      }}
                    />
                    <span style={{ color: '#8A9D9A', fontSize: '0.75rem' }}>
                      {connectionStatus === 'connected' ? 'Online' : 'Connecting...'}
                    </span>
                    <span style={{ 
                      backgroundColor: '#EAF3F1',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      color: '#5F6F6C',
                      fontSize: '0.7rem',
                      marginLeft: '4px'
                    }}>
                      ID: {sessionId.substring(0, 6)}
                    </span>
                  </div>
                ) : (
                  <p style={{ color: '#8A9D9A', fontSize: '0.8rem', marginBottom: 0 }}>
                    Start a confidential conversation
                  </p>
                )}
              </div>
            </div>

            {sessionId && !compact && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'white',
                  border: '1px solid #EAF3F1',
                  borderRadius: '30px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#5F6F6C',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <FiMoreVertical size={14} />
                <span>Options</span>
              </motion.button>
            )}
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-0" style={{ backgroundColor: '#FFFFFF' }}>
          {!sessionId || showSessionInput ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: compact ? '300px' : '400px'
              }}
            >
              <div style={{ maxWidth: '320px', width: '100%' }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #E8F6F4 0%, #D4F0EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 20px 40px -10px rgba(46, 196, 182, 0.3)'
                  }}
                >
                  <FiMessageSquare size={40} style={{ color: '#2EC4B6' }} />
                </motion.div>
                
                <h5 style={{ 
                  textAlign: 'center', 
                  color: '#2D3F3B', 
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  Start a Conversation
                </h5>
                <p style={{ 
                  textAlign: 'center', 
                  color: '#8A9D9A', 
                  fontSize: '0.9rem',
                  marginBottom: '24px'
                }}>
                  Enter your session ID to connect with your counselor in a secure, private space
                </p>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    placeholder="e.g., SESS-123-456"
                    style={{ 
                      borderRadius: '40px',
                      border: '2px solid #EAF3F1',
                      padding: '12px 20px',
                      fontSize: '0.95rem',
                      textAlign: 'center'
                    }}
                    className="shadow-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                    autoFocus
                  />
                </Form.Group>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleStartChat}
                    disabled={!sessionId.trim()}
                    style={{
                      background: sessionId.trim() 
                        ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
                        : '#EAF3F1',
                      border: 'none',
                      borderRadius: '40px',
                      padding: '12px',
                      width: '100%',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: sessionId.trim() ? 'white' : '#8A9D9A',
                      cursor: sessionId.trim() ? 'pointer' : 'not-allowed',
                      boxShadow: sessionId.trim() ? '0 8px 16px rgba(46, 196, 182, 0.2)' : 'none'
                    }}
                  >
                    Enter Session
                  </Button>
                </motion.div>

                <p style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: '0.75rem',
                  color: '#B0C0BD'
                }}>
                  🔒 End-to-end encrypted • HIPAA compliant
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Messages Area */}
              <div 
                ref={chatContainerRef}
                style={{ 
                  flexGrow: 1,
                  overflowY: 'auto',
                  maxHeight: compact ? '350px' : '450px',
                  padding: compact ? '16px' : '24px',
                  backgroundColor: '#FFFFFF',
                  scrollBehavior: 'smooth'
                }}
              >
                {loading && messages.length === 0 ? (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <Spinner animation="border" style={{ color: '#2EC4B6' }} />
                    <p style={{ color: '#8A9D9A' }}>Loading your conversation...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      padding: '40px 20px'
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '30px',
                      background: '#F4F8F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <FiMessageSquare size={32} style={{ color: '#2EC4B6' }} />
                    </div>
                    <h6 style={{ color: '#2D3F3B', marginBottom: '8px' }}>
                      No messages yet
                    </h6>
                    <p style={{ color: '#8A9D9A', fontSize: '0.9rem', maxWidth: '250px' }}>
                      Send a message to start the conversation with your counselor
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {Object.entries(groupedMessages).map(([date, dateMessages], groupIndex) => (
                      <div key={date}>
                        <DateDivider date={date} />
                        {dateMessages.map((msg, msgIndex) => {
                          const isUser = msg.sender === user?.username || msg.sender === 'user';
                          const showAvatar = msgIndex === 0 || 
                            dateMessages[msgIndex - 1]?.sender !== msg.sender;
                          
                          return (
                            <MessageBubble
                              key={msg.id}
                              message={msg}
                              isUser={isUser}
                              showAvatar={showAvatar}
                              timestamp={formatTime(msg.created_at)}
                            />
                          );
                        })}
                      </div>
                    ))}

                    {/* Typing indicator */}
                    <AnimatePresence>
                      {isTyping && <TypingIndicator />}
                    </AnimatePresence>

                    {/* Read receipt */}
                    {lastReadMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '8px',
                          paddingRight: '8px'
                        }}
                      >
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#8A9D9A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FiCheckCircle size={10} style={{ color: '#2EC4B6' }} />
                          Seen
                        </span>
                      </motion.div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{ 
                padding: compact ? '16px' : '20px 24px',
                borderTop: '1px solid #EAF3F1',
                backgroundColor: '#F9FCFB'
              }}>
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2 align-items-center">
                    {/* Attachment button (optional) */}
                    {!compact && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        style={{
                          background: 'white',
                          border: '1px solid #EAF3F1',
                          borderRadius: '30px',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#5F6F6C',
                          cursor: 'pointer'
                        }}
                      >
                        <FiPaperclip size={16} />
                      </motion.button>
                    )}

                    <div style={{ flex: 1, position: 'relative' }}>
                      <Form.Control
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isTyping ? "Counselor is typing..." : "Type your message..."}
                        disabled={sending || connectionStatus !== 'connected'}
                        style={{ 
                          borderRadius: '40px',
                          border: '2px solid #EAF3F1',
                          padding: compact ? '10px 16px' : '12px 20px',
                          paddingRight: '50px',
                          backgroundColor: 'white',
                          fontSize: compact ? '0.9rem' : '0.95rem',
                          transition: 'all 0.2s ease'
                        }}
                        className="shadow-sm"
                      />
                      
                      {/* Emoji button (optional) */}
                      {!compact && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: '#8A9D9A',
                            cursor: 'pointer'
                          }}
                        >
                          <FiSmile size={18} />
                        </motion.button>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        disabled={sending || !newMessage.trim() || connectionStatus !== 'connected'}
                        style={{
                          background: newMessage.trim() && connectionStatus === 'connected'
                            ? 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)'
                            : '#EAF3F1',
                          border: 'none',
                          borderRadius: '30px',
                          width: compact ? '40px' : '48px',
                          height: compact ? '40px' : '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          cursor: newMessage.trim() && connectionStatus === 'connected' ? 'pointer' : 'not-allowed',
                          boxShadow: newMessage.trim() && connectionStatus === 'connected'
                            ? '0 4px 12px rgba(46, 196, 182, 0.3)'
                            : 'none'
                        }}
                      >
                        {sending ? (
                          <Spinner size="sm" animation="border" style={{ color: 'white' }} />
                        ) : (
                          <FiSend size={compact ? 16 : 18} color={newMessage.trim() ? 'white' : '#8A9D9A'} />
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </Form>

                {/* Connection status warning */}
                {connectionStatus !== 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#FFF4E5',
                      borderRadius: '30px',
                      fontSize: '0.8rem',
                      color: '#F4A261'
                    }}
                  >
                    <FiAlertCircle size={14} />
                    <span>Reconnecting to chat...</span>
                  </motion.div>
                )}

                {/* Encryption notice */}
                {!compact && (
                  <p style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '0.65rem',
                    color: '#B0C0BD',
                    marginBottom: 0
                  }}>
                    🔒 All messages are end-to-end encrypted
                  </p>
                )}
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <style>{`
        .form-control:focus {
          border-color: #2EC4B6 !important;
          box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.1) !important;
          outline: none;
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