"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, isAuthenticated, getCurrentClient, logout as authLogout } from '@/lib/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  client: Client | null;
  loading: boolean;
  logout: () => void;
  login: (client: Client) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const currentClient = getCurrentClient();
      
      setIsLoggedIn(authenticated);
      setClient(currentClient);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (newClient: Client) => {
    setIsLoggedIn(true);
    setClient(newClient);
  };

  const logout = () => {
    authLogout();
    setIsLoggedIn(false);
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      client,
      loading,
      logout,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 