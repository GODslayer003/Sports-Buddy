// Mock data for Sports Buddy application
import { SportsCategory, City, Area, SportsEvent, User, UserProfile } from '../types';

export const mockSportsCategories: SportsCategory[] = [
  {
    id: '1',
    name: 'Basketball',
    description: 'Indoor and outdoor basketball games',
    icon: '🏀',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Soccer',
    description: 'Football matches and training sessions',
    icon: '⚽',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Tennis',
    description: 'Singles and doubles tennis matches',
    icon: '🎾',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Running',
    description: 'Running groups and marathons',
    icon: '🏃',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: 'Swimming',
    description: 'Swimming sessions and competitions',
    icon: '🏊',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: 'Volleyball',
    description: 'Beach and indoor volleyball games',
    icon: '🏐',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: 'Climbing',
    description: 'Indoor and outdoor rock climbing',
    icon: '🧗',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: 'Yoga',
    description: 'Yoga classes and meditation sessions',
    icon: '🧘',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '9',
    name: 'Cycling',
    description: 'Road cycling and mountain biking',
    icon: '🚴',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '10',
    name: 'Martial Arts',
    description: 'Various martial arts training',
    icon: '🥋',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '11',
    name: 'Golf',
    description: 'Golf games and practice sessions',
    icon: '⛳',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '12',
    name: 'Hiking',
    description: 'Nature hikes and trail walking',
    icon: '🥾',
    createdAt: new Date('2024-01-01')
  }
];

export const mockCities: City[] = [
  {
    id: '1',
    name: 'New York',
    state: 'NY',
    country: 'USA',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '2',
    name: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: '3',
    name: 'Chicago',
    state: 'IL',
    country: 'USA',
    coordinates: { lat: 41.8781, lng: -87.6298 }
  },
  {
    id: '4',
    name: 'Houston',
    state: 'TX',
    country: 'USA',
    coordinates: { lat: 29.7604, lng: -95.3698 }
  }
];

export const mockAreas: Area[] = [
  {
    id: '1',
    name: 'Manhattan',
    cityId: '1',
    description: 'Central Manhattan area',
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: '2',
    name: 'Brooklyn',
    cityId: '1',
    description: 'Brooklyn neighborhoods',
    coordinates: { lat: 40.6782, lng: -73.9442 }
  },
  {
    id: '3',
    name: 'Hollywood',
    cityId: '2',
    description: 'Hollywood area',
    coordinates: { lat: 34.0928, lng: -118.3287 }
  },
  {
    id: '4',
    name: 'Santa Monica',
    cityId: '2',
    description: 'Santa Monica beach area',
    coordinates: { lat: 34.0195, lng: -118.4912 }
  }
];

export const mockUserProfile: UserProfile = {
  bio: 'Passionate about sports and making new connections!',
  location: 'Manhattan, NY',
  preferredSports: ['Basketball', 'Tennis', 'Running'],
  skillLevels: {
    'Basketball': 'intermediate',
    'Tennis': 'beginner',
    'Running': 'advanced'
  },
  availability: ['weekday-evening', 'weekend-morning', 'weekend-afternoon'],
  age: 28,
  phoneNumber: '+1-555-0123'
};

export const mockCurrentUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  isAdmin: false,
  createdAt: new Date('2024-01-15'),
  profile: mockUserProfile
};

export const mockAdminUser: User = {
  id: 'admin-1',
  email: 'admin@sportsbuddy.com',
  name: 'Admin User',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  isAdmin: true,
  createdAt: new Date('2024-01-01')
};

export const mockSportsEvents: SportsEvent[] = [
  {
    id: '1',
    title: 'Weekend Basketball Pickup',
    description: 'Casual basketball game in Central Park. All skill levels welcome! We\'ll have fun drills and scrimmage games.',
    sport: 'Basketball',
    skillLevelRequired: 'any',
    date: new Date('2024-12-21'),
    startTime: '10:00',
    endTime: '12:00',
    location: {
      name: 'Central Park Basketball Courts',
      address: 'Central Park, Manhattan, NY',
      cityId: '1',
      areaId: '1',
      coordinates: { lat: 40.7829, lng: -73.9654 }
    },
    maxParticipants: 10,
    currentParticipants: ['user-1', 'user-2'],
    organizerId: 'user-1',
    isPublic: true,
    tags: ['casual', 'pickup', 'weekend'],
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15')
  },
  {
    id: '2',
    title: 'Tennis Practice Session',
    description: 'Intermediate tennis practice. Looking for consistent hitting partner to work on groundstrokes and serves.',
    sport: 'Tennis',
    skillLevelRequired: 'intermediate',
    date: new Date('2024-12-22'),
    startTime: '18:00',
    endTime: '20:00',
    location: {
      name: 'Manhattan Tennis Club',
      address: '123 Tennis St, Manhattan, NY',
      cityId: '1',
      areaId: '1'
    },
    maxParticipants: 4,
    currentParticipants: ['user-3'],
    organizerId: 'user-3',
    isPublic: true,
    tags: ['practice', 'intermediate', 'weekday'],
    createdAt: new Date('2024-12-16'),
    updatedAt: new Date('2024-12-16')
  },
  {
    id: '3',
    title: 'Morning Running Group',
    description: 'Early morning 5K run through Brooklyn Bridge Park. Perfect for beginners and those looking to start their day actively!',
    sport: 'Running',
    skillLevelRequired: 'beginner',
    date: new Date('2024-12-23'),
    startTime: '07:00',
    endTime: '08:00',
    location: {
      name: 'Brooklyn Bridge Park',
      address: 'Brooklyn Bridge Park, Brooklyn, NY',
      cityId: '1',
      areaId: '2'
    },
    maxParticipants: 15,
    currentParticipants: ['user-4', 'user-5', 'user-6'],
    organizerId: 'user-4',
    isPublic: true,
    tags: ['morning', 'running', 'beginner-friendly'],
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date('2024-12-17')
  },
  {
    id: '4',
    title: 'Soccer Scrimmage Match',
    description: 'Competitive 11v11 soccer match. Advanced players preferred. Full 90-minute game with refs.',
    sport: 'Soccer',
    skillLevelRequired: 'advanced',
    date: new Date('2024-12-24'),
    startTime: '14:00',
    endTime: '16:30',
    location: {
      name: 'Randalls Island Soccer Fields',
      address: 'Randalls Island, Manhattan, NY',
      cityId: '1',
      areaId: '1',
      coordinates: { lat: 40.7870, lng: -73.9248 }
    },
    maxParticipants: 22,
    currentParticipants: ['user-5', 'user-6', 'user-7', 'user-8', 'user-9'],
    organizerId: 'user-5',
    isPublic: true,
    tags: ['competitive', 'advanced', 'scrimmage', 'weekend'],
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-18')
  },
  {
    id: '5',
    title: 'Beach Volleyball Tournament',
    description: 'Sand volleyball tournament at Santa Monica Beach. Teams of 4, prizes for winners!',
    sport: 'Volleyball',
    skillLevelRequired: 'intermediate',
    date: new Date('2024-12-25'),
    startTime: '11:00',
    endTime: '17:00',
    location: {
      name: 'Santa Monica Beach Volleyball Courts',
      address: 'Santa Monica Beach, CA',
      cityId: '2',
      areaId: '4'
    },
    maxParticipants: 32,
    currentParticipants: ['user-10', 'user-11', 'user-12'],
    organizerId: 'user-10',
    isPublic: true,
    tags: ['tournament', 'beach', 'prizes', 'intermediate'],
    createdAt: new Date('2024-12-19'),
    updatedAt: new Date('2024-12-19')
  },
  {
    id: '6',
    title: 'Swimming Laps & Technique',
    description: 'Open water swimming practice session. Focus on stroke technique and endurance building.',
    sport: 'Swimming',
    skillLevelRequired: 'intermediate',
    date: new Date('2024-12-26'),
    startTime: '08:00',
    endTime: '10:00',
    location: {
      name: 'Astoria Pool Complex',
      address: '19-01 23rd Ave, Astoria, NY',
      cityId: '1',
      areaId: '2'
    },
    maxParticipants: 8,
    currentParticipants: ['user-13', 'user-14'],
    organizerId: 'user-13',
    isPublic: true,
    tags: ['technique', 'swimming', 'morning', 'endurance'],
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20')
  },
  {
    id: '7',
    title: 'Indoor Rock Climbing Session',
    description: 'Beginner-friendly rock climbing session at local climbing gym. All equipment provided!',
    sport: 'Climbing',
    skillLevelRequired: 'beginner',
    date: new Date('2024-12-27'),
    startTime: '19:00',
    endTime: '21:00',
    location: {
      name: 'Brooklyn Boulders',
      address: '575 Degraw St, Brooklyn, NY',
      cityId: '1',
      areaId: '2'
    },
    maxParticipants: 12,
    currentParticipants: ['user-15'],
    organizerId: 'user-15',
    isPublic: true,
    tags: ['climbing', 'beginner', 'indoor', 'equipment-provided'],
    createdAt: new Date('2024-12-21'),
    updatedAt: new Date('2024-12-21')
  },
  {
    id: '8',
    title: 'Yoga in the Park',
    description: 'Relaxing outdoor yoga session suitable for all levels. Bring your own mat!',
    sport: 'Yoga',
    skillLevelRequired: 'any',
    date: new Date('2024-12-28'),
    startTime: '09:00',
    endTime: '10:30',
    location: {
      name: 'Prospect Park Meadow',
      address: 'Prospect Park, Brooklyn, NY',
      cityId: '1',
      areaId: '2'
    },
    maxParticipants: 20,
    currentParticipants: ['user-16', 'user-17', 'user-18'],
    organizerId: 'user-16',
    isPublic: true,
    tags: ['yoga', 'outdoor', 'relaxing', 'all-levels'],
    createdAt: new Date('2024-12-22'),
    updatedAt: new Date('2024-12-22')
  }
];

// Logging utility for actions
export const logAction = (action: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    data: data || null,
    user: mockCurrentUser.id
  };
  
  console.log('Sports Buddy Action Log:', logEntry);
  
  // In a real application, this would send to a logging service
  // For now, we'll store in localStorage for demonstration
  const logs = JSON.parse(localStorage.getItem('sportsBuddyLogs') || '[]');
  logs.push(logEntry);
  localStorage.setItem('sportsBuddyLogs', JSON.stringify(logs.slice(-100))); // Keep last 100 logs
};