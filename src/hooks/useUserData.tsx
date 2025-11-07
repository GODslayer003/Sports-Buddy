/**
 * Custom hook for managing user-specific data
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  loadUserData, 
  saveUserData, 
  UserData,
  joinEvent as joinEventService,
  leaveEvent as leaveEventService,
  likeMatch as likeMatchService,
  passMatch as passMatchService,
  resetPassedMatches as resetPassedMatchesService
} from '../utils/userDataService';

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await loadUserData(user.id);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Save user data
  const save = useCallback(async (updates: Partial<UserData>) => {
    if (!user) return false;

    try {
      const success = await saveUserData(user.id, updates);
      if (success) {
        // Reload user data to get the latest
        const data = await loadUserData(user.id);
        setUserData(data);
      }
      return success;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }, [user]);

  // Join an event
  const joinEvent = useCallback(async (eventId: string) => {
    if (!user) return false;

    const success = await joinEventService(user.id, eventId);
    if (success) {
      setUserData(prev => prev ? {
        ...prev,
        events: [...prev.events, eventId]
      } : null);
    }
    return success;
  }, [user]);

  // Leave an event
  const leaveEvent = useCallback(async (eventId: string) => {
    if (!user) return false;

    const success = await leaveEventService(user.id, eventId);
    if (success) {
      setUserData(prev => prev ? {
        ...prev,
        events: prev.events.filter(id => id !== eventId)
      } : null);
    }
    return success;
  }, [user]);

  // Like a match
  const likeMatch = useCallback(async (matchId: string) => {
    if (!user) return false;

    const success = await likeMatchService(user.id, matchId);
    if (success) {
      setUserData(prev => prev ? {
        ...prev,
        likedMatches: [...prev.likedMatches, matchId]
      } : null);
    }
    return success;
  }, [user]);

  // Pass a match
  const passMatch = useCallback(async (matchId: string) => {
    if (!user) return false;

    const success = await passMatchService(user.id, matchId);
    if (success) {
      setUserData(prev => prev ? {
        ...prev,
        passedMatches: [...prev.passedMatches, matchId]
      } : null);
    }
    return success;
  }, [user]);

  // Reset passed matches
  const resetPassedMatches = useCallback(async () => {
    if (!user) return false;

    const success = await resetPassedMatchesService(user.id);
    if (success) {
      setUserData(prev => prev ? {
        ...prev,
        passedMatches: []
      } : null);
    }
    return success;
  }, [user]);

  // Check if user has joined an event
  const hasJoinedEvent = useCallback((eventId: string) => {
    return userData?.events.includes(eventId) || false;
  }, [userData]);

  // Check if user has liked a match
  const hasLikedMatch = useCallback((matchId: string) => {
    return userData?.likedMatches.includes(matchId) || false;
  }, [userData]);

  // Check if user has passed a match
  const hasPassedMatch = useCallback((matchId: string) => {
    return userData?.passedMatches.includes(matchId) || false;
  }, [userData]);

  return {
    userData,
    isLoading,
    save,
    joinEvent,
    leaveEvent,
    likeMatch,
    passMatch,
    resetPassedMatches,
    hasJoinedEvent,
    hasLikedMatch,
    hasPassedMatch
  };
}
