
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Crown, 
  Shield, 
  User, 
  Mail,
  UserPlus,
  MoreVertical,
  Settings,
  UserMinus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGroupManagement } from '@/hooks/useGroupManagement';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GroupMembersTabProps {
  groupId: string;
  userRole: string;
}

const GroupMembersTab = ({ groupId, userRole }: GroupMembersTabProps) => {
  const { user } = useAuth();
  const { 
    members, 
    isManager,
    isFounder,
    isLoading, 
    updateMemberRole, 
    removeMember,
    isUpdatingRole,
    isRemoving
  } = useGroupManagement(groupId);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return;

    // Mock invite functionality - would integrate with real invitation system
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleRoleChange = (memberId: string, newRole: 'member' | 'manager') => {
    updateMemberRole({ memberId, newRole });
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      removeMember(memberId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'founder':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'bg-yellow-100 text-yellow-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Members</h2>
          <p className="text-gray-600">Manage group membership and roles</p>
        </div>
        
        {(isManager || isFounder) && (
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteMember}>
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Members List */}
      <Card className="p-6">
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback>
                    {member.full_name?.charAt(0) || member.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {member.full_name || 'Unknown User'}
                      {member.user_id === user?.id && (
                        <span className="text-sm text-gray-500 font-normal ml-1">(You)</span>
                      )}
                    </h3>
                    {getRoleIcon(member.role)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{member.email}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={getRoleBadgeColor(member.role)}>
                  {member.role === 'founder' ? 'Founder' : 
                   member.role === 'manager' ? 'Manager' : 'Member'}
                </Badge>

                {(isFounder || (isManager && member.role !== 'founder')) && member.user_id !== user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role === 'member' && (
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(member.id, 'manager')}
                          disabled={isUpdatingRole}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Promote to Manager
                        </DropdownMenuItem>
                      )}
                      
                      {member.role === 'manager' && isFounder && (
                        <DropdownMenuItem 
                          onClick={() => handleRoleChange(member.id, 'member')}
                          disabled={isUpdatingRole}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id, member.full_name || member.email || 'Unknown')}
                        disabled={isRemoving}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Members Yet</h3>
            <p className="text-gray-500">Invite members to start building your group.</p>
          </div>
        )}
      </Card>

      {/* Role Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">Founder</p>
              <p className="text-sm text-gray-600">Full control over the group, can manage all members and settings</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Manager</p>
              <p className="text-sm text-gray-600">Can create votes, manage offers, and moderate discussions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Member</p>
              <p className="text-sm text-gray-600">Can participate in discussions, vote, and view group content</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GroupMembersTab;
