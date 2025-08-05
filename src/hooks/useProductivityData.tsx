import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tasks hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch profile data separately for assigned users
      const assignedUserIds = data?.filter(task => task.assigned_to).map(task => task.assigned_to) || [];
      const createdUserIds = data?.map(task => task.created_by) || [];
      const allUserIds = [...new Set([...assignedUserIds, ...createdUserIds])];
      
      let profilesData: any[] = [];
      if (allUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', allUserIds);
        profilesData = profiles || [];
      }
      
      // Map profile data to tasks
      const tasksWithProfiles = data?.map(task => ({
        ...task,
        assigned_profile: task.assigned_to 
          ? { full_name: profilesData.find(p => p.id === task.assigned_to)?.full_name || 'Unknown User' }
          : null,
        created_profile: { full_name: profilesData.find(p => p.id === task.created_by)?.full_name || 'Unknown User' }
      })) || [];
      
      return tasksWithProfiles;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      assigned_to?: string;
      group_id?: string;
      due_date?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, created_by: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      description: string;
      status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      priority: 'low' | 'medium' | 'high' | 'urgent';
    }>) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

// Focus Sessions hooks
export const useFocusSessions = () => {
  return useQuery({
    queryKey: ['focus_sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select(`
          *,
          task:tasks(title)
        `)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFocusSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (session: {
      duration_minutes: number;
      task_id?: string;
      notes?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('focus_sessions')
        .insert([{ ...session, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus_sessions'] });
    },
  });
};

export const useUpdateFocusSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, completed, notes }: { 
      id: string; 
      completed: boolean; 
      notes?: string; 
    }) => {
      const { data, error } = await supabase
        .from('focus_sessions')
        .update({ 
          completed, 
          notes,
          completed_at: completed ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['focus_sessions'] });
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Goals hooks
export const useGoals = () => {
  return useQuery({
    queryKey: ['user_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goal: {
      title: string;
      description?: string;
      target_value: number;
      goal_type: 'daily' | 'weekly' | 'monthly' | 'custom';
      due_date?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_goals')
        .insert([{ ...goal, user_id: user.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_goals'] });
      toast.success('Goal created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, current_value }: { id: string; current_value: number }) => {
      const { data, error } = await supabase
        .from('user_goals')
        .update({ current_value })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_goals'] });
    },
  });
};
