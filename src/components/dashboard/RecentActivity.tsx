
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Users, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight
} from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'group',
      icon: Users,
      title: 'New member joined "Tech Innovation Hub"',
      description: 'Sarah Johnson joined your group',
      time: '2 hours ago',
      status: 'success',
      actionLabel: 'View Group'
    },
    {
      id: 2,
      type: 'proposal',
      icon: FileText,
      title: 'Proposal "Mobile App Development" updated',
      description: 'Document was revised with new requirements',
      time: '4 hours ago',
      status: 'info',
      actionLabel: 'Review'
    },
    {
      id: 3,
      type: 'message',
      icon: MessageSquare,
      title: 'New message from Project Manager',
      description: 'Meeting scheduled for tomorrow at 2 PM',
      time: '6 hours ago',
      status: 'warning',
      actionLabel: 'Reply'
    },
    {
      id: 4,
      type: 'task',
      icon: CheckCircle,
      title: 'Task "UI Design Review" completed',
      description: 'Marked as complete by design team',
      time: '1 day ago',
      status: 'success',
      actionLabel: 'View'
    },
    {
      id: 5,
      type: 'deadline',
      icon: AlertCircle,
      title: 'Deadline approaching: "Market Research"',
      description: 'Due in 2 days - 85% complete',
      time: '1 day ago',
      status: 'warning',
      actionLabel: 'Update'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        <Button variant="ghost" size="sm" className="gap-2">
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg ${getIconColor(activity.status)} bg-opacity-10`}>
              <activity.icon className={`w-5 h-5 ${getIconColor(activity.status)}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(activity.status)} whitespace-nowrap`}>
                  {activity.actionLabel}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
