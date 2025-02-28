
import { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'wouter';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
      setUser({ id: userId });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Here you would normally make an API call to authenticate
      // For now, we'll simply simulate a successful login
      const userId = `user_${Date.now()}`;
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      setUser({ id: userId, username });
      setLocation('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null);
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
