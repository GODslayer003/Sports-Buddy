import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { User, MapPin, Trophy, Clock, Plus, X, Save, Settings, Camera, Upload } from 'lucide-react';
import { mockSportsCategories, logAction } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SkillLevel } from '../types';

interface ProfilePageProps {
  onNavigate?: (page: any) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    age: user?.profile?.age || '',
    phoneNumber: user?.profile?.phoneNumber || '',
    preferredSports: user?.profile?.preferredSports || [],
    skillLevels: user?.profile?.skillLevels || {},
    availability: user?.profile?.availability || [],
    avatar: user?.avatar || ''
  });

  const [newSport, setNewSport] = useState('');

  const availabilityOptions = [
    { id: 'weekday-morning', label: 'Weekday Mornings' },
    { id: 'weekday-afternoon', label: 'Weekday Afternoons' },
    { id: 'weekday-evening', label: 'Weekday Evenings' },
    { id: 'weekend-morning', label: 'Weekend Mornings' },
    { id: 'weekend-afternoon', label: 'Weekend Afternoons' },
    { id: 'weekend-evening', label: 'Weekend Evenings' }
  ];

  const skillLevelOptions: { value: SkillLevel; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      // Update user profile
      const updatedUser = {
        ...user!,
        name: formData.name.trim(),
        avatar: formData.avatar,
        profile: {
          bio: formData.bio.trim(),
          location: formData.location.trim(),
          age: formData.age ? parseInt(formData.age.toString()) : undefined,
          phoneNumber: formData.phoneNumber.trim(),
          preferredSports: formData.preferredSports,
          skillLevels: formData.skillLevels,
          availability: formData.availability
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateUser(updatedUser);
      setIsEditing(false);
      setSuccess(true);
      
      logAction('UPDATE_PROFILE', {
        userId: user?.id,
        updatedFields: Object.keys(formData)
      });

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      logAction('UPDATE_PROFILE_ERROR', {
        userId: user?.id,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      age: user?.profile?.age || '',
      phoneNumber: user?.profile?.phoneNumber || '',
      preferredSports: user?.profile?.preferredSports || [],
      skillLevels: user?.profile?.skillLevels || {},
      availability: user?.profile?.availability || [],
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Update formData with the new avatar
      setFormData(prev => ({ ...prev, avatar: imageUrl }));
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      logAction('UPLOAD_AVATAR', {
        userId: user?.id,
        fileName: file.name,
        fileSize: file.size
      });
    } catch (err) {
      setError('Failed to upload avatar. Please try again.');
      logAction('UPLOAD_AVATAR_ERROR', {
        userId: user?.id,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addSport = () => {
    if (newSport && !formData.preferredSports.includes(newSport)) {
      setFormData(prev => ({
        ...prev,
        preferredSports: [...prev.preferredSports, newSport],
        skillLevels: { ...prev.skillLevels, [newSport]: 'beginner' }
      }));
      setNewSport('');
    }
  };

  const removeSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSports: prev.preferredSports.filter(s => s !== sport),
      skillLevels: Object.fromEntries(
        Object.entries(prev.skillLevels).filter(([key]) => key !== sport)
      )
    }));
  };

  const updateSkillLevel = (sport: string, level: SkillLevel) => {
    setFormData(prev => ({
      ...prev,
      skillLevels: { ...prev.skillLevels, [sport]: level }
    }));
  };

  const toggleAvailability = (timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(timeSlot)
        ? prev.availability.filter(slot => slot !== timeSlot)
        : [...prev.availability, timeSlot]
    }));
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

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-2">
            <CardContent className="p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={isEditing ? formData.avatar : user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              {isEditing && (
                <p className="text-xs text-muted-foreground mb-4 flex items-center justify-center gap-1">
                  <Upload className="w-3 h-3" />
                  Click camera icon to update profile picture
                </p>
              )}
              
              {user.profile?.location && (
                <div className="flex items-center justify-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.profile.location}
                </div>
              )}
              
              <div className="flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold">{user.profile?.preferredSports?.length || 0}</div>
                  <div className="text-muted-foreground">Sports</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{user.profile?.availability?.length || 0}</div>
                  <div className="text-muted-foreground">Time Slots</div>
                </div>
              </div>
              
              {!isEditing && (
                <>
                  <Button className="w-full mt-6" onClick={() => setIsEditing(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  {onNavigate && (
                    <Button 
                      className="w-full mt-2" 
                      variant="outline" 
                      onClick={() => onNavigate('settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Sports Summary */}
          {user.profile?.preferredSports && user.profile.preferredSports.length > 0 && (
            <Card className="mt-6 shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Your Sports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.profile.preferredSports.map((sport) => (
                  <div key={sport} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">
                        {mockSportsCategories.find(c => c.name === sport)?.icon}
                      </span>
                      <span>{sport}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getSkillLevelColor(user.profile?.skillLevels?.[sport] || 'beginner')}
                    >
                      {user.profile?.skillLevels?.[sport] || 'beginner'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {success && (
            <Alert>
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your basic profile information' : 'Your basic profile information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Manhattan, NY"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="e.g., +1-555-0123"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself and your sports interests..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sports Preferences */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle>Sports Preferences</CardTitle>
              <CardDescription>
                {isEditing ? 'Add your preferred sports and skill levels' : 'Your preferred sports and skill levels'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div>
                  <Label>Add Sport</Label>
                  <div className="flex gap-2">
                    <Select value={newSport} onValueChange={setNewSport}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a sport to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockSportsCategories
                          .filter(category => !formData.preferredSports.includes(category.name))
                          .map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addSport} disabled={!newSport}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {formData.preferredSports.map((sport) => (
                  <div key={sport} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">
                        {mockSportsCategories.find(c => c.name === sport)?.icon}
                      </span>
                      <span className="font-medium">{sport}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Select
                          value={formData.skillLevels[sport] || 'beginner'}
                          onValueChange={(value: SkillLevel) => updateSkillLevel(sport, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevelOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className={getSkillLevelColor(formData.skillLevels[sport] || 'beginner')}
                        >
                          {formData.skillLevels[sport] || 'beginner'}
                        </Badge>
                      )}
                      
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSport(sport)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formData.preferredSports.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sports added yet</p>
                  {isEditing && <p>Add your first sport above to get started</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Availability
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Select when you\'re available to play sports' : 'When you\'re available to play sports'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availabilityOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={formData.availability.includes(option.id)}
                      onCheckedChange={() => isEditing && toggleAvailability(option.id)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={option.id} className="flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>

              {formData.availability.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No availability set</p>
                  {isEditing && <p>Select your available time slots above</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    className="flex-1 h-12"
                    size="lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="flex-1 h-12 shadow-lg"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}