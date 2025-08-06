
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
  Activity,
  Shield,
  Crown,
  CheckCircle,
  AlertTriangle
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
  const [showManagerApprovalModal, setShowManagerApprovalModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [pendingAction, setPendingAction] = useState<any>(null);
  const ipfs = useIPFS();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      // Load groups with manager status and MCP control info
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
          industry_sectors: { name: 'Healthcare', icon: '🏥' },
          elected_manager: {
            id: 'manager-1',
            name: 'أحمد محمد',
            role: 'honorary', // Honorary/Supervisory role
            approval_required: true
          },
          mcp_control: {
            active: true,
            last_action: '2 hours ago',
            pending_approvals: 1
          }
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
          industry_sectors: { name: 'Technology', icon: '💻' },
          elected_manager: {
            id: 'manager-2',
            name: 'سارة أحمد',
            role: 'honorary',
            approval_required: false
          },
          mcp_control: {
            active: true,
            last_action: '5 minutes ago',
            pending_approvals: 0
          }
        }
      ];

      setGroups(mockGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    }
  };

  const executeManagementAction = async (action: string, groupId: string, data: any) => {
    const group = groups.find(g => g.id === groupId);
    
    // Check if manager approval is required for this action
    const requiresApproval = group?.elected_manager?.approval_required && 
      ['invite_member', 'remove_member', 'change_settings'].includes(action);

    if (requiresApproval) {
      setPendingAction({ action, groupId, data, group });
      setShowManagerApprovalModal(true);
      return;
    }

    // Execute action directly
    await performAction(action, groupId, data);
  };

  const performAction = async (action: string, groupId: string, data: any) => {
    try {
      switch (action) {
        case 'invite_member':
          toast.success(`MCP Agent: Invitation sent to ${data.email} for group ${data.groupName}`);
          onLogActivity('mcp_member_invited', `MCP Agent invited ${data.email} to ${data.groupName}`, groupId);
          break;
        
        case 'manage_voting':
          toast.success(`MCP Agent: Voting process managed for ${data.groupName}`);
          onLogActivity('mcp_voting_managed', `MCP Agent managed voting in ${data.groupName}`, groupId);
          break;
        
        case 'approve_offer':
          toast.success(`MCP Agent: Offer approved for ${data.groupName}`);
          onLogActivity('mcp_offer_approved', `MCP Agent approved offer in ${data.groupName}`, groupId);
          break;
        
        case 'manage_contracts':
          toast.success(`MCP Agent: Contract managed for ${data.groupName}`);
          onLogActivity('mcp_contract_managed', `MCP Agent managed contract in ${data.groupName}`, groupId);
          break;
        
        default:
          toast.success(`MCP Agent: Action ${action} executed successfully`);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error('Failed to execute management action');
    }
  };

  const requestManagerApproval = async () => {
    try {
      if (!pendingAction) return;

      // In real implementation, this would notify the manager
      toast.success(`Approval request sent to ${pendingAction.group.elected_manager.name}`);
      
      // Simulate manager approval after 3 seconds
      setTimeout(async () => {
        toast.success(`${pendingAction.group.elected_manager.name} approved the action`);
        await performAction(pendingAction.action, pendingAction.groupId, pendingAction.data);
        setShowManagerApprovalModal(false);
        setPendingAction(null);
      }, 3000);

    } catch (error) {
      console.error('Error requesting approval:', error);
      toast.error('Failed to request manager approval');
    }
  };

  const inviteMember = async () => {
    try {
      if (!selectedGroup || !inviteEmail) return;

      await executeManagementAction('invite_member', selectedGroup.id, {
        email: inviteEmail,
        role: inviteRole,
        groupName: selectedGroup.name
      });

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
        'mcp_ipfs_managed',
        `MCP Agent managed IPFS storage for group ${groupId}`,
        groupId,
        { totalFiles: files.length, storageStats: stats }
      );

      toast.success('MCP Agent: IPFS storage managed successfully');
    } catch (error) {
      console.error('Error managing IPFS:', error);
      toast.error('Failed to manage IPFS storage');
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
        <div>
          <h2 className="text-2xl font-bold">MCP Agent Control Center</h2>
          <p className="text-sm text-gray-600 mt-1">
            Full administrative control • Elected managers are honorary supervisors
          </p>
        </div>
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
                    <Badge className="bg-purple-100 text-purple-800">
                      <Shield className="w-3 h-3 mr-1" />
                      MCP Controlled
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>{group.countries?.flag_emoji} {group.countries?.name}</span>
                    <span>{group.industry_sectors?.icon} {group.industry_sectors?.name}</span>
                    <span>Created: {new Date(group.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Manager Status */}
                  {group.elected_manager && (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                      <Crown className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Honorary Manager:</span>
                      <span>{group.elected_manager.name}</span>
                      {group.elected_manager.approval_required ? (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">
                          Approval Required
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Supervisory Only
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowInviteModal(true);
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    MCP Invite
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => manageIPFSStorage(group.id)}
                  >
                    <Database className="w-4 h-4 mr-1" />
                    Manage IPFS
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => executeManagementAction('manage_voting', group.id, { groupName: group.name })}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Manage Voting
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                  <p className="text-sm text-gray-500">MCP Status</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className="text-sm font-semibold text-green-600">Active Control</p>
                  </div>
                </div>
              </div>

              {/* MCP Control Status */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Last MCP action: {group.mcp_control.last_action}</span>
                  </div>
                  {group.mcp_control.pending_approvals > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600">
                        {group.mcp_control.pending_approvals} pending approval(s)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => executeManagementAction('approve_offer', group.id, { groupName: group.name })}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Full Control Panel
                  </Button>
                </div>
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
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                MCP Agent: Invite New Member
              </CardTitle>
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
                  <option value="observer">Observer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Note: Administrative roles are MCP Agent controlled
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={inviteMember} className="flex-1">
                  Send MCP Invitation
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

      {/* Manager Approval Modal */}
      {showManagerApprovalModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                Manager Approval Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  This action requires approval from the honorary manager:
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{pendingAction.group.elected_manager.name}</p>
                  <p className="text-sm text-gray-600">Honorary Group Manager</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Action Details</label>
                <p className="text-gray-600 text-sm">{pendingAction.action} in {pendingAction.group.name}</p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={requestManagerApproval} className="flex-1">
                  Request Approval
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowManagerApprovalModal(false);
                    setPendingAction(null);
                  }}
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
