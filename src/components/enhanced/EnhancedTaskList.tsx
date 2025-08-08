import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, Clock, Flag, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const EnhancedTaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Draft initial project proposal', completed: false, priority: 'high', dueDate: '2024-08-15' },
    { id: '2', title: 'Schedule team kickoff meeting', completed: true, priority: 'medium', dueDate: '2024-08-10' },
    { id: '3', title: 'Finalize budget allocation', completed: false, priority: 'high', dueDate: '2024-08-20' },
    { id: '4', title: 'Design UI/UX wireframes', completed: false, priority: 'medium', dueDate: '2024-08-22' },
    { id: '5', title: 'Develop backend API endpoints', completed: true, priority: 'high', dueDate: '2024-08-25' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('EnhancedTaskList - User:', user);
  }, [user]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem = {
        id: String(Date.now()),
        title: newTask,
        completed: false,
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Enhanced Task Management</span>
          <Badge variant="secondary">{tasks.length} Tasks</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="mr-2"
          />
          <Button onClick={addTask}><Plus className="w-4 h-4 mr-2" /> Add Task</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'completed' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('completed')}>Completed</Button>
          <Button variant={filter === 'incomplete' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('incomplete')}>Incomplete</Button>
        </div>

        <Separator />

        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleComplete(task.id)}
                />
                <label htmlFor={`task-${task.id}`} className="ml-2 font-medium">
                  {task.title}
                </label>
                <Badge variant="outline" className="ml-2">{task.priority}</Badge>
                <Calendar className="w-4 h-4 ml-2" />
                <span className="text-xs text-gray-500">{task.dueDate}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500">No tasks found.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskList;
