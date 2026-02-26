import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCoffee, FiX } from 'react-icons/fi';

export const CalmNotificationCard: React.FC = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
            >
                <Card
                    className="border-0"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--primary-light)', // Soft mint
                        border: '1px solid var(--border-light)'
                    }}
                >
                    <Card.Body className="p-3 d-flex align-items-start gap-3">
                        <div style={{
                            minWidth: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#FFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-peach)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <FiCoffee size={20} />
                        </div>

                        <div className="flex-grow-1">
                            <h6 style={{ color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '2px', fontSize: '0.95rem' }}>
                                Gentle Reminder
                            </h6>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 0, paddingRight: '1rem' }}>
                                You've been active for a while. Remember to hydrate and take a short screen break.
                            </p>
                        </div>

                        <button
                            onClick={() => setVisible(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <FiX size={18} />
                        </button>
                    </Card.Body>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
};
