import axiosInstance from '../api/axios';
import { Feedback, CreateFeedbackPayload } from '../types';

export const feedbackService = {
  createFeedback: (payload: CreateFeedbackPayload): Promise<Feedback> =>
    axiosInstance.post('/feedback', payload).then((res) => res.data),

  getUserFeedback: (userId: string): Promise<Feedback[]> =>
    axiosInstance.get(`/feedback?user_id=${userId}`).then((res) => res.data),
};
