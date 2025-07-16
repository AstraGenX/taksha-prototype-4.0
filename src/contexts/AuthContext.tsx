
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'individual' | 'corporate' | 'institution' | 'admin';
  profilePicture?: string;
  provider?: 'email' | 'google';
  phone?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  updateProfile: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      localStorage.setItem('taksha_user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.register(userData);
      setUser(response.user);
      localStorage.setItem('taksha_user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await authAPI.googleAuth();
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    }
  };

  const updateProfile = async (userData: any): Promise<boolean> => {
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response.user);
      localStorage.setItem('taksha_user', JSON.stringify(response.user));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('taksha_user');
      localStorage.removeItem('auth_token');
    }
  };

  const isAdmin = () => {
    return user?.userType === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      isAdmin,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
