import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Form, Modal, Dropdown } from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { ChatModule } from '../components/Dashboard/ChatModule';
import { 
  FiUsers, 
  FiUserCheck, 
  FiActivity, 
  FiSettings, 
  FiRefreshCw,
  FiTrash2,
  FiEdit2,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiSearch,
  FiUser,
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiStar,
  FiEye,
  FiMessageSquare,
  FiPlay,
  FiPieChart,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiStopCircle,
  FiXCircle,
  FiCopy
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface Session {
  id: string;
  session_id?: string;
  user_id: string;
  counselor_id: string | null;
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'waiting' | 'ended';
  created_at: string;
  scheduled_at?: string;
  completed_at?: string;
  notes?: string;
  initial_pulse?: number;
  last_message?: string;
}

interface User {
  user_id: string;
  id?: string;
  username: string;
  name?: string;
  email?: string;
  age_group?: string;
  last_seen?: string;
  last_active?: string;
  updated_at?: string;
  pulse_level?: number;
  mood_score?: number;
  is_online?: boolean;
  phone?: string;
}

interface TransformedSession {
  id: string;
  user_id: string;
  username: string;
  user_email?: string;
  user_age_group: string;
  counselor_id: string | null;
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'waiting' | 'ended';
  created_at: string;
  scheduled_at?: string;
  completed_at?: string;
  notes?: string;
  user_pulse_level?: number;
  last_message?: string;
  user_last_seen?: string;
  user_online?: boolean;
}

export const CounselorDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [sessions, setSessions] = useState<TransformedSession[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<TransformedSession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [endingId, setEndingId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active tab from URL params
  const activeTab = tab || 'overview';

  // Fetch users from API
  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const transformedUsers: User[] = response.data.map((item: any) => ({
        user_id: item.user_id || item.id,
        username: item.username || item.name || 'Unknown User',
        email: item.email,
        age_group: item.age_group,
        last_seen: item.last_seen || item.last_active || item.updated_at,
        pulse_level: item.pulse_level || item.mood_score,
        is_online: item.is_online || false,
        phone: item.phone
      }));
      
      setUsers(transformedUsers);
      return transformedUsers;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load users');
      }
      return [];
    }
  };

  // Fetch sessions from API
  const fetchSessions = async (userData?: User[]) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Use provided user data or existing users state
      const userMap = new Map((userData || users).map(user => [user.user_id, user]));
      
      const transformedSessions: TransformedSession[] = response.data.map((item: any) => {
        const user = userMap.get(item.user_id);
        
        return {
          id: item.id || item.session_id,
          user_id: item.user_id,
          username: user?.username || item.username || `User ${item.user_id?.slice(0, 6)}`,
          user_email: user?.email,
          user_age_group: user?.age_group || item.user_age_group || 'Not specified',
          counselor_id: item.counselor_id || null,
          status: item.status || 'pending',
          created_at: item.created_at || new Date().toISOString(),
          scheduled_at: item.scheduled_at,
          completed_at: item.completed_at,
          notes: item.notes,
          user_pulse_level: user?.pulse_level || item.initial_pulse || item.pulse_level,
          last_message: item.last_message,
          user_last_seen: user?.last_seen,
          user_online: user?.is_online
        };
      });
      
      setSessions(transformedSessions);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to load sessions');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load both users and sessions
  const loadData = async () => {
    const userData = await fetchUsers();
    await fetchSessions(userData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Handle session activation
  const handleActivateSession = async (sessionId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setActivatingId(sessionId);
    try {
      const loadingToast = toast.loading('Activating session...');
      await axios.post(`${API_BASE_URL}/sessions/${sessionId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Session activated successfully! You can now start counseling.', { 
        id: loadingToast,
        icon: '🎉'
      });
      
      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, status: 'active' } 
          : s
      ));
    } catch (error: any) {
      console.error('Error activating session:', error);
      toast.error(error.response?.data?.message || 'Failed to activate session');
    } finally {
      setActivatingId(null);
    }
  };

  // Handle session ending
  const handleEndSession = async () => {
    if (!selectedSession) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setEndingId(selectedSession.id);
    try {
      const loadingToast = toast.loading('Ending session...');
      await axios.post(`${API_BASE_URL}/sessions/${selectedSession.id}/end`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Session ended successfully!', { 
        id: loadingToast,
        icon: '✅'
      });
      
      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id 
          ? { ...s, status: 'completed', completed_at: new Date().toISOString() } 
          : s
      ));
      
      setShowEndSessionModal(false);
      setSelectedSession(null);
    } catch (error: any) {
      console.error('Error ending session:', error);
      toast.error(error.response?.data?.message || 'Failed to end session');
    } finally {
      setEndingId(null);
    }
  };

  // Handle add notes
  const handleAddNotes = async () => {
    if (!selectedSession) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Saving notes...');
      await axios.post(`${API_BASE_URL}/sessions/${selectedSession.id}/notes`, 
        { notes: sessionNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Notes saved successfully', { id: loadingToast });
      
      // Update local state
      setSessions(prev => prev.map(s => 
        s.id === selectedSession.id 
          ? { ...s, notes: sessionNotes } 
          : s
      ));
      
      setShowNotesModal(false);
      setSessionNotes('');
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error(error.response?.data?.message || 'Failed to save notes');
    }
  };

  // Handle copy session ID
  const handleCopySessionId = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    toast.success('Session ID copied to clipboard!', {
      icon: '📋',
      style: { borderRadius: '20px' }
    });
  };

  // Navigation handlers
  const handleViewUser = (userId: string) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleMessageUser = (userId: string) => {
    navigate(`admin/dashboard/counselor/chat?userId=${userId}`);
  };

  const handleViewSession = (session: TransformedSession) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleJoinSession = (sessionId: string) => {
    navigate(`/admin/counselor/chat?sessionId=${sessionId}`);
  };

  const handleOpenNotes = (session: TransformedSession) => {
    setSelectedSession(session);
    setSessionNotes(session.notes || '');
    setShowNotesModal(true);
  };

  const handleOpenEndSession = (session: TransformedSession) => {
    setSelectedSession(session);
    setShowEndSessionModal(true);
  };

  // Tab navigation handler
  const handleTabChange = (tabKey: string) => {
    if (tabKey === 'overview') {
      navigate('/admin/counselor');
    } else {
      navigate(`/admin/counselor/${tabKey}`);
    }
    setIsMobileMenuOpen(false);
  };

  // Sort handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get status badge configuration
  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; color: string; label: string; icon: any }> = {
      active: { 
        bg: '#E8F6F4', 
        color: '#2EC4B6', 
        label: 'Active', 
        icon: FiCheckCircle 
      },
      waiting: { 
        bg: '#FEF7E9', 
        color: '#F4A261', 
        label: 'Waiting', 
        icon: FiClock 
      },
      pending: { 
        bg: '#E8F6F4', 
        color: '#2EC4B6', 
        label: 'Pending', 
        icon: FiClock 
      },
      completed: { 
        bg: '#F4F8F6', 
        color: '#5F6F6C', 
        label: 'Completed', 
        icon: FiCheckCircle 
      },
      cancelled: { 
        bg: '#FFE5E5', 
        color: '#dc3545', 
        label: 'Cancelled', 
        icon: FiAlertCircle 
      }
    };
    
    const { bg, color, label, icon: Icon } = config[status] || config.pending;
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 10px',
        backgroundColor: bg,
        color: color,
        borderRadius: '30px',
        fontSize: '0.75rem',
        fontWeight: 500
      }}>
        <Icon size={10} />
        {label}
      </span>
    );
  };

  // Format date to relative time
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format full date
  const formatFullDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get pulse level color
  const getPulseColor = (level?: number) => {
    if (!level) return null;
    if (level >= 4) return '#dc3545';
    if (level >= 2.5) return '#F4A261';
    return '#2EC4B6';
  };

  const getPulseBg = (level?: number) => {
    if (!level) return null;
    if (level >= 4) return '#FFE5E5';
    if (level >= 2.5) return '#FEF7E9';
    return '#E8F6F4';
  };

  // Filter and sort sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = 
        session.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (session.user_email && session.user_email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof TransformedSession];
      let bVal: any = b[sortField as keyof TransformedSession];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

  // Stats
  const waitingCount = sessions.filter(s => s.status === 'waiting').length;
  const activeCount = sessions.filter(s => s.status === 'active').length;
  const pendingCount = sessions.filter(s => s.status === 'pending').length;
  const completedCount = sessions.filter(s => s.status === 'ended').length;

  // Render overview section
  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Quick Stats Cards */}
      <Row className="g-3 g-md-4 mb-4">
        <Col xs={6} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-0 h-100" style={{ 
              borderRadius: 'clamp(16px, 2vw, 24px)',
              background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
              boxShadow: '0 10px 30px rgba(46, 196, 182, 0.2)'
            }}>
              <Card.Body className="p-3 p-md-4 text-white">
                <div className="d-flex align-items-center justify-content-between mb-2 mb-md-3">
                  <FiActivity size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>
                    {activeCount}
                  </Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{activeCount}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Active Sessions</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>Currently counseling</small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col xs={6} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-0 h-100" style={{ 
              borderRadius: 'clamp(16px, 2vw, 24px)',
              background: 'linear-gradient(135deg, #F4A261 0%, #F6B87E 100%)',
              boxShadow: '0 10px 30px rgba(244, 162, 97, 0.2)'
            }}>
              <Card.Body className="p-3 p-md-4 text-white">
                <div className="d-flex align-items-center justify-content-between mb-2 mb-md-3">
                  <FiClock size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>
                    {waitingCount}
                  </Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{waitingCount}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Waiting List</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>Ready for activation</small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col xs={6} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-0 h-100" style={{ 
              borderRadius: 'clamp(16px, 2vw, 24px)',
              background: 'linear-gradient(135deg, #8A9D9A 0%, #9FB7B0 100%)',
              boxShadow: '0 10px 30px rgba(138, 157, 154, 0.2)'
            }}>
              <Card.Body className="p-3 p-md-4 text-white">
                <div className="d-flex align-items-center justify-content-between mb-2 mb-md-3">
                  <FiCheckCircle size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>
                    {completedCount}
                  </Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{completedCount}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Completed</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>Total sessions</small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
        <Col xs={6} md={3}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="border-0 h-100" style={{ 
              borderRadius: 'clamp(16px, 2vw, 24px)',
              background: 'linear-gradient(135deg, #2D3F3B 0%, #4A5F5A 100%)',
              boxShadow: '0 10px 30px rgba(45, 63, 59, 0.2)'
            }}>
              <Card.Body className="p-3 p-md-4 text-white">
                <div className="d-flex align-items-center justify-content-between mb-2 mb-md-3">
                  <FiTrendingUp size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>
                    {pendingCount}
                  </Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{pendingCount}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Pending</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>Awaiting response</small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 20px)', backgroundColor: '#F9FCFB' }}>
            <Card.Body className="p-2 p-md-3">
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <Button
                  variant="light"
                  className="rounded-pill d-inline-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 py-2"
                  style={{ backgroundColor: 'white', border: '1px solid #EDF1F0', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <FiRefreshCw className={refreshing ? 'spinning' : ''} style={{ color: '#2EC4B6' }} size={window.innerWidth < 768 ? 14 : 16} /> 
                  <span className="d-none d-sm-inline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                  <span className="d-sm-none">Refresh</span>
                </Button>
                <Button
                  variant="light"
                  className="rounded-pill d-inline-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 py-2"
                  style={{ backgroundColor: 'white', border: '1px solid #EDF1F0', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
                  onClick={() => handleTabChange('chat')}
                >
                  <FiMessageSquare style={{ color: '#F4A261' }} size={window.innerWidth < 768 ? 14 : 16} /> 
                  <span className="d-none d-sm-inline">Messages</span>
                  <span className="d-sm-none">Chat</span>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );

  // Render sessions table
  const renderSessionsTable = () => (
    <Card className="border-0" style={{ 
      borderRadius: 'clamp(16px, 2vw, 24px)', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      overflow: 'hidden'
    }}>
      <Card.Body className="p-3 p-md-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <div style={{
              width: window.innerWidth < 768 ? '36px' : '48px',
              height: window.innerWidth < 768 ? '36px' : '48px',
              borderRadius: window.innerWidth < 768 ? '12px' : '16px',
              background: 'linear-gradient(135deg, #E8F6F4 0%, #D4F0EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiActivity style={{ color: '#2EC4B6' }} size={window.innerWidth < 768 ? 18 : 24} />
            </div>
            <div>
              <h5 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>
                Session Management
              </h5>
              <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                {waitingCount} waiting · {activeCount} active · {pendingCount} pending · {completedCount} ended
              </p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <div style={{ position: 'relative', width: window.innerWidth < 768 ? '100%' : '250px' }}>
              <FiSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8A9D9A',
                fontSize: window.innerWidth < 768 ? '14px' : '16px'
              }} />
              <input
                type="text"
                placeholder="Search by user or session..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: window.innerWidth < 768 ? '8px 12px 8px 36px' : '10px 16px 10px 44px',
                  borderRadius: '40px',
                  border: '1px solid #EDF1F0',
                  backgroundColor: '#F9FCFB',
                  fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem'
                }}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: window.innerWidth < 768 ? '8px 12px' : '10px 16px',
                borderRadius: '40px',
                border: '1px solid #EDF1F0',
                backgroundColor: '#F9FCFB',
                color: '#2D3F3B',
                fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
                cursor: 'pointer',
                minWidth: window.innerWidth < 768 ? '90px' : '120px'
              }}
            >
              <option value="all">All Sessions</option>
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Sessions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            minWidth: window.innerWidth < 768 ? '1000px' : '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#F4F8F6' }}>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('username')}>
                  <div className="d-flex align-items-center gap-2">
                    <FiUser size={14} style={{ color: '#8A9D9A' }} />
                    <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>User</span>
                    {sortField === 'username' && <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Age Group</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Pulse</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  <div className="d-flex align-items-center gap-2">
                    <FiActivity size={14} style={{ color: '#8A9D9A' }} />
                    <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Status</span>
                    {sortField === 'status' && <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                  <div className="d-flex align-items-center gap-2">
                    <FiClock size={14} style={{ color: '#8A9D9A' }} />
                    <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Requested</span>
                    {sortField === 'created_at' && <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Session ID</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredSessions.map((session, index) => {
                  const pulseColor = getPulseColor(session.user_pulse_level);
                  const pulseBg = getPulseBg(session.user_pulse_level);
                  
                  return (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      style={{ 
                        borderBottom: '1px solid #EDF1F0',
                        backgroundColor: session.status === 'waiting' ? '#FEF7E9' : 'transparent'
                      }}
                      whileHover={{ backgroundColor: '#F9FCFB' }}
                    >
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        <div className="d-flex align-items-center gap-2 gap-md-3">
                          <div style={{
                            width: window.innerWidth < 768 ? '32px' : '40px',
                            height: window.innerWidth < 768 ? '32px' : '40px',
                            borderRadius: window.innerWidth < 768 ? '8px' : '12px',
                            background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
                          }}>
                            {session.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-500" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem' }}>
                              {session.username}
                            </div>
                            <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>
                              ID: {session.user_id.slice(0, 8)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                        {session.user_age_group?.replace('_', '-') || 'N/A'}
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        {session.user_pulse_level ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: window.innerWidth < 768 ? '2px' : '4px',
                            padding: window.innerWidth < 768 ? '2px 6px' : '4px 10px',
                            borderRadius: '30px',
                            backgroundColor: pulseBg,
                            color: pulseColor,
                            fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem',
                            fontWeight: 500
                          }}>
                            <FiActivity size={window.innerWidth < 768 ? 8 : 10} />
                            {session.user_pulse_level.toFixed(1)}
                          </div>
                        ) : (
                          <span style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        {getStatusBadge(session.status)}
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        <div className="d-flex align-items-center gap-1 gap-md-2">
                          <FiClock size={window.innerWidth < 768 ? 10 : 12} style={{ color: '#8A9D9A' }} />
                          <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>
                            {formatDate(session.created_at)}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <code style={{ 
                            backgroundColor: '#F4F8F6', 
                            padding: '4px 8px', 
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#5F6F6C'
                          }}>
                            {session.id.slice(0, 8)}...
                          </code>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-light rounded-circle p-1"
                            style={{ width: '24px', height: '24px' }}
                            onClick={() => handleCopySessionId(session.id)}
                            title="Copy Session ID"
                          >
                            <FiCopy size={12} style={{ color: '#2EC4B6' }} />
                          </motion.button>
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                        <div className="d-flex gap-1 gap-md-2 justify-content-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-light rounded-circle p-1 p-md-2"
                            style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                            onClick={() => handleViewSession(session)}
                            title="View Session Details"
                          >
                            <FiEye size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#2EC4B6' }} />
                          </motion.button>
                          
                          {session.status === 'active' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="btn btn-light rounded-circle p-1 p-md-2"
                                style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                                onClick={() => handleJoinSession(session.id)}
                                title="Join Session"
                              >
                                <FiMessageSquare size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#2EC4B6' }} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="btn btn-light rounded-circle p-1 p-md-2"
                                style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                                onClick={() => handleOpenEndSession(session)}
                                title="End Session"
                              >
                                <FiStopCircle size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#dc3545' }} />
                              </motion.button>
                            </>
                          )}
                          
                          {session.status === 'waiting' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-light rounded-circle p-1 p-md-2"
                              style={{ 
                                width: window.innerWidth < 768 ? '28px' : '32px', 
                                height: window.innerWidth < 768 ? '28px' : '32px',
                                backgroundColor: '#2EC4B6',
                                border: 'none'
                              }}
                              onClick={() => handleActivateSession(session.id)}
                              disabled={activatingId === session.id}
                              title="Activate Session"
                            >
                              {activatingId === session.id ? (
                                <span className="spinner-border spinner-border-sm" style={{ color: 'white' }} />
                              ) : (
                                <FiPlay size={window.innerWidth < 768 ? 12 : 14} style={{ color: 'white' }} />
                              )}
                            </motion.button>
                          )}
                          
                          {session.status === 'pending' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-light rounded-circle p-1 p-md-2"
                              style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                              onClick={() => handleMessageUser(session.user_id)}
                              title="Message User"
                            >
                              <FiMessageSquare size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#F4A261' }} />
                            </motion.button>
                          )}
                          
                          <Dropdown>
                            <Dropdown.Toggle variant="light" className="rounded-circle p-1 p-md-2" style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px', background: 'transparent', border: 'none' }}>
                              <FiMoreVertical size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#8A9D9A' }} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewUser(session.user_id)}>
                                <FiUser className="me-2" /> View User Profile
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleOpenNotes(session)}>
                                <FiEdit2 className="me-2" /> {session.notes ? 'Edit Notes' : 'Add Notes'}
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleCopySessionId(session.id)}>
                                <FiCopy className="me-2" /> Copy Session ID
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredSessions.length === 0 && !loading && (
          <div className="text-center py-4 py-md-5">
            <div style={{
              width: window.innerWidth < 768 ? '60px' : '80px',
              height: window.innerWidth < 768 ? '60px' : '80px',
              borderRadius: '50%',
              backgroundColor: '#F4F8F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FiActivity size={window.innerWidth < 768 ? 24 : 32} style={{ color: '#8A9D9A' }} />
            </div>
            <h6 style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>No sessions found</h6>
            <p style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem' }}>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Table Footer */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 mt-md-4 pt-2" style={{ borderTop: '1px solid #EDF1F0' }}>
          <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem', marginBottom: window.innerWidth < 768 ? '8px' : 0 }}>
            Showing {filteredSessions.length} of {sessions.length} sessions
          </small>
          <div className="d-flex gap-2">
            <span className="badge" style={{
              backgroundColor: '#FEF7E9',
              color: '#F4A261',
              padding: window.innerWidth < 768 ? '4px 8px' : '6px 12px',
              borderRadius: '30px',
              fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem'
            }}>
              {waitingCount} waiting
            </span>
            <span className="badge" style={{
              backgroundColor: '#E8F6F4',
              color: '#2EC4B6',
              padding: window.innerWidth < 768 ? '4px 8px' : '6px 12px',
              borderRadius: '30px',
              fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem'
            }}>
              {activeCount} active
            </span>
            <span className="badge" style={{
              backgroundColor: '#F4F8F6',
              color: '#5F6F6C',
              padding: window.innerWidth < 768 ? '4px 8px' : '6px 12px',
              borderRadius: '30px',
              fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem'
            }}>
              {completedCount} completed
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Render content based on tab
  const renderContent = () => {
    switch (activeTab) {
      case 'sessions':
        return (
          <div className="space-y-4">
            {renderSessionsTable()}
          </div>
        );
      case 'chat':
        return (
          <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 24px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <Card.Body className="p-3 p-md-4">
              <ChatModule />
            </Card.Body>
          </Card>
        );
      case 'profile':
        return (
          <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 24px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <Card.Body className="p-3 p-md-4">
              <ProfileSection />
            </Card.Body>
          </Card>
        );
      default:
        return (
          <>
            {renderOverview()}
            <Row className="mt-4 g-3 g-md-4">
              <Col xs={12}>
                <Card className="border-0" style={{ 
                  borderRadius: 'clamp(16px, 2vw, 24px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                }}>
                  <Card.Body className="p-3 p-md-4">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="d-flex align-items-center gap-2 gap-md-3">
                        <div style={{
                          width: window.innerWidth < 768 ? '36px' : '48px',
                          height: window.innerWidth < 768 ? '36px' : '48px',
                          borderRadius: window.innerWidth < 768 ? '12px' : '16px',
                          background: 'linear-gradient(135deg, #E8F6F4 0%, #D4F0EB 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FiUsers size={window.innerWidth < 768 ? 18 : 24} style={{ color: '#2EC4B6' }} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1" style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>Recent Sessions</h5>
                          <p className="text-secondary small mb-0">
                            Showing latest 5 sessions
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="text-primary-teal fw-600 text-decoration-none"
                        onClick={() => handleTabChange('sessions')}
                      >
                        View All <FiArrowRight className="ms-1" />
                      </Button>
                    </div>

                    {/* Compact Table for Dashboard */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ 
                        width: '100%', 
                        minWidth: window.innerWidth < 768 ? '600px' : '100%',
                        borderCollapse: 'collapse'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F4F8F6' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Requested</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Pulse</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.slice(0, 5).map((session) => (
                            <tr key={session.id} style={{ borderBottom: '1px solid #EDF1F0' }}>
                              <td style={{ padding: '12px' }}>
                                <div className="d-flex align-items-center gap-2">
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: '#2EC4B6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                  }}>
                                    {session.username.charAt(0)}
                                  </div>
                                  <span style={{ fontSize: '0.9rem' }}>{session.username}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px' }}>
                                {getStatusBadge(session.status)}
                              </td>
                              <td style={{ padding: '12px', fontSize: '0.85rem', color: '#5F6F6C' }}>
                                {formatDate(session.created_at)}
                              </td>
                              <td style={{ padding: '12px' }}>
                                {session.user_pulse_level ? (
                                  <span style={{ 
                                    color: getPulseColor(session.user_pulse_level),
                                    fontWeight: 500
                                  }}>
                                    {session.user_pulse_level.toFixed(1)}
                                  </span>
                                ) : '—'}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                {session.status === 'waiting' ? (
                                  <Button
                                    size="sm"
                                    style={{
                                      backgroundColor: '#2EC4B6',
                                      border: 'none',
                                      borderRadius: '20px',
                                      padding: '4px 12px',
                                      fontSize: '0.75rem'
                                    }}
                                    onClick={() => handleActivateSession(session.id)}
                                    disabled={activatingId === session.id}
                                  >
                                    {activatingId === session.id ? '...' : 'Activate'}
                                  </Button>
                                ) : session.status === 'active' ? (
                                  <div className="d-flex gap-1 justify-content-center">
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      style={{
                                        borderRadius: '20px',
                                        padding: '4px 8px',
                                        fontSize: '0.7rem',
                                        borderColor: '#2EC4B6',
                                        color: '#2EC4B6'
                                      }}
                                      onClick={() => handleJoinSession(session.id)}
                                    >
                                      Join
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-danger"
                                      style={{
                                        borderRadius: '20px',
                                        padding: '4px 8px',
                                        fontSize: '0.7rem',
                                        borderColor: '#dc3545',
                                        color: '#dc3545'
                                      }}
                                      onClick={() => handleOpenEndSession(session)}
                                    >
                                      End
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="link"
                                    style={{ fontSize: '0.75rem', color: '#8A9D9A' }}
                                    onClick={() => handleViewSession(session)}
                                  >
                                    View
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Mobile Menu Toggle */}
      <div className="d-lg-none mb-3">
        <Button
          variant="light"
          className="d-flex align-items-center gap-2 w-100 justify-content-between"
          style={{ backgroundColor: '#F4F8F6', border: '1px solid #EDF1F0', borderRadius: '12px' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="fw-semibold">Menu</span>
          <FiMoreVertical />
        </Button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 mb-md-4"
      >
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <div style={{
            width: window.innerWidth < 768 ? '44px' : '56px',
            height: window.innerWidth < 768 ? '44px' : '56px',
            borderRadius: window.innerWidth < 768 ? '14px' : '18px',
            background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(46, 196, 182, 0.2)'
          }}>
            <FiUserCheck size={window.innerWidth < 768 ? 20 : 24} color="white" />
          </div>
          <div>
            <h2 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1.3rem' : '1.8rem' }}>
              Counselor Dashboard
            </h2>
            <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
              Manage your sessions and support your clients
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="mb-3 mb-md-4" style={{ borderBottom: '1px solid #EDF1F0', overflowX: 'auto' }}>
        <div className="d-flex gap-1 gap-md-2" style={{ minWidth: '400px' }}>
          {[
            { key: 'overview', label: 'Overview', icon: FiPieChart },
            { key: 'sessions', label: 'Sessions', icon: FiActivity },
            { key: 'chat', label: 'Messages', icon: FiMessageSquare },
            { key: 'profile', label: 'Profile', icon: FiSettings }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              style={{
                padding: window.innerWidth < 768 ? '8px 16px' : '12px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === item.key ? '3px solid #2EC4B6' : '3px solid transparent',
                color: activeTab === item.key ? '#2EC4B6' : '#8A9D9A',
                fontSize: window.innerWidth < 768 ? '0.8rem' : '0.95rem',
                fontWeight: activeTab === item.key ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: window.innerWidth < 768 ? '4px' : '8px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <item.icon size={window.innerWidth < 768 ? 14 : 16} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {renderContent()}
      </div>

      {/* Session Details Modal */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <div className="p-2">
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <label className="text-secondary small mb-2">User Information</label>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: '#2EC4B6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.2rem'
                      }}>
                        {selectedSession.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">{selectedSession.username}</h6>
                        <small className="text-secondary">{selectedSession.user_email}</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-secondary small">Age Group</label>
                    <p className="mb-0">{selectedSession.user_age_group?.replace('_', '-') || 'N/A'}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-secondary small">Pulse Level</label>
                    <p className="mb-0">
                      {selectedSession.user_pulse_level ? (
                        <span style={{ color: getPulseColor(selectedSession.user_pulse_level) }}>
                          {selectedSession.user_pulse_level.toFixed(1)}
                        </span>
                      ) : 'N/A'}
                    </p>
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="mb-4">
                    <label className="text-secondary small mb-2">Session Information</label>
                    <div className="p-3 bg-light rounded-3" style={{ backgroundColor: '#F4F8F6' }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-secondary">Status</span>
                        <span>{getStatusBadge(selectedSession.status)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-secondary">Session ID</span>
                        <div className="d-flex align-items-center gap-2">
                          <code className="small">{selectedSession.id}</code>
                          <FiCopy 
                            size={14} 
                            style={{ color: '#2EC4B6', cursor: 'pointer' }}
                            onClick={() => handleCopySessionId(selectedSession.id)}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-secondary">Created</span>
                        <span className="small">{formatFullDate(selectedSession.created_at)}</span>
                      </div>
                      {selectedSession.scheduled_at && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-secondary">Scheduled</span>
                          <span className="small">{formatFullDate(selectedSession.scheduled_at)}</span>
                        </div>
                      )}
                      {selectedSession.completed_at && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="small text-secondary">Completed</span>
                          <span className="small">{formatFullDate(selectedSession.completed_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-secondary small">Notes</label>
                    <p className="p-3 bg-light rounded-3" style={{ backgroundColor: '#F4F8F6', minHeight: '80px' }}>
                      {selectedSession.notes || 'No notes added yet'}
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #EDF1F0' }}>
          <Button variant="secondary" onClick={() => setShowSessionModal(false)}>
            Close
          </Button>
          <Button 
            style={{ backgroundColor: '#2EC4B6', border: 'none' }}
            onClick={() => {
              setShowSessionModal(false);
              if (selectedSession) {
                if (selectedSession.status === 'active') {
                  handleJoinSession(selectedSession.id);
                } else if (selectedSession.status === 'waiting') {
                  handleActivateSession(selectedSession.id);
                } else {
                  handleMessageUser(selectedSession.user_id);
                }
              }
            }}
          >
            {selectedSession?.status === 'active' ? 'Join Session' :
             selectedSession?.status === 'waiting' ? 'Activate Session' : 'Message User'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* End Session Confirmation Modal */}
      <Modal show={showEndSessionModal} onHide={() => setShowEndSessionModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>End Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <FiAlertCircle size={48} style={{ color: '#dc3545' }} />
          </div>
          <p className="text-center mb-2">Are you sure you want to end this session?</p>
          {selectedSession && (
            <p className="text-center text-secondary small">
              Session with <strong>{selectedSession.username}</strong> will be marked as completed.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #EDF1F0' }}>
          <Button variant="secondary" onClick={() => setShowEndSessionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={handleEndSession}
            disabled={endingId === selectedSession?.id}
          >
            {endingId === selectedSession?.id ? 'Ending...' : 'End Session'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notes Modal */}
      <Modal show={showNotesModal} onHide={() => setShowNotesModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>{selectedSession?.notes ? 'Edit Notes' : 'Add Notes'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="small text-secondary">Session Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add your session notes here..."
              style={{ borderRadius: '12px', resize: 'none' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #EDF1F0' }}>
          <Button variant="secondary" onClick={() => setShowNotesModal(false)}>
            Cancel
          </Button>
          <Button 
            style={{ backgroundColor: '#2EC4B6', border: 'none' }}
            onClick={handleAddNotes}
          >
            Save Notes
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
        
        /* Table hover effects */
        tbody tr {
          transition: all 0.2s ease;
        }
        tbody tr:hover {
          background-color: #F9FCFB;
        }
        
        /* Responsive text */
        @media (max-width: 576px) {
          h2 { font-size: 1.3rem; }
          h5 { font-size: 1rem; }
          p { font-size: 0.8rem; }
          small { font-size: 0.65rem; }
        }
        
        /* Card hover effects */
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 15px 40px rgba(0,0,0,0.08) !important;
        }
        
        .fw-mono {
          font-family: monospace;
        }
      `}</style>
    </DashboardLayout>
  );
};