
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageCircle, Video, Settings, Crown, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GroupRoomTabs from './GroupRoomTabs';

interface GroupRoomInterfaceProps {
  groupId: string;
}

const GroupRoomInterface: React.FC<GroupRoomInterfaceProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [userRole, setUserRole] = useState('member');
  const [isManager, setIsManager] = useState(false);
  const [onlineMembers, setOnlineMembers] = useState([]);

  useEffect(() => {
    // Mock group data
    const mockGroup = {
      id: groupId,
      name: 'Tech Innovation Hub',
      description: 'Collaborative space for technology professionals and entrepreneurs',
      memberCount: 24,
      onlineCount: 8,
      status: 'active',
      category: 'Technology'
    };
    
    setGroup(mockGroup);
    setUserRole('admin');
    setIsManager(true);

    // Mock online members
    const mockOnlineMembers = [
      { id: '1', name: 'John Doe', role: 'admin', status: 'online' },
      { id: '2', name: 'Jane Smith', role: 'moderator', status: 'online' },
      { id: '3', name: 'Mike Johnson', role: 'member', status: 'online' },
      { id: '4', name: 'Sarah Wilson', role: 'member', status: 'away' }
    ];
    setOnlineMembers(mockOnlineMembers);
  }, [groupId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-3 h-3 text-yellow-600" />;
      case 'moderator':
        return <Shield className="w-3 h-3 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (!group) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue mx-auto mb-2"></div>
          <p className="text-gray-600">Loading group room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Group Header */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              {group.name}
              <Badge variant="outline">{group.status}</Badge>
            </CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4 mr-2" />
              Video Call
            </Button>
            {isManager && (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {group.memberCount} members
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {group.onlineCount} online
              </span>
              <span className="capitalize">{group.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <GroupRoomTabs 
            groupId={groupId} 
            group={group}
            userRole={userRole}
            isManager={isManager}
          />
        </div>

        {/* Online Members Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Online Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">{member.name}</span>
                      {getRoleIcon(member.role)}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{member.role}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              
              {onlineMembers.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No members online
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupRoomInterface;
