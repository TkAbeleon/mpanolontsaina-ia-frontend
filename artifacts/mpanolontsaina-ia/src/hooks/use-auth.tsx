import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, UserProfile, authApi } from '@/api/client';
import { useLocation } from 'wouter';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => usersApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (error && (error as any).status === 401) {
      localStorage.removeItem('mpanolontsaina_access_token');
      localStorage.removeItem('mpanolontsaina_refresh_token');
      queryClient.setQueryData(['me'], null);
    }
  }, [error, queryClient]);

  const logout = async () => {
    const refreshToken = localStorage.getItem('mpanolontsaina_refresh_token');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('mpanolontsaina_access_token');
    localStorage.removeItem('mpanolontsaina_refresh_token');
    // Purge every cached query (conversations, messages, profile...), not just
    // ['me'] -- otherwise stale authenticated data (history, chat) stays in
    // memory and only disappears after a manual page refresh.
    queryClient.clear();
    queryClient.setQueryData(['me'], null);
    setLocation('/');
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
