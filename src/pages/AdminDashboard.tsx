import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Form, Modal, Dropdown, Container } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { ProfileSection } from '../components/Dashboard/ProfileSection';
import { UserSessionTable, UserSessionRow } from '../components/Dashboard/useSessionRow';
import { CounselorRegistrationModal } from '../components/Modal/CounselorRegistrationModal';
import { 
  FiUsers, 
  FiUserCheck, 
  FiShield, 
  FiActivity, 
  FiSettings, 
  FiServer, 
  FiRefreshCw,
  FiTrash2,
  FiEdit2,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
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
  FiAward,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface SystemMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}

interface Counselor {
  id: string;
  username: string;
  email?: string;
  specialties: string[];
  is_online: boolean;
  session_count: number;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
  joined_at: string;
  last_active?: string;
  avatar?: string;
  bio?: string;
  languages?: string[];
  experience_years?: number;
  verified?: boolean;
}

export const AdminDashboard: React.FC = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  
  // State
  const [userSessions, setUserSessions] = useState<UserSessionRow[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCounselorModal, setShowCounselorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCounselorRegModal, setShowCounselorRegModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch functions
  const fetchSessions = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const sessions: UserSessionRow[] = response.data.map((item: any) => ({
        user_id: item.user_id,
        username: `User ${item.user_id.slice(0, 4)}`,
        age_group: 'Unknown',
        last_seen: item.updated_at || null,
        pulse_level: item.initial_pulse || null,
        session_id: item.id || item.session_id,
        status: item.status,
        counselor_id: item.counselor_id || 'unassigned'
      }));
      
      setUserSessions(sessions);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchCounselors = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/counselors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Transform API data to match Counselor interface
      const transformed: Counselor[] = response.data.map((item: any) => ({
        id: item.id || item.counselor_id,
        username: item.username,
        email: item.email,
        specialties: item.specialties || ['General Counseling'],
        is_online: item.is_online || false,
        session_count: item.session_count || 0,
        rating: item.rating || 4.5,
        status: item.status || 'active',
        joined_at: item.created_at || item.joined_at,
        last_active: item.last_active,
        bio: item.bio || 'Licensed professional counselor',
        languages: item.languages || ['English'],
        experience_years: item.experience_years || Math.floor(Math.random() * 10) + 2,
        verified: item.verified || true
      }));
      
      setCounselors(transformed);
    } catch (error: any) {
      console.error('Error fetching counselors:', error);
      toast.error('Failed to load counselors');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSessions(),
        fetchUsers(),
        fetchCounselors()
      ]);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (tab === 'sessions' || !tab) fetchSessions();
    if (tab === 'users') fetchUsers();
    if (tab === 'counselors') fetchCounselors();
    setActiveTab(tab || 'overview');
  }, [tab]);

  // Handlers
  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      fetchSessions(),
      fetchUsers(),
      fetchCounselors()
    ]).finally(() => setRefreshing(false));
  };

  const handleAutoAssignSession = async (sessionId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Auto-assigning session...');
      await axios.post(`${API_BASE_URL}/sessions/auto-assign/${sessionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Session auto-assigned successfully', { id: loadingToast });
      fetchSessions();
    } catch (error: any) {
      console.error('Error assigning session:', error);
      toast.error(error.response?.data?.message || 'Failed to auto-assign session');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Deleting user...');
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully', { id: loadingToast });
      setUsers(users.filter(u => u.user_id !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteCounselor = async (counselorId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Deleting counselor...');
      await axios.delete(`${API_BASE_URL}/counselors/${counselorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Counselor deleted successfully', { id: loadingToast });
      setCounselors(counselors.filter(c => c.id !== counselorId));
    } catch (error: any) {
      console.error('Error deleting counselor:', error);
      toast.error(error.response?.data?.message || 'Failed to delete counselor');
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Updating user...');
      await axios.put(`${API_BASE_URL}/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User updated successfully', { id: loadingToast });
      setShowUserModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleUpdateCounselor = async (counselorId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const loadingToast = toast.loading('Updating counselor...');
      await axios.put(`${API_BASE_URL}/counselors/${counselorId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Counselor updated successfully', { id: loadingToast });
      setShowCounselorModal(false);
      fetchCounselors();
    } catch (error: any) {
      console.error('Error updating counselor:', error);
      toast.error(error.response?.data?.message || 'Failed to update counselor');
    }
  };

  const handleToggleCounselorStatus = async (counselorId: string, currentStatus: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.patch(`${API_BASE_URL}/counselors/${counselorId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Counselor ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      fetchCounselors();
    } catch (error: any) {
      toast.error('Failed to update counselor status');
    }
  };

  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewCounselor = (counselorId: string) => {
    const counselor = counselors.find(c => c.id === counselorId);
    setSelectedCounselor(counselor || null);
    setShowCounselorModal(true);
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/dashboard/admin/sessions/${sessionId}`);
  };

  const handleCounselorRegistered = (newCounselor: any) => {
    fetchCounselors();
    toast.success('Counselor registered successfully!');
  };

  const exportData = (type: 'users' | 'sessions' | 'counselors') => {
    let data: any[] = [];
    let filename = '';
    
    switch(type) {
      case 'users':
        data = users;
        filename = 'users-export';
        break;
      case 'sessions':
        data = userSessions;
        filename = 'sessions-export';
        break;
      case 'counselors':
        data = counselors;
        filename = 'counselors-export';
        break;
    }

    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).map(val => 
      typeof val === 'string' ? `"${val}"` : val
    ).join(','));
    
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get all unique specialties for filter
  const allSpecialties = Array.from(
    new Set(counselors.flatMap(c => c.specialties))
  ).sort();

  const filteredCounselors = counselors
    .filter(c => 
      (filterStatus === 'all' || c.status === filterStatus) &&
      (filterSpecialty === 'all' || c.specialties.includes(filterSpecialty)) &&
      (c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
       c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       c.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      let aVal = a[sortField as keyof Counselor];
      let bVal = b[sortField as keyof Counselor];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCounselors = filteredCounselors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCounselors.length / itemsPerPage);

  const filteredUsers = users
    .filter(user =>
      (filterStatus === 'all' || user.status === filterStatus) &&
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return 0;
    });

  // Responsive system health cards
  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* System Health Overview Cards - Responsive grid */}
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
                  <FiServer size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>Live</Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>99.9%</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Uptime</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>Last 30 days</small>
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
                  <FiUsers size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>Active</Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{users.length}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Total Users</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>+12% this month</small>
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
                  <FiActivity size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>{userSessions.length}</Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{userSessions.filter(s => s.status === 'active').length}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Active Sessions</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>{userSessions.filter(s => s.status === 'pending').length} pending</small>
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
                  <FiUserCheck size={window.innerWidth < 768 ? 18 : 24} />
                  <Badge bg="light" text="dark" className="rounded-pill px-2 py-1 px-md-3 py-md-2" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>{counselors.length}</Badge>
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>{counselors.filter(c => c.is_online).length}</h3>
                <p className="mb-0 opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>Online Counselors</p>
                <small className="opacity-75" style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>{counselors.length} total</small>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Quick Actions - Responsive */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 20px)', backgroundColor: '#F9FCFB' }}>
            <Card.Body className="p-2 p-md-3">
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <Button
                  variant="light"
                  className="rounded-pill d-inline-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 py-2"
                  style={{ backgroundColor: 'white', border: '1px solid #EDF1F0', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
                  onClick={() => setShowCounselorRegModal(true)}
                >
                  <FiUserPlus style={{ color: '#2EC4B6' }} size={window.innerWidth < 768 ? 14 : 16} /> 
                  <span className="d-none d-sm-inline">Add Counselor</span>
                  <span className="d-sm-none">Add</span>
                </Button>
                <Button
                  variant="light"
                  className="rounded-pill d-inline-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 py-2"
                  style={{ backgroundColor: 'white', border: '1px solid #EDF1F0', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
                  onClick={() => exportData('users')}
                >
                  <FiDownload style={{ color: '#F4A261' }} size={window.innerWidth < 768 ? 14 : 16} /> 
                  <span className="d-none d-sm-inline">Export Data</span>
                  <span className="d-sm-none">Export</span>
                </Button>
                <Button
                  variant="light"
                  className="rounded-pill d-inline-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 py-2"
                  style={{ backgroundColor: 'white', border: '1px solid #EDF1F0', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <FiRefreshCw className={refreshing ? 'spinning' : ''} style={{ color: '#2EC4B6' }} size={window.innerWidth < 768 ? 14 : 16} /> 
                  <span className="d-none d-sm-inline">{refreshing ? 'Refreshing...' : 'Refresh All'}</span>
                  <span className="d-sm-none">Refresh</span>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );

  const renderUsers = () => (
    <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 24px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <Card.Body className="p-3 p-md-4">
        {/* Header - Responsive */}
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
              <FiUsers style={{ color: '#2EC4B6' }} size={window.innerWidth < 768 ? 18 : 24} />
            </div>
            <div>
              <h5 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>User Management</h5>
              <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                {users.length} total users · {users.filter(u => u.is_online).length} online now
              </p>
            </div>
          </div>

          {/* Search and Filter - Responsive */}
          <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
            <div style={{ position: 'relative', minWidth: window.innerWidth < 768 ? '100%' : '250px' }}>
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
                placeholder="Search users..."
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
          </div>
        </div>

        {/* Users Table - Horizontal scroll on mobile */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            minWidth: window.innerWidth < 768 ? '800px' : '100%',
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
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Contact</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Age Group</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Pulse</span>
                </th>
                <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                  <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem', fontWeight: 600 }}>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.slice(0, 5).map((user, index) => (
                  <motion.tr
                    key={user.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.03 }}
                    style={{ borderBottom: '1px solid #EDF1F0' }}
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
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-500" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem' }}>{user.username}</div>
                          <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem' }}>ID: {user.user_id?.slice(0, 6)}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                      {user.email && <small style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>{user.email}</small>}
                    </td>
                    <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.85rem' }}>
                      {user.age_group?.replace('_', '-') || 'N/A'}
                    </td>
                    <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                      {user.pulse_level ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: window.innerWidth < 768 ? '2px 8px' : '4px 12px',
                          borderRadius: '30px',
                          backgroundColor: user.pulse_level >= 4 ? '#FFE5E5' : 
                                         user.pulse_level >= 2.5 ? '#FEF7E9' : '#E8F6F4',
                          color: user.pulse_level >= 4 ? '#dc3545' :
                                 user.pulse_level >= 2.5 ? '#F4A261' : '#2EC4B6',
                          fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem',
                          fontWeight: 500
                        }}>
                          <FiActivity size={window.innerWidth < 768 ? 8 : 10} />
                          {user.pulse_level.toFixed(1)}
                        </div>
                      ) : <span style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                      <div className="d-flex gap-1 gap-md-2 justify-content-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-light rounded-circle p-1 p-md-2"
                          style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                          onClick={() => handleViewUser(user.user_id)}
                        >
                          <FiEye size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#2EC4B6' }} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-light rounded-circle p-1 p-md-2"
                          style={{ width: window.innerWidth < 768 ? '28px' : '32px', height: window.innerWidth < 768 ? '28px' : '32px' }}
                          onClick={() => {
                            setUserToDelete(user.user_id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FiTrash2 size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#dc3545' }} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
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
              <FiUsers size={window.innerWidth < 768 ? 24 : 32} style={{ color: '#8A9D9A' }} />
            </div>
            <h6 style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>No users found</h6>
            <p style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem' }}>Try adjusting your search criteria</p>
          </div>
        )}

        {/* Table Footer */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 mt-md-4 pt-2" style={{ borderTop: '1px solid #EDF1F0' }}>
          <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem', marginBottom: window.innerWidth < 768 ? '8px' : 0 }}>
            Showing {filteredUsers.slice(0, 5).length} of {users.length} users
          </small>
          <Button
            variant="link"
            size="sm"
            className="text-decoration-none d-flex align-items-center gap-1"
            style={{ color: '#2EC4B6', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem' }}
            onClick={() => navigate('/dashboard/admin/users')}
          >
            View All Users <FiChevronRight />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const renderCounselors = () => (
    <Card className="border-0 h-100" style={{ borderRadius: 'clamp(16px, 2vw, 24px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <Card.Body className="p-3 p-md-4">
        {/* Header - Responsive */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-2 gap-md-3">
            <div style={{
              width: window.innerWidth < 768 ? '36px' : '48px',
              height: window.innerWidth < 768 ? '36px' : '48px',
              borderRadius: window.innerWidth < 768 ? '12px' : '16px',
              background: 'linear-gradient(135deg, #FEF7E9 0%, #FDEFD9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiUserCheck style={{ color: '#F4A261' }} size={window.innerWidth < 768 ? 18 : 24} />
            </div>
            <div>
              <h5 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>Counselor Management</h5>
              <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                {counselors.length} total · {counselors.filter(c => c.is_online).length} online now
              </p>
            </div>
          </div>

          {/* View Toggle and Add Button */}
          <div className="d-flex gap-2 w-100 w-md-auto">
            <div className="d-flex bg-light rounded-pill p-1" style={{ backgroundColor: '#F4F8F6' }}>
              <Button
                variant="link"
                className={`rounded-pill p-2 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                style={{ color: viewMode === 'grid' ? '#2EC4B6' : '#8A9D9A' }}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid size={window.innerWidth < 768 ? 14 : 16} />
              </Button>
              <Button
                variant="link"
                className={`rounded-pill p-2 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                style={{ color: viewMode === 'list' ? '#2EC4B6' : '#8A9D9A' }}
                onClick={() => setViewMode('list')}
              >
                <FiList size={window.innerWidth < 768 ? 14 : 16} />
              </Button>
            </div>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-1 gap-md-2 px-3 px-md-4 rounded-pill"
              style={{ 
                background: 'linear-gradient(135deg, #2EC4B6 0%, #4FD1C5 100%)',
                border: 'none',
                fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                whiteSpace: 'nowrap'
              }}
              onClick={() => setShowCounselorRegModal(true)}
            >
              <FiUserPlus size={window.innerWidth < 768 ? 14 : 16} />
              <span className="d-none d-sm-inline">Add Counselor</span>
              <span className="d-sm-none">Add</span>
            </Button>
          </div>
        </div>

        {/* Search and Filters - Responsive */}
        <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 mb-4">
          <div style={{ position: 'relative', flex: 1 }}>
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
              placeholder="Search counselors by name, email, or specialty..."
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
          <div className="d-flex gap-2">
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              style={{
                padding: window.innerWidth < 768 ? '8px 12px' : '10px 16px',
                borderRadius: '40px',
                border: '1px solid #EDF1F0',
                backgroundColor: '#F9FCFB',
                color: '#2D3F3B',
                fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem',
                cursor: 'pointer',
                minWidth: window.innerWidth < 768 ? '90px' : '140px'
              }}
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Counselors Display - Grid or List View */}
        {viewMode === 'grid' ? (
          <>
            <Row className="g-3 g-md-4">
              <AnimatePresence>
                {currentCounselors.map((counselor, index) => (
                  <Col xs={12} sm={6} lg={4} key={counselor.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      style={{ height: '100%' }}
                    >
                      <Card className="border-0 h-100" style={{ 
                        borderRadius: '20px',
                        border: '1px solid #EDF1F0',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden'
                      }}>
                        {/* Status Bar */}
                        <div style={{
                          height: '4px',
                          background: counselor.status === 'active' 
                            ? 'linear-gradient(90deg, #2EC4B6, #4FD1C5)'
                            : counselor.status === 'suspended'
                            ? 'linear-gradient(90deg, #dc3545, #ff6b6b)'
                            : 'linear-gradient(90deg, #8A9D9A, #B0C0BD)'
                        }} />

                        <Card.Body className="p-3 p-md-4">
                          {/* Header Badges */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <Badge style={{
                              backgroundColor: counselor.is_online ? '#E8F6F4' : '#F4F8F6',
                              color: counselor.is_online ? '#2EC4B6' : '#8A9D9A',
                              padding: window.innerWidth < 768 ? '4px 8px' : '6px 12px',
                              borderRadius: '30px',
                              fontSize: window.innerWidth < 768 ? '0.65rem' : '0.7rem',
                              fontWeight: 500
                            }}>
                              {counselor.is_online ? '● Online' : '○ Offline'}
                            </Badge>
                            {counselor.verified && (
                              <Badge style={{
                                backgroundColor: '#E8F6F4',
                                color: '#2EC4B6',
                                padding: window.innerWidth < 768 ? '4px 8px' : '6px 12px',
                                borderRadius: '30px',
                                fontSize: window.innerWidth < 768 ? '0.65rem' : '0.7rem'
                              }}>
                                <FiCheckCircle size={window.innerWidth < 768 ? 8 : 10} className="me-1" />
                                Verified
                              </Badge>
                            )}
                          </div>

                          {/* Avatar and Basic Info */}
                          <div className="text-center mb-3">
                            <div style={{
                              width: window.innerWidth < 768 ? '60px' : '80px',
                              height: window.innerWidth < 768 ? '60px' : '80px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 12px',
                              color: 'white',
                              fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
                              fontWeight: 600,
                              border: '3px solid white',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                              {counselor.username.charAt(0).toUpperCase()}
                            </div>
                            <h6 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
                              {counselor.username}
                            </h6>
                            <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.65rem' : '0.7rem' }}>
                              {counselor.experience_years}+ years experience
                            </small>
                          </div>

                          {/* Specialties */}
                          <div className="mb-3">
                            <div className="d-flex flex-wrap gap-1 justify-content-center">
                              {counselor.specialties.slice(0, 3).map((specialty, i) => (
                                <Badge
                                  key={i}
                                  style={{
                                    backgroundColor: '#F4F8F6',
                                    color: '#5F6F6C',
                                    padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
                                    borderRadius: '20px',
                                    fontSize: window.innerWidth < 768 ? '0.6rem' : '0.65rem',
                                    fontWeight: 500
                                  }}
                                >
                                  {specialty.length > 12 ? `${specialty.slice(0, 10)}...` : specialty}
                                </Badge>
                              ))}
                              {counselor.specialties.length > 3 && (
                                <Badge style={{
                                  backgroundColor: '#F4F8F6',
                                  color: '#5F6F6C',
                                  padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
                                  borderRadius: '20px',
                                  fontSize: window.innerWidth < 768 ? '0.6rem' : '0.65rem'
                                }}>
                                  +{counselor.specialties.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="d-flex justify-content-around mb-3">
                            <div className="text-center">
                              <div className="fw-bold" style={{ color: '#2EC4B6', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
                                {counselor.session_count}
                              </div>
                              <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.55rem' : '0.6rem' }}>Sessions</small>
                            </div>
                            <div className="text-center">
                              <div className="fw-bold d-flex align-items-center gap-1" style={{ color: '#F4A261', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
                                <FiStar style={{ fill: '#F4A261' }} size={window.innerWidth < 768 ? 10 : 12} />
                                {counselor.rating}
                              </div>
                              <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.55rem' : '0.6rem' }}>Rating</small>
                            </div>
                            <div className="text-center">
                              <div className="fw-bold" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
                                {counselor.languages?.length || 1}
                              </div>
                              <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.55rem' : '0.6rem' }}>Languages</small>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-center mb-3">
                            <Badge style={{
                              backgroundColor: counselor.status === 'active' ? '#E8F6F4' :
                                             counselor.status === 'suspended' ? '#FFE5E5' : '#F4F8F6',
                              color: counselor.status === 'active' ? '#2EC4B6' :
                                     counselor.status === 'suspended' ? '#dc3545' : '#8A9D9A',
                              padding: window.innerWidth < 768 ? '4px 12px' : '6px 16px',
                              borderRadius: '30px',
                              fontSize: window.innerWidth < 768 ? '0.65rem' : '0.7rem',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}>
                              {counselor.status}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="d-flex gap-2 justify-content-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-light rounded-circle p-1 p-md-2"
                              style={{ width: window.innerWidth < 768 ? '32px' : '36px', height: window.innerWidth < 768 ? '32px' : '36px' }}
                              onClick={() => handleViewCounselor(counselor.id)}
                            >
                              <FiEdit2 size={window.innerWidth < 768 ? 14 : 16} style={{ color: '#2EC4B6' }} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-light rounded-circle p-1 p-md-2"
                              style={{ width: window.innerWidth < 768 ? '32px' : '36px', height: window.innerWidth < 768 ? '32px' : '36px' }}
                              onClick={() => handleToggleCounselorStatus(counselor.id, counselor.status)}
                            >
                              {counselor.status === 'active' ? (
                                <FiToggleRight size={window.innerWidth < 768 ? 14 : 16} style={{ color: '#2EC4B6' }} />
                              ) : (
                                <FiToggleLeft size={window.innerWidth < 768 ? 14 : 16} style={{ color: '#F4A261' }} />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="btn btn-light rounded-circle p-1 p-md-2"
                              style={{ width: window.innerWidth < 768 ? '32px' : '36px', height: window.innerWidth < 768 ? '32px' : '36px' }}
                              onClick={() => handleDeleteCounselor(counselor.id)}
                            >
                              <FiTrash2 size={window.innerWidth < 768 ? 14 : 16} style={{ color: '#dc3545' }} />
                            </motion.button>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </AnimatePresence>
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                <Button
                  variant="light"
                  className="rounded-circle p-2"
                  style={{ width: '36px', height: '36px' }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <FiChevronLeft />
                </Button>
                <span style={{ color: '#5F6F6C', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="light"
                  className="rounded-circle p-2"
                  style={{ width: '36px', height: '36px' }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <FiChevronRight />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* List View */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              minWidth: window.innerWidth < 768 ? '600px' : '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F4F8F6' }}>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>Counselor</th>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'left' }}>Specialties</th>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>Sessions</th>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>Rating</th>
                  <th style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentCounselors.map((counselor, index) => (
                    <motion.tr
                      key={counselor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ borderBottom: '1px solid #EDF1F0' }}
                    >
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{
                            width: window.innerWidth < 768 ? '32px' : '36px',
                            height: window.innerWidth < 768 ? '32px' : '36px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                            fontWeight: 600
                          }}>
                            {counselor.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.85rem' : '0.95rem' }}>
                              {counselor.username}
                            </div>
                            <small style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.6rem' : '0.7rem' }}>
                              {counselor.email}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px' }}>
                        <div className="d-flex flex-wrap gap-1">
                          {counselor.specialties.slice(0, 2).map((s, i) => (
                            <Badge key={i} style={{
                              backgroundColor: '#F4F8F6',
                              color: '#5F6F6C',
                              padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
                              borderRadius: '20px',
                              fontSize: window.innerWidth < 768 ? '0.6rem' : '0.7rem'
                            }}>
                              {s}
                            </Badge>
                          ))}
                          {counselor.specialties.length > 2 && (
                            <Badge style={{
                              backgroundColor: '#F4F8F6',
                              color: '#5F6F6C',
                              padding: window.innerWidth < 768 ? '2px 6px' : '4px 8px',
                              borderRadius: '20px',
                              fontSize: window.innerWidth < 768 ? '0.6rem' : '0.7rem'
                            }}>
                              +{counselor.specialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: window.innerWidth < 768 ? '2px 8px' : '4px 12px',
                          borderRadius: '30px',
                          backgroundColor: counselor.status === 'active' ? '#E8F6F4' :
                                         counselor.status === 'suspended' ? '#FFE5E5' : '#F4F8F6',
                          color: counselor.status === 'active' ? '#2EC4B6' :
                                 counselor.status === 'suspended' ? '#dc3545' : '#8A9D9A',
                          fontSize: window.innerWidth < 768 ? '0.65rem' : '0.75rem',
                          fontWeight: 500
                        }}>
                          {counselor.is_online && '●'} {counselor.status}
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center', color: '#2D3F3B', fontWeight: 500 }}>
                        {counselor.session_count}
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                        <div className="d-flex align-items-center gap-1 justify-content-center">
                          <FiStar style={{ color: '#F4A261', fill: '#F4A261' }} size={window.innerWidth < 768 ? 10 : 12} />
                          <span style={{ color: '#2D3F3B', fontWeight: 500 }}>{counselor.rating}</span>
                        </div>
                      </td>
                      <td style={{ padding: window.innerWidth < 768 ? '12px' : '16px', textAlign: 'center' }}>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button
                            variant="link"
                            className="p-1"
                            onClick={() => handleViewCounselor(counselor.id)}
                          >
                            <FiEdit2 size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#2EC4B6' }} />
                          </Button>
                          <Button
                            variant="link"
                            className="p-1"
                            onClick={() => handleToggleCounselorStatus(counselor.id, counselor.status)}
                          >
                            {counselor.status === 'active' ? (
                              <FiToggleRight size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#2EC4B6' }} />
                            ) : (
                              <FiToggleLeft size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#F4A261' }} />
                            )}
                          </Button>
                          <Button
                            variant="link"
                            className="p-1"
                            onClick={() => handleDeleteCounselor(counselor.id)}
                          >
                            <FiTrash2 size={window.innerWidth < 768 ? 12 : 14} style={{ color: '#dc3545' }} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {filteredCounselors.length === 0 && !loading && (
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
              <FiUserCheck size={window.innerWidth < 768 ? 24 : 32} style={{ color: '#8A9D9A' }} />
            </div>
            <h6 style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>No counselors found</h6>
            <p style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem' }}>Click "Add Counselor" to get started</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderSessions = () => (
    <div className="space-y-4">
      <Card className="border-0" style={{ borderRadius: 'clamp(16px, 2vw, 24px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <Card.Body className="p-3 p-md-4">
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
                <h5 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>Session Management</h5>
                <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
                  {userSessions.length} total · {userSessions.filter(s => s.status === 'active').length} active
                </p>
              </div>
            </div>
            <Button
              variant="outline-primary"
              className="d-flex align-items-center gap-2 rounded-pill px-3 px-md-4 py-2"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ borderColor: '#2EC4B6', color: '#2EC4B6', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}
            >
              <FiRefreshCw className={refreshing ? 'spinning' : ''} size={window.innerWidth < 768 ? 14 : 16} />
              <span className="d-none d-sm-inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>

          <UserSessionTable
            data={userSessions}
            userRole="admin"
            onViewUser={handleViewUser}
            onViewSession={handleViewSession}
            onAutoAssignSession={handleAutoAssignSession}
            isLoading={loading}
          />
        </Card.Body>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return renderUsers();
      case 'counselors':
        return renderCounselors();
      case 'sessions':
        return renderSessions();
      case 'profile':
        return <ProfileSection />;
      default:
        return (
          <>
            {renderOverview()}
            <Row className="mt-4 g-3 g-md-4">
              <Col xs={12} lg={6}>
                {renderUsers()}
              </Col>
              <Col xs={12} lg={6}>
                {renderCounselors()}
              </Col>
            </Row>
            <Row className="mt-3 mt-md-4">
              <Col xs={12}>
                {renderSessions()}
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <DashboardLayout>
      {/* Mobile Menu Toggle - Only visible on small screens */}
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

      {/* Header - Responsive */}
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
            <FiShield size={window.innerWidth < 768 ? 20 : 24} color="white" />
          </div>
          <div>
            <h2 className="fw-semibold mb-1" style={{ color: '#2D3F3B', fontSize: window.innerWidth < 768 ? '1.3rem' : '1.8rem' }}>
              Admin Dashboard
            </h2>
            <p className="mb-0" style={{ color: '#8A9D9A', fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem' }}>
              System overview and management
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs - Responsive */}
      <div className="mb-3 mb-md-4" style={{ borderBottom: '1px solid #EDF1F0', overflowX: 'auto' }}>
        <div className="d-flex gap-1 gap-md-2" style={{ minWidth: '500px' }}>
          {[
            { key: 'overview', label: 'Overview', icon: FiShield },
            { key: 'users', label: 'Users', icon: FiUsers },
            { key: 'counselors', label: 'Counselors', icon: FiUserCheck },
            { key: 'sessions', label: 'Sessions', icon: FiActivity },
            { key: 'profile', label: 'Profile', icon: FiSettings }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                navigate(item.key === 'overview' ? '/dashboard/admin' : `/dashboard/admin/${item.key}`);
                setIsMobileMenuOpen(false);
              }}
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

      {/* Modals */}
      <CounselorRegistrationModal
        show={showCounselorRegModal}
        onHide={() => setShowCounselorRegModal(false)}
        onSuccess={handleCounselorRegistered}
      />

      {/* User Edit Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered size="lg" responsive>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateUser(selectedUser.user_id, {
                username: formData.get('username'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                age_group: formData.get('age_group')
              });
            }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      defaultValue={selectedUser.username}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={selectedUser.email}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      defaultValue={selectedUser.phone}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age Group</Form.Label>
                    <Form.Select name="age_group" defaultValue={selectedUser.age_group}>
                      <option value="">Select</option>
                      <option value="under_18">Under 18</option>
                      <option value="18_25">18-25</option>
                      <option value="26_35">26-35</option>
                      <option value="36_50">36-50</option>
                      <option value="51_plus">51+</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowUserModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2EC4B6', border: 'none' }}>
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Counselor Edit Modal */}
      <Modal show={showCounselorModal} onHide={() => setShowCounselorModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>Edit Counselor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCounselor && (
            <Form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateCounselor(selectedCounselor.id, {
                username: formData.get('username'),
                email: formData.get('email'),
                specialties: (formData.get('specialties') as string).split(',').map(s => s.trim()),
                status: formData.get('status')
              });
            }}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name="username"
                      defaultValue={selectedCounselor.username}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={selectedCounselor.email}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Specialties (comma-separated)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="specialties"
                  rows={3}
                  defaultValue={selectedCounselor.specialties.join(', ')}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" defaultValue={selectedCounselor.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowCounselorModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ backgroundColor: '#2EC4B6', border: 'none' }}>
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid #EDF1F0' }}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <FiAlertCircle size={48} style={{ color: '#dc3545' }} />
          </div>
          <p className="text-center mb-0">Are you sure you want to delete this user?</p>
          <p className="text-center text-secondary small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid #EDF1F0' }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => userToDelete && handleDeleteUser(userToDelete)}
          >
            Delete User
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
      `}</style>
    </DashboardLayout>
  );
};