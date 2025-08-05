
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  AlertTriangle 
} from 'lucide-react';
import type { Group } from '@/types';

interface GroupOverviewProps {
  group: Group;
  userRole: string;
}

const GroupOverview = ({ group, userRole }: GroupOverviewProps) => {
  // Calculate progress percentage
  const progressPercentage = (group.current_members / group.max_members) * 100;

  // Mock data for demonstration
  const mockStats = {
    activeVotes: 2,
    pendingProposals: 3,
    activeContracts: 1,
    openCases: 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGatewayTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      'purchasing': '🛒 Collaborative Purchasing',
      'marketing': '📢 Collaborative Marketing',
      'company': '🏢 Company Formation',
      'investment': '💰 Investment Groups',
      'suppliers': '🏭 Suppliers Network',
      'freelancers': '👨‍💻 Freelancers Hub',
      'teams': '👥 Freelancer Teams',
      'services': '🔧 Service Providers',
      'products': '📦 Product Listings',
      'arbitration': '⚖️ Arbitration & Documentation',
      'requests': '📋 Arbitration Requests',
      'negotiation': '🤝 Smart Negotiation Tools'
    };
    return types[type] || '🔍 General';
  };

  return (
    <div className="space-y-6">
      {/* Group Status Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Group Status</h3>
            <p className="text-gray-600">{getGatewayTypeDisplay(group.gateway_type)}</p>
          </div>
          <Badge className={getStatusColor(group.status)}>
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Member Progress</span>
              <span>{group.current_members}/{group.max_members}</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockStats.activeVotes}</div>
              <div className="text-sm text-gray-600">Active Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockStats.pendingProposals}</div>
              <div className="text-sm text-gray-600">Proposals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockStats.activeContracts}</div>
              <div className="text-sm text-gray-600">Contracts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{mockStats.openCases}</div>
              <div className="text-sm text-gray-600">Cases</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h4 className="font-semibold text-gray-900">Membership</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Members</span>
              <span className="font-medium">{group.current_members}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Available Slots</span>
              <span className="font-medium">{group.max_members - group.current_members}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Capacity</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h4 className="font-semibold text-gray-900">Activity</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Messages Today</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Active Discussions</span>
              <span className="font-medium">6</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Last Activity</span>
              <span className="font-medium">2h ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-purple-500" />
            <h4 className="font-semibold text-gray-900">Progress</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed Tasks</span>
              <span className="font-medium">12/18</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium">89%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Group Rating</span>
              <span className="font-medium">4.7/5</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
            <MessageSquare className="w-4 h-4 text-blue-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">New proposal submitted for review</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
            <Users className="w-4 h-4 text-green-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Sarah Ahmed joined the group</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-purple-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Contract draft uploaded for review</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      {(userRole === 'founder' || userRole === 'admin') && (
        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Invite Members
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Discussion
            </Button>
            <Button size="sm" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GroupOverview;
