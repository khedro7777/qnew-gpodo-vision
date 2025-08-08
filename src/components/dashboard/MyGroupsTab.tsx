import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Search, Filter, MapPin, Building2, Calendar, Eye, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const MyGroupsTab = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Medical Equipment Group',
      description: 'Focused on medical equipment trading and innovation.',
      location: 'Riyadh, Saudi Arabia',
      industry: 'Healthcare',
      members: 45,
      lastActivity: '2 days ago',
      isPublic: true,
      isMember: true,
    },
    {
      id: '2',
      name: 'Tech Supplies Group',
      description: 'Sourcing and supplying the latest tech gadgets.',
      location: 'Dubai, UAE',
      industry: 'Technology',
      members: 28,
      lastActivity: '5 hours ago',
      isPublic: false,
      isMember: false,
    },
    {
      id: '3',
      name: 'Manufacturing Group',
      description: 'Connecting manufacturers and suppliers globally.',
      location: 'Jeddah, Saudi Arabia',
      industry: 'Manufacturing',
      members: 62,
      lastActivity: '1 week ago',
      isPublic: true,
      isMember: true,
    },
  ]);

  const filteredGroups = groups.filter(group => {
    const searchMatch = group.name.toLowerCase().includes(searchQuery.toLowerCase());
    const filterMatch = filter === 'all' || (filter === 'public' && group.isPublic) || (filter === 'private' && !group.isPublic);
    return searchMatch && filterMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">My Groups</CardTitle>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            Create Group
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage and explore your business groups.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Input
            type="text"
            placeholder="Search groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        </div>

        <Tabs defaultValue="all" className="w-1/3">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Group List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <Card key={group.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">{group.name}</CardTitle>
              <Badge className={group.isPublic ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {group.isPublic ? 'Public' : 'Private'}
              </Badge>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p>{group.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{group.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span>{group.industry}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{group.members} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Active {group.lastActivity}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link to={`/group/${group.id}`}>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 ml-2" />
                    View Group
                  </Button>
                </Link>
                {group.isMember ? (
                  <Badge variant="secondary">
                    <MessageCircle className="w-3 h-3 ml-1" />
                    Member
                  </Badge>
                ) : (
                  <Button variant="secondary">
                    <Plus className="w-4 h-4 ml-2" />
                    Join
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyGroupsTab;
