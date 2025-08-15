
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Globe, 
  Lock, 
  Star,
  Settings,
  Share2,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import EnhancedGroupRoomTabs from './EnhancedGroupRoomTabs';
import { useAuth } from '@/contexts/AuthContext';

interface GroupRoomInterfaceProps {
  groupId: string;
}

const GroupRoomInterface = ({ groupId }: GroupRoomInterfaceProps) => {
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [userRole, setUserRole] = useState('member');
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock group data - replace with actual API call
    const mockGroup = {
      id: groupId,
      name: 'Tech Innovators Collective',
      description: 'A collaborative space for technology professionals to share ideas, discuss trends, and work together on innovative projects.',
      type: 'professional',
      privacy: 'public',
      category: 'Technology',
      location: 'Global',
      members_count: 156,
      max_members: 500,
      created_at: '2024-01-01T00:00:00Z',
      image_url: null,
      tags: ['technology', 'innovation', 'collaboration', 'networking'],
      rules: [
        'Respect all members and maintain professional conduct',
        'Share knowledge and help others learn',
        'No spam or irrelevant content',
        'Use appropriate channels for different topics'
      ],
      stats: {
        messages_today: 23,
        active_proposals: 3,
        completed_deals: 12,
        satisfaction_rate: 94
      }
    };

    setGroup(mockGroup);
    setUserRole('member');
    setIsManager(true); // Mock manager status
    setLoading(false);
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Group Not Found</h2>
          <p className="text-muted-foreground">The group you're looking for doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Group Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src={group.image_url} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {group.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{group.name}</h1>
                    <Badge variant={group.privacy === 'public' ? 'default' : 'secondary'}>
                      {group.privacy === 'public' ? (
                        <>
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">{group.category}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 max-w-2xl">{group.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{group.members_count} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{group.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{group.stats.satisfaction_rate}% satisfaction</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-8">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {isManager && (
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{group.stats.messages_today}</div>
              <div className="text-sm text-muted-foreground">Messages Today</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{group.stats.active_proposals}</div>
              <div className="text-sm text-muted-foreground">Active Proposals</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{group.stats.completed_deals}</div>
              <div className="text-sm text-muted-foreground">Completed Deals</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{group.members_count}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Group Room Tabs */}
        <EnhancedGroupRoomTabs 
          groupId={groupId}
          group={group}
          userRole={userRole}
          isManager={isManager}
        />
      </div>
    </div>
  );
};

export default GroupRoomInterface;
