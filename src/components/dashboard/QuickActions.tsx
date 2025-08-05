
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar,
  Target,
  TrendingUp,
  Settings
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Create Group',
      description: 'Start a new collaboration',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Create group')
    },
    {
      icon: Users,
      label: 'Join Group',
      description: 'Find groups to join',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Join group')
    },
    {
      icon: FileText,
      label: 'New Proposal',
      description: 'Draft a new proposal',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('New proposal')
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      description: 'Check your messages',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => console.log('Messages')
    },
    {
      icon: Calendar,
      label: 'Schedule',
      description: 'Manage your calendar',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => console.log('Schedule')
    },
    {
      icon: Target,
      label: 'Goals',
      description: 'Set and track goals',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => console.log('Goals')
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      description: 'View your progress',
      color: 'bg-teal-500 hover:bg-teal-600',
      onClick: () => console.log('Analytics')
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage preferences',
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => console.log('Settings')
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-200"
            onClick={action.onClick}
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
