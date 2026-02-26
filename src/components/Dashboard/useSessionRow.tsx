import React, { useState } from 'react';
import {
  FiUser,
  FiClock,
  FiActivity,
  FiEye,
  FiMessageSquare,
  FiMoreVertical,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserSessionRow {
  user_id: string;
  username: string;
  age_group: string;
  last_seen: string | null;
  pulse_level: number | null;
  session_id: string;
  status: string;
  counselor_id: string;
}

interface UserSessionTableProps {
  data: UserSessionRow[];
  userRole?: 'admin' | 'counselor' | 'user';
  onViewUser?: (userId: string) => void;
  onMessageUser?: (userId: string) => void;
  onViewSession?: (sessionId: string) => void;
  onActivateSession?: (sessionId: string) => void;
  onAutoAssignSession?: (sessionId: string) => void;
  isLoading?: boolean;
}

export const UserSessionTable: React.FC<UserSessionTableProps> = ({
  data,
  userRole = 'user',
  onViewUser,
  onMessageUser,
  onViewSession,
  onActivateSession,
  onAutoAssignSession,
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof UserSessionRow>('last_seen');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; color: string; label: string }> = {
      active: { bg: '#E8F6F4', color: '#2EC4B6', label: 'Active' },
      pending: { bg: '#FEF7E9', color: '#F4A261', label: 'Pending' },
      completed: { bg: '#F4F8F6', color: '#5F6F6C', label: 'Completed' },
      scheduled: { bg: '#E8F6F4', color: '#2EC4B6', label: 'Scheduled' },
      cancelled: { bg: '#FFE5E5', color: '#dc3545', label: 'Cancelled' }
    };
    return statusMap[status.toLowerCase()] || statusMap.pending;
  };

  const getPulseLevelColor = (level: number | null) => {
    if (!level) return { bg: '#F4F8F6', color: '#8A9D9A', label: 'Unknown' };
    if (level >= 4) return { bg: '#FFE5E5', color: '#dc3545', label: 'High' };
    if (level >= 2.5) return { bg: '#FEF7E9', color: '#F4A261', label: 'Medium' };
    return { bg: '#E8F6F4', color: '#2EC4B6', label: 'Low' };
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';

    const date = new Date(lastSeen);
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

  const formatAgeGroup = (ageGroup: string) => {
    const ageMap: Record<string, string> = {
      'under_18': 'Under 18',
      '18_25': '18-25',
      '26_35': '26-35',
      '36_50': '36-50',
      '51_plus': '51+'
    };
    return ageMap[ageGroup] || ageGroup;
  };

  const handleSort = (field: keyof UserSessionRow) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = data
    .filter(row => {
      const matchesSearch =
        row.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.session_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || row.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'last_seen') {
        aValue = a.last_seen ? new Date(a.last_seen).getTime() : 0;
        bValue = b.last_seen ? new Date(b.last_seen).getTime() : 0;
      }

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  if (isLoading) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        background: 'white',
        borderRadius: '24px',
        border: '1px solid #EDF1F0'
      }}>
        <div className="spinner-border" style={{ color: '#2EC4B6' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ color: '#8A9D9A', marginTop: '1rem' }}>Loading session data...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      border: '1px solid #EDF1F0',
      overflow: 'hidden'
    }}>
      {/* Table Header with Controls */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #EDF1F0',
        background: '#F9FCFB'
      }}>
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="d-flex gap-3 align-items-center">
            <h5 className="fw-semibold mb-0" style={{ color: '#2D3F3B' }}>
              User Sessions
            </h5>
            <span style={{
              backgroundColor: '#E8F6F4',
              color: '#2EC4B6',
              padding: '4px 10px',
              borderRadius: '30px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>
              {filteredData.length} records
            </span>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {/* Search */}
            <div style={{ position: 'relative', width: '250px' }}>
              <FiSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8A9D9A',
                fontSize: '14px'
              }} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: '30px',
                  border: '1px solid #EDF1F0',
                  backgroundColor: 'white',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                border: '1px solid #EDF1F0',
                backgroundColor: 'white',
                color: '#2D3F3B',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Export Button */}
            <button
              onClick={() => {
                const csv = [
                  ['User ID', 'Username', 'Age Group', 'Last Seen', 'Pulse Level', 'Session ID', 'Status', 'Counselor ID'],
                  ...filteredData.map(row => [
                    row.user_id,
                    row.username,
                    row.age_group,
                    row.last_seen || '',
                    row.pulse_level || '',
                    row.session_id,
                    row.status,
                    row.counselor_id
                  ])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `user-sessions-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                border: '1px solid #EDF1F0',
                backgroundColor: 'white',
                color: '#2D3F3B',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <FiDownload size={14} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '1000px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#F4F8F6', borderBottom: '1px solid #EDF1F0' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleSort('username')}>
                  <FiUser size={14} style={{ color: '#8A9D9A' }} />
                  <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>User</span>
                  {sortField === 'username' && (
                    <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>
                Age Group
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleSort('last_seen')}>
                  <FiClock size={14} style={{ color: '#8A9D9A' }} />
                  <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>Last Seen</span>
                  {sortField === 'last_seen' && (
                    <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => handleSort('pulse_level')}>
                  <FiActivity size={14} style={{ color: '#8A9D9A' }} />
                  <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>Pulse</span>
                  {sortField === 'pulse_level' && (
                    <span style={{ color: '#2EC4B6' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCalendar size={14} style={{ color: '#8A9D9A' }} />
                  <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>Session</span>
                </div>
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left' }}>
                <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>Status</span>
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'center' }}>
                <span style={{ color: '#5F6F6C', fontSize: '0.85rem', fontWeight: 600 }}>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredData.map((row, index) => {
                const status = getStatusColor(row.status);
                const pulse = getPulseLevelColor(row.pulse_level);

                return (
                  <motion.tr
                    key={row.session_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      borderBottom: '1px solid #EDF1F0',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FCFB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '12px',
                          background: '#2EC4B6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}>
                          {row.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: '#2D3F3B' }}>
                            {row.username}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#8A9D9A' }}>
                            ID: {row.user_id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#5F6F6C' }}>
                      {formatAgeGroup(row.age_group)}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ color: '#2D3F3B' }}>{formatLastSeen(row.last_seen)}</div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      {row.pulse_level ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          backgroundColor: pulse.bg,
                          color: pulse.color,
                          borderRadius: '30px',
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}>
                          <FiActivity size={10} />
                          {pulse.label} ({row.pulse_level})
                        </span>
                      ) : (
                        <span style={{ color: '#8A9D9A', fontSize: '0.8rem' }}>No data</span>
                      )}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#2D3F3B', fontSize: '0.9rem' }}>
                          {row.session_id.slice(0, 8)}...
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#8A9D9A' }}>
                          Counselor: {row.counselor_id.slice(0, 8)}...
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        backgroundColor: status.bg,
                        color: status.color,
                        borderRadius: '30px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {status.label}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div className="d-flex gap-2 justify-content-center">
                        {/* Counselor: Activate Button */}
                        {userRole === 'counselor' && (row.status === 'pending' || row.status === 'waiting') && (
                          <button
                            onClick={() => onActivateSession?.(row.session_id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#2EC4B6',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                            title="Activate Session"
                          >
                            Activate
                          </button>
                        )}
                        {/* Admin: Auto-Assign Button */}
                        {userRole === 'admin' && (row.status === 'pending' || row.status === 'waiting') && (
                          <button
                            onClick={() => onAutoAssignSession?.(row.session_id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#F4A261',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                              fontWeight: 500
                            }}
                            title="Auto-Assign Session"
                          >
                            Auto-Assign
                          </button>
                        )}

                        <button
                          onClick={() => onViewUser?.(row.user_id)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid #EDF1F0',
                            backgroundColor: 'white',
                            color: '#5F6F6C',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="View User"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => onMessageUser?.(row.user_id)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid #EDF1F0',
                            backgroundColor: 'white',
                            color: '#5F6F6C',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="Send Message"
                        >
                          <FiMessageSquare size={14} />
                        </button>
                        <button
                          onClick={() => onViewSession?.(row.session_id)}
                          style={{
                            padding: '6px',
                            borderRadius: '8px',
                            border: '1px solid #EDF1F0',
                            backgroundColor: 'white',
                            color: '#5F6F6C',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          title="View Session"
                        >
                          <FiMoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '40px',
                    background: '#F4F8F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <FiUser size={32} style={{ color: '#8A9D9A' }} />
                  </div>
                  <h6 style={{ color: '#2D3F3B', marginBottom: '4px' }}>No sessions found</h6>
                  <p style={{ color: '#8A9D9A', fontSize: '0.9rem' }}>
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #EDF1F0',
        backgroundColor: '#F9FCFB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: '#8A9D9A'
      }}>
        <span>
          Showing {filteredData.length} of {data.length} records
        </span>
        <span>
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <style>{`
        .btn-icon:hover {
          background-color: #2EC4B6 !important;
          color: white !important;
          border-color: #2EC4B6 !important;
        }
      `}</style>
    </div>
  );
};