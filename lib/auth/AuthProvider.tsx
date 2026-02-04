'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authStore, AuthState } from './auth';
import { User, UserRole } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (email: string, password: string, name: string, role: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void | Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Verify authentication with server on mount
    const verifyAuth = async () => {
      setState({ user: null, isLoading: true });
      const user = await authStore.verifyWithServer();
      setState({ user, isLoading: false });
    };

    verifyAuth();
    
    const unsubscribe = authStore.subscribe(() => {
      const currentUser = authStore.getUser();
      setState({ user: currentUser, isLoading: false });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return authStore.login(email, password);
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    return authStore.register(email, password, name, role as UserRole);
  };

  const logout = async () => {
    setState({ user: null, isLoading: false });
    await authStore.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const hasRole = (role: string) => {
    return authStore.hasRole(role as UserRole);
  };

  const hasAnyRole = (roles: string[]) => {
    return authStore.hasAnyRole(roles as UserRole[]);
  };

  const contextValue = {
    ...state,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

