
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MyGroupsTab = () => {
  const { user } = useAuth();

  // Mock data for user's groups
  const mockGroups = [
    {
      id: '1',
      name: 'Tech Startups Coalition',
      description: 'Collaborative group for technology entrepreneurs and innovators',
      category: 'technology',
      memberCount: 24,
      location: 'San Francisco, CA',
      status: 'active' as const,
      lastActivity: '2 hours ago',
      image: '/placeholder.svg'
    },
    {
      id: '2', 
      name: 'Sustainable Energy Initiative',
      description: 'Working towards renewable energy solutions and partnerships',
      category: 'energy',
      memberCount: 18,
      location: 'Austin, TX',
      status: 'active' as const,
      lastActivity: '1 day ago',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Digital Marketing Collective',
      description: 'Sharing strategies and resources for digital marketing success',
      category: 'marketing',
      memberCount: 31,
      location: 'New York, NY', 
      status: 'draft' as const,
      lastActivity: '3 days ago',
      image: '/placeholder.svg'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      draft: 'secondary',
      under_review: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
          <p className="text-gray-600">Groups you've joined or created</p>
        </div>
        <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
          Create New Group
        </Button>
      </div>

      <div className="grid gap-6">
        {mockGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  {getStatusBadge(group.status)}
                </div>
                <CardDescription className="max-w-2xl">
                  {group.description}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {group.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Active {group.lastActivity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                  <Button variant="default" size="sm" className="bg-productivity-blue hover:bg-productivity-blue/90">
                    View Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockGroups.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No groups yet</h3>
            <p className="text-gray-600 mb-4">Join or create your first group to get started</p>
            <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
              Explore Groups
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyGroupsTab;
