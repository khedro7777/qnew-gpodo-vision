
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: 'member' | 'manager' | 'founder';
  joined_at: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export const useGroupManagement = (groupId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get group members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: async () => {
      if (!groupId) return [];

      // First get group members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId);

      if (membersError) {
        console.error('Error fetching group members:', membersError);
        throw membersError;
      }

      // Then get profile data for members
      const userIds = membersData.map(m => m.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Map profiles to members
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      return membersData.map(member => ({
        ...member,
        full_name: profilesMap.get(member.user_id)?.full_name,
        email: profilesMap.get(member.user_id)?.email,
        avatar_url: profilesMap.get(member.user_id)?.avatar_url
      })) as GroupMember[];
    },
    enabled: !!groupId,
  });

  // Get group invitations (mock for now)
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['group-invitations', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      // Mock data for now - would need to create invitations table
      return [] as GroupInvitation[];
    },
    enabled: !!groupId,
  });

  // Join group
  const joinGroup = useMutation({
    mutationFn: async () => {
      if (!user?.id || !groupId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('group_members')
        .insert({
          user_id: user.id,
          group_id: groupId,
          role: 'member'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Successfully joined the group!');
    },
    onError: (error: any) => {
      console.error('Join group error:', error);
      toast.error('Failed to join group');
    },
  });

  // Leave group
  const leaveGroup = useMutation({
    mutationFn: async () => {
      if (!user?.id || !groupId) throw new Error('Missing required data');

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('user_id', user.id)
        .eq('group_id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Successfully left the group');
    },
    onError: (error: any) => {
      console.error('Leave group error:', error);
      toast.error('Failed to leave group');
    },
  });

  // Update member role
  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, newRole }: { memberId: string; newRole: 'member' | 'manager' }) => {
      const { error } = await supabase
        .from('group_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      toast.success('Member role updated successfully');
    },
    onError: (error: any) => {
      console.error('Update member role error:', error);
      toast.error('Failed to update member role');
    },
  });

  // Remove member
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      toast.success('Member removed successfully');
    },
    onError: (error: any) => {
      console.error('Remove member error:', error);
      toast.error('Failed to remove member');
    },
  });

  // Get user's role in the group
  const userRole = members.find(m => m.user_id === user?.id)?.role || 'member';
  const isManager = userRole === 'manager' || userRole === 'founder';
  const isFounder = userRole === 'founder';

  return {
    members,
    invitations,
    userRole,
    isManager,
    isFounder,
    isLoading: membersLoading || invitationsLoading,
    joinGroup: joinGroup.mutate,
    leaveGroup: leaveGroup.mutate,
    updateMemberRole: updateMemberRole.mutate,
    removeMember: removeMember.mutate,
    isJoining: joinGroup.isPending,
    isLeaving: leaveGroup.isPending,
    isUpdatingRole: updateMemberRole.isPending,
    isRemoving: removeMember.isPending,
  };
};
