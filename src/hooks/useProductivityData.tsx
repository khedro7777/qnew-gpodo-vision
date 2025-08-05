
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tasks hooks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.log('No authenticated user');
        return [];
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      console.log('Tasks fetched successfully:', data);
      return data || [];
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
      toast.success('تم إنشاء المهمة بنجاح!');
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
      toast.success('تم تحديث المهمة بنجاح!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};

// Simple focus sessions without complex relations
export const useFocusSessions = () => {
  return useQuery({
    queryKey: ['focus_sessions'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.user.id)
        .order('started_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching focus sessions:', error);
        return [];
      }
      return data || [];
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

// Simplified notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      return data || [];
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

// Simplified goals
export const useGoals = () => {
  return useQuery({
    queryKey: ['user_goals'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching goals:', error);
        return [];
      }
      return data || [];
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
      toast.success('تم إنشاء الهدف بنجاح!');
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
