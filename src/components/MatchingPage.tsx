import { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, X, MapPin, Users, MessageCircle, Calendar, Trophy, Star, Info } from 'lucide-react';
import { mockSportsCategories, logAction } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { likeMatch, passMatch, resetPassedMatches, loadUserData } from '../utils/userDataService';

interface MatchingPageProps {
  onNavigate: (page: string) => void;
}

interface PotentialMatch {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  location: string;
  distance: number;
  commonSports: string[];
  skillLevels: Record<string, string>;
  rating: number;
  totalGames: number;
  availability: string[];
  lastActive: string;
}

const mockPotentialMatches: PotentialMatch[] = [
  {
    id: 'match-1',
    name: 'Sarah Williams',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    bio: 'Tennis enthusiast looking for regular hitting partners. Love competitive games and improving my skills!',
    location: 'Manhattan, NY',
    distance: 1.2,
    commonSports: ['Tennis', 'Running'],
    skillLevels: { Tennis: 'intermediate', Running: 'advanced' },
    rating: 4.8,
    totalGames: 47,
    availability: ['weekday-evening', 'weekend-morning'],
    lastActive: '2 hours ago'
  },
  {
    id: 'match-2',
    name: 'Mike Johnson',
    age: 31,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Basketball player since high school. Always up for pickup games and meeting new people on the court.',
    location: 'Brooklyn, NY',
    distance: 3.8,
    commonSports: ['Basketball', 'Swimming'],
    skillLevels: { Basketball: 'advanced', Swimming: 'intermediate' },
    rating: 4.6,
    totalGames: 89,
    availability: ['weekend-morning', 'weekend-afternoon'],
    lastActive: '1 day ago'
  },
  {
    id: 'match-3',
    name: 'Emily Chen',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Soccer player and running enthusiast. Training for my first marathon while keeping up with weekly soccer games.',
    location: 'Manhattan, NY',
    distance: 0.8,
    commonSports: ['Soccer', 'Running'],
    skillLevels: { Soccer: 'intermediate', Running: 'expert' },
    rating: 4.9,
    totalGames: 34,
    availability: ['weekday-evening', 'weekend-morning', 'weekend-afternoon'],
    lastActive: '30 minutes ago'
  },
  {
    id: 'match-4',
    name: 'David Rodriguez',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Volleyball and swimming coach. Love helping others improve while staying active myself.',
    location: 'Queens, NY',
    distance: 5.2,
    commonSports: ['Volleyball', 'Swimming'],
    skillLevels: { Volleyball: 'expert', Swimming: 'advanced' },
    rating: 4.7,
    totalGames: 123,
    availability: ['weekday-evening'],
    lastActive: '3 hours ago'
  }
];

export function MatchingPage({ onNavigate }: MatchingPageProps) {
  const { user } = useAuth();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [likedMatches, setLikedMatches] = useState<string[]>([]);
  const [passedMatches, setPassedMatches] = useState<string[]>([]);

  // Load user's match preferences on mount
  useEffect(() => {
    const loadMatchData = async () => {
      if (!user) return;
      
      try {
        const userData = await loadUserData(user.id);
        setLikedMatches(userData.likedMatches || []);
        setPassedMatches(userData.passedMatches || []);
      } catch (error) {
        console.error('Error loading match data:', error);
      }
    };
    
    loadMatchData();
  }, [user]);

  const filteredMatches = useMemo(() => {
    return mockPotentialMatches.filter(match => {
      if (likedMatches.includes(match.id) || passedMatches.includes(match.id)) {
        return false;
      }
      
      if (selectedSport === 'all') {
        return true;
      }
      
      return match.commonSports.includes(selectedSport);
    });
  }, [selectedSport, likedMatches, passedMatches]);

  const currentMatch = filteredMatches[currentMatchIndex];

  const handleLike = async () => {
    if (!currentMatch || !user) return;
    
    const success = await likeMatch(user.id, currentMatch.id);
    
    if (success) {
      setLikedMatches(prev => [...prev, currentMatch.id]);
      logAction('MATCH_LIKED', {
        userId: user?.id,
        matchedUserId: currentMatch.id,
        matchedUserName: currentMatch.name
      });
      
      // Move to next match
      if (currentMatchIndex < filteredMatches.length - 1) {
        setCurrentMatchIndex(prev => prev + 1);
      } else {
        setCurrentMatchIndex(0);
      }
    }
  };

  const handlePass = async () => {
    if (!currentMatch || !user) return;
    
    const success = await passMatch(user.id, currentMatch.id);
    
    if (success) {
      setPassedMatches(prev => [...prev, currentMatch.id]);
      logAction('MATCH_PASSED', {
        userId: user?.id,
        passedUserId: currentMatch.id,
        passedUserName: currentMatch.name
      });
      
      // Move to next match
      if (currentMatchIndex < filteredMatches.length - 1) {
        setCurrentMatchIndex(prev => prev + 1);
      } else {
        setCurrentMatchIndex(0);
      }
    }
  };

  const handleResetPassed = async () => {
    if (!user) return;
    
    const success = await resetPassedMatches(user.id);
    
    if (success) {
      setPassedMatches([]);
      setCurrentMatchIndex(0);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const compatibilityScore = currentMatch ? Math.floor(85 + Math.random() * 15) : 0;

  if (!currentMatch) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No More Matches</h2>
          <p className="text-muted-foreground mb-6">
            You've seen all available matches for your criteria. Try adjusting your sport filter or check back later for new users.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleResetPassed}>
              Reset Passed Matches
            </Button>
            <Button variant="outline" onClick={() => onNavigate('events')}>
              Browse Events Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Find Your Sports Buddy</h1>
          <p className="text-muted-foreground">Discover players who match your interests and skill level</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {mockSportsCategories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Card */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {/* Profile Image */}
            <div className="relative h-80">
              <ImageWithFallback
                src={currentMatch.avatar}
                alt={currentMatch.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-background/90">
                  <MapPin className="w-3 h-3 mr-1" />
                  {currentMatch.distance} miles away
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-background/90">
                  {currentMatch.lastActive}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {currentMatch.name}, {currentMatch.age}
                  </h2>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentMatch.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                      {currentMatch.rating} ({currentMatch.totalGames} games)
                    </div>
                  </div>
                  <p className="text-muted-foreground">{currentMatch.bio}</p>
                </div>

                {/* Common Sports */}
                <div>
                  <h3 className="font-semibold mb-3">Sports in Common</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.commonSports.map((sport) => (
                      <div key={sport} className="flex items-center gap-2">
                        <Badge variant="outline">
                          {mockSportsCategories.find(c => c.name === sport)?.icon} {sport}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={getSkillLevelColor(currentMatch.skillLevels[sport])}
                        >
                          {currentMatch.skillLevels[sport]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-semibold mb-3">Available Times</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.availability.map((time) => (
                      <Badge key={time} variant="outline">
                        {time.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePass}
                    className="flex-1 h-14"
                  >
                    <X className="w-6 h-6 mr-2" />
                    Pass
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleLike}
                    className="flex-1 h-14 bg-pink-600 hover:bg-pink-700"
                  >
                    <Heart className="w-6 h-6 mr-2" />
                    Like
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compatibility Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compatibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary mb-2">{compatibilityScore}%</div>
                <p className="text-sm text-muted-foreground">Match Score</p>
              </div>
              <Progress value={compatibilityScore} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Common Sports</span>
                  <span className="font-medium">{currentMatch.commonSports.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-medium">{currentMatch.distance}mi</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability</span>
                  <span className="font-medium">{currentMatch.availability.length} slots</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Matching Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Likes Given</span>
                <span className="font-semibold">{likedMatches.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profiles Viewed</span>
                <span className="font-semibold">{likedMatches.length + passedMatches.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold">{filteredMatches.length - currentMatchIndex - 1}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Likes */}
          {likedMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Likes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {likedMatches.slice(-3).map((matchId) => {
                    const match = mockPotentialMatches.find(m => m.id === matchId);
                    if (!match) return null;
                    
                    return (
                      <div key={matchId} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={match.avatar} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{match.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {match.commonSports[0]}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                {likedMatches.length > 3 && (
                  <Button variant="link" className="w-full mt-2">
                    View All Likes ({likedMatches.length})
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}