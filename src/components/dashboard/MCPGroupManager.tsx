
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Database, 
  Upload,
  Eye,
  UserPlus,
  Settings,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIPFS } from '@/hooks/useIPFS';

interface MCPGroupManagerProps {
  mcpAgent: any;
  onLogActivity: (type: string, description: string, groupId?: string, metadata?: any) => void;
}

const MCPGroupManager = ({ mcpAgent, onLogActivity }: MCPGroupManagerProps) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const ipfs = useIPFS();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      // Load groups with member counts and performance data
      const mockGroups = [
        {
          id: '1',
          group_number: 'P 105',
          name: 'Medical Equipment Purchasing',
          gateway_type: 'purchasing',
          status: 'active',
          current_members: 12,
          max_members: 20,
          created_at: '2024-01-15',
          performance_score: 89,
          total_savings: 45000,
          countries: { name: 'Saudi Arabia', flag_emoji: '🇸🇦' },
          industry_sectors: { name: 'Healthcare', icon: '🏥' }
        },
        {
          id: '2',
          group_number: 'I 203',
          name: 'Tech Startup Investment',
          gateway_type: 'investment',
          status: 'active',
          current_members: 8,
          max_members: 15,
          created_at: '2024-02-01',
          performance_score: 76,
          total_savings: 125000,
          countries: { name: 'UAE', flag_emoji: '🇦🇪' },
          industry_sectors: { name: 'Technology', icon: '💻' }
        }
      ];

      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    }
  };

  const inviteMember = async () => {
    try {
      if (!selectedGroup || !inviteEmail) return;

      // In real implementation, this would send an invitation
      toast.success(`Invitation sent to ${inviteEmail} for ${selectedGroup.name}`);
      
      onLogActivity(
        'member_invited',
        `Invited ${inviteEmail} to join ${selectedGroup.name} as ${inviteRole}`,
        selectedGroup.id,
        { email: inviteEmail, role: inviteRole }
      );

      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error inviting member:', error);
      toast.error('Failed to send invitation');
    }
  };

  const manageIPFSStorage = async (groupId: string) => {
    try {
      const files = ipfs.getFiles(groupId);
      const stats = ipfs.getStorageStats(groupId);
      
      onLogActivity(
        'ipfs_managed',
        `Accessed IPFS storage for group ${groupId}`,
        groupId,
        { totalFiles: files.length, storageStats: stats }
      );

      toast.success('IPFS storage accessed successfully');
    } catch (error) {
      console.error('Error managing IPFS:', error);
      toast.error('Failed to access IPFS storage');
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.group_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Group Management Center</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-6">
        {filteredGroups.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-blue-100 text-blue-800 font-mono">
                      {group.group_number}
                    </Badge>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <Badge className={getStatusColor(group.status)}>
                      {group.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{group.countries?.flag_emoji} {group.countries?.name}</span>
                    <span>{group.industry_sectors?.icon} {group.industry_sectors?.name}</span>
                    <span>Created: {new Date(group.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowInviteModal(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Invite
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => manageIPFSStorage(group.id)}
                  >
                    <Database className="w-4 h-4 mr-1" />
                    IPFS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="text-lg font-semibold">
                    {group.current_members}/{group.max_members}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Performance</p>
                  <p className="text-lg font-semibold text-green-600">
                    {group.performance_score}%
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Total Savings</p>
                  <p className="text-lg font-semibold text-blue-600">
                    ${group.total_savings?.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Gateway Type</p>
                  <p className="text-lg font-semibold capitalize">
                    {group.gateway_type}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Last activity: 2 hours ago</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => {
                    onLogActivity(
                      'group_managed',
                      `Accessed management panel for ${group.name}`,
                      group.id
                    );
                  }}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Invite New Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group</label>
                <p className="text-gray-600">{selectedGroup?.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@example.com"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="observer">Observer</option>
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={inviteMember} className="flex-1">
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MCPGroupManager;
