
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Building2, ExternalLink, Plus } from 'lucide-react';
import { useGroups } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import GroupCreationWizard from '@/components/workflow/GroupCreationWizard';
import { useState } from 'react';

const MyGroupsTab = () => {
  const { data: groups = [], isLoading } = useGroups();
  const { user } = useAuth();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Filter groups where user is member or creator
  const myGroups = groups.filter(group => 
    group.creator_id === user?.id || 
    group.current_members > 0 // This would need proper member checking
  );

  const joinedGroups = groups.filter(group => 
    group.creator_id !== user?.id && group.is_public
  );

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
          // Refresh groups list
          window.location.reload();
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">My Created Groups</h3>
          <Button onClick={() => setShowCreateGroup(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <p className="text-gray-600 mb-4">You haven't created any groups yet.</p>
              <Button onClick={() => setShowCreateGroup(true)}>Create Your First Group</Button>
            </Card>
          ) : (
            myGroups.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
                  <Badge className={`${
                    group.status === 'active' ? 'bg-green-100 text-green-800' : 
                    group.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  } border-0`}>
                    {group.status}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{group.current_members} / {group.max_members} members</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{group.industry_sectors?.name || 'General'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{group.countries?.name || 'Global'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(group.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link to={`/group/${group.id}`}>
                  <Button className="w-full" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Group
                  </Button>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Groups to Join</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedGroups.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <p className="text-gray-600">No groups available to join at the moment.</p>
            </Card>
          ) : (
            joinedGroups.slice(0, 6).map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    Open
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {group.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{group.current_members} / {group.max_members} members</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Building2 className="w-4 h-4" />
                    <span>{group.industry_sectors?.name || 'General'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/group/${group.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1">
                    Join Group
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGroupsTab;
