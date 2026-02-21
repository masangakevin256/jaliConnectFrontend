import axiosInstance from '../api/axios';
import { Message, CreateMessagePayload } from '../types';

export const messageService = {
  sendMessage: (sessionId: string, payload: CreateMessagePayload): Promise<Message> =>
    axiosInstance.post(`/sessions/${sessionId}/messages`, payload).then((res) => res.data),

  getSessionMessages: (sessionId: string): Promise<Message[]> =>
    axiosInstance.get(`/sessions/${sessionId}/messages`).then((res) => res.data),
};
