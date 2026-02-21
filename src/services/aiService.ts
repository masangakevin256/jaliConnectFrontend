import axiosInstance from '../api/axios';
import { AIChatPayload, AIChatResponse } from '../types';

export const aiService = {
  chat: (payload: AIChatPayload): Promise<AIChatResponse> =>
    axiosInstance.post('/ai/chat', payload).then((res) => res.data),
};
