
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Vote, VoteOption, UserVote } from '@/types';

export const useVoting = (groupId?: string) => {
  const queryClient = useQueryClient();

  // Get votes for a group
  const { data: votes, isLoading: votesLoading } = useQuery({
    queryKey: ['votes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      const { data, error } = await supabase
        .from('votes')
        .select(`
          *,
          vote_options(*)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching votes:', error);
        return [];
      }
      
      return data as Vote[];
    },
    enabled: !!groupId,
  });

  // Get user votes
  const { data: userVotes } = useQuery({
    queryKey: ['user_votes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('user_votes')
        .select(`
          *,
          votes!inner(group_id)
        `)
        .eq('user_id', user.user.id)
        .eq('votes.group_id', groupId);
      
      if (error) {
        console.error('Error fetching user votes:', error);
        return [];
      }
      
      return data as UserVote[];
    },
    enabled: !!groupId,
  });

  // Create vote mutation
  const createVote = useMutation({
    mutationFn: async (voteData: Omit<Vote, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('votes')
        .insert([voteData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      toast.success('تم إنشاء التصويت بنجاح');
    },
    onError: (error: any) => {
      console.error('Create vote error:', error);
      toast.error('حدث خطأ في إنشاء التصويت');
    },
  });

  // Cast vote mutation
  const castVote = useMutation({
    mutationFn: async ({ voteId, optionId }: { voteId: string; optionId: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_votes')
        .insert([{
          vote_id: voteId,
          option_id: optionId,
          user_id: user.user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Update vote count
      await supabase.rpc('increment_vote_count', { 
        option_id: optionId 
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['user_votes', groupId] });
      toast.success('تم تسجيل صوتك بنجاح');
    },
    onError: (error: any) => {
      console.error('Cast vote error:', error);
      toast.error('حدث خطأ في التصويت');
    },
  });

  // Add vote options mutation
  const addVoteOptions = useMutation({
    mutationFn: async ({ voteId, options }: { voteId: string; options: string[] }) => {
      const voteOptions = options.map(option => ({
        vote_id: voteId,
        option_text: option
      }));

      const { data, error } = await supabase
        .from('vote_options')
        .insert(voteOptions)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      toast.success('تم إضافة خيارات التصويت بنجاح');
    },
    onError: (error: any) => {
      console.error('Add vote options error:', error);
      toast.error('حدث خطأ في إضافة خيارات التصويت');
    },
  });

  return {
    votes: votes || [],
    userVotes: userVotes || [],
    isLoading: votesLoading,
    createVote: createVote.mutate,
    castVote: castVote.mutate,
    addVoteOptions: addVoteOptions.mutate,
    isCreatingVote: createVote.isPending,
    isCastingVote: castVote.isPending,
    isAddingOptions: addVoteOptions.isPending,
  };
};
