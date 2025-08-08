import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Plus, 
  Settings, 
  Users, 
  Clock, 
  Trophy, 
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Calendar,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const MCPTestSetup = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Mock data for MCP tests
    const mockTests = [
      {
        id: '1',
        title: 'AI Fundamentals',
        description: 'Assess basic knowledge of AI concepts and applications',
        status: 'active',
        participantCount: 45,
        duration: 60,
        questionCount: 20
      },
      {
        id: '2',
        title: 'Data Science Essentials',
        description: 'Evaluate understanding of data analysis and machine learning techniques',
        status: 'draft',
        participantCount: 12,
        duration: 45,
        questionCount: 15
      }
    ];
    setTests(mockTests);
  }, []);

  const handleTestSelect = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    setSelectedTest(test);
  };

  const handleCreateTest = () => {
    setIsCreateModalOpen(true);
    setIsEditMode(false);
  };

  const handleEditTest = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    setSelectedTest(test);
    setIsCreateModalOpen(true);
    setIsEditMode(true);
  };

  const handleDeleteTest = (testId: string) => {
    // Implement delete logic here
    toast.success(`Test ${testId} deleted successfully!`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-productivity-blue" />
            MCP Test Management
          </h2>
          <p className="text-gray-600 mt-1">Create and manage MCP skill assessment tests</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-productivity-blue hover:bg-productivity-blue/90">
          <Plus className="w-4 h-4 mr-2" />
          Create New Test
        </Button>
      </div>

      {/* Test List */}
      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{test.title}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={test.status === 'active' ? 'default' : 'secondary'}>
                  {test.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {test.participantCount || 0} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration || 30} minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {test.questionCount || 0} questions
                  </span>
                </div>
                <Button variant="link" className="p-0 h-auto text-productivity-blue">
                  View Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Test Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit MCP Test' : 'Create New MCP Test'}
            </DialogTitle>
            <DialogDescription>
              Set up skill assessment parameters and questions for MCP evaluation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input 
                  id="title"
                  placeholder="Enter test title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input 
                  id="duration"
                  type="number"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe the test objectives and requirements"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
                {isEditMode ? 'Update Test' : 'Create Test'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MCPTestSetup;
