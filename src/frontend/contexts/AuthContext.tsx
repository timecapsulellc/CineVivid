/**
 * Authentication Context for CineVivid
 * Provides authentication state and methods throughout the app
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  credits: number;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  // Initialize authentication state
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        setCredits(userData.credits);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid token
      apiClient.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await apiClient.login({ username, password });
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setCredits(userData.credits);
    } catch (error) {
      setUser(null);
      setCredits(0);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await apiClient.register({
        username,
        email,
        password,
        full_name: fullName
      });
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setCredits(userData.credits);
    } catch (error) {
      setUser(null);
      setCredits(0);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } finally {
      setUser(null);
      setCredits(0);
      // Force reload to clear any cached data
      window.location.reload();
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (apiClient.isAuthenticated()) {
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        setCredits(userData.credits);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If token is invalid, logout
      await logout();
    }
  };

  const refreshCredits = async (): Promise<void> => {
    try {
      if (apiClient.isAuthenticated()) {
        const creditData = await apiClient.getUserCredits();
        setCredits(creditData.credits);
        
        // Also update user object if we have it
        if (user) {
          setUser({ ...user, credits: creditData.credits });
        }
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    credits,
    login,
    register,
    logout,
    refreshUser,
    refreshCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
};

export default AuthContext;