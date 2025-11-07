import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthPages } from './components/AuthPages';
import { EventsPage } from './components/EventsPage';
import { CreateEventPage } from './components/CreateEventPage';
import { MatchingPage } from './components/MatchingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { MessagingPage } from './components/MessagingPage';
import { AchievementsPage } from './components/AchievementsPage';
import { StatisticsPage } from './components/StatisticsPage';
import { EventDetailPage } from './components/EventDetailPage';
import { NotificationsPage } from './components/NotificationsPage';
import { ConnectionStatus } from './components/ConnectionStatus';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'login' | 'register' | 'events' | 'create-event' | 'matching' | 'admin' | 'profile' | 'settings' | 'messages' | 'achievements' | 'statistics' | 'event-detail' | 'notifications';

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Sports Buddy...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Redirect logic
    if (!isAuthenticated && ['events', 'create-event', 'matching', 'admin', 'profile', 'settings', 'messages', 'achievements', 'statistics', 'event-detail', 'notifications'].includes(currentPage)) {
      return <AuthPages type="login" onNavigate={handleNavigate} />;
    }

    if (isAuthenticated && ['login', 'register'].includes(currentPage)) {
      return <EventsPage onNavigate={handleNavigate} />;
    }

    // Admin access check
    if (currentPage === 'admin' && (!user?.isAdmin)) {
      return <EventsPage onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return isAuthenticated ? 
          <EventsPage onNavigate={handleNavigate} /> : 
          <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <AuthPages type="login" onNavigate={handleNavigate} />;
      case 'register':
        return <AuthPages type="register" onNavigate={handleNavigate} />;
      case 'events':
        return <EventsPage onNavigate={handleNavigate} />;
      case 'create-event':
        return <CreateEventPage onNavigate={handleNavigate} />;
      case 'matching':
        return <MatchingPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'messages':
        return <MessagingPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'statistics':
        return <StatisticsPage />;
      case 'event-detail':
        return <EventDetailPage onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderContent()}
      </main>
      <ConnectionStatus />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}