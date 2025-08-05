
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const EnhancedTaskList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  console.log('EnhancedTaskList render:', { user: !!user });

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', user?.id, filter],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID, returning mock data');
        // Return mock tasks for demo mode
        return [
          {
            id: '1',
            title: 'Review supplier proposals',
            description: 'Analyze pricing and terms for office supplies',
            status: 'pending',
            priority: 'high',
            due_date: '2025-08-06',
            created_at: '2025-08-05T10:00:00Z',
            user_id: 'demo'
          },
          {
            id: '2',
            title: 'Schedule team meeting',
            description: 'Quarterly planning session',
            status: 'completed',
            priority: 'medium',
            due_date: '2025-08-05',
            created_at: '2025-08-05T09:00:00Z',
            user_id: 'demo'
          }
        ];
      }

      try {
        let query = supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Tasks query error:', error);
          throw error;
        }

        console.log('Tasks loaded successfully:', data?.length || 0);
        return data || [];
      } catch (err) {
        console.error('Failed to load tasks:', err);
        throw err;
      }
    },
    retry: false,
  });

  const addTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!user?.id) {
        throw new Error('Authentication required');
      }
      
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: title,
          status: 'pending',
          priority: 'medium'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle('');
      toast.success('Task added successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to add task: ' + error.message);
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, currentStatus }: { taskId: string; currentStatus: string }) => {
      if (!user?.id) {
        throw new Error('Authentication required');
      }

      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: (error: Error) => {
      toast.error('Failed to update task: ' + error.message);
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTaskMutation.mutate(newTaskTitle);
  };

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    toggleTaskMutation.mutate({ taskId, currentStatus });
  };

  if (error) {
    console.error('EnhancedTaskList error:', error);
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Tasks</h3>
          <p className="text-gray-600 mb-4">There was an error loading your tasks. Please try again.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Task Management</h3>
          <p className="text-gray-600 text-sm">Stay organized and productive</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add New Task */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          className="flex-1"
        />
        <Button 
          onClick={handleAddTask}
          disabled={!newTaskTitle.trim() || addTaskMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Add your first task to get started!</p>
          </div>
        ) : (
          tasks.map((task: any) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <button
                onClick={() => handleToggleTask(task.id, task.status)}
                className="mt-1"
                disabled={toggleTaskMutation.isPending}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </h4>
                  <Badge className={`${getPriorityColor(task.priority)} border-0 text-xs`}>
                    {task.priority}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {task.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default EnhancedTaskList;
