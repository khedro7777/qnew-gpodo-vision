
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GroupInvitationWithDetails {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  status: string;
  created_at: string;
  expires_at: string;
  groups?: {
    name: string;
  };
  invited_by_profile?: {
    full_name: string;
  };
}

export const useInvitations = () => {
  const queryClient = useQueryClient();

  // Get group invitations with group and user details
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['group_invitations'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('group_invitations')
        .select(`
          *,
          groups:group_id (
            name
          ),
          invited_by_profile:invited_by (
            full_name
          )
        `)
        .eq('invited_user_id', user.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        return [];
      }
      
      return (data || []) as GroupInvitationWithDetails[];
    },
  });

  // Accept invitation mutation
  const acceptInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data: invitation } = await supabase
        .from('group_invitations')
        .select('group_id')
        .eq('id', invitationId)
        .single();

      if (!invitation) throw new Error('Invitation not found');

      // Update invitation status
      const { error: updateError } = await supabase
        .from('group_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (updateError) throw updateError;

      // Add user to group
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not found');

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invitation.group_id,
          user_id: user.user.id,
          role: 'member'
        });

      if (memberError) throw memberError;

      return { invitationId, groupId: invitation.group_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_invitations'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('تم قبول الدعوة بنجاح');
    },
    onError: (error: any) => {
      console.error('Accept invitation error:', error);
      toast.error('حدث خطأ في قبول الدعوة');
    },
  });

  // Reject invitation mutation
  const rejectInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('group_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitationId);
      
      if (error) throw error;
      return invitationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_invitations'] });
      toast.success('تم رفض الدعوة');
    },
    onError: (error: any) => {
      console.error('Reject invitation error:', error);
      toast.error('حدث خطأ في رفض الدعوة');
    },
  });

  return {
    invitations: invitations || [],
    isLoading,
    acceptInvitation: acceptInvitation.mutate,
    rejectInvitation: rejectInvitation.mutate,
    isAcceptingInvitation: acceptInvitation.isPending,
    isRejectingInvitation: rejectInvitation.isPending,
  };
};
