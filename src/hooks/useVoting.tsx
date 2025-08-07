
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Vote, VoteOption, UserVote } from '@/types';

export const useVoting = (groupId?: string) => {
  const queryClient = useQueryClient();

  // Get votes for a group (mock data for now)
  const { data: votes, isLoading: votesLoading } = useQuery({
    queryKey: ['votes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      console.log('Fetching votes for group:', groupId);
      // Return empty array for now until Supabase types are updated
      return [] as Vote[];
    },
    enabled: !!groupId,
  });

  // Get user votes (mock data for now)
  const { data: userVotes } = useQuery({
    queryKey: ['user_votes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      console.log('Fetching user votes for group:', groupId);
      // Return empty array for now until Supabase types are updated
      return [] as UserVote[];
    },
    enabled: !!groupId,
  });

  // Create vote mutation (mock for now)
  const createVote = useMutation({
    mutationFn: async (voteData: Omit<Vote, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating vote:', voteData);
      // Mock implementation
      return { id: 'mock-vote-id', ...voteData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as Vote;
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

  // Cast vote mutation (mock for now)
  const castVote = useMutation({
    mutationFn: async ({ voteId, optionId }: { voteId: string; optionId: string }) => {
      console.log('Casting vote:', { voteId, optionId });
      // Mock implementation
      return { id: 'mock-user-vote-id', vote_id: voteId, option_id: optionId, user_id: 'mock-user-id', created_at: new Date().toISOString() } as UserVote;
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

  // Add vote options mutation (mock for now)
  const addVoteOptions = useMutation({
    mutationFn: async ({ voteId, options }: { voteId: string; options: string[] }) => {
      console.log('Adding vote options:', { voteId, options });
      // Mock implementation
      return options.map((option, index) => ({
        id: `mock-option-${index}`,
        vote_id: voteId,
        option_text: option,
        vote_count: 0,
        created_at: new Date().toISOString()
      })) as VoteOption[];
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
