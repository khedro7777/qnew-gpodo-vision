
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle, 
  PauseCircle,
  RotateCcw,
  FileText,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowType: 'create' | 'start' | 'pause' | 'resume' | 'complete';
  groupId?: string;
  workflowData?: any;
}

const GroupWorkflowModals: React.FC<WorkflowModalProps> = ({
  isOpen,
  onClose,
  workflowType,
  groupId,
  workflowData
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '60',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (workflowType) {
        case 'create':
          toast.success('Workflow created successfully!');
          break;
        case 'start':
          toast.success('Workflow started!');
          break;
        case 'pause':
          toast.info('Workflow paused.');
          break;
        case 'resume':
          toast.success('Workflow resumed.');
          break;
        case 'complete':
          toast.success('Workflow completed!');
          break;
      }
      
      onClose();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalContent = () => {
    switch (workflowType) {
      case 'create':
        return {
          title: 'Create New Workflow',
          description: 'Set up a new workflow process for your group',
          icon: <FileText className="w-5 h-5" />
        };
      case 'start':
        return {
          title: 'Start Workflow',
          description: 'Begin the workflow process for your group',
          icon: <PlayCircle className="w-5 h-5" />
        };
      case 'pause':
        return {
          title: 'Pause Workflow',
          description: 'Temporarily pause the current workflow',
          icon: <PauseCircle className="w-5 h-5" />
        };
      case 'resume':
        return {
          title: 'Resume Workflow',
          description: 'Continue the paused workflow',
          icon: <PlayCircle className="w-5 h-5" />
        };
      case 'complete':
        return {
          title: 'Complete Workflow',
          description: 'Mark the workflow as completed',
          icon: <CheckCircle2 className="w-5 h-5" />
        };
      default:
        return {
          title: 'Workflow Action',
          description: 'Perform workflow action',
          icon: <Target className="w-5 h-5" />
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {modalContent.icon}
            {modalContent.title}
          </DialogTitle>
          <DialogDescription>
            {modalContent.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {workflowType === 'create' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Workflow Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter workflow title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the workflow process"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                  <Calendar className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          {workflowType === 'pause' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Pause Workflow</p>
                  <p className="text-sm text-yellow-700">
                    This will temporarily halt the current workflow progress.
                  </p>
                </div>
              </div>
            </div>
          )}

          {workflowType === 'complete' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Complete Workflow</p>
                  <p className="text-sm text-green-700">
                    Mark this workflow as successfully completed.
                  </p>
                </div>
              </div>
              
              {workflowData && (
                <div className="space-y-2">
                  <Label>Progress Summary</Label>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Started: Today</span>
                      <span>Duration: 2h 30m</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : modalContent.title}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupWorkflowModals;
