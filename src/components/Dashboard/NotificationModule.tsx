import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { notificationService, Notification } from '../../services/notificationService';
import toast from 'react-hot-toast';

export const NotificationModule: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            // Sort newest first based on created_at
            const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setNotifications(sortedData);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            toast.error("Failed to load your notifications");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success("Notification cleared", {
                icon: '✨',
                style: { borderRadius: '20px', background: 'var(--bg-main)', color: 'var(--text-main)' }
            });
        } catch (error) {
            console.error("Failed to delete notification", error);
            toast.error("Failed to clear notification");
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'success': return <FiCheckCircle size={20} style={{ color: 'var(--primary-teal)' }} />;
            case 'alert': return <FiAlertCircle size={20} style={{ color: 'var(--accent-peach)' }} />;
            case 'info':
            default: return <FiInfo size={20} style={{ color: 'var(--accent-sky)' }} />;
        }
    };

    return (
        <Card
            className="border-0"
            style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--bg-white)',
                overflow: 'hidden'
            }}
        >
            <Card.Body className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 style={{ color: 'var(--text-main)', fontWeight: 600, margin: 0 }}>
                        <FiBell className="me-2" style={{ color: 'var(--accent-lavender)' }} />
                        Recent Notifications
                    </h5>
                    {notifications.length > 0 && !loading && (
                        <span className="badge rounded-pill" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.4em 0.8em' }}>
                            {notifications.length} New
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" style={{ color: 'var(--primary-teal)' }} />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-5" style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                        <FiBell size={32} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You're all caught up!</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        <AnimatePresence>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-main)',
                                        border: '1px solid var(--border-light)',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '1rem'
                                    }}
                                >
                                    <div style={{
                                        minWidth: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--bg-white)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {getIconForType(notification.type)}
                                    </div>

                                    <div className="flex-grow-1">
                                        <h6 style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '4px' }}>
                                            {notification.title}
                                        </h6>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                                            {notification.message}
                                        </p>
                                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                            {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '50%',
                                            transition: 'var(--transition-fast)'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--bg-white)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <FiX size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};
