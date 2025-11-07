import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Bell, Settings, Users, Calendar, Trophy, MessageCircle, Heart, UserPlus, MapPin, CheckCircle, X, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logAction } from '../lib/mockData';

interface Notification {
  id: string;
  type: 'event_invite' | 'match_request' | 'event_reminder' | 'achievement' | 'message' | 'friend_request' | 'event_update' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  actionData?: any;
  avatar?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  eventInvites: boolean;
  eventReminders: boolean;
  matchRequests: boolean;
  messages: boolean;
  achievements: boolean;
  friendRequests: boolean;
  eventUpdates: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'event_invite',
    title: 'Event Invitation',
    description: 'Sarah Williams invited you to "Tennis Practice Session" tomorrow at 6:00 PM',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    read: false,
    actionable: true,
    actionData: { eventId: 'event-2', inviterId: 'sarah-1' },
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'match_request',
    title: 'New Match Request',
    description: 'Mike Johnson wants to be your sports buddy for Basketball',
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    read: false,
    actionable: true,
    actionData: { userId: 'mike-1', sport: 'Basketball' },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    priority: 'medium'
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    description: 'You\'ve earned the "Social Butterfly" achievement for making 10 sports buddies',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    read: false,
    actionable: false,
    priority: 'medium'
  },
  {
    id: 'notif-4',
    type: 'event_reminder',
    title: 'Event Reminder',
    description: 'Weekend Basketball Pickup starts in 2 hours at Central Park Basketball Courts',
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    read: true,
    actionable: false,
    priority: 'high'
  },
  {
    id: 'notif-5',
    type: 'message',
    title: 'New Message',
    description: 'Emily Chen: "Looking forward to our running session this weekend!"',
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    read: true,
    actionable: true,
    actionData: { chatId: 'chat-4', userId: 'emily-1' },
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    priority: 'low'
  },
  {
    id: 'notif-6',
    type: 'friend_request',
    title: 'Friend Request',
    description: 'Alex Thompson sent you a friend request',
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    read: true,
    actionable: true,
    actionData: { userId: 'alex-1' },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    priority: 'medium'
  },
  {
    id: 'notif-7',
    type: 'event_update',
    title: 'Event Updated',
    description: 'Morning Running Group location changed to Brooklyn Bridge Park',
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    read: true,
    actionable: false,
    priority: 'medium'
  },
  {
    id: 'notif-8',
    type: 'system',
    title: 'New Feature Available',
    description: 'Check out the new Statistics page to track your sports performance!',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    read: true,
    actionable: false,
    priority: 'low'
  }
];

const defaultNotificationSettings: NotificationSettings = {
  eventInvites: true,
  eventReminders: true,
  matchRequests: true,
  messages: true,
  achievements: true,
  friendRequests: true,
  eventUpdates: true,
  systemUpdates: false,
  emailNotifications: true,
  pushNotifications: true
};

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const [filter, setFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    logAction('MARK_NOTIFICATION_READ', { notificationId, userId: user?.id });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    logAction('MARK_ALL_NOTIFICATIONS_READ', { userId: user?.id });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    logAction('DELETE_NOTIFICATION', { notificationId, userId: user?.id });
  };

  const handleNotificationAction = (notification: Notification, action: 'accept' | 'decline') => {
    if (notification.type === 'event_invite') {
      logAction('RESPOND_TO_EVENT_INVITE', {
        eventId: notification.actionData?.eventId,
        response: action,
        userId: user?.id
      });
    } else if (notification.type === 'match_request') {
      logAction('RESPOND_TO_MATCH_REQUEST', {
        requesterId: notification.actionData?.userId,
        response: action,
        userId: user?.id
      });
    } else if (notification.type === 'friend_request') {
      logAction('RESPOND_TO_FRIEND_REQUEST', {
        requesterId: notification.actionData?.userId,
        response: action,
        userId: user?.id
      });
    }

    // Remove notification after action
    handleDeleteNotification(notification.id);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    logAction('UPDATE_NOTIFICATION_SETTINGS', {
      setting: key,
      value,
      userId: user?.id
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_invite':
      case 'event_reminder':
      case 'event_update':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'match_request':
        return <Users className="w-5 h-5 text-green-500" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-pink-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-gray-300';
      default: return 'border-l-gray-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your sports activities and connections
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          )}
          <Badge variant="secondary">
            {unreadCount} unread
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('all')}
              >
                <Bell className="w-4 h-4 mr-2" />
                All Notifications
              </Button>
              
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('unread')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Unread
                  </div>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Button>
              
              <Separator className="my-2" />
              
              <Button
                variant={filter === 'event_invite' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('event_invite')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Event Invites
              </Button>
              
              <Button
                variant={filter === 'match_request' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('match_request')}
              >
                <Users className="w-4 h-4 mr-2" />
                Match Requests
              </Button>
              
              <Button
                variant={filter === 'message' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('message')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </Button>
              
              <Button
                variant={filter === 'achievement' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setFilter('achievement')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[700px]">
                    <div className="divide-y">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                          <p className="text-muted-foreground">
                            {filter === 'unread' ? 'All caught up!' : 'No notifications found for this filter.'}
                          </p>
                        </div>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                              !notification.read ? 'bg-muted/30' : ''
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {notification.avatar ? (
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={notification.avatar} alt="User" />
                                  <AvatarFallback>{notification.title[0]}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(notification.timestamp)}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {notification.actionable && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => handleNotificationAction(notification, 'decline')}
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                        <Button 
                                          size="sm"
                                          onClick={() => handleNotificationAction(notification, 'accept')}
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                        </Button>
                                      </>
                                    )}

                                    {!notification.read && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </Button>
                                    )}

                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteNotification(notification.id)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Control what notifications you receive and how you receive them
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Activity Notifications */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Activity Notifications</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event Invitations</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified when someone invites you to an event
                            </p>
                          </div>
                          <Switch
                            checked={settings.eventInvites}
                            onCheckedChange={(checked) => updateSetting('eventInvites', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Reminders for upcoming events you're attending
                            </p>
                          </div>
                          <Switch
                            checked={settings.eventReminders}
                            onCheckedChange={(checked) => updateSetting('eventReminders', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Match Requests</p>
                            <p className="text-sm text-muted-foreground">
                              When someone wants to be your sports buddy
                            </p>
                          </div>
                          <Switch
                            checked={settings.matchRequests}
                            onCheckedChange={(checked) => updateSetting('matchRequests', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Messages</p>
                            <p className="text-sm text-muted-foreground">
                              New messages from other players
                            </p>
                          </div>
                          <Switch
                            checked={settings.messages}
                            onCheckedChange={(checked) => updateSetting('messages', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Achievements</p>
                            <p className="text-sm text-muted-foreground">
                              When you unlock new achievements or badges
                            </p>
                          </div>
                          <Switch
                            checked={settings.achievements}
                            onCheckedChange={(checked) => updateSetting('achievements', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Friend Requests</p>
                            <p className="text-sm text-muted-foreground">
                              When someone sends you a friend request
                            </p>
                          </div>
                          <Switch
                            checked={settings.friendRequests}
                            onCheckedChange={(checked) => updateSetting('friendRequests', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Event Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Changes to events you're attending
                            </p>
                          </div>
                          <Switch
                            checked={settings.eventUpdates}
                            onCheckedChange={(checked) => updateSetting('eventUpdates', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">System Updates</p>
                            <p className="text-sm text-muted-foreground">
                              New features and important announcements
                            </p>
                          </div>
                          <Switch
                            checked={settings.systemUpdates}
                            onCheckedChange={(checked) => updateSetting('systemUpdates', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Delivery Methods */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Delivery Methods</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Browser push notifications
                            </p>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}