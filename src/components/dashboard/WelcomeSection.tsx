
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const WelcomeSection = () => {
  const { user } = useAuth();
  const currentTime = new Date();
  
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.user_metadata?.full_name || user?.email || 'User'}!
          </h1>
          <p className="text-blue-100 mb-4">
            Welcome back to your GPODO dashboard. Ready to be productive?
          </p>
          <div className="flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Button variant="secondary" size="lg">
            Start Focus Session
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeSection;
