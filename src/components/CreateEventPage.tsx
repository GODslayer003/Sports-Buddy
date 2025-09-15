import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Calendar, MapPin, Users, Clock, X, Plus } from 'lucide-react';
import { mockSportsCategories, mockCities, mockAreas, logAction } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SportsEvent } from '../types';

interface CreateEventPageProps {
  onNavigate: (page: string) => void;
}

export function CreateEventPage({ onNavigate }: CreateEventPageProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: '',
    skillLevelRequired: 'any' as const,
    date: '',
    startTime: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    cityId: '',
    areaId: '',
    maxParticipants: 10,
    isPublic: true,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Event title is required');
      }
      if (!formData.sport) {
        throw new Error('Please select a sport');
      }
      if (!formData.date) {
        throw new Error('Event date is required');
      }
      if (!formData.startTime) {
        throw new Error('Start time is required');
      }
      if (!formData.endTime) {
        throw new Error('End time is required');
      }
      if (formData.startTime >= formData.endTime) {
        throw new Error('End time must be after start time');
      }
      if (!formData.locationName.trim()) {
        throw new Error('Location name is required');
      }
      if (!formData.cityId) {
        throw new Error('Please select a city');
      }
      if (formData.maxParticipants < 2) {
        throw new Error('Maximum participants must be at least 2');
      }

      // Create new event
      const newEvent: SportsEvent = {
        id: `event-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        sport: formData.sport,
        skillLevelRequired: formData.skillLevelRequired,
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: {
          name: formData.locationName.trim(),
          address: formData.locationAddress.trim(),
          cityId: formData.cityId,
          areaId: formData.areaId
        },
        maxParticipants: formData.maxParticipants,
        currentParticipants: [user.id],
        organizerId: user.id,
        isPublic: formData.isPublic,
        tags: formData.tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      logAction('CREATE_EVENT', {
        eventId: newEvent.id,
        userId: user.id,
        sport: newEvent.sport,
        title: newEvent.title
      });

      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        onNavigate('events');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      logAction('CREATE_EVENT_ERROR', {
        userId: user?.id,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredAreas = mockAreas.filter(area => area.cityId === formData.cityId);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Event Created Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your sports event has been created and published. You'll be redirected to the events page shortly.
            </p>
            <Button onClick={() => onNavigate('events')}>
              View Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Sports Event</h1>
        <p className="text-muted-foreground">Organize a sports event and find players to join you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Fill in the information about your sports event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekend Basketball Pickup"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, what to expect, any requirements..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sport">Sport *</Label>
                <Select value={formData.sport} onValueChange={(value) => handleChange('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSportsCategories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skillLevel">Skill Level Required</Label>
                <Select 
                  value={formData.skillLevelRequired} 
                  onValueChange={(value: any) => handleChange('skillLevelRequired', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Level</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="locationName">Venue Name *</Label>
                  <Input
                    id="locationName"
                    placeholder="e.g., Central Park Basketball Courts"
                    value={formData.locationName}
                    onChange={(e) => handleChange('locationName', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="locationAddress">Address</Label>
                  <Input
                    id="locationAddress"
                    placeholder="Street address (optional)"
                    value={formData.locationAddress}
                    onChange={(e) => handleChange('locationAddress', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select value={formData.cityId} onValueChange={(value) => handleChange('cityId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCities.map(city => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select 
                    value={formData.areaId} 
                    onValueChange={(value) => handleChange('areaId', value)}
                    disabled={!formData.cityId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.cityId ? "Select an area" : "Select city first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAreas.map(area => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div>
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value) || 2)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">people (including you)</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag (e.g., casual, competitive, beginner-friendly)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="isPublic" className="text-base">Public Event</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anyone to discover and join this event
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleChange('isPublic', checked)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('events')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}