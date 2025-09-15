import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, TrendingDown, Calendar, Clock, Users, Trophy, Target, Activity, MapPin, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockSportsCategories } from '../lib/mockData';

interface SportStats {
  sport: string;
  events: number;
  hours: number;
  winRate: number;
  avgRating: number;
  color: string;
}

interface MonthlyActivity {
  month: string;
  events: number;
  hours: number;
  newFriends: number;
}

interface LocationStats {
  city: string;
  events: number;
  percentage: number;
}

interface SkillProgression {
  sport: string;
  startLevel: string;
  currentLevel: string;
  improvement: number;
}

const mockSportStats: SportStats[] = [
  { sport: 'Basketball', events: 12, hours: 48, winRate: 75, avgRating: 4.6, color: '#f97316' },
  { sport: 'Tennis', events: 8, hours: 32, winRate: 62, avgRating: 4.3, color: '#06b6d4' },
  { sport: 'Soccer', events: 6, hours: 36, winRate: 58, avgRating: 4.1, color: '#10b981' },
  { sport: 'Running', events: 15, hours: 22, winRate: 0, avgRating: 4.8, color: '#8b5cf6' },
  { sport: 'Swimming', events: 4, hours: 16, winRate: 80, avgRating: 4.4, color: '#f59e0b' }
];

const mockMonthlyActivity: MonthlyActivity[] = [
  { month: 'Jul', events: 3, hours: 12, newFriends: 2 },
  { month: 'Aug', events: 5, hours: 20, newFriends: 4 },
  { month: 'Sep', events: 7, hours: 28, newFriends: 3 },
  { month: 'Oct', events: 8, hours: 32, newFriends: 5 },
  { month: 'Nov', events: 6, hours: 24, newFriends: 2 },
  { month: 'Dec', events: 9, hours: 36, newFriends: 6 }
];

const mockLocationStats: LocationStats[] = [
  { city: 'Manhattan, NY', events: 18, percentage: 45 },
  { city: 'Brooklyn, NY', events: 12, percentage: 30 },
  { city: 'Queens, NY', events: 8, percentage: 20 },
  { city: 'Bronx, NY', events: 2, percentage: 5 }
];

const mockSkillProgression: SkillProgression[] = [
  { sport: 'Basketball', startLevel: 'Beginner', currentLevel: 'Intermediate', improvement: 1 },
  { sport: 'Tennis', startLevel: 'Beginner', currentLevel: 'Intermediate', improvement: 1 },
  { sport: 'Running', startLevel: 'Intermediate', currentLevel: 'Advanced', improvement: 1 }
];

const mockPeakPerformance = [
  { day: 'Mon', performance: 65 },
  { day: 'Tue', performance: 70 },
  { day: 'Wed', performance: 85 },
  { day: 'Thu', performance: 75 },
  { day: 'Fri', performance: 80 },
  { day: 'Sat', performance: 95 },
  { day: 'Sun', performance: 90 }
];

const mockTimeDistribution = [
  { timeSlot: 'Morning (6-12)', events: 8, color: '#f59e0b' },
  { timeSlot: 'Afternoon (12-18)', events: 15, color: '#06b6d4' },
  { timeSlot: 'Evening (18-24)', events: 22, color: '#8b5cf6' }
];

export function StatisticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedSport, setSelectedSport] = useState('all');

  const totalEvents = mockSportStats.reduce((sum, sport) => sum + sport.events, 0);
  const totalHours = mockSportStats.reduce((sum, sport) => sum + sport.hours, 0);
  const avgWinRate = Math.round(
    mockSportStats.filter(s => s.winRate > 0).reduce((sum, sport) => sum + sport.winRate, 0) / 
    mockSportStats.filter(s => s.winRate > 0).length
  );
  const avgRating = (mockSportStats.reduce((sum, sport) => sum + sport.avgRating, 0) / mockSportStats.length).toFixed(1);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.dataKey}: ${pld.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sports Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your sports journey and performance</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sports" />
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% vs last period</span>
                </div>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Played</p>
                <p className="text-3xl font-bold">{totalHours}h</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+18% vs last period</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-3xl font-bold">{avgWinRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-3% vs last period</span>
                </div>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold">{avgRating}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+0.2 vs last period</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sports">Sports Breakdown</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Your sports activity over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockMonthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="events" stroke="#3b82f6" name="Events" strokeWidth={2} />
                    <Line type="monotone" dataKey="hours" stroke="#10b981" name="Hours" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Playing Times</CardTitle>
                <CardDescription>When you're most active during the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockTimeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="events"
                      label={({ timeSlot, events }) => `${timeSlot}: ${events}`}
                    >
                      {mockTimeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Location Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLocationStats.map((location, index) => (
                    <div key={location.city} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{location.city}</span>
                        <span className="text-sm text-muted-foreground">{location.events} events</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${location.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Weekly Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockPeakPerformance}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Recent Highlights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Flame className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">7-game win streak</p>
                    <p className="text-xs text-muted-foreground">Basketball</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">5 new sports buddies</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Skill level up</p>
                    <p className="text-xs text-muted-foreground">Tennis: Intermediate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your win rate and rating trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockMonthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="events" stroke="#3b82f6" name="Win Rate %" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Sport</CardTitle>
                <CardDescription>Win rates across different sports</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockSportStats.filter(s => s.winRate > 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sport" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="winRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sports" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sports Breakdown</CardTitle>
                <CardDescription>Detailed statistics for each sport you play</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockSportStats.map((sport) => (
                    <div key={sport.sport} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${sport.color}20` }}>
                          <span className="text-2xl">
                            {mockSportsCategories.find(c => c.name === sport.sport)?.icon}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{sport.sport}</h4>
                          <p className="text-sm text-muted-foreground">
                            {sport.events} events • {sport.hours} hours
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        {sport.winRate > 0 && (
                          <div className="text-center">
                            <div className="font-semibold">{sport.winRate}%</div>
                            <div className="text-muted-foreground">Win Rate</div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="font-semibold">{sport.avgRating}</div>
                          <div className="text-muted-foreground">Rating</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="font-semibold">{(sport.hours / sport.events).toFixed(1)}h</div>
                          <div className="text-muted-foreground">Avg/Event</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Progression</CardTitle>
                <CardDescription>Your improvement across different sports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSkillProgression.map((skill) => (
                    <div key={skill.sport} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill.sport}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getSkillLevelColor(skill.startLevel)}>
                            {skill.startLevel}
                          </Badge>
                          <span className="text-muted-foreground">→</span>
                          <Badge className={getSkillLevelColor(skill.currentLevel)}>
                            {skill.currentLevel}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Improved {skill.improvement} skill level{skill.improvement > 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Targets</CardTitle>
                <CardDescription>Track your progress towards personal goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Monthly Event Goal</span>
                      <span className="text-sm">8/10 events</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Win Rate Target</span>
                      <span className="text-sm">68/75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">New Friends Goal</span>
                      <span className="text-sm">18/20 buddies</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}