// Role constants
export const ROLE_LIST = {
  User: 'user',
  Counselor: 'counselor',
  Admin: 'admin',
};

// Auth types
export interface User {
  id: string;
  username: string;
  email?: string;
  role: string;
  age_group?: string;
  phone?: string;
}

export interface Counselor {
  id: string;
  username: string;
  email?: string;
  specialties?: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User | Counselor;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterUserPayload {
  username: string;
  email?: string;
  password: string;
  age_group?: string;
  phone?: string;
}

export interface RegisterCounselorPayload {
  username: string;
  password: string;
  specialties?: string;
}

export interface RegisterAdminPayload {
  username: string;
  password: string;
  email: string;
  registration_code: string;
}

// Check-in types
export interface CheckIn {
  id: string;
  user_id: string;
  mood: number;
  note?: string;
  created_at: string;
}

export interface CreateCheckInPayload {
  mood: number;
  note?: string;
}

// Session types
export interface Session {
  id: string;
  user_id: string;
  counselor_id?: string;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
}

export interface CreateSessionPayload {
  user_id: string;
}

// Message types
export interface Message {
  id: string;
  session_id: string;
  sender: string;
  content: string;
  created_at: string;
}

export interface CreateMessagePayload {
  session_id: string;
  content: string;
}

// AI Chat types
export interface AIChatPayload {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

export interface AIChatResponse {
  response: string;
}

// Feedback types
export interface Feedback {
  id: string;
  session_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface CreateFeedbackPayload {
  session_id: string;
  rating: number;
  comment?: string;
}

// Auth Context type
export interface AuthContextType {
  auth: AuthResponse | null;
  setAuth: (auth: AuthResponse | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
}
