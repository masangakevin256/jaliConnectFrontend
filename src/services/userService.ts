import axiosInstance from '../api/axios';

export interface UpdateUserPayload {
    username?: string;
    email?: string;
    phone?: string;
    age_group?: string;
    pulse_level?: string | number;
    password?: string;
    newPassword?: string;
}

export const userService = {
    updateUser: (id: string, payload: UpdateUserPayload): Promise<any> =>
        axiosInstance.put(`/users/${id}`, payload).then((res) => res.data),

    getUsers: (): Promise<any> => axiosInstance.get('/users').then((res) => res.data),
};
