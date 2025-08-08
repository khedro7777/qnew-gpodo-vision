import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { 
  Vote, 
  FileText, 
  Users, 
  Scale, 
  Upload, 
  X, 
  Plus, 
  AlertTriangle, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateVoteModalProps {
  groupId: string;
  onVoteCreated: () => void;
}

export const CreateVoteModal: React.FC<CreateVoteModalProps> = ({ groupId, onVoteCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createVote, loading } = useGroupWorkflow(groupId);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await createVote({ title, description });
    if (success) {
      toast.success('Vote created successfully!');
      onVoteCreated();
      setOpen(false);
      setTitle('');
      setDescription('');
    } else {
      toast.error('Failed to create vote.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Vote className="w-4 h-4" />
          Create Vote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Vote</DialogTitle>
          <DialogDescription>
            Gather opinions and make decisions within your group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vote-title">Title</Label>
            <Input
              type="text"
              id="vote-title"
              placeholder="Enter vote title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vote-description">Description</Label>
            <Textarea
              id="vote-description"
              placeholder="Describe the vote"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Create Vote'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface SubmitProposalModalProps {
  groupId: string;
  onProposalSubmitted: () => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({ groupId, onProposalSubmitted }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const { submitProposal, loading } = useGroupWorkflow(groupId);

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await submitProposal({ title, description, document_url: documentUrl });
    if (success) {
      toast.success('Proposal submitted successfully!');
      onProposalSubmitted();
      setOpen(false);
      setTitle('');
      setDescription('');
      setDocumentUrl('');
    } else {
      toast.error('Failed to submit proposal.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <FileText className="w-4 h-4" />
          Submit Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a New Proposal</DialogTitle>
          <DialogDescription>
            Share your ideas and suggestions with the group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="proposal-title">Title</Label>
            <Input
              type="text"
              id="proposal-title"
              placeholder="Enter proposal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proposal-description">Description</Label>
            <Textarea
              id="proposal-description"
              placeholder="Describe the proposal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proposal-document">Document URL (Optional)</Label>
            <Input
              type="url"
              id="proposal-document"
              placeholder="Enter document URL"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Submit Proposal'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface CreateTaskModalProps {
  groupId: string;
  onTaskCreated: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ groupId, onTaskCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const { createTask, loading } = useGroupWorkflow(groupId);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!title || !description || !assignedTo || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const success = await createTask({
      title,
      description,
      assigned_to: assignedTo,
      due_date: dueDate,
      status,
      priority
    });

    if (success) {
      toast.success('Task created successfully!');
      onTaskCreated();
      setOpen(false);
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setDueDate('');
      setStatus('pending');
      setPriority('medium');
    } else {
      toast.error('Failed to create task.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>
            Assign tasks to group members to manage projects effectively.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              type="text"
              id="task-title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Describe the task"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-assigned-to">Assign To</Label>
            <Input
              type="text"
              id="task-assigned-to"
              placeholder="Enter user ID to assign"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-due-date">Due Date</Label>
            <Input
              type="date"
              id="task-due-date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Create Task'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface FileArbitrationCaseModalProps {
  groupId: string;
  onCaseFiled: () => void;
}

export const FileArbitrationCaseModal: React.FC<FileArbitrationCaseModalProps> = ({ groupId, onCaseFiled }) => {
  const [open, setOpen] = useState(false);
  const [respondentId, setRespondentId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const { fileArbitrationCase, loading } = useGroupWorkflow(groupId);

  const handleSubmit = async () => {
    if (!respondentId || !title || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const caseData = {
      respondent_id: respondentId,
      title,
      description,
      evidence
    };

    const success = await fileArbitrationCase(caseData);
    if (success) {
      toast.success('Arbitration case filed successfully!');
      onCaseFiled();
      setOpen(false);
      setRespondentId('');
      setTitle('');
      setDescription('');
      setEvidence([]);
    } else {
      toast.error('Failed to file arbitration case.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full justify-start gap-2">
          <AlertTriangle className="w-4 h-4" />
          File Arbitration Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>File an Arbitration Case</DialogTitle>
          <DialogDescription>
            Report a dispute and request arbitration. This will temporarily freeze the group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="respondent-id">Respondent User ID</Label>
            <Input
              type="text"
              id="respondent-id"
              placeholder="Enter the user ID of the respondent"
              value={respondentId}
              onChange={(e) => setRespondentId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="case-title">Case Title</Label>
            <Input
              type="text"
              id="case-title"
              placeholder="Enter the title of the case"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="case-description">Case Description</Label>
            <Textarea
              id="case-description"
              placeholder="Describe the details of the case"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {/* Implement evidence upload/selection as needed */}
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'File Arbitration Case'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
