
import React, { useState } from 'react';
import { Plus, Check, Clock, Flag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/useProductivityData';
import { format } from 'date-fns';

const EnhancedTaskList = () => {
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const { data: tasks = [], isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const addTask = () => {
    if (newTask.trim()) {
      createTask.mutate({
        title: newTask.trim(),
        priority: newTaskPriority,
      });
      setNewTask('');
      setNewTaskPriority('medium');
    }
  };

  const toggleTask = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateTask.mutate({ id, status: newStatus });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePriorityChange = (value: string) => {
    setNewTaskPriority(value as 'low' | 'medium' | 'high' | 'urgent');
  };

  if (isLoading) {
    return <Card className="p-6"><div className="animate-pulse">Loading tasks...</div></Card>;
  }

  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const totalCount = tasks.length;

  return (
    <Card className="p-6 bg-white shadow-lg border-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-productivity-green rounded-full"></div>
            {completedCount} of {totalCount} completed
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Select value={newTaskPriority} onValueChange={handlePriorityChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={addTask}
              disabled={createTask.isPending}
              className="bg-productivity-blue hover:bg-productivity-blue/90 text-white px-4"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 ${
                  task.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Button
                  onClick={() => toggleTask(task.id, task.status)}
                  variant="ghost"
                  size="sm"
                  disabled={updateTask.isPending}
                  className={`w-6 h-6 p-0 rounded-full mt-1 ${
                    task.status === 'completed'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'border-2 border-gray-300 hover:border-green-500 bg-transparent'
                  }`}
                >
                  {task.status === 'completed' && <Check className="w-3 h-3" />}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        task.status === 'completed'
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className={`text-xs mt-1 ${
                      task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {task.assigned_profile && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.assigned_profile.full_name}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due {format(new Date(task.due_date), 'MMM d')}
                      </span>
                    )}
                    <span>Created {format(new Date(task.created_at), 'MMM d')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {completedCount > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-productivity-green">
              <Check className="w-4 h-4" />
              <span>Great job! You've completed {completedCount} task{completedCount !== 1 ? 's' : ''}.</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedTaskList;
