import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Send, Phone, Video, MoreVertical, Search, Users, Pin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logAction } from '../lib/mockData';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'image';
}

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'event';
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  participants: string[];
  isOnline?: boolean;
  eventId?: string;
}

const mockChats: Chat[] = [
  {
    id: 'chat-1',
    name: 'Sarah Williams',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    participants: ['user-1', 'sarah-1'],
    unreadCount: 3,
    isOnline: true,
    lastMessage: {
      id: 'msg-1',
      senderId: 'sarah-1',
      senderName: 'Sarah Williams',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      content: 'Hey! Are we still on for tennis this evening? The weather looks perfect!',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    }
  },
  {
    id: 'chat-2',
    name: 'Basketball Pickup Group',
    type: 'group',
    avatar: 'https://images.unsplash.com/photo-1515326283062-ef852efa28a8?w=150&h=150&fit=crop&crop=face',
    participants: ['user-1', 'mike-1', 'alex-1', 'david-1'],
    unreadCount: 0,
    lastMessage: {
      id: 'msg-2',
      senderId: 'mike-1',
      senderName: 'Mike Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Great game everyone! Same time next week?',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    }
  },
  {
    id: 'chat-3',
    name: 'Weekend Basketball Pickup',
    type: 'event',
    eventId: 'event-1',
    participants: ['user-1', 'mike-1', 'alex-1'],
    unreadCount: 1,
    lastMessage: {
      id: 'msg-3',
      senderId: 'system',
      senderName: 'System',
      senderAvatar: '',
      content: 'Alex joined the event',
      timestamp: new Date(Date.now() - 1800000),
      type: 'system'
    }
  },
  {
    id: 'chat-4',
    name: 'Emily Chen',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    participants: ['user-1', 'emily-1'],
    unreadCount: 0,
    isOnline: false,
    lastMessage: {
      id: 'msg-4',
      senderId: 'user-1',
      senderName: 'You',
      senderAvatar: '',
      content: 'Thanks for the running tips! Looking forward to our next session.',
      timestamp: new Date(Date.now() - 86400000),
      type: 'text'
    }
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'sarah-1',
    senderName: 'Sarah Williams',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 3600000),
    type: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'You',
    senderAvatar: '',
    content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
    timestamp: new Date(Date.now() - 3500000),
    type: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'sarah-1',
    senderName: 'Sarah Williams',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    content: 'I\'m fantastic! I\'ve been practicing my backhand and it\'s finally starting to feel natural.',
    timestamp: new Date(Date.now() - 3400000),
    type: 'text'
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    senderName: 'You',
    senderAvatar: '',
    content: 'That\'s awesome! All that practice is paying off. I noticed a big improvement in your last match.',
    timestamp: new Date(Date.now() - 3300000),
    type: 'text'
  },
  {
    id: 'msg-5',
    senderId: 'sarah-1',
    senderName: 'Sarah Williams',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    content: 'Hey! Are we still on for tennis this evening? The weather looks perfect!',
    timestamp: new Date(Date.now() - 300000),
    type: 'text'
  }
];

export function MessagingPage() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || '',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    logAction('SEND_MESSAGE', {
      userId: user.id,
      chatId: selectedChat.id,
      messageType: 'text'
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.95 && selectedChat?.id === 'chat-1') {
        const responses = [
          "Sounds good to me!",
          "Perfect! I'll see you there.",
          "Looking forward to it!",
          "Can't wait to play!"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const message: Message = {
          id: `msg-${Date.now()}`,
          senderId: 'sarah-1',
          senderName: 'Sarah Williams',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
          content: randomResponse,
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, message]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedChat?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-5rem)]">
      <div className="flex h-full bg-background border rounded-lg overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback>
                        {chat.type === 'group' || chat.type === 'event' ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          chat.name[0]
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && chat.type === 'direct' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <div className="flex items-center gap-2">
                        {chat.type === 'event' && (
                          <Pin className="w-3 h-3 text-muted-foreground" />
                        )}
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage?.type === 'system' ? (
                          <span className="italic">{chat.lastMessage.content}</span>
                        ) : (
                          <>
                            {chat.lastMessage?.senderId === user?.id ? 'You: ' : ''}
                            {chat.lastMessage?.content}
                          </>
                        )}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2">
                        {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedChat.avatar} alt={selectedChat.name} />
                  <AvatarFallback>
                    {selectedChat.type === 'group' || selectedChat.type === 'event' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      selectedChat.name[0]
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.type === 'direct' ? (
                      selectedChat.isOnline ? 'Online' : 'Last seen recently'
                    ) : selectedChat.type === 'event' ? (
                      'Event Chat'
                    ) : (
                      `${selectedChat.participants.length} participants`
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedChat.type === 'direct' && (
                  <>
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.senderId === user?.id;
                  const showAvatar = !isOwnMessage && (
                    index === 0 || 
                    messages[index - 1].senderId !== message.senderId ||
                    (message.timestamp.getTime() - messages[index - 1].timestamp.getTime()) > 300000
                  );

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwnMessage && (
                        <Avatar className={`w-8 h-8 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                          <AvatarFallback className="text-xs">
                            {message.senderName[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : 'order-2'}`}>
                        {message.type === 'system' ? (
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              {message.content}
                            </Badge>
                          </div>
                        ) : (
                          <div
                            className={`p-3 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {!isOwnMessage && showAvatar && selectedChat.type !== 'direct' && (
                              <p className="text-xs font-medium mb-1 opacity-70">
                                {message.senderName}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                          </div>
                        )}
                        
                        <p className={`text-xs text-muted-foreground mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1725798451557-fc60db3eb6a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGNoYXQlMjBtZXNzYWdpbmd8ZW58MXx8fHwxNzU3ODU5OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="No chat selected"
                className="w-64 h-48 object-cover rounded-lg mx-auto mb-4 opacity-50"
              />
              <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}