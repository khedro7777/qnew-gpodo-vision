
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Discussion {
  id: string;
  group_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file';
  file_url?: string;
  created_at: string;
  is_read: boolean;
  sender_name?: string;
}

export const useDiscussion = (groupId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get discussion messages for a group
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['discussion-messages', groupId],
    queryFn: async () => {
      if (!groupId) return [];

      console.log('Fetching discussion messages for group:', groupId);
      
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching discussion messages:', messagesError);
        throw messagesError;
      }

      // Then get profile data for senders
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Map profiles to messages
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      return messagesData.map(message => ({
        ...message,
        sender_name: profilesMap.get(message.sender_id)?.full_name || 'Unknown User'
      })) as Discussion[];
    },
    enabled: !!groupId,
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async ({ content, messageType = 'text', fileUrl }: { 
      content: string; 
      messageType?: 'text' | 'file';
      fileUrl?: string;
    }) => {
      if (!user?.id || !groupId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          group_id: groupId,
          content,
          message_type: messageType,
          file_url: fileUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion-messages', groupId] });
      toast.success('Message sent successfully');
    },
    onError: (error: any) => {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    },
  });

  // Mark messages as read
  const markAsRead = useMutation({
    mutationFn: async (messageIds: string[]) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', messageIds)
        .eq('receiver_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion-messages', groupId] });
    },
    onError: (error: any) => {
      console.error('Mark as read error:', error);
    },
  });

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessage.mutate,
    markAsRead: markAsRead.mutate,
    isSending: sendMessage.isPending,
    isMarkingRead: markAsRead.isPending,
  };
};
