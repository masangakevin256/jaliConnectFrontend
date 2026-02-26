import React from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiWind } from 'react-icons/fi';

export const MeditationCard: React.FC = () => {
    return (
        <Card
            className="border-0"
            style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                background: 'linear-gradient(135deg, var(--bg-white) 0%, #F5FAFB 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative calm shape */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--accent-sky)',
                opacity: 0.15,
                filter: 'blur(20px)'
            }} />

            <Card.Body className="p-4 position-relative">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'rgba(169, 214, 229, 0.2)', // Sky blue with opacity
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-dark)'
                    }}>
                        <FiWind size={24} />
                    </div>
                    <div>
                        <h5 style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: 0 }}>
                            Mindful Breathing
                        </h5>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            3 Min Exercise
                        </span>
                    </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    Take a moment to center yourself. Follow the guided breathing rhythm to reduce stress and find calm.
                </p>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'var(--accent-sky)', // Using sky blue for calmness
                        color: '#1A3F4C', // Contrast test for sky blue
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 8px 16px rgba(169, 214, 229, 0.3)',
                        transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#92CADE')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-sky)')}
                >
                    Begin Breathing
                </motion.button>
            </Card.Body>
        </Card>
    );
};
