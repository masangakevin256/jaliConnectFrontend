import axiosInstance from '../api/axios';

export interface Notification {
    id: string;
    sender_id: string;
    sender_role: string;
    recipient_id: string;
    recipient_role: string;
    type: string;
    title: string;
    message: string;
    created_at: string;
}

export const notificationService = {
    getNotifications: (): Promise<Notification[]> =>
        axiosInstance.get('/notifications').then((res) => res.data),

    deleteNotification: (id: string): Promise<any> =>
        axiosInstance.delete(`/notifications/${id}`).then((res) => res.data),
};
