import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { logAction } from '../lib/mockData';
import { createClient, callServer } from '../utils/supabase/client';
import { loadUserData, clearUserData } from '../utils/userDataService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts for fallback authentication
const DEMO_ACCOUNTS = [
  {
    email: 'demo@sportsbuddy.com',
    password: 'demo123',
    profile: {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@sportsbuddy.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      bio: 'Sports enthusiast and fitness lover',
      sports: ['Tennis', 'Basketball'],
      skillLevel: 'intermediate' as const,
      location: 'San Francisco, CA',
      preferredDays: ['weekends'],
      preferredTimes: ['morning'],
      isAdmin: false,
      joinedDate: '2024-01-15',
    }
  },
  {
    email: 'admin@sportsbuddy.com',
    password: 'admin123',
    profile: {
      id: 'admin-user-1',
      name: 'Admin User',
      email: 'admin@sportsbuddy.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      bio: 'Platform administrator',
      sports: ['Soccer', 'Running'],
      skillLevel: 'advanced' as const,
      location: 'New York, NY',
      preferredDays: ['weekdays'],
      preferredTimes: ['evening'],
      isAdmin: true,
      joinedDate: '2024-01-01',
    }
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });
  const [useSupabase, setUseSupabase] = useState(true);

  useEffect(() => {
    // Check for existing Supabase session
    const checkSession = async () => {
      try {
        const supabase = createClient();
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 3000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;

        if (error) {
          console.debug('Session check error, using mock auth:', error);
          setUseSupabase(false);
          checkMockSession();
          return;
        }

        if (session?.user) {
          // Fetch user profile from server
          try {
            const response = await callServer('/profile');
            
            if (response.ok) {
              const { profile } = await response.json();
              
              // Load user-specific data
              await loadUserData(profile.id);
              
              setAuthState({
                user: profile,
                isLoading: false,
                isAuthenticated: true
              });
              logAction('SESSION_RESTORED', { userId: profile.id });
            } else {
              // If profile fetch fails, clear session
              await supabase.auth.signOut();
              setAuthState({ user: null, isLoading: false, isAuthenticated: false });
            }
          } catch (profileError) {
            console.debug('Profile fetch failed, falling back to mock auth:', profileError);
            setUseSupabase(false);
            checkMockSession();
          }
        } else {
          setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        }
      } catch (error) {
        console.debug('Supabase unavailable, using mock authentication:', error);
        setUseSupabase(false);
        checkMockSession();
      }
    };

    const checkMockSession = async () => {
      // Check for mock session in localStorage
      const mockUser = localStorage.getItem('mockUser');
      if (mockUser) {
        try {
          const user = JSON.parse(mockUser);
          
          // Load user-specific data
          await loadUserData(user.id);
          
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true
          });
          logAction('MOCK_SESSION_RESTORED', { userId: user.id });
        } catch (error) {
          console.error('Error parsing mock user:', error);
          setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        }
      } else {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      logAction('LOGIN_ATTEMPT', { email });
      
      if (useSupabase) {
        try {
          const supabase = createClient();
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Login timeout')), 5000)
          );
          
          const loginPromise = supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          const { data, error } = await Promise.race([
            loginPromise,
            timeoutPromise
          ]) as any;

          if (error || !data.session) {
            console.debug('Supabase login failed, trying mock auth:', error);
            setUseSupabase(false);
            return loginWithMock(email, password);
          }

          // Fetch user profile
          const response = await callServer('/profile');
          
          if (!response.ok) {
            console.error('Failed to fetch profile after login');
            await supabase.auth.signOut();
            return loginWithMock(email, password);
          }

          const { profile } = await response.json();
          
          setAuthState({
            user: profile,
            isLoading: false,
            isAuthenticated: true
          });
          
          logAction('LOGIN_SUCCESS', { userId: profile.id, userType: profile.isAdmin ? 'admin' : 'user' });
          
          return true;
        } catch (error) {
          console.debug('Supabase error, falling back to mock auth:', error);
          setUseSupabase(false);
          return loginWithMock(email, password);
        }
      } else {
        return loginWithMock(email, password);
      }
    } catch (error) {
      console.error('Login error:', error);
      logAction('LOGIN_ERROR', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  const loginWithMock = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      setAuthState({
        user: account.profile,
        isLoading: false,
        isAuthenticated: true
      });
      
      // Store in localStorage for session persistence
      localStorage.setItem('mockUser', JSON.stringify(account.profile));
      
      logAction('MOCK_LOGIN_SUCCESS', { userId: account.profile.id });
      return true;
    }
    
    logAction('LOGIN_FAILED', { email, reason: 'Invalid credentials' });
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      logAction('REGISTER_ATTEMPT', { email, name });
      
      if (!useSupabase) {
        // For mock mode, just create a new mock user
        const newUser = {
          id: `mock-user-${Date.now()}`,
          name,
          email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          bio: '',
          sports: [],
          skillLevel: 'beginner' as const,
          location: '',
          preferredDays: [],
          preferredTimes: [],
          isAdmin: false,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        
        setAuthState({
          user: newUser,
          isLoading: false,
          isAuthenticated: true
        });
        
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        logAction('MOCK_REGISTER_SUCCESS', { userId: newUser.id });
        return true;
      }
      
      try {
        // Call server to create user
        const response = await callServer('/signup', {
          method: 'POST',
          body: JSON.stringify({ email, password, name }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Registration error:', data.error);
          logAction('REGISTER_FAILED', { email, reason: data.error });
          return false;
        }

        // Now login with the new credentials
        const supabase = createClient();
        
        // Add timeout to login
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout')), 5000)
        );
        
        const loginPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        const { data: loginData, error: loginError } = await Promise.race([
          loginPromise,
          timeoutPromise
        ]) as any;

        if (loginError || !loginData.session) {
          console.error('Auto-login after registration failed:', loginError);
          return false;
        }

        // Fetch user profile
        const profileResponse = await callServer('/profile');
        
        if (!profileResponse.ok) {
          console.error('Failed to fetch profile after registration');
          return false;
        }

        const { profile } = await profileResponse.json();
        
        setAuthState({
          user: profile,
          isLoading: false,
          isAuthenticated: true
        });
        
        logAction('REGISTER_SUCCESS', { userId: profile.id });
        
        return true;
      } catch (supabaseError) {
        console.debug('Supabase registration failed, falling back to mock:', supabaseError);
        setUseSupabase(false);
        
        // Create mock user as fallback
        const newUser = {
          id: `mock-user-${Date.now()}`,
          name,
          email,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          bio: '',
          sports: [],
          skillLevel: 'beginner' as const,
          location: '',
          preferredDays: [],
          preferredTimes: [],
          isAdmin: false,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        
        setAuthState({
          user: newUser,
          isLoading: false,
          isAuthenticated: true
        });
        
        localStorage.setItem('mockUser', JSON.stringify(newUser));
        logAction('MOCK_REGISTER_SUCCESS', { userId: newUser.id });
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      logAction('REGISTER_ERROR', { email, error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  };

  const logout = () => {
    logAction('LOGOUT', { userId: authState.user?.id });
    
    // Clear user-specific data first (before clearing user state)
    if (authState.user?.id) {
      clearUserData(authState.user.id);
    }
    
    if (useSupabase) {
      try {
        const supabase = createClient();
        supabase.auth.signOut();
      } catch (error) {
        console.debug('Supabase signout error:', error);
      }
    }
    
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    
    // Clear mock session from localStorage
    localStorage.removeItem('mockUser');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    try {
      if (useSupabase) {
        const response = await callServer('/profile', {
          method: 'PUT',
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          console.error('Failed to update user profile');
          // Fall back to local update
          updateUserLocally(updates);
          return;
        }

        const { profile } = await response.json();
        
        setAuthState(prev => ({
          ...prev,
          user: profile
        }));
      } else {
        updateUserLocally(updates);
      }
      
      logAction('USER_UPDATED', { userId: authState.user.id, updates });
    } catch (error) {
      console.error('Update user error:', error);
      updateUserLocally(updates);
    }
  };

  const updateUserLocally = (updates: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...updates };
    
    setAuthState(prev => ({
      ...prev,
      user: updatedUser
    }));
    
    // Update mock session in localStorage
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
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