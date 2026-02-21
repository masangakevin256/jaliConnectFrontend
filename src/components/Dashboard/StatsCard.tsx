import React from 'react';
import { Card } from 'react-bootstrap';
import { IconType } from 'react-icons';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: IconType;
    color?: string;
    subtitle?: string;
    trend?: {
        value: string;
        isUp: boolean;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color = '#2EC4B6', trend, subtitle }) => {
    return (
        <Card className="jali-card h-100 animate-up">
            <Card.Body className="d-flex align-items-center gap-3 p-4">
                <div
                    className="stat-icon flex-shrink-0"
                    style={{
                        backgroundColor: `${color}15`,
                        color: color
                    }}
                >
                    <Icon size={24} />
                </div>
                <div className="flex-grow-1">
                    <p className="text-secondary small fw-600 mb-0">{title}</p>
                    <h3 className="fw-700 mb-1">{value}</h3>
                    <div className="d-flex align-items-center gap-2">
                        {trend && (
                            <span className={`small fw-700 px-2 py-0 rounded-pill ${trend.isUp ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
                                }`}>
                                {trend.isUp ? '↑' : '↓'} {trend.value}
                            </span>
                        )}
                        {subtitle && <span className="text-muted small">{subtitle}</span>}
                    </div>
                </div>
            </Card.Body>

            <style>{`
                .bg-success-light { background: #DCFCE7; }
                .bg-danger-light { background: #FEE2E2; }
                .fw-700 { font-weight: 700; }
            `}</style>
        </Card>
    );
};
