import axiosInstance from '../api/axios';
import {
  LoginPayload,
  AuthResponse,
  RegisterUserPayload,
  RegisterCounselorPayload,
  RegisterAdminPayload,
} from '../types';

export const authService = {
  loginUser: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosInstance.post('/auth/login/user', payload).then((res: any) => res.data),

  loginCounselor: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosInstance.post('/auth/login/counselor', payload).then((res: any) => res.data),

  loginAdmin: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosInstance.post('/auth/login/admin', payload).then((res: any) => res.data),

  registerUser: (payload: RegisterUserPayload): Promise<AuthResponse> =>
    axiosInstance.post('/users', payload).then((res: any) => res.data),

  registerCounselor: (payload: RegisterCounselorPayload): Promise<AuthResponse> =>
    axiosInstance.post('/counselors', payload).then((res: any) => res.data),

  registerAdmin: (payload: RegisterAdminPayload): Promise<AuthResponse> =>
    axiosInstance.post('/admins', payload).then((res: any) => res.data),

  requestPasswordReset: (email: string): Promise<{ message: string }> =>
    axiosInstance.post('/auth/user/password-reset/request', { email }).then((res: any) => res.data),

  resetPassword: (payload: { token: string; newPassword: string }): Promise<{ message: string }> =>
    axiosInstance.post('/auth/user/password-reset/password-reset-form', payload).then((res: any) => res.data),
  
};
