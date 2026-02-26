import axiosInstance from '../api/axios';

export interface StatItem {
    value: string;
    subtitle: string;
    trend?: {
        value: string;
        isUp: boolean;
    };
}

export interface UserStats {
    moodAverage: StatItem;
    totalSessions: StatItem;
    unreadMessages: StatItem;
    journalEntries: StatItem;
    nextSession: StatItem;
    wellnessScore: StatItem;
}

export interface CounselorStats {
    activeSessions: StatItem;
    waitingList: StatItem;
    unreadMessages: StatItem;
    totalClients: StatItem;
    todaysSchedule: StatItem;
    sessionRating: StatItem;
}

export interface AdminStats {
    totalUsers: StatItem;
    counselors: StatItem;
    activeSessions: StatItem;
    systemHealth: StatItem;
    newUsers: StatItem;
    sessionsCompleted: StatItem;
    avgResponse: StatItem;
    satisfaction: StatItem;
}

export const statsService = {
    getUserStats: (): Promise<UserStats> =>
        axiosInstance.get('/stats/user').then((res) => res.data),

    getCounselorStats: (): Promise<CounselorStats> =>
        axiosInstance.get('/stats/counselor').then((res) => res.data),

    getAdminStats: (): Promise<AdminStats> =>
        axiosInstance.get('/stats/admin').then((res) => res.data),
};

