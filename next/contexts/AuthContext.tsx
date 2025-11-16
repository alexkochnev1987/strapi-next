'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { STRAPI_URL } from '@/lib/config';
import {
  getMeAction,
  loginAction,
  logoutAction,
  registerAction,
} from '@/lib/server/auth';
import type { LoginInput, RegisterInput, User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount (only if no initial user)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const userData = await getMeAction();
      setUser(userData);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (input: LoginInput) => {
    try {
      setIsLoading(true);
      const result = await loginAction(input);
      if (!result.success || !result.user) {
        throw new Error(result.error || 'Login failed');
      }
      setUser(result.user);
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      setIsLoading(true);
      const result = await registerAction(input);
      if (!result.success || !result.user) {
        throw new Error(result.error || 'Registration failed');
      }
      setUser(result.user);
    } catch (error) {
      console.error('Registration error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const result = await logoutAction();
      if (!result.success) {
        throw new Error(result.error || 'Logout failed');
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${STRAPI_URL}/api/connect/google`;
  };

  const checkAuth = async () => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user: user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle: handleGoogleLogin,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
