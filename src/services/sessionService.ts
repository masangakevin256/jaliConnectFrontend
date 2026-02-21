import axiosInstance from '../api/axios';
import { Session, CreateSessionPayload } from '../types';

export const sessionService = {
  createSession: (payload: CreateSessionPayload): Promise<Session> =>
    axiosInstance.post('/sessions', payload).then((res) => res.data),

  getUserSessions: (userId: string): Promise<Session[]> =>
    axiosInstance.get(`/sessions?user_id=${userId}`).then((res) => res.data),

  getCounselorSessions: (counselorId: string): Promise<Session[]> =>
    axiosInstance.get(`/sessions?counselor_id=${counselorId}`).then((res) => res.data),

  getSessionById: (id: string): Promise<Session> =>
    axiosInstance.get(`/sessions/${id}`).then((res) => res.data),

  autoAssignSession: (sessionId: string): Promise<Session> =>
    axiosInstance.post(`/sessions/auto-assign/${sessionId}`, {}).then((res) => res.data),
};
