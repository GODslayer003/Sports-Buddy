import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, MapPin, Users, Clock, Search, Filter, Plus } from 'lucide-react';
import { mockSportsEvents, mockSportsCategories, logAction } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SportsEvent } from '../types';

interface EventsPageProps {
  onNavigate: (page: string) => void;
}

export function EventsPage({ onNavigate }: EventsPageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [events, setEvents] = useState<SportsEvent[]>(mockSportsEvents);
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('sportsbuddy-seen-welcome');
    return !hasSeenWelcome;
  });

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.sport.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === 'all' || event.sport === selectedSport;
      
      const matchesSkillLevel = selectedSkillLevel === 'all' || 
                               event.skillLevelRequired === selectedSkillLevel ||
                               event.skillLevelRequired === 'any';
      
      return matchesSearch && matchesSport && matchesSkillLevel;
    });
  }, [events, searchQuery, selectedSport, selectedSkillLevel]);

  const handleJoinEvent = (eventId: string) => {
    if (!user) return;
    
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId && !event.currentParticipants.includes(user.id)) {
          const updatedEvent = {
            ...event,
            currentParticipants: [...event.currentParticipants, user.id]
          };
          logAction('JOIN_EVENT', { eventId, userId: user.id, eventTitle: event.title });
          return updatedEvent;
        }
        return event;
      })
    );
  };

  const handleLeaveEvent = (eventId: string) => {
    if (!user) return;
    
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId && event.currentParticipants.includes(user.id)) {
          const updatedEvent = {
            ...event,
            currentParticipants: event.currentParticipants.filter(id => id !== user.id)
          };
          logAction('LEAVE_EVENT', { eventId, userId: user.id, eventTitle: event.title });
          return updatedEvent;
        }
        return event;
      })
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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

  const getSportImage = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'basketball':
        return 'https://images.unsplash.com/photo-1515326283062-ef852efa28a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzU3ODAzNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'soccer':
        return 'https://images.unsplash.com/photo-1603508434829-7c4282d74483?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbCUyMGZpZWxkfGVufDF8fHx8MTc1NzgzMDIyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      default:
        return 'https://images.unsplash.com/photo-1710301431051-ee6923af04aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBwZW9wbGUlMjBwbGF5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU3ODU0NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('sportsbuddy-seen-welcome', 'true');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      {showWelcome && (
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Welcome to Sports Buddy! 🎉</h3>
                <p className="text-muted-foreground mb-4">
                  Ready to find your perfect sports partner? Browse events below, create your own, or use our matching feature to connect with others who share your interests!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => onNavigate('profile')}>
                    Complete Profile
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('matching')}>
                    Find Partners
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCloseWelcome}>
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sports Events</h1>
          <p className="text-muted-foreground">Discover and join sports events in your area</p>
        </div>
        <Button onClick={() => onNavigate('create-event')} className="mt-4 md:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events, sports, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger className="w-full md:w-[200px]">
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
        
        <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Skill Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const isParticipant = user && event.currentParticipants.includes(user.id);
          const isFull = event.currentParticipants.length >= event.maxParticipants;
          const isOrganizer = user && event.organizerId === user.id;
          
          return (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <ImageWithFallback
                  src={getSportImage(event.sport)}
                  alt={event.sport}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90">
                    {event.sport}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant="outline" 
                    className={`${getSkillLevelColor(event.skillLevelRequired)} border-0`}
                  >
                    {event.skillLevelRequired}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(event.date)} at {event.startTime}
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">{event.location.name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.currentParticipants.length} / {event.maxParticipants} participants
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.startTime} - {event.endTime}
                  </div>
                </div>

                {/* Participants Preview */}
                {event.currentParticipants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {event.currentParticipants.slice(0, 3).map((participantId, index) => (
                        <Avatar key={participantId} className="w-6 h-6 border-2 border-background">
                          <AvatarImage src={`https://images.unsplash.com/photo-${1472099645785 + index}?w=150&h=150&fit=crop&crop=face`} />
                          <AvatarFallback className="text-xs">
                            {String.fromCharCode(65 + index)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {event.currentParticipants.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+{event.currentParticipants.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">joined</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onNavigate('event-detail')}
                  >
                    View Details
                  </Button>
                  
                  {isOrganizer ? (
                    <Badge variant="outline" className="px-4 py-2">
                      Organizer
                    </Badge>
                  ) : isParticipant ? (
                    <Button
                      variant="outline"
                      onClick={() => handleLeaveEvent(event.id)}
                    >
                      Leave Event
                    </Button>
                  ) : (
                    <Button
                      disabled={isFull}
                      onClick={() => handleJoinEvent(event.id)}
                    >
                      {isFull ? 'Full' : 'Join Event'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No events found</p>
            <p>Try adjusting your search criteria or create a new event</p>
          </div>
          <Button onClick={() => onNavigate('create-event')} className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      )}
    </div>
  );
}