import { useAuthContext } from '../context/AuthContext';
import { ROLE_LIST } from '../types';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    auth: context.auth,
    user: context.auth?.user,
    isAuthenticated: context.isAuthenticated,
    userRole: context.userRole,
    isUser: context.userRole === ROLE_LIST.User,
    isCounselor: context.userRole === ROLE_LIST.Counselor,
    isAdmin: context.userRole === ROLE_LIST.Admin,
    setAuth: context.setAuth,
    logout: context.logout,
  };
};
