
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from './queryClient';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        // Check local storage for auth token
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token with server if needed
          // const response = await apiRequest('/api/auth/verify', 'GET');
          // if (response.ok) {
          //   const userData = await response.json();
          //   setUser(userData);
          //   setIsAuthenticated(true);
          // }
          
          // For now, just assume token means authenticated
          setIsAuthenticated(true);
          
          // Mock user data
          setUser({ id: 1, name: "User" });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await apiRequest('/api/auth/login', 'POST', credentials);
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('auth_token', data.accessKey || 'mock-token');
        setUser(data);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user }}>
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
