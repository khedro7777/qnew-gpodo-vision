
import React from 'react';
import { Clock, MessageCircle, Vote, Users as UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GroupActivityProps {
  groupId: string;
}

const GroupActivity = ({ groupId }: GroupActivityProps) => {
  // Mock data for current activity - this would come from the database
  const currentActivity = {
    phase: 'negotiation', // negotiation, voting, freelancer_request
    status: 'active',
    description: 'Currently negotiating terms with suppliers for bulk purchasing agreement',
    lastUpdate: '2024-01-20T10:30:00Z',
    participants: 8
  };

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'negotiation':
        return {
          title: 'Negotiation Phase',
          icon: MessageCircle,
          color: 'bg-blue-100 text-blue-800',
          description: 'Active discussions with suppliers and partners'
        };
      case 'voting':
        return {
          title: 'Voting Phase',
          icon: Vote,
          color: 'bg-purple-100 text-purple-800',
          description: 'Members are voting on proposals'
        };
      case 'freelancer_request':
        return {
          title: 'Freelancer Request',
          icon: UsersIcon,
          color: 'bg-orange-100 text-orange-800',
          description: 'Seeking qualified freelancers for this project'
        };
      default:
        return {
          title: 'Active',
          icon: Clock,
          color: 'bg-green-100 text-green-800',
          description: 'Group is currently active'
        };
    }
  };

  const phaseInfo = getPhaseInfo(currentActivity.phase);
  const IconComponent = phaseInfo.icon;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Current Activity Status</h2>
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-productivity-blue/10 to-productivity-purple/10 rounded-xl flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-productivity-blue" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{phaseInfo.title}</h3>
            <Badge className={`${phaseInfo.color} border-0`}>
              Active
            </Badge>
          </div>
          
          <p className="text-gray-600 mb-3">{currentActivity.description}</p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Last update: {new Date(currentActivity.lastUpdate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              <span>{currentActivity.participants} active participants</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[
            { action: 'New member joined the group', time: '2 hours ago', user: 'Sarah Johnson' },
            { action: 'Supplier proposal submitted', time: '1 day ago', user: 'Global Supplies Inc.' },
            { action: 'Document uploaded: Updated LOI', time: '2 days ago', user: 'Group Admin' },
            { action: 'Voting started on supplier selection', time: '3 days ago', user: 'Group Admin' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-productivity-blue rounded-full"></div>
              <div className="flex-1">
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-gray-500"> • by {activity.user}</span>
              </div>
              <span className="text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupActivity;
