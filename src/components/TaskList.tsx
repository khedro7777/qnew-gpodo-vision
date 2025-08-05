
import React, { useState } from 'react';
import { Plus, Check, Trash2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Review project proposals", completed: false, createdAt: new Date() },
    { id: 2, text: "Complete morning workout", completed: true, createdAt: new Date() },
    { id: 3, text: "Prepare for team meeting", completed: false, createdAt: new Date() },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <Card className="p-6 bg-white shadow-lg border-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-productivity-green rounded-full"></div>
            {completedCount} of {totalCount} completed
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 border-gray-200 focus:border-productivity-blue focus:ring-productivity-blue/20"
          />
          <Button
            onClick={addTask}
            className="bg-productivity-blue hover:bg-productivity-blue/90 text-white px-4"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 animate-fade-in ${
                  task.completed
                    ? 'bg-productivity-green/5 border-productivity-green/20'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Button
                  onClick={() => toggleTask(task.id)}
                  variant="ghost"
                  size="sm"
                  className={`w-6 h-6 p-0 rounded-full ${
                    task.completed
                      ? 'bg-productivity-green text-white hover:bg-productivity-green/90'
                      : 'border-2 border-gray-300 hover:border-productivity-green bg-transparent'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </Button>
                
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-900'
                  }`}
                >
                  {task.text}
                </span>
                
                <Button
                  onClick={() => deleteTask(task.id)}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))
          )}
        </div>

        {completedCount > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-productivity-green">
              <Check className="w-4 h-4" />
              <span>Great job! You've completed {completedCount} task{completedCount !== 1 ? 's' : ''} today.</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskList;
