/**
 * User Data Service
 * Manages user-specific data persistence across Supabase and localStorage
 */

import { callServer } from './supabase/client';

// Type definitions for user data
export interface UserData {
  events: string[]; // Event IDs user has joined
  likedMatches: string[]; // Match IDs user has liked
  passedMatches: string[]; // Match IDs user has passed
  conversations: any[]; // User's conversations
  createdEvents: string[]; // Event IDs user has created
  achievements: string[]; // Unlocked achievement IDs
  lastUpdated: string;
}

/**
 * Get storage key for user-specific data
 */
function getUserDataKey(userId: string): string {
  return `sportsbuddy_user_data_${userId}`;
}

/**
 * Load user data from localStorage
 */
function loadFromLocalStorage(userId: string): UserData | null {
  try {
    const key = getUserDataKey(userId);
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
  }
  return null;
}

/**
 * Save user data to localStorage
 */
function saveToLocalStorage(userId: string, data: UserData): void {
  try {
    const key = getUserDataKey(userId);
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

/**
 * Get initial/empty user data structure
 */
function getEmptyUserData(): UserData {
  return {
    events: [],
    likedMatches: [],
    passedMatches: [],
    conversations: [],
    createdEvents: [],
    achievements: [],
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Load user data (from Supabase or localStorage)
 */
export async function loadUserData(userId: string): Promise<UserData> {
  try {
    // Try to load from Supabase first
    const response = await callServer(`/user-data/${userId}`);
    
    if (response.ok) {
      const data = await response.json();
      // Save to localStorage as cache
      saveToLocalStorage(userId, data.userData);
      return data.userData;
    }
  } catch (error) {
    console.debug('Failed to load from Supabase, using localStorage:', error);
  }

  // Fallback to localStorage
  const localData = loadFromLocalStorage(userId);
  if (localData) {
    return localData;
  }

  // Return empty data structure if nothing exists
  return getEmptyUserData();
}

/**
 * Save user data (to both Supabase and localStorage)
 */
export async function saveUserData(userId: string, data: Partial<UserData>): Promise<boolean> {
  try {
    // Load existing data
    const existingData = await loadUserData(userId);
    
    // Merge with new data
    const updatedData: UserData = {
      ...existingData,
      ...data,
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage immediately (for instant updates)
    saveToLocalStorage(userId, updatedData);

    // Try to sync to Supabase
    try {
      const response = await callServer('/user-data', {
        method: 'PUT',
        body: JSON.stringify({ userId, userData: updatedData })
      });

      if (response.ok) {
        console.debug('User data synced to Supabase successfully');
        return true;
      } else {
        console.debug('Supabase sync failed, data saved locally only');
      }
    } catch (error) {
      console.debug('Supabase not available, data saved locally only:', error);
    }

    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
}

/**
 * Add event to user's joined events
 */
export async function joinEvent(userId: string, eventId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    if (!data.events.includes(eventId)) {
      data.events.push(eventId);
      return await saveUserData(userId, data);
    }
    return true;
  } catch (error) {
    console.error('Error joining event:', error);
    return false;
  }
}

/**
 * Remove event from user's joined events
 */
export async function leaveEvent(userId: string, eventId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    data.events = data.events.filter(id => id !== eventId);
    return await saveUserData(userId, data);
  } catch (error) {
    console.error('Error leaving event:', error);
    return false;
  }
}

/**
 * Add match to user's liked matches
 */
export async function likeMatch(userId: string, matchId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    if (!data.likedMatches.includes(matchId)) {
      data.likedMatches.push(matchId);
      return await saveUserData(userId, data);
    }
    return true;
  } catch (error) {
    console.error('Error liking match:', error);
    return false;
  }
}

/**
 * Add match to user's passed matches
 */
export async function passMatch(userId: string, matchId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    if (!data.passedMatches.includes(matchId)) {
      data.passedMatches.push(matchId);
      return await saveUserData(userId, data);
    }
    return true;
  } catch (error) {
    console.error('Error passing match:', error);
    return false;
  }
}

/**
 * Reset passed matches
 */
export async function resetPassedMatches(userId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    data.passedMatches = [];
    return await saveUserData(userId, data);
  } catch (error) {
    console.error('Error resetting passed matches:', error);
    return false;
  }
}

/**
 * Add event to user's created events
 */
export async function createEvent(userId: string, eventId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    if (!data.createdEvents.includes(eventId)) {
      data.createdEvents.push(eventId);
      // Also add to joined events
      if (!data.events.includes(eventId)) {
        data.events.push(eventId);
      }
      return await saveUserData(userId, data);
    }
    return true;
  } catch (error) {
    console.error('Error creating event:', error);
    return false;
  }
}

/**
 * Unlock achievement for user
 */
export async function unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
  try {
    const data = await loadUserData(userId);
    if (!data.achievements.includes(achievementId)) {
      data.achievements.push(achievementId);
      return await saveUserData(userId, data);
    }
    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
}

/**
 * Clear all user data (used on logout)
 */
export function clearUserData(userId: string): void {
  try {
    const key = getUserDataKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}
