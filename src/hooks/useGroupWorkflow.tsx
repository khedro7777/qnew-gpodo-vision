
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkflowState {
  tasks: any[];
  currentTaskIndex: number;
  isWorkflowActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  pausedTime: Date | null;
  timeElapsedWhilePaused: number;
}

interface UseGroupWorkflowProps {
  groupId: string;
}

export const useGroupWorkflow = ({ groupId }: UseGroupWorkflowProps) => {
  const { user } = useAuth();
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    tasks: [],
    currentTaskIndex: 0,
    isWorkflowActive: false,
    startTime: null,
    endTime: null,
    pausedTime: null,
    timeElapsedWhilePaused: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchWorkflowTasks(groupId);
    }
  }, [groupId]);

  const fetchWorkflowTasks = async (groupId: string) => {
    setIsLoading(true);
    try {
      // Since workflow_tasks table doesn't exist in our schema, 
      // we'll use the tasks table and mock workflow functionality
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
        toast.error(`Failed to load tasks: ${error.message}`);
      } else {
        setWorkflowState(prevState => ({ 
          ...prevState, 
          tasks: data || [] 
        }));
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error loading tasks: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkflow = async () => {
    if (workflowState.tasks.length === 0) {
      toast.error('No tasks available to start the workflow.');
      return;
    }

    setIsLoading(true);
    try {
      setWorkflowState(prevState => ({
        ...prevState,
        isWorkflowActive: true,
        currentTaskIndex: 0,
        startTime: new Date(),
        endTime: null,
        pausedTime: null,
        timeElapsedWhilePaused: 0,
      }));
      toast.success('Workflow started!');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to start workflow: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseWorkflow = () => {
    if (!workflowState.isWorkflowActive || workflowState.pausedTime !== null) {
      return;
    }

    setIsLoading(true);
    try {
      setWorkflowState(prevState => ({
        ...prevState,
        isWorkflowActive: false,
        pausedTime: new Date(),
      }));
      toast.info('Workflow paused.');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to pause workflow: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeWorkflow = () => {
    if (workflowState.isWorkflowActive || workflowState.pausedTime === null) {
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const timeDiff = now.getTime() - workflowState.pausedTime.getTime();

      setWorkflowState(prevState => ({
        ...prevState,
        isWorkflowActive: true,
        pausedTime: null,
        timeElapsedWhilePaused: prevState.timeElapsedWhilePaused + timeDiff,
      }));
      toast.success('Workflow resumed.');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to resume workflow: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async () => {
    setIsLoading(true);
    try {
      const nextTaskIndex = workflowState.currentTaskIndex + 1;

      if (nextTaskIndex < workflowState.tasks.length) {
        setWorkflowState(prevState => ({
          ...prevState,
          currentTaskIndex: nextTaskIndex,
        }));
        toast.success('Task completed! Loading next task.');
      } else {
        // Workflow completed
        setWorkflowState(prevState => ({
          ...prevState,
          isWorkflowActive: false,
          endTime: new Date(),
        }));
        toast.success('Workflow completed!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to complete task: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetWorkflow = () => {
    setIsLoading(true);
    try {
      setWorkflowState({
        tasks: workflowState.tasks,
        currentTaskIndex: 0,
        isWorkflowActive: false,
        startTime: null,
        endTime: null,
        pausedTime: null,
        timeElapsedWhilePaused: 0,
      });
      toast.info('Workflow reset.');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to reset workflow: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workflowState,
    isLoading,
    error,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    completeTask,
    resetWorkflow,
  };
};
