
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Vote {
  id: string;
  group_id: string;
  title: string;
  description?: string;
  created_by: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vote_options?: VoteOption[];
}

export interface VoteOption {
  id: string;
  vote_id: string;
  option_text: string;
  vote_count: number;
  order_index: number;
}

export interface UserVote {
  id: string;
  vote_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

export const useVoting = (groupId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get votes for a group - using group_proposals as vote storage for now
  const { data: votes, isLoading: votesLoading } = useQuery({
    queryKey: ['votes', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      
      console.log('Fetching votes/proposals for group:', groupId);
      
      const { data, error } = await supabase
        .from('group_proposals')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching votes:', error);
        throw error;
      }
      
      // Transform proposals to vote format with mock options
      return data.map(proposal => ({
        id: proposal.id,
        group_id: proposal.group_id,
        title: proposal.title,
        description: proposal.description,
        created_by: proposal.created_by,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        is_active: proposal.status === 'submitted',
        created_at: proposal.created_at,
        updated_at: proposal.updated_at,
        vote_options: [
          {
            id: `${proposal.id}-approve`,
            vote_id: proposal.id,
            option_text: 'Approve',
            vote_count: Math.floor(Math.random() * 10),
            order_index: 0
          },
          {
            id: `${proposal.id}-reject`,
            vote_id: proposal.id,
            option_text: 'Reject',
            vote_count: Math.floor(Math.random() * 5),
            order_index: 1
          }
        ]
      })) as Vote[];
    },
    enabled: !!groupId,
  });

  // Get user votes - mock for now
  const { data: userVotes } = useQuery({
    queryKey: ['user_votes', groupId, user?.id],
    queryFn: async () => {
      if (!groupId || !user?.id) return [];
      
      // Mock user votes based on localStorage for demo
      const storedVotes = localStorage.getItem(`user_votes_${user.id}_${groupId}`);
      return storedVotes ? JSON.parse(storedVotes) : [];
    },
    enabled: !!groupId && !!user?.id,
  });

  // Create vote mutation - creates a proposal for now
  const createVote = useMutation({
    mutationFn: async (voteData: {
      title: string;
      description?: string;
      group_id: string;
      created_by: string;
      deadline: string;
      is_active: boolean;
      vote_options: { option_text: string; vote_count: number; order_index: number }[];
    }) => {
      console.log('Creating vote/proposal:', voteData);
      
      const { data, error } = await supabase
        .from('group_proposals')
        .insert({
          title: voteData.title,
          description: voteData.description,
          group_id: voteData.group_id,
          created_by: voteData.created_by,
          status: 'submitted'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      toast.success('Vote created successfully');
    },
    onError: (error: any) => {
      console.error('Create vote error:', error);
      toast.error('Failed to create vote');
    },
  });

  // Cast vote mutation - stores in localStorage for demo
  const castVote = useMutation({
    mutationFn: async ({ voteId, optionId }: { voteId: string; optionId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      console.log('Casting vote:', { voteId, optionId, userId: user.id });
      
      const newVote = {
        id: `vote_${Date.now()}`,
        vote_id: voteId,
        option_id: optionId,
        user_id: user.id,
        created_at: new Date().toISOString()
      };
      
      // Store in localStorage for demo
      const storageKey = `user_votes_${user.id}_${groupId}`;
      const existingVotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedVotes = [...existingVotes, newVote];
      localStorage.setItem(storageKey, JSON.stringify(updatedVotes));
      
      return newVote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      queryClient.invalidateQueries({ queryKey: ['user_votes', groupId, user?.id] });
      toast.success('Vote cast successfully');
    },
    onError: (error: any) => {
      console.error('Cast vote error:', error);
      toast.error('Failed to cast vote');
    },
  });

  // Add vote options mutation - not needed for current implementation
  const addVoteOptions = useMutation({
    mutationFn: async ({ voteId, options }: { voteId: string; options: string[] }) => {
      console.log('Adding vote options:', { voteId, options });
      // Mock implementation
      return options.map((option, index) => ({
        id: `option_${voteId}_${index}`,
        vote_id: voteId,
        option_text: option,
        vote_count: 0,
        order_index: index
      }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes', groupId] });
      toast.success('Vote options added successfully');
    },
    onError: (error: any) => {
      console.error('Add vote options error:', error);
      toast.error('Failed to add vote options');
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
