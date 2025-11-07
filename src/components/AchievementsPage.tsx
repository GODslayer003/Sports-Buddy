import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Trophy, Star, Target, Users, Calendar, MapPin, Flame, Medal, Crown, Award, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'participation' | 'skill' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  requirements: string[];
}

interface UserStats {
  totalEvents: number;
  totalMatches: number;
  totalFriends: number;
  favoritesSport: string;
  totalHoursPlayed: number;
  winRate: number;
  streak: number;
  level: number;
  totalPoints: number;
  nextLevelPoints: number;
}

const mockUserStats: UserStats = {
  totalEvents: 23,
  totalMatches: 45,
  totalFriends: 18,
  favoritesSport: 'Basketball',
  totalHoursPlayed: 127,
  winRate: 68,
  streak: 7,
  level: 12,
  totalPoints: 2340,
  nextLevelPoints: 2500
};

const mockAchievements: Achievement[] = [
  {
    id: 'first-event',
    title: 'First Steps',
    description: 'Join your first sports event',
    icon: Target,
    category: 'milestone',
    rarity: 'common',
    points: 50,
    unlocked: true,
    unlockedAt: new Date('2024-01-15'),
    requirements: ['Join 1 sports event']
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Make 10 new sports buddies',
    icon: Users,
    category: 'social',
    rarity: 'rare',
    points: 150,
    unlocked: true,
    unlockedAt: new Date('2024-02-20'),
    progress: 10,
    maxProgress: 10,
    requirements: ['Connect with 10 different players']
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Warrior',
    description: 'Participate in 15 weekend events',
    icon: Calendar,
    category: 'participation',
    rarity: 'rare',
    points: 200,
    unlocked: true,
    unlockedAt: new Date('2024-03-10'),
    progress: 15,
    maxProgress: 15,
    requirements: ['Participate in weekend events']
  },
  {
    id: 'hot-streak',
    title: 'Hot Streak',
    description: 'Win 5 matches in a row',
    icon: Flame,
    category: 'skill',
    rarity: 'epic',
    points: 300,
    unlocked: true,
    unlockedAt: new Date('2024-04-05'),
    requirements: ['Win consecutive matches']
  },
  {
    id: 'globe-trotter',
    title: 'Globe Trotter',
    description: 'Play sports in 5 different cities',
    icon: MapPin,
    category: 'milestone',
    rarity: 'epic',
    points: 250,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    requirements: ['Play in multiple cities']
  },
  {
    id: 'mvp',
    title: 'MVP Player',
    description: 'Receive 50 positive ratings',
    icon: Star,
    category: 'skill',
    rarity: 'epic',
    points: 400,
    unlocked: false,
    progress: 32,
    maxProgress: 50,
    requirements: ['Maintain high player ratings']
  },
  {
    id: 'master-organizer',
    title: 'Master Organizer',
    description: 'Successfully organize 25 events',
    icon: Crown,
    category: 'milestone',
    rarity: 'legendary',
    points: 500,
    unlocked: false,
    progress: 8,
    maxProgress: 25,
    requirements: ['Organize successful events']
  },
  {
    id: 'champion',
    title: 'Sports Champion',
    description: 'Reach expert level in 3 different sports',
    icon: Medal,
    category: 'skill',
    rarity: 'legendary',
    points: 750,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    requirements: ['Master multiple sports']
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Participate in 100 sports events',
    icon: Trophy,
    category: 'milestone',
    rarity: 'legendary',
    points: 1000,
    unlocked: false,
    progress: 23,
    maxProgress: 100,
    requirements: ['Long-term participation']
  }
];

const mockLeaderboard = [
  {
    rank: 1,
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    points: 4250,
    level: 18,
    badges: 15
  },
  {
    rank: 2,
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    points: 3890,
    level: 16,
    badges: 12
  },
  {
    rank: 3,
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    points: 3654,
    level: 15,
    badges: 11
  },
  {
    rank: 4,
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    points: 2340,
    level: 12,
    badges: 8,
    isCurrentUser: true
  },
  {
    rank: 5,
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    points: 2156,
    level: 11,
    badges: 7
  }
];

export function AchievementsPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return '';
    switch (rarity) {
      case 'epic':
        return 'shadow-lg shadow-purple-200';
      case 'legendary':
        return 'shadow-lg shadow-yellow-200';
      default:
        return '';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? mockAchievements 
    : mockAchievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedAchievements = mockAchievements.filter(a => a.unlocked);
  const progressLevel = (mockUserStats.totalPoints / mockUserStats.nextLevelPoints) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Achievements & Progress</h1>
        <p className="text-muted-foreground">Track your sports journey and unlock amazing rewards</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Player Level */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold">Level {mockUserStats.level}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Level {mockUserStats.level + 1}</span>
                    <span>{mockUserStats.totalPoints} / {mockUserStats.nextLevelPoints} XP</span>
                  </div>
                  <Progress value={progressLevel} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{mockUserStats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{unlockedAchievements.length}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Events Joined</span>
                <span className="font-semibold">{mockUserStats.totalEvents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Matches Played</span>
                <span className="font-semibold">{mockUserStats.totalMatches}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-semibold">{mockUserStats.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Streak</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">{mockUserStats.streak}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sports Buddies</span>
                <span className="font-semibold">{mockUserStats.totalFriends}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hours Played</span>
                <span className="font-semibold">{mockUserStats.totalHoursPlayed}h</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievement */}
          {unlockedAchievements.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Latest Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    {React.createElement(unlockedAchievements[unlockedAchievements.length - 1].icon, {
                      className: "w-6 h-6 text-yellow-600"
                    })}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {unlockedAchievements[unlockedAchievements.length - 1].title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      +{unlockedAchievements[unlockedAchievements.length - 1].points} points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="achievements">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === 'milestone' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('milestone')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Milestones
                </Button>
                <Button
                  variant={selectedCategory === 'skill' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('skill')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Skill
                </Button>
                <Button
                  variant={selectedCategory === 'social' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('social')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Social
                </Button>
                <Button
                  variant={selectedCategory === 'participation' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('participation')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Participation
                </Button>
              </div>

              {/* Achievements Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`transition-all hover:shadow-md ${
                      achievement.unlocked 
                        ? `border-2 ${getRarityGlow(achievement.rarity, achievement.unlocked)}` 
                        : 'opacity-75 border-dashed'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.unlocked 
                            ? 'bg-primary/10' 
                            : 'bg-muted'
                        }`}>
                          {achievement.unlocked ? (
                            React.createElement(achievement.icon, {
                              className: "w-6 h-6 text-primary"
                            })
                          ) : (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`font-semibold ${!achievement.unlocked && 'text-muted-foreground'}`}>
                              {achievement.title}
                            </h3>
                            <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{achievement.points} pts</span>
                            </div>

                            {achievement.unlocked && achievement.unlockedAt && (
                              <span className="text-xs text-muted-foreground">
                                Unlocked {achievement.unlockedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="mt-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}

                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground">
                              Requirements: {achievement.requirements.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Global Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how you rank against other Sports Buddy players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLeaderboard.map((player, index) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          player.isCurrentUser 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          {player.rank <= 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              player.rank === 1 ? 'bg-yellow-500' :
                              player.rank === 2 ? 'bg-gray-400' :
                              'bg-amber-600'
                            }`}>
                              {player.rank === 1 ? (
                                <Crown className="w-4 h-4 text-white" />
                              ) : (
                                <Medal className="w-4 h-4 text-white" />
                              )}
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                              #{player.rank}
                            </span>
                          )}
                        </div>

                        <Avatar className="w-12 h-12">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {player.name}
                            {player.isCurrentUser && (
                              <Badge variant="secondary" className="ml-2">You</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Level {player.level} • {player.badges} achievements
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {player.points.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}