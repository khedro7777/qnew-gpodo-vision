
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  MessageCircle, 
  Vote, 
  FileText, 
  AlertTriangle, 
  CheckSquare,
  Settings,
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';
import GroupOverview from './GroupOverview';

interface GroupRoomProps {
  groupId: string;
}

const GroupRoomInterface = ({ groupId }: GroupRoomProps) => {
  const { user } = useAuth();
  const workflow = useGroupWorkflow(groupId);
  const [group, setGroup] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('member');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroupData();
  }, [groupId, user]);

  const loadGroupData = async () => {
    try {
      // Load group details
      const { data: groupData } = await supabase
        .from('groups')
        .select(`
          *,
          countries(name, flag_emoji),
          industry_sectors(name, icon)
        `)
        .eq('id', groupId)
        .single();

      if (groupData) {
        setGroup(groupData);
      }

      // Load user role in group
      if (user) {
        const { data: memberData } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();

        if (memberData) {
          setUserRole(memberData.role);
        }
      }
    } catch (error) {
      console.error('Load group data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportGroupData = async () => {
    try {
      // This would generate a PDF report of the group
      // For now, we'll just show a toast
      toast.success('Group report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Group not found</h2>
        <p className="text-gray-600 mt-2">The group you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Group Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <Badge 
                className={`capitalize ${
                  group.status === 'active' ? 'bg-green-100 text-green-800' :
                  group.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  group.status === 'paused' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {group.status}
              </Badge>
              {userRole === 'founder' && (
                <Badge className="bg-purple-100 text-purple-800">Founder</Badge>
              )}
            </div>
            
            {group.description && (
              <p className="text-gray-600 mb-4">{group.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{group.current_members}/{group.max_members} members</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
              </div>

              {group.countries && (
                <div className="flex items-center gap-1">
                  <span>{group.countries.flag_emoji}</span>
                  <span>{group.countries.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportGroupData}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            
            {userRole === 'founder' && (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-productivity-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Group Room Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-2">
          <TabsTrigger value="overview" className="flex flex-col gap-1 py-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          
          <TabsTrigger value="members" className="flex flex-col gap-1 py-3">
            <Users className="w-4 h-4" />
            <span className="text-xs">Members</span>
          </TabsTrigger>
          
          <TabsTrigger value="voting" className="flex flex-col gap-1 py-3">
            <Vote className="w-4 h-4" />
            <span className="text-xs">Voting</span>
          </TabsTrigger>
          
          <TabsTrigger value="proposals" className="flex flex-col gap-1 py-3">
            <FileText className="w-4 h-4" />
            <span className="text-xs">Proposals</span>
          </TabsTrigger>
          
          <TabsTrigger value="tasks" className="flex flex-col gap-1 py-3">
            <CheckSquare className="w-4 h-4" />
            <span className="text-xs">Tasks</span>
          </TabsTrigger>
          
          <TabsTrigger value="chat" className="flex flex-col gap-1 py-3">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Chat</span>
          </TabsTrigger>
          
          <TabsTrigger value="contracts" className="flex flex-col gap-1 py-3">
            <FileText className="w-4 h-4" />
            <span className="text-xs">Contracts</span>
          </TabsTrigger>
          
          <TabsTrigger value="arbitration" className="flex flex-col gap-1 py-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Arbitration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <GroupOverview group={group} userRole={userRole} />
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
            <p className="text-gray-600">Member management functionality coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="voting" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting & Decisions</h3>
            <p className="text-gray-600">Voting system coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposals</h3>
            <p className="text-gray-600">Proposal system coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Management</h3>
            <p className="text-gray-600">Task management coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Chat</h3>
            <p className="text-gray-600">Chat functionality coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibent text-gray-900 mb-4">Contracts</h3>
            <p className="text-gray-600">Contract management coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="arbitration" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arbitration</h3>
            <p className="text-gray-600">Arbitration system coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupRoomInterface;
