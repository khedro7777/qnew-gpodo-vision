
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Building2, ExternalLink, Plus, Crown } from 'lucide-react';
import { useGroups } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import GroupCreationWizard from '@/components/workflow/GroupCreationWizard';

const MyGroupsTab = () => {
  const { data: groups = [], isLoading } = useGroups();
  const { user } = useAuth();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Mock data for demonstration with role-based groups
  const myGroupsData = [
    {
      id: '1',
      name: 'Medical Equipment Group Purchasing',
      description: 'Group purchasing for medical equipment at competitive prices',
      status: 'active',
      current_members: 12,
      max_members: 20,
      gateway_type: 'purchasing',
      userRole: 'founder',
      isManager: false,
      created_at: '2024-01-10T00:00:00Z',
      countries: { name: 'Saudi Arabia', flag_emoji: '🇸🇦' },
      industry_sectors: { name: 'Healthcare', icon: '🏥' }
    },
    {
      id: '2',
      name: 'Digital Marketing Cooperative',
      description: 'Joint marketing campaigns for startups',
      status: 'active',
      current_members: 8,
      max_members: 15,
      gateway_type: 'marketing',
      userRole: 'member',
      isManager: true,
      created_at: '2024-01-05T00:00:00Z',
      countries: { name: 'UAE', flag_emoji: '🇦🇪' },
      industry_sectors: { name: 'Marketing', icon: '📢' }
    },
    {
      id: '3',
      name: 'Cooperative Investment Group',
      description: 'Group investment in startup projects',
      status: 'under_voting',
      current_members: 15,
      max_members: 25,
      gateway_type: 'investment',
      userRole: 'member',
      isManager: false,
      created_at: '2024-01-01T00:00:00Z',
      countries: { name: 'Kuwait', flag_emoji: '🇰🇼' },
      industry_sectors: { name: 'Investment', icon: '💰' }
    },
    {
      id: '4',
      name: 'Independent Development Team',
      description: 'Developer team for tech projects',
      status: 'under_arbitration',
      current_members: 6,
      max_members: 10,
      gateway_type: 'freelancers',
      userRole: 'admin',
      isManager: true,
      created_at: '2023-12-20T00:00:00Z',
      countries: { name: 'Bahrain', flag_emoji: '🇧🇭' },
      industry_sectors: { name: 'Technology', icon: '💻' }
    }
  ];

  const getGatewayTypeLabel = (type: string) => {
    switch (type) {
      case 'purchasing': return 'Group Purchasing';
      case 'marketing': return 'Marketing Cooperatives';
      case 'investment': return 'Cooperative Investment';
      case 'freelancers': return 'Independent Team';
      case 'formation': return 'Company Formation';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>;
      case 'under_voting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Under Voting</Badge>;
      case 'under_arbitration':
        return <Badge className="bg-red-100 text-red-800 border-0">Under Arbitration</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-0">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string, isManager: boolean) => {
    if (isManager && role !== 'founder') {
      return 'Elected Manager';
    }
    switch (role) {
      case 'founder': return 'Founder';
      case 'admin': return 'Admin';
      case 'member': return 'Member';
      default: return role;
    }
  };

  const getLastUpdateText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Last activity: 2 hours ago';
      case 'under_voting':
        return 'Last vote: Supplier selection';
      case 'under_arbitration':
        return 'Last decision: Dispute filed';
      default:
        return 'Last update: 1 day ago';
    }
  };

  // Count only active groups
  const activeGroupsCount = myGroupsData.filter(group => group.status === 'active').length;

  if (isLoading) {
    return <div className="text-center py-8">Loading groups...</div>;
  }

  if (showCreateGroup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
            ← Back to Groups
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">Create New Group</h2>
        </div>
        <GroupCreationWizard onComplete={() => {
          setShowCreateGroup(false);
          window.location.reload();
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">My Groups</h3>
            <p className="text-gray-600">Manage your groups and participate in collective activities</p>
            <p className="text-sm text-blue-600 font-medium mt-1">
              Active Groups: {activeGroupsCount}
            </p>
          </div>
          <Button onClick={() => setShowCreateGroup(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Group Type Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { type: 'purchasing', label: 'Group Purchasing', icon: '🛒', count: myGroupsData.filter(g => g.gateway_type === 'purchasing').length },
            { type: 'marketing', label: 'Marketing Cooperatives', icon: '📢', count: myGroupsData.filter(g => g.gateway_type === 'marketing').length },
            { type: 'investment', label: 'Cooperative Investment', icon: '💰', count: myGroupsData.filter(g => g.gateway_type === 'investment').length },
            { type: 'freelancers', label: 'Independent Team', icon: '👥', count: myGroupsData.filter(g => g.gateway_type === 'freelancers').length }
          ].map((stat) => (
            <Card key={stat.type} className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h4 className="font-semibold text-gray-900">{stat.label}</h4>
              <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {myGroupsData.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <p className="text-gray-600 mb-4">You haven't created any groups yet.</p>
              <Button onClick={() => setShowCreateGroup(true)}>Create Your First Group</Button>
            </Card>
          ) : (
            myGroupsData.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{group.name}</h4>
                        {group.isManager && (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        {getGatewayTypeLabel(group.gateway_type)}
                      </p>
                    </div>
                    {getStatusBadge(group.status)}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {group.description}
                  </p>

                  {/* Role and Status Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-500">Your Role</span>
                      <p className="font-medium text-gray-900">
                        {getRoleLabel(group.userRole, group.isManager)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Last Update</span>
                      <p className="font-medium text-gray-900 text-sm">
                        {getLastUpdateText(group.status)}
                      </p>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.current_members}/{group.max_members} members</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.industry_sectors?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.countries?.flag_emoji} {group.countries?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{new Date(group.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Group Capacity</span>
                      <span className="text-gray-500">{Math.round((group.current_members / group.max_members) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/group-room/${group.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Enter Group Room
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Manager Privileges Info */}
      {myGroupsData.some(g => g.isManager) && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Elected Manager Privileges</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800">
                <div className="space-y-1">
                  <p>• Access to managers tab</p>
                  <p>• Create and manage decisions</p>
                  <p>• Approve submitted offers</p>
                </div>
                <div className="space-y-1">
                  <p>• Direct communication with MCP</p>
                  <p>• Review group performance reports</p>
                  <p>• Invite new members and freelancers</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyGroupsTab;
