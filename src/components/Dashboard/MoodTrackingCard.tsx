import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

export const MoodTrackingCard: React.FC = () => {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    const moods = [
        { value: 1, label: 'Low', emoji: '🌧️', color: '#A9D6E5' },
        { value: 2, label: 'Okay', emoji: '⛅', color: '#9BB1AA' },
        { value: 3, label: 'Good', emoji: '☀️', color: '#F6C7B6' },
        { value: 4, label: 'Great', emoji: '✨', color: '#5FAF8F' },
    ];

    return (
        <Card
            className="border-0"
            style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                background: 'var(--bg-white)',
                overflow: 'hidden'
            }}
        >
            <Card.Body className="p-4">
                <h5 style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    How are you feeling right now?
                </h5>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Taking a moment to check in with yourself is the first step to feeling better.
                </p>

                <div className="d-flex justify-content-between gap-2">
                    {moods.map((mood) => (
                        <motion.button
                            key={mood.value}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMood(mood.value)}
                            style={{
                                flex: 1,
                                padding: '1rem 0.5rem',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                background: selectedMood === mood.value ? mood.color : 'var(--bg-main)',
                                color: selectedMood === mood.value ? '#FFF' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'var(--transition-base)',
                                boxShadow: selectedMood === mood.value ? `0 8px 16px ${mood.color}40` : 'none'
                            }}
                        >
                            <span style={{ fontSize: '1.8rem' }}>{mood.emoji}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: selectedMood === mood.value ? 600 : 500 }}>
                                {mood.label}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {selectedMood && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4"
                    >
                        <button
                            className="btn btn-jali-primary w-100"
                            style={{ padding: '0.8rem' }}
                            onClick={() => {
                                alert("Mood logged successfully!");
                                setSelectedMood(null);
                            }}
                        >
                            Save Check-in
                        </button>
                    </motion.div>
                )}
            </Card.Body>
        </Card>
    );
};
