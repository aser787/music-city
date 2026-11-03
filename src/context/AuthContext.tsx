import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface AuthContextType {
  token: string | null;
  user: { email: string; role: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; needsSetup?: boolean; error?: string }>;
  setupPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkEmailStatus: (email: string) => Promise<{ allowed: boolean; hasPassword: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mc_admin_token'));
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getMe(token);
        setUser(profile);
      } catch (err) {
        console.warn('Session verification failed, clearing stale token');
        setToken(null);
        setUser(null);
        localStorage.removeItem('mc_admin_token');
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, [token]);

  const checkEmailStatus = async (email: string) => {
    return api.checkAuthStatus(email);
  };

  const login = async (email: string, password?: string) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('mc_admin_token', res.token);
        return { success: true };
      }
      return { success: false, needsSetup: res.needsSetup, error: res.error || 'Authentication failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login request error' };
    }
  };

  const setupPassword = async (email: string, password: string) => {
    try {
      const res = await api.setupPassword(email, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('mc_admin_token', res.token);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to setup password' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password setup request error' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await api.logout(token);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('mc_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        setupPassword,
        logout,
        checkEmailStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
