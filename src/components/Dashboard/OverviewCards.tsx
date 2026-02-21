import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { StatsCard } from './StatsCard';
import { FiMessageSquare, FiTrendingUp, FiCalendar, FiUsers, FiHeart, FiClock, FiShield, FiUserCheck, FiZap } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const OverviewCards: React.FC = () => {
    const { isUser, isCounselor, isAdmin } = useAuth();

    const renderUserCards = () => (
        <Row className="g-4">
            <Col lg={4} md={6}>
                <StatsCard
                    title="Mood Average"
                    value="Good"
                    icon={FiHeart}
                    trend={{ value: '12%', isUp: true }}
                    color="var(--primary-teal)"
                    subtitle="Last 30 days"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Total Sessions"
                    value="12"
                    icon={FiCalendar}
                    color="var(--accent-orange)"
                    subtitle="This month"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Unread Messages"
                    value="3"
                    icon={FiMessageSquare}
                    color="var(--primary-teal)"
                    subtitle="From your counselor"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Journal Entries"
                    value="8"
                    icon={FiTrendingUp}
                    color="var(--accent-orange)"
                    subtitle="This week"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Next Session"
                    value="Tomorrow"
                    icon={FiClock}
                    color="var(--primary-teal)"
                    subtitle="10:00 AM"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Wellness Score"
                    value="85%"
                    icon={FiHeart}
                    trend={{ value: '5%', isUp: true }}
                    color="var(--accent-orange)"
                    subtitle="Improved"
                />
            </Col>
        </Row>
    );

    const renderCounselorCards = () => (
        <Row className="g-4">
            <Col lg={4} md={6}>
                <StatsCard
                    title="Active Sessions"
                    value="5"
                    icon={FiCalendar}
                    color="var(--primary-teal)"
                    subtitle="Currently in progress"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Waiting List"
                    value="3"
                    icon={FiUsers}
                    color="var(--accent-orange)"
                    subtitle="Awaiting assignment"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Unread Messages"
                    value="8"
                    icon={FiMessageSquare}
                    color="var(--primary-teal)"
                    subtitle="From your clients"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Total Clients"
                    value="24"
                    icon={FiUserCheck}
                    color="var(--accent-orange)"
                    subtitle="Active clients"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Today's Schedule"
                    value="4"
                    icon={FiClock}
                    color="var(--primary-teal)"
                    subtitle="Sessions today"
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Session Rating"
                    value="4.8"
                    icon={FiTrendingUp}
                    trend={{ value: '0.3', isUp: true }}
                    color="var(--accent-orange)"
                    subtitle="Average rating"
                />
            </Col>
        </Row>
    );

    const renderAdminCards = () => (
        <Row className="g-3 g-xl-4">
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Total Users"
                    value="1,284"
                    icon={FiUsers}
                    color="var(--primary-teal)"
                    trend={{ value: '12%', isUp: true }}
                    subtitle="Active users"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Counselors"
                    value="48"
                    icon={FiUserCheck}
                    color="var(--accent-orange)"
                    trend={{ value: '3', isUp: true }}
                    subtitle="Licensed professionals"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Active Sessions"
                    value="32"
                    icon={FiCalendar}
                    color="var(--primary-teal)"
                    subtitle="Currently ongoing"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="System Health"
                    value="98%"
                    icon={FiShield}
                    color="var(--accent-orange)"
                    subtitle="Uptime this month"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="New Users"
                    value="156"
                    icon={FiUsers}
                    color="var(--primary-teal)"
                    trend={{ value: '8%', isUp: true }}
                    subtitle="This month"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Sessions Completed"
                    value="847"
                    icon={FiTrendingUp}
                    color="var(--accent-orange)"
                    subtitle="This month"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Avg. Response"
                    value="2.4h"
                    icon={FiClock}
                    color="var(--primary-teal)"
                    trend={{ value: '15%', isUp: false }}
                    subtitle="Response time"
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Satisfaction"
                    value="4.6"
                    icon={FiHeart}
                    color="var(--accent-orange)"
                    trend={{ value: '0.2', isUp: true }}
                    subtitle="Average rating"
                />
            </Col>
        </Row>
    );

    // Welcome message based on role
    const renderWelcomeMessage = () => {
        let content = { title: '', desc: '' };
        if (isUser) content = { title: 'Welcome back! 👋', desc: "Here's your wellness summary for today" };
        else if (isCounselor) content = { title: 'Your Counseling Dashboard', desc: "Here's an overview of your practice" };
        else if (isAdmin) content = { title: 'Admin Overview', desc: "Platform statistics and health metrics" };
        else return null;

        return (
            <div className="mb-4 animate-up">
                <h2 className="mb-1">{content.title}</h2>
                <p className="text-secondary">{content.desc}</p>
            </div>
        );
    };

    return (
        <>
            {renderWelcomeMessage()}
            {isUser && renderUserCards()}
            {isCounselor && renderCounselorCards()}
            {isAdmin && renderAdminCards()}

            {/* Quick tip based on role */}
            <div className="mt-4 animate-up" style={{ animationDelay: '200ms' }}>
                <Card className="jali-card border-0" style={{ backgroundColor: 'var(--primary-light)' }}>
                    <Card.Body className="p-3 d-flex align-items-center gap-3">
                        <div className="stat-icon bg-white text-primary-teal shadow-sm" style={{ width: '40px', height: '40px' }}>
                            <FiZap />
                        </div>
                        <div className="text-main small">
                            <strong>Quick tip:</strong>{' '}
                            {isUser && "Track your mood daily to see patterns in your wellness journey."}
                            {isCounselor && "You have 3 messages waiting for response in your inbox."}
                            {isAdmin && "System performance is optimal. Check user growth analytics for insights."}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};