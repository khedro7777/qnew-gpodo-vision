
import React from 'react';
import { MessageCircle, UserPlus, Briefcase, Building, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface GroupActionsProps {
  groupId: string;
  isLoggedIn: boolean;
}

const GroupActions = ({ groupId, isLoggedIn }: GroupActionsProps) => {
  const handleAction = (action: string) => {
    if (!isLoggedIn) {
      toast.error('Please log in to perform this action');
      return;
    }
    
    // Mock actions for now
    switch (action) {
      case 'contact':
        toast.success('Contact request sent to group admin');
        break;
      case 'join':
        toast.success('Join request submitted successfully');
        break;
      case 'freelancer':
        toast.success('Freelancer application submitted');
        break;
      case 'supplier':
        toast.success('Supplier proposal submitted');
        break;
      default:
        toast.info('Feature coming soon');
    }
  };

  const actions = [
    {
      id: 'contact',
      title: 'Contact Group Admin',
      description: 'Send a message to the group administrator',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      enabled: isLoggedIn
    },
    {
      id: 'join',
      title: 'Join as Member',
      description: 'Request to become a member of this group',
      icon: UserPlus,
      color: 'bg-green-500 hover:bg-green-600',
      enabled: isLoggedIn
    },
    {
      id: 'freelancer',
      title: 'Apply for Freelancer Role',
      description: 'Submit your application as a freelancer',
      icon: Briefcase,
      color: 'bg-orange-500 hover:bg-orange-600',
      enabled: isLoggedIn
    },
    {
      id: 'supplier',
      title: 'Submit Supplier Offer',
      description: 'Propose your services or products',
      icon: Building,
      color: 'bg-purple-500 hover:bg-purple-600',
      enabled: isLoggedIn
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 sticky top-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Available Actions</h3>
      
      {!isLoggedIn && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-800">Authentication Required</span>
          </div>
          <p className="text-sm text-amber-700">
            Please log in to interact with this group and access all features.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              className={`w-full justify-start gap-3 h-auto p-4 ${
                action.enabled 
                  ? action.color 
                  : 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed'
              } text-white`}
              onClick={() => handleAction(action.id)}
              disabled={!action.enabled}
            >
              <IconComponent className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <Button variant="ghost" size="sm" className="text-productivity-blue hover:text-productivity-blue/90">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupActions;
