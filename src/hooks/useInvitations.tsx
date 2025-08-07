
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { GroupInvitation } from '@/types';

export const useInvitations = () => {
  const queryClient = useQueryClient();

  // Get user invitations
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['group_invitations'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('group_invitations')
        .select(`
          *,
          groups(name),
          invited_by_profile:profiles!group_invitations_invited_by_fkey(full_name)
        `)
        .eq('invited_user_id', user.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        return [];
      }
      
      return data as GroupInvitation[];
    },
  });

  // Send invitation mutation
  const sendInvitation = useMutation({
    mutationFn: async ({ groupId, invitedUserId }: { groupId: string; invitedUserId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('group_invitations')
        .insert([{
          group_id: groupId,
          invited_user_id: invitedUserId,
          invited_by: user.user.id,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_invitations'] });
      toast.success('تم إرسال الدعوة بنجاح');
    },
    onError: (error: any) => {
      console.error('Send invitation error:', error);
      toast.error('حدث خطأ في إرسال الدعوة');
    },
  });

  // Accept invitation mutation
  const acceptInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data: invitation } = await supabase
        .from('group_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (!invitation) throw new Error('Invitation not found');

      // Update invitation status
      await supabase
        .from('group_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      // Add user to group
      const { data, error } = await supabase
        .from('group_members')
        .insert([{
          group_id: invitation.group_id,
          user_id: invitation.invited_user_id,
          role: 'member'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group_invitations'] });
      queryClient.invalidateQueries({ queryKey: ['group_members'] });
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
      const { data, error } = await supabase
        .from('group_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
    sendInvitation: sendInvitation.mutate,
    acceptInvitation: acceptInvitation.mutate,
    rejectInvitation: rejectInvitation.mutate,
    isSendingInvitation: sendInvitation.isPending,
    isAcceptingInvitation: acceptInvitation.isPending,
    isRejectingInvitation: rejectInvitation.isPending,
  };
};
