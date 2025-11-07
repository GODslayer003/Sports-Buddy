import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, MapPin, Users, Clock, Star, MessageSquare, Share2, Flag, ArrowLeft, CheckCircle, XCircle, Cloud, Navigation, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockSportsEvents, mockSportsCategories, logAction } from '../lib/mockData';
import { joinEvent, leaveEvent, loadUserData } from '../utils/userDataService';

interface EventDetailPageProps {
  eventId?: string;
  onNavigate: (page: string) => void;
}

interface EventReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
}

interface EventComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  replies?: EventComment[];
}

const mockEventReviews: EventReview[] = [
  {
    id: 'review-1',
    userId: 'user-2',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment: 'Amazing event! Great organization and fantastic players. The skill level was perfect and everyone was super friendly.',
    date: new Date('2024-12-16')
  },
  {
    id: 'review-2',
    userId: 'user-3',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    rating: 4,
    comment: 'Really enjoyed this pickup game. Good competition and well-organized. Only downside was it started a bit late.',
    date: new Date('2024-12-16')
  },
  {
    id: 'review-3',
    userId: 'user-4',
    userName: 'Alex Chen',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    comment: 'Perfect event for intermediate players. Met some great people and had an awesome workout!',
    date: new Date('2024-12-16')
  }
];

const mockEventComments: EventComment[] = [
  {
    id: 'comment-1',
    userId: 'user-2',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Hey everyone! Looking forward to the game. I\'ll bring an extra ball just in case.',
    timestamp: new Date('2024-12-19T10:30:00')
  },
  {
    id: 'comment-2',
    userId: 'user-3',
    userName: 'Sarah Williams',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    content: 'Thanks Mike! I can also bring some water bottles if needed. Weather forecast looks perfect for tomorrow.',
    timestamp: new Date('2024-12-19T14:15:00')
  },
  {
    id: 'comment-3',
    userId: 'user-1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'Great! See you all there. The courts should be in excellent condition.',
    timestamp: new Date('2024-12-19T16:20:00')
  }
];

const mockWeatherData = {
  temperature: 72,
  condition: 'Sunny',
  humidity: 45,
  windSpeed: 8,
  icon: '☀️'
};

export function EventDetailPage({ eventId = '1', onNavigate }: EventDetailPageProps) {
  const { user } = useAuth();
  const [event] = useState(mockSportsEvents.find(e => e.id === eventId) || mockSportsEvents[0]);
  const [isJoined, setIsJoined] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Load user's event participation status on mount
  useEffect(() => {
    const checkJoinStatus = async () => {
      if (!user) return;
      
      try {
        const userData = await loadUserData(user.id);
        setIsJoined(userData.events.includes(event.id));
      } catch (error) {
        console.error('Error loading join status:', error);
      }
    };
    
    checkJoinStatus();
  }, [user, event.id]);

  const handleJoinEvent = async () => {
    if (!user || !event) return;
    
    if (!isJoined) {
      const success = await joinEvent(user.id, event.id);
      if (success) {
        setIsJoined(true);
        logAction('JOIN_EVENT', { eventId: event.id, userId: user.id });
      }
    }
  };

  const handleLeaveEvent = async () => {
    if (!user || !event) return;
    
    if (isJoined) {
      const success = await leaveEvent(user.id, event.id);
      if (success) {
        setIsJoined(false);
        logAction('LEAVE_EVENT', { eventId: event.id, userId: user.id });
      }
    }
  };

  const getSportImage = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'basketball':
        return 'https://images.unsplash.com/photo-1515326283062-ef852efa28a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzU3ODAzNDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
      case 'tennis':
        return 'https://images.unsplash.com/photo-1554068470-29f8ac72bd50?w=1080&h=500&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1710301431051-ee6923af04aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBwZW9wbGUlMjBwbGF5aW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzU3ODU0NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const averageRating = mockEventReviews.reduce((sum, review) => sum + review.rating, 0) / mockEventReviews.length;
  const isFull = event.currentParticipants.length >= event.maxParticipants;
  const isOrganizer = user?.id === event.organizerId;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('events')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Hero */}
          <Card className="overflow-hidden">
            <div className="relative h-64">
              <ImageWithFallback
                src={getSportImage(event.sport)}
                alt={event.sport}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {mockSportsCategories.find(c => c.name === event.sport)?.icon} {event.sport}
                  </Badge>
                  <Badge variant="secondary" className={`${getSkillLevelColor(event.skillLevelRequired)} bg-white/90`}>
                    {event.skillLevelRequired}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Organized by John Doe</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm">{averageRating.toFixed(1)} • {mockEventReviews.length} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{event.description}</p>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Details Tabs */}
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Discussion ({mockEventComments.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({mockEventReviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location & Directions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{event.location.name}</h4>
                    <p className="text-muted-foreground">{event.location.address}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Venue
                    </Button>
                  </div>

                  {/* Map placeholder */}
                  <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Interactive map would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="w-5 h-5 mr-2" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{mockWeatherData.icon}</div>
                      <div>
                        <p className="text-2xl font-bold">{mockWeatherData.temperature}°F</p>
                        <p className="text-muted-foreground">{mockWeatherData.condition}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Humidity: {mockWeatherData.humidity}%</p>
                      <p>Wind: {mockWeatherData.windSpeed} mph</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment & Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>What to Bring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Required Equipment</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Basketball shoes
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Water bottle
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Towel
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Provided Equipment</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          Basketball
                        </li>
                        <li className="flex items-center">
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                          No jerseys provided
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Event Discussion</CardTitle>
                  <CardDescription>
                    Chat with other participants about the event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockEventComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                          <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    {isJoined && (
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-2 border rounded-md text-sm"
                          />
                          <Button size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isJoined && (
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Join the event to participate in the discussion</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Event Reviews</CardTitle>
                  <CardDescription>
                    Reviews from previous participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockEventReviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={review.userAvatar} alt={review.userName} />
                              <AvatarFallback>{review.userName[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {review.date.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <Separator className="!mt-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Join/Leave Event */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {event.currentParticipants.length} / {event.maxParticipants}
                  </div>
                  <p className="text-sm text-muted-foreground">participants</p>
                </div>

                {isOrganizer ? (
                  <Badge variant="outline" className="w-full justify-center py-2">
                    You're the organizer
                  </Badge>
                ) : isJoined ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLeaveEvent}
                  >
                    Leave Event
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    disabled={isFull}
                    onClick={handleJoinEvent}
                  >
                    {isFull ? 'Event Full' : 'Join Event'}
                  </Button>
                )}

                <div className="text-xs text-center text-muted-foreground">
                  {event.isPublic ? 'Public Event' : 'Private Event'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skill Level</span>
                <Badge variant="outline" className={getSkillLevelColor(event.skillLevelRequired)}>
                  {event.skillLevelRequired}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Show first few participants */}
                {event.currentParticipants.slice(0, 5).map((participantId, index) => (
                  <div key={participantId} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={`https://images.unsplash.com/photo-${1472099645785 + index}?w=150&h=150&fit=crop&crop=face`} 
                      />
                      <AvatarFallback>{String.fromCharCode(65 + index)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Player {index + 1}</p>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                        <span className="text-xs text-muted-foreground">4.{5 + index}</span>
                      </div>
                    </div>
                    {participantId === event.organizerId && (
                      <Badge variant="secondary" className="text-xs">Organizer</Badge>
                    )}
                  </div>
                ))}

                {event.currentParticipants.length > 5 && (
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    View all {event.currentParticipants.length} participants
                  </Button>
                )}

                {event.currentParticipants.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No participants yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Similar Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Similar Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSportsEvents.slice(1, 3).map((similarEvent) => (
                <div key={similarEvent.id} className="space-y-2">
                  <h4 className="font-medium text-sm line-clamp-2">{similarEvent.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(similarEvent.date)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {similarEvent.currentParticipants.length}/{similarEvent.maxParticipants}
                  </div>
                </div>
              ))}
              <Button variant="link" size="sm" className="p-0 h-auto">
                See more events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
            <DialogDescription>
              Share this event with your friends and sports buddies
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Copy Link
              </Button>
              <Button variant="outline" className="flex-1">
                Share on Social
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Event link: sports-buddy.com/events/{event.id}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}