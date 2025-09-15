import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { Menu, User, Settings, LogOut, Plus, Calendar, Users, MessageCircle, Trophy, BarChart3, Bell } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'matching', label: 'Find Partners', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'create-event', label: 'Create Event', icon: Plus }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: Settings }
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SB</span>
              </div>
              <span className="font-bold text-xl text-foreground">Sports Buddy</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => handleNavigation(item.id)}
                  className="flex items-center space-x-2"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Button>
              ))}
              
              {user?.isAdmin && adminNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => handleNavigation(item.id)}
                  className="flex items-center space-x-2"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <div className="flex flex-col space-y-4 mt-8">
                        {navItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={currentPage === item.id ? 'default' : 'ghost'}
                            onClick={() => handleNavigation(item.id)}
                            className="justify-start"
                          >
                            {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                            {item.label}
                          </Button>
                        ))}
                        
                        {user?.isAdmin && adminNavItems.map((item) => (
                          <Button
                            key={item.id}
                            variant={currentPage === item.id ? 'default' : 'ghost'}
                            onClick={() => handleNavigation(item.id)}
                            className="justify-start"
                          >
                            {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleNavigation('notifications')}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </div>
                </Button>

                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('achievements')}>
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Achievements</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('statistics')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Statistics</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('notifications')}>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => handleNavigation('login')}>
                  Sign In
                </Button>
                <Button onClick={() => handleNavigation('register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}