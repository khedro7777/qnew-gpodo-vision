
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Video,
  ArrowRight
} from 'lucide-react';

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      type: 'meeting',
      date: 'Today',
      time: '2:00 PM',
      location: 'Conference Room A',
      attendees: 5,
      color: 'bg-blue-500',
      isVirtual: false
    },
    {
      id: 2,
      title: 'Project Review',
      type: 'review',
      date: 'Tomorrow',
      time: '10:30 AM',
      location: 'Virtual',
      attendees: 8,
      color: 'bg-green-500',
      isVirtual: true
    },
    {
      id: 3,
      title: 'Client Presentation',
      type: 'presentation',
      date: 'Friday',
      time: '3:00 PM',
      location: 'Client Office',
      attendees: 12,
      color: 'bg-purple-500',
      isVirtual: false
    },
    {
      id: 4,
      title: 'Sprint Planning',
      type: 'planning',
      date: 'Next Monday',
      time: '9:00 AM',
      location: 'Virtual',
      attendees: 6,
      color: 'bg-orange-500',
      isVirtual: true
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Upcoming Events
        </h4>
        <Button variant="ghost" size="sm" className="gap-2">
          View Calendar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${event.color} mt-2 flex-shrink-0`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                  <Badge variant="secondary" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {event.isVirtual ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <MapPin className="w-3 h-3" />
                    )}
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
        <Calendar className="w-4 h-4" />
        Schedule New Event
      </Button>
    </Card>
  );
};

export default UpcomingEvents;
