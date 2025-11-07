// Core types for Sports Buddy application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  location: string;
  preferredSports: string[];
  skillLevels: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'>;
  availability: string[];
  age?: number;
  phoneNumber?: string;
}

export interface SportsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: Date;
}

export interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Area {
  id: string;
  name: string;
  cityId: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SportsEvent {
  id: string;
  title: string;
  description: string;
  sport: string;
  skillLevelRequired: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'any';
  date: Date;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    cityId: string;
    areaId: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  maxParticipants: number;
  currentParticipants: string[]; // User IDs
  organizerId: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  sport: string;
  matchedAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  eventId?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';