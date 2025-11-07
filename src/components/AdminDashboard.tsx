import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, Edit, Plus, Save, X, Users, Calendar, MapPin, Trophy } from 'lucide-react';
import { mockSportsCategories, mockCities, mockAreas, mockSportsEvents, logAction } from '../lib/mockData';
import { useAuth } from '../contexts/AuthContext';
import { SportsCategory, City, Area, SportsEvent } from '../types';

export function AdminDashboard() {
  const { user } = useAuth();
  const [sportsCategories, setSportsCategories] = useState<SportsCategory[]>(mockSportsCategories);
  const [cities, setCities] = useState<City[]>(mockCities);
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [events, setEvents] = useState<SportsEvent[]>(mockSportsEvents);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({});
  const [error, setError] = useState('');

  // Sports Categories Management
  const handleAddCategory = () => {
    if (!newItem.name || !newItem.icon) {
      setError('Name and icon are required');
      return;
    }

    const category: SportsCategory = {
      id: `category-${Date.now()}`,
      name: newItem.name,
      description: newItem.description || '',
      icon: newItem.icon,
      createdAt: new Date()
    };

    setSportsCategories(prev => [...prev, category]);
    setNewItem({});
    setIsAddingCategory(false);
    setError('');
    
    logAction('ADD_SPORTS_CATEGORY', {
      adminId: user?.id,
      categoryId: category.id,
      categoryName: category.name
    });
  };

  const handleUpdateCategory = (id: string) => {
    setSportsCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, name: editingItem.name, description: editingItem.description, icon: editingItem.icon }
          : cat
      )
    );
    setEditingItem(null);
    
    logAction('UPDATE_SPORTS_CATEGORY', {
      adminId: user?.id,
      categoryId: id
    });
  };

  const handleDeleteCategory = (id: string) => {
    const category = sportsCategories.find(c => c.id === id);
    setSportsCategories(prev => prev.filter(cat => cat.id !== id));
    
    logAction('DELETE_SPORTS_CATEGORY', {
      adminId: user?.id,
      categoryId: id,
      categoryName: category?.name
    });
  };

  // Cities Management
  const handleAddCity = () => {
    if (!newItem.name || !newItem.state || !newItem.country) {
      setError('Name, state, and country are required');
      return;
    }

    const city: City = {
      id: `city-${Date.now()}`,
      name: newItem.name,
      state: newItem.state,
      country: newItem.country,
      coordinates: {
        lat: parseFloat(newItem.lat) || 0,
        lng: parseFloat(newItem.lng) || 0
      }
    };

    setCities(prev => [...prev, city]);
    setNewItem({});
    setIsAddingCity(false);
    setError('');
    
    logAction('ADD_CITY', {
      adminId: user?.id,
      cityId: city.id,
      cityName: city.name
    });
  };

  const handleUpdateCity = (id: string) => {
    setCities(prev => 
      prev.map(city => 
        city.id === id 
          ? { 
              ...city, 
              name: editingItem.name, 
              state: editingItem.state,
              country: editingItem.country,
              coordinates: {
                lat: parseFloat(editingItem.lat) || city.coordinates.lat,
                lng: parseFloat(editingItem.lng) || city.coordinates.lng
              }
            }
          : city
      )
    );
    setEditingItem(null);
    
    logAction('UPDATE_CITY', {
      adminId: user?.id,
      cityId: id
    });
  };

  const handleDeleteCity = (id: string) => {
    const city = cities.find(c => c.id === id);
    setCities(prev => prev.filter(c => c.id !== id));
    // Also remove areas in this city
    setAreas(prev => prev.filter(area => area.cityId !== id));
    
    logAction('DELETE_CITY', {
      adminId: user?.id,
      cityId: id,
      cityName: city?.name
    });
  };

  // Areas Management
  const handleAddArea = () => {
    if (!newItem.name || !newItem.cityId) {
      setError('Name and city are required');
      return;
    }

    const area: Area = {
      id: `area-${Date.now()}`,
      name: newItem.name,
      cityId: newItem.cityId,
      description: newItem.description || '',
      coordinates: newItem.lat && newItem.lng ? {
        lat: parseFloat(newItem.lat),
        lng: parseFloat(newItem.lng)
      } : undefined
    };

    setAreas(prev => [...prev, area]);
    setNewItem({});
    setIsAddingArea(false);
    setError('');
    
    logAction('ADD_AREA', {
      adminId: user?.id,
      areaId: area.id,
      areaName: area.name
    });
  };

  const handleUpdateArea = (id: string) => {
    setAreas(prev => 
      prev.map(area => 
        area.id === id 
          ? { 
              ...area, 
              name: editingItem.name, 
              cityId: editingItem.cityId,
              description: editingItem.description,
              coordinates: editingItem.lat && editingItem.lng ? {
                lat: parseFloat(editingItem.lat),
                lng: parseFloat(editingItem.lng)
              } : area.coordinates
            }
          : area
      )
    );
    setEditingItem(null);
    
    logAction('UPDATE_AREA', {
      adminId: user?.id,
      areaId: id
    });
  };

  const handleDeleteArea = (id: string) => {
    const area = areas.find(a => a.id === id);
    setAreas(prev => prev.filter(a => a.id !== id));
    
    logAction('DELETE_AREA', {
      adminId: user?.id,
      areaId: id,
      areaName: area?.name
    });
  };

  // Events Management
  const handleDeleteEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(e => e.id !== id));
    
    logAction('DELETE_EVENT', {
      adminId: user?.id,
      eventId: id,
      eventTitle: event?.title
    });
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city ? `${city.name}, ${city.state}` : 'Unknown City';
  };

  const getAreaName = (areaId: string) => {
    const area = areas.find(a => a.id === areaId);
    return area?.name || 'Unknown Area';
  };

  const stats = {
    totalEvents: events.length,
    totalCategories: sportsCategories.length,
    totalCities: cities.length,
    totalAreas: areas.length,
    totalParticipants: events.reduce((sum, event) => sum + event.currentParticipants.length, 0)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage sports categories, locations, and events</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
                <p className="text-sm text-muted-foreground">Sports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCities}</p>
                <p className="text-sm text-muted-foreground">Cities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAreas}</p>
                <p className="text-sm text-muted-foreground">Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Sports Categories</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Sports Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sports Categories</CardTitle>
                <CardDescription>Manage available sports categories</CardDescription>
              </div>
              <Button onClick={() => setIsAddingCategory(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAddingCategory && (
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="🏀"
                          value={newItem.icon || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, icon: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Category name"
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newItem.description || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddCategory}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsAddingCategory(false);
                            setNewItem({});
                            setError('');
                          }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {sportsCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {editingItem?.id === category.id ? (
                          <Input
                            value={editingItem.icon}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, icon: e.target.value }))}
                          />
                        ) : (
                          <span className="text-2xl">{category.icon}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === category.id ? (
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          category.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === category.id ? (
                          <Input
                            value={editingItem.description}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                          />
                        ) : (
                          category.description
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingItem?.id === category.id ? (
                            <>
                              <Button size="sm" onClick={() => handleUpdateCategory(category.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingItem({
                                  id: category.id,
                                  name: category.name,
                                  description: category.description,
                                  icon: category.icon
                                })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cities Tab */}
        <TabsContent value="cities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cities</CardTitle>
                <CardDescription>Manage available cities</CardDescription>
              </div>
              <Button onClick={() => setIsAddingCity(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAddingCity && (
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="City name"
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="State"
                          value={newItem.state || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Country"
                          value={newItem.country || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, country: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Input
                            placeholder="Lat"
                            value={newItem.lat || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, lat: e.target.value }))}
                            className="w-20"
                          />
                          <Input
                            placeholder="Lng"
                            value={newItem.lng || ''}
                            onChange={(e) => setNewItem(prev => ({ ...prev, lng: e.target.value }))}
                            className="w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddCity}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsAddingCity(false);
                            setNewItem({});
                            setError('');
                          }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>
                        {editingItem?.id === city.id ? (
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          city.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === city.id ? (
                          <Input
                            value={editingItem.state}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, state: e.target.value }))}
                          />
                        ) : (
                          city.state
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === city.id ? (
                          <Input
                            value={editingItem.country}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, country: e.target.value }))}
                          />
                        ) : (
                          city.country
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === city.id ? (
                          <div className="flex gap-1">
                            <Input
                              value={editingItem.lat}
                              onChange={(e) => setEditingItem(prev => ({ ...prev, lat: e.target.value }))}
                              className="w-20"
                            />
                            <Input
                              value={editingItem.lng}
                              onChange={(e) => setEditingItem(prev => ({ ...prev, lng: e.target.value }))}
                              className="w-20"
                            />
                          </div>
                        ) : (
                          `${city.coordinates.lat.toFixed(2)}, ${city.coordinates.lng.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingItem?.id === city.id ? (
                            <>
                              <Button size="sm" onClick={() => handleUpdateCity(city.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingItem({
                                  id: city.id,
                                  name: city.name,
                                  state: city.state,
                                  country: city.country,
                                  lat: city.coordinates.lat.toString(),
                                  lng: city.coordinates.lng.toString()
                                })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteCity(city.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Areas Tab */}
        <TabsContent value="areas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Areas</CardTitle>
                <CardDescription>Manage areas within cities</CardDescription>
              </div>
              <Button onClick={() => setIsAddingArea(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Area
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAddingArea && (
                    <TableRow>
                      <TableCell>
                        <Input
                          placeholder="Area name"
                          value={newItem.name || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          className="w-full border rounded px-3 py-2"
                          value={newItem.cityId || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, cityId: e.target.value }))}
                        >
                          <option value="">Select City</option>
                          {cities.map(city => (
                            <option key={city.id} value={city.id}>
                              {city.name}, {city.state}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Description"
                          value={newItem.description || ''}
                          onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddArea}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setIsAddingArea(false);
                            setNewItem({});
                            setError('');
                          }}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  
                  {areas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell>
                        {editingItem?.id === area.id ? (
                          <Input
                            value={editingItem.name}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          area.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === area.id ? (
                          <select
                            className="w-full border rounded px-3 py-2"
                            value={editingItem.cityId}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, cityId: e.target.value }))}
                          >
                            {cities.map(city => (
                              <option key={city.id} value={city.id}>
                                {city.name}, {city.state}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getCityName(area.cityId)
                        )}
                      </TableCell>
                      <TableCell>
                        {editingItem?.id === area.id ? (
                          <Input
                            value={editingItem.description}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                          />
                        ) : (
                          area.description
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {editingItem?.id === area.id ? (
                            <>
                              <Button size="sm" onClick={() => handleUpdateArea(area.id)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingItem({
                                  id: area.id,
                                  name: area.name,
                                  cityId: area.cityId,
                                  description: area.description || ''
                                })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteArea(area.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Sports Events</CardTitle>
              <CardDescription>Monitor and manage all sports events on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {mockSportsCategories.find(c => c.name === event.sport)?.icon} {event.sport}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{event.date.toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.location.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {getAreaName(event.location.areaId)}, {getCityName(event.location.cityId)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">
                            {event.currentParticipants.length} / {event.maxParticipants}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {((event.currentParticipants.length / event.maxParticipants) * 100).toFixed(0)}% full
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}