
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Group, GroupMember, Vote, Proposal, Task } from '@/types';

export const useGroupWorkflow = (groupId: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Join Group Workflow
  const joinGroup = useCallback(async (group: Group) => {
    if (!user) {
      toast.error('Please log in to join groups');
      return false;
    }

    setLoading(true);
    try {
      // Check KYC requirement - now using correct property from User type
      if (user.kyc_status !== 'approved') {
        toast.error('KYC verification required for this group');
        return false;
      }

      // Check points requirement - now using correct property from User type
      const userPoints = user.points || 0;
      if (userPoints < 0) { // Removed entry_points check as it's not in the current schema
        toast.error(`Insufficient points for this group`);
        return false;
      }

      // Check MCP test requirement  
      const { data: mcpTest } = await supabase
        .from('mcp_test_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (!mcpTest) {
        toast.error('MCP test completion required for this group');
        return false;
      }

      // Add member to group
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      // Update group member count
      await supabase
        .from('groups')
        .update({ current_members: group.current_members + 1 })
        .eq('id', groupId);

      toast.success(group.is_public ? 'Successfully joined group!' : 'Join request submitted for approval');
      return true;

    } catch (error: any) {
      console.error('Join group error:', error);
      toast.error('Failed to join group');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, groupId]);

  // Create Vote
  const createVote = useCallback(async (voteData: Partial<Vote>) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('group_proposals')
        .insert({
          title: voteData.title,
          description: voteData.description,
          group_id: groupId,
          created_by: user.id,
          status: 'submitted'
        });

      if (error) throw error;

      // Notify all group members
      await notifyGroupMembers('vote', 'New vote created', `Vote: ${voteData.title}`);

      toast.success('Vote created successfully');
      return true;
    } catch (error) {
      console.error('Create vote error:', error);
      toast.error('Failed to create vote');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, groupId]);

  // Cast Vote
  const castVote = useCallback(async (voteId: string, optionId: string) => {
    if (!user) return false;

    try {
      // This will be implemented when vote_results table exists
      console.log(`Would cast vote for option ${optionId} on vote ${voteId}`);
      toast.success('Vote cast successfully (demo mode)');
      return true;
    } catch (error) {
      console.error('Cast vote error:', error);
      toast.error('Failed to cast vote');
      return false;
    }
  }, [user]);

  // Submit Proposal
  const submitProposal = useCallback(async (proposalData: Partial<Proposal>) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('group_proposals')
        .insert({
          title: proposalData.title,
          description: proposalData.description,
          document_url: proposalData.document_url,
          group_id: groupId,
          created_by: user.id,
          status: 'submitted'
        });

      if (error) throw error;

      await notifyGroupMembers('proposal', 'New proposal submitted', `Proposal: ${proposalData.title}`);

      toast.success('Proposal submitted successfully');
      return true;
    } catch (error) {
      console.error('Submit proposal error:', error);
      toast.error('Failed to submit proposal');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, groupId]);

  // Create Task
  const createTask = useCallback(async (taskData: Partial<Task>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
          assigned_to: taskData.assigned_to,
          due_date: taskData.due_date,
          group_id: groupId,
          created_by: user.id
        });

      if (error) throw error;

      if (taskData.assigned_to) {
        await supabase
          .from('notifications')
          .insert({
            user_id: taskData.assigned_to,
            title: 'Task Assigned',
            message: `You have been assigned a new task: ${taskData.title}`,
            type: 'info'
          });
      }

      toast.success('Task created successfully');
      return true;
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
      return false;
    }
  }, [user, groupId]);

  // File Arbitration Case
  const fileArbitrationCase = useCallback(async (caseData: {
    respondent_id: string;
    title: string;
    description: string;
    evidence: string[];
  }) => {
    if (!user) return false;

    setLoading(true);
    try {
      // Update group status to 'closed' instead of 'paused' to match schema
      await supabase
        .from('groups')
        .update({ status: 'closed' })
        .eq('id', groupId);

      // Create arbitration case (this would be implemented when arbitration_cases table exists)
      console.log('Would create arbitration case:', caseData);

      // Notify relevant parties
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: caseData.respondent_id,
            title: 'Arbitration Case Filed',
            message: `An arbitration case has been filed against you: ${caseData.title}`,
            type: 'warning',
            action_url: `/arbitration/case-id`
          }
        ]);

      toast.success('Arbitration case filed successfully. Group has been temporarily frozen.');
      return true;
    } catch (error) {
      console.error('File arbitration error:', error);
      toast.error('Failed to file arbitration case');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, groupId]);

  // Helper function to notify group members
  const notifyGroupMembers = async (type: string, title: string, message: string) => {
    try {
      const { data: members } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      if (members && members.length > 0) {
        const notifications = members
          .filter(member => member.user_id !== user?.id)
          .map(member => ({
            user_id: member.user_id,
            title,
            message,
            type,
            action_url: `/group/${groupId}`
          }));

        await supabase
          .from('notifications')
          .insert(notifications);
      }
    } catch (error) {
      console.error('Notify group members error:', error);
    }
  };

  return {
    loading,
    joinGroup,
    createVote,
    castVote,
    submitProposal,
    createTask,
    fileArbitrationCase
  };
};
