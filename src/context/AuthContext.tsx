import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AuthContextType, AuthResponse } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthResponse | null>(() => {
    try {
      const stored = localStorage.getItem('auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleSetAuth = useCallback((authData: AuthResponse | null) => {
    try {
      if (authData) {
        localStorage.setItem('auth', JSON.stringify(authData));
        localStorage.setItem('accessToken', authData.accessToken);
      } else {
        localStorage.removeItem('auth');
        localStorage.removeItem('accessToken');
      }
    } catch (error) {
      console.error('Error setting auth:', error);
    }
    setAuth(authData);
  }, []);

  const logout = useCallback(() => {
    handleSetAuth(null);
  }, [handleSetAuth]);

  const value: AuthContextType = {
    auth,
    setAuth: handleSetAuth,
    logout,
    isAuthenticated: !!auth?.accessToken,
    userRole: auth?.user?.role ?? null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
