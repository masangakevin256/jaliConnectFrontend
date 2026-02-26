import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { StatsCard } from './StatsCard';
import { FiMessageSquare, FiTrendingUp, FiCalendar, FiUsers, FiHeart, FiClock, FiShield, FiUserCheck, FiZap, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { statsService, UserStats, CounselorStats, AdminStats } from '../../services/statsService';

export const OverviewCards: React.FC = () => {
    const { isUser, isCounselor, isAdmin, user } = useAuth();
    
    const [loading, setLoading] = React.useState(true);
    const [userStats, setUserStats] = React.useState<UserStats | null>(null);
    const [counselorStats, setCounselorStats] = React.useState<CounselorStats | null>(null);
    const [adminStats, setAdminStats] = React.useState<AdminStats | null>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                if (isUser) {
                    const data = await statsService.getUserStats();
                    setUserStats(data);
                } else if (isCounselor) {
                    const data = await statsService.getCounselorStats();
                    setCounselorStats(data);
                } else if (isAdmin) {
                    const data = await statsService.getAdminStats();
                    setAdminStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isUser, isCounselor, isAdmin]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <FiLoader className="icon-spin text-primary-teal" size={32} />
            </div>
        );
    }

    const renderUserCards = () => (
        <Row className="g-4">
            <Col lg={4} md={6}>
                <StatsCard
                    title="Mood Average"
                    value={userStats?.moodAverage.value || "No Data"}
                    icon={FiHeart}
                    trend={userStats?.moodAverage.trend}
                    color="var(--primary-teal)"
                    subtitle={userStats?.moodAverage.subtitle || "Last 30 days"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Total Sessions"
                    value={userStats?.totalSessions.value || "0"}
                    icon={FiCalendar}
                    color="var(--accent-orange)"
                    subtitle={userStats?.totalSessions.subtitle || "All time"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Unread Messages"
                    value={userStats?.unreadMessages.value || "0"}
                    icon={FiMessageSquare}
                    color="var(--primary-teal)"
                    subtitle={userStats?.unreadMessages.subtitle || "From your counselor"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Journal Entries"
                    value={userStats?.journalEntries.value || "0"}
                    icon={FiTrendingUp}
                    color="var(--accent-orange)"
                    subtitle={userStats?.journalEntries.subtitle || "All time"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Next Session"
                    value={userStats?.nextSession.value || "None"}
                    icon={FiClock}
                    color="var(--primary-teal)"
                    subtitle={userStats?.nextSession.subtitle || "N/A"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Wellness Score"
                    value={userStats?.wellnessScore.value || "N/A"}
                    icon={FiHeart}
                    trend={userStats?.wellnessScore.trend}
                    color="var(--accent-orange)"
                    subtitle={userStats?.wellnessScore.subtitle || "Pending data"}
                />
            </Col>
        </Row>
    );

    const renderCounselorCards = () => (
        <Row className="g-4">
            <Col lg={4} md={6}>
                <StatsCard
                    title="Active Sessions"
                    value={counselorStats?.activeSessions.value || "0"}
                    icon={FiCalendar}
                    color="var(--primary-teal)"
                    subtitle={counselorStats?.activeSessions.subtitle || "Currently in progress"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Waiting List"
                    value={counselorStats?.waitingList.value || "0"}
                    icon={FiUsers}
                    color="var(--accent-orange)"
                    subtitle={counselorStats?.waitingList.subtitle || "Awaiting assignment"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Unread Messages"
                    value={counselorStats?.unreadMessages.value || "0"}
                    icon={FiMessageSquare}
                    color="var(--primary-teal)"
                    subtitle={counselorStats?.unreadMessages.subtitle || "From your clients"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Total Clients"
                    value={counselorStats?.totalClients.value || "0"}
                    icon={FiUserCheck}
                    color="var(--accent-orange)"
                    subtitle={counselorStats?.totalClients.subtitle || "Active clients"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Today's Schedule"
                    value={counselorStats?.todaysSchedule.value || "0"}
                    icon={FiClock}
                    color="var(--primary-teal)"
                    subtitle={counselorStats?.todaysSchedule.subtitle || "Sessions today"}
                />
            </Col>
            <Col lg={4} md={6}>
                <StatsCard
                    title="Session Rating"
                    value={counselorStats?.sessionRating.value || "N/A"}
                    icon={FiTrendingUp}
                    trend={counselorStats?.sessionRating.trend}
                    color="var(--accent-orange)"
                    subtitle={counselorStats?.sessionRating.subtitle || "Average rating"}
                />
            </Col>
        </Row>
    );

    const renderAdminCards = () => (
        <Row className="g-3 g-xl-4">
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Total Users"
                    value={adminStats?.totalUsers.value || "0"}
                    icon={FiUsers}
                    color="var(--primary-teal)"
                    trend={adminStats?.totalUsers.trend}
                    subtitle={adminStats?.totalUsers.subtitle || "Registered users"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Counselors"
                    value={adminStats?.counselors.value || "0"}
                    icon={FiUserCheck}
                    color="var(--accent-orange)"
                    trend={adminStats?.counselors.trend}
                    subtitle={adminStats?.counselors.subtitle || "Licensed professionals"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Active Sessions"
                    value={adminStats?.activeSessions.value || "0"}
                    icon={FiCalendar}
                    color="var(--primary-teal)"
                    subtitle={adminStats?.activeSessions.subtitle || "Currently ongoing"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="System Health"
                    value={adminStats?.systemHealth.value || "100%"}
                    icon={FiShield}
                    color="var(--accent-orange)"
                    subtitle={adminStats?.systemHealth.subtitle || "Uptime this month"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="New Users"
                    value={adminStats?.newUsers.value || "0"}
                    icon={FiUsers}
                    color="var(--primary-teal)"
                    trend={adminStats?.newUsers.trend}
                    subtitle={adminStats?.newUsers.subtitle || "This month"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Sessions Completed"
                    value={adminStats?.sessionsCompleted.value || "0"}
                    icon={FiTrendingUp}
                    color="var(--accent-orange)"
                    subtitle={adminStats?.sessionsCompleted.subtitle || "This month"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Avg. Response"
                    value={adminStats?.avgResponse.value || "N/A"}
                    icon={FiClock}
                    color="var(--primary-teal)"
                    trend={adminStats?.avgResponse.trend}
                    subtitle={adminStats?.avgResponse.subtitle || "Response time"}
                />
            </Col>
            <Col xl={3} lg={6} md={6}>
                <StatsCard
                    title="Satisfaction"
                    value={adminStats?.satisfaction.value || "N/A"}
                    icon={FiHeart}
                    color="var(--accent-orange)"
                    trend={adminStats?.satisfaction.trend}
                    subtitle={adminStats?.satisfaction.subtitle || "Average rating"}
                />
            </Col>
        </Row>
    );

    // Welcome message based on role
    const renderWelcomeMessage = () => {
        let content = { title: '', desc: '' };
        //use real name
        if (isUser) content = { title: `Welcome back  ${user?.username}!`, desc: "Here's your wellness summary for today" };
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