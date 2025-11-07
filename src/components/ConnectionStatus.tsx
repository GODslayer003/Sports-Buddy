import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { callServer } from '../utils/supabase/client';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await callServer('/health');
        const data = await response.json();
        setIsConnected(data.status === 'ok');
      } catch (error) {
        // Silently fail - backend might not be deployed yet
        // Only log in development, don't show error to user
        if (process.env.NODE_ENV === 'development') {
          console.debug('Backend connection check failed (this is normal if backend is not deployed):', error);
        }
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();

    // Check connection every 60 seconds (reduced frequency)
    const interval = setInterval(checkConnection, 60000);

    return () => clearInterval(interval);
  }, []);

  // Don't show anything if still checking or if we haven't determined status yet
  if (isChecking || isConnected === null) {
    return null;
  }

  // Only show status if connected - hide the "offline" badge to reduce noise
  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge 
        variant="default"
        className="flex items-center gap-2"
      >
        <Wifi className="w-3 h-3" />
        <span>Backend Connected</span>
      </Badge>
    </div>
  );
}