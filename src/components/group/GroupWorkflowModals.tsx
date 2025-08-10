
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { 
  Vote, 
  MessageSquare, 
  FileText, 
  Users, 
  AlertTriangle,
  Calendar,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupWorkflowModalsProps {
  groupId: string;
  isOpen: boolean;
  modalType: 'vote' | 'proposal' | 'task' | 'arbitration' | null;
  onClose: () => void;
}

const GroupWorkflowModals = ({ groupId, isOpen, modalType, onClose }: GroupWorkflowModalsProps) => {
  const { user, profile } = useAuth();
  const workflow = useGroupWorkflow(groupId);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    respondentId: '',
    evidence: ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    
    switch (modalType) {
      case 'vote':
        success = await workflow.createVote({
          title: formData.title,
          description: formData.description,
          group_id: groupId,
          created_by: user?.id || '',
          type: 'standard',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          threshold: 50
        });
        break;
        
      case 'proposal':
        success = await workflow.submitProposal({
          title: formData.title,
          description: formData.description,
          group_id: groupId,
          created_by: user?.id || ''
        });
        break;
        
      case 'task':
        success = await workflow.createTask({
          title: formData.title,
          description: formData.description,
          assigned_to: formData.assignedTo,
          priority: formData.priority,
          due_date: formData.dueDate,
          group_id: groupId,
          created_by: user?.id || ''
        });
        break;
        
      case 'arbitration':
        success = await workflow.fileArbitrationCase({
          respondent_id: formData.respondentId,
          title: formData.title,
          description: formData.description,
          evidence: formData.evidence.filter(e => e.trim())
        });
        break;
    }
    
    if (success) {
      onClose();
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        respondentId: '',
        evidence: ['']
      });
    }
  };

  const getModalConfig = () => {
    switch (modalType) {
      case 'vote':
        return {
          title: 'Create New Vote',
          icon: <Vote className="w-5 h-5" />,
          description: `Creating vote as ${profile?.full_name || 'User'}`
        };
      case 'proposal':
        return {
          title: 'Submit Proposal',
          icon: <FileText className="w-5 h-5" />,
          description: 'Submit a new proposal for group consideration'
        };
      case 'task':
        return {
          title: 'Create Task',
          icon: <Target className="w-5 h-5" />,
          description: 'Create a new task for the group'
        };
      case 'arbitration':
        return {
          title: 'File Arbitration Case',
          icon: <AlertTriangle className="w-5 h-5" />,
          description: 'File a dispute for arbitration'
        };
      default:
        return { title: '', icon: null, description: '' };
    }
  };

  const config = getModalConfig();

  return (
    <Dialog open={isOpen && modalType !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </DialogTitle>
          {config.description && (
            <p className="text-sm text-gray-600">{config.description}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`Enter ${modalType} title...`}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Describe the ${modalType}...`}
              rows={4}
            />
          </div>

          {modalType === 'task' && (
            <>
              <div>
                <Label htmlFor="assignedTo">Assign To (User ID)</Label>
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  placeholder="Enter user ID to assign task..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'arbitration' && (
            <>
              <div>
                <Label htmlFor="respondentId">Respondent (User ID) *</Label>
                <Input
                  id="respondentId"
                  value={formData.respondentId}
                  onChange={(e) => setFormData({ ...formData, respondentId: e.target.value })}
                  placeholder="Enter the user ID you're filing against..."
                  required
                />
              </div>

              <div>
                <Label>Evidence/Supporting Documents</Label>
                {formData.evidence.map((evidence, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={evidence}
                      onChange={(e) => {
                        const newEvidence = [...formData.evidence];
                        newEvidence[index] = e.target.value;
                        setFormData({ ...formData, evidence: newEvidence });
                      }}
                      placeholder="Evidence description or URL..."
                    />
                    {index === formData.evidence.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ 
                          ...formData, 
                          evidence: [...formData.evidence, ''] 
                        })}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Important Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Filing an arbitration case will temporarily freeze the group until resolution.
                  Make sure you have sufficient evidence to support your claim.
                </p>
              </div>
            </>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Submitted by {profile?.full_name || 'Unknown User'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={workflow.loading}>
                {workflow.loading ? 'Processing...' : `Submit ${modalType || ''}`}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupWorkflowModals;
