import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Filter,
  Search,
  Edit,
  Trash2,
  Tag
} from 'lucide-react';

const EnhancedTaskList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Finalize Q3 Budget',
      description: 'Complete budget adjustments and submit for approval',
      status: 'in progress',
      priority: 'high',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-08-15',
      tags: ['finance', 'budget']
    },
    {
      id: '2',
      title: 'Prepare Marketing Report',
      description: 'Gather data and create a comprehensive marketing report',
      status: 'completed',
      priority: 'medium',
      assignedTo: 'Michael Lee',
      dueDate: '2024-08-10',
      tags: ['marketing', 'report']
    },
    {
      id: '3',
      title: 'Update Project Timeline',
      description: 'Adjust project timeline based on recent progress',
      status: 'pending',
      priority: 'low',
      assignedTo: 'Emily Davis',
      dueDate: '2024-08-20',
      tags: ['project management', 'timeline']
    }
  ]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    tags: ''
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = () => {
    setTasks([...tasks, { ...newTask, id: String(Date.now()), tags: newTask.tags.split(',') }]);
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      tags: ''
    });
    setIsAddingTask(false);
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: any) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-500" />
          Enhanced Task Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Input type="text" placeholder="Search tasks..." className="max-w-xs" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setIsAddingTask(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
          <TabsContent value="all">
            <div className="grid gap-4">
              {tasks.map(task => (
                <Card key={task.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {task.status === 'pending' && <Clock className="w-4 h-4 text-gray-500" />}
                        {task.status === 'in progress' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {task.tags && task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid gap-4">
              {tasks.filter(task => task.status === 'pending').map(task => (
                <Card key={task.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {task.tags && task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="in progress">
            <div className="grid gap-4">
              {tasks.filter(task => task.status === 'in progress').map(task => (
                <Card key={task.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {task.tags && task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid gap-4">
              {tasks.filter(task => task.status === 'completed').map(task => (
                <Card key={task.id}>
                  <CardContent className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        {task.tags && task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {isAddingTask && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input type="text" id="title" name="title" value={newTask.title} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" value={newTask.dueDate} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={newTask.description} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" value={newTask.status} onValueChange={(value) => handleInputChange({ target: { name: 'status', value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" value={newTask.priority} onValueChange={(value) => handleInputChange({ target: { name: 'priority', value } } as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input type="text" id="assignedTo" name="assignedTo" value={newTask.assignedTo} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input type="text" id="tags" name="tags" value={newTask.tags} onChange={handleInputChange} placeholder="e.g., finance, budget" />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {editingTask && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input type="text" id="title" name="title" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" value={editingTask.dueDate} onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={editingTask.status} onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input type="text" id="assignedTo" name="assignedTo" value={editingTask.assignedTo} onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input type="text" id="tags" name="tags" value={editingTask.tags} onChange={(e) => setEditingTask({ ...editingTask, tags: e.target.value })} placeholder="e.g., finance, budget" />
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button onClick={() => handleUpdateTask(editingTask)}>Update Task</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedTaskList;
