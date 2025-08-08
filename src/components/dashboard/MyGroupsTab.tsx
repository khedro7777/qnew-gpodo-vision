import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, Calendar, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GroupCard from './GroupCard';

const MyGroupsTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Marketing Mavericks',
      description: 'A group for innovative marketing strategies.',
      memberCount: 45,
      lastActivity: 'Yesterday',
      location: 'New York, USA',
      industry: 'Marketing',
      creationDate: '2023-01-15',
    },
    {
      id: '2',
      name: 'Tech Innovators Hub',
      description: 'Discussing the latest tech trends and innovations.',
      memberCount: 120,
      lastActivity: 'Today',
      location: 'San Francisco, USA',
      industry: 'Technology',
      creationDate: '2022-11-20',
    },
    {
      id: '3',
      name: 'Creative Design Circle',
      description: 'Sharing creative design ideas and feedback.',
      memberCount: 68,
      lastActivity: '2 days ago',
      location: 'London, UK',
      industry: 'Design',
      creationDate: '2023-03-01',
    },
  ]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Groups</span>
          <Badge variant="secondary">3 Groups</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:w-64"
            />
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyGroupsTab;
