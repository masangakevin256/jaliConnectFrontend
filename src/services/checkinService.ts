import axiosInstance from '../api/axios';
import { CheckIn, CreateCheckInPayload } from '../types';

export const checkinService = {
  createCheckIn: (payload: CreateCheckInPayload): Promise<CheckIn> =>
    axiosInstance.post('/checkins', payload).then((res) => res.data),

  getUserCheckIns: (userId: string): Promise<CheckIn[]> =>
    axiosInstance.get(`/checkins?user_id=${userId}`).then((res) => res.data),

  getCheckInById: (id: string): Promise<CheckIn> =>
    axiosInstance.get(`/checkins/${id}`).then((res) => res.data),
};
