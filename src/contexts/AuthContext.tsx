import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { mockCurrentUser, mockAdminUser, logAction } from '../lib/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('sportsBuddyUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        logAction('SESSION_RESTORED', { userId: user.id });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('sportsBuddyUser');
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      logAction('LOGIN_ATTEMPT', { email });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      let user: User;
      
      if (email === 'admin@sportsbuddy.com' && password === 'admin123') {
        user = mockAdminUser;
      } else if (email === 'john.doe@example.com' && password === 'password123') {
        user = mockCurrentUser;
      } else {
        logAction('LOGIN_FAILED', { email, reason: 'Invalid credentials' });
        return false;
      }
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true
      });
      
      localStorage.setItem('sportsBuddyUser', JSON.stringify(user));
      logAction('LOGIN_SUCCESS', { userId: user.id, userType: user.isAdmin ? 'admin' : 'user' });
      
      return true;
    } catch (error) {
      logAction('LOGIN_ERROR', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      logAction('REGISTER_ATTEMPT', { email, name });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration logic
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        isAdmin: false,
        createdAt: new Date(),
        profile: {
          bio: '',
          location: '',
          preferredSports: [],
          skillLevels: {},
          availability: []
        }
      };
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true
      });
      
      localStorage.setItem('sportsBuddyUser', JSON.stringify(newUser));
      logAction('REGISTER_SUCCESS', { userId: newUser.id });
      
      return true;
    } catch (error) {
      logAction('REGISTER_ERROR', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  const logout = () => {
    logAction('LOGOUT', { userId: authState.user?.id });
    
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    
    localStorage.removeItem('sportsBuddyUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...updates };
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
    
    localStorage.setItem('sportsBuddyUser', JSON.stringify(updatedUser));
    logAction('USER_UPDATED', { userId: authState.user.id, updates });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};