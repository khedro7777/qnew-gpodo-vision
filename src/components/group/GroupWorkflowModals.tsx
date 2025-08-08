import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { Vote, FileText, UserPlus, AlertTriangle, Loader2 } from 'lucide-react';

interface GroupType {
  id: string;
  name: string;
}

interface VoteType {
  title: string;
  description: string;
}

interface ProposalType {
  title: string;
  description: string;
  document_url: string;
}

interface TaskType {
  title: string;
  description: string;
  assigned_to: string;
  due_date: string;
  status: 'pending' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface ArbitrationCaseType {
  respondent_id: string;
  title: string;
  description: string;
  evidence: string[];
}

export const CreateVoteModal = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { createVote, loading } = useGroupWorkflow(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [voteData, setVoteData] = useState<VoteType>({
    title: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVoteData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voteData.title || !voteData.description) {
      alert('Please fill in all fields');
      return;
    }

    const success = await createVote(voteData);
    if (success) {
      setIsOpen(false);
      setVoteData({ title: '', description: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Vote className="w-4 h-4 mr-2" />
          Create Vote
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Vote</DialogTitle>
          <DialogDescription>
            Create a new vote for the group to decide on important matters.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={voteData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={voteData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Vote'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const SubmitProposalModal = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { submitProposal, loading } = useGroupWorkflow(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalType>({
    title: '',
    description: '',
    document_url: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProposalData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalData.title || !proposalData.description) {
      alert('Please fill in all fields');
      return;
    }

    const success = await submitProposal(proposalData);
    if (success) {
      setIsOpen(false);
      setProposalData({ title: '', description: '', document_url: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Submit Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit a New Proposal</DialogTitle>
          <DialogDescription>
            Submit a new proposal for the group to review and vote on.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={proposalData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={proposalData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document_url" className="text-right">
              Document URL
            </Label>
            <Input
              type="text"
              id="document_url"
              name="document_url"
              value={proposalData.document_url}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Proposal'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const CreateTaskModal = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { createTask, loading } = useGroupWorkflow(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState<TaskType>({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    status: 'pending',
    priority: 'medium'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description || !taskData.assigned_to || !taskData.due_date) {
      alert('Please fill in all fields');
      return;
    }

    const success = await createTask(taskData);
    if (success) {
      setIsOpen(false);
      setTaskData({ title: '', description: '', assigned_to: '', due_date: '', status: 'pending', priority: 'medium' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
          <DialogDescription>
            Assign a new task to a group member.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigned_to" className="text-right">
              Assigned To
            </Label>
            <Input
              type="text"
              id="assigned_to"
              name="assigned_to"
              value={taskData.assigned_to}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due_date" className="text-right">
              Due Date
            </Label>
            <Input
              type="date"
              id="due_date"
              name="due_date"
              value={taskData.due_date}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value as any }))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select onValueChange={(value) => setTaskData(prev => ({ ...prev, priority: value as any }))}>
              <SelectTrigger className="col-span-3">
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
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Task'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const FileArbitrationCaseModal = ({ groupId, group }: { groupId: string; group: GroupType }) => {
  const { fileArbitrationCase, loading } = useGroupWorkflow(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [caseData, setCaseData] = useState<ArbitrationCaseType>({
    respondent_id: '',
    title: '',
    description: '',
    evidence: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCaseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseData.respondent_id || !caseData.title || !caseData.description) {
      alert('Please fill in all fields');
      return;
    }

    const success = await fileArbitrationCase(caseData);
    if (success) {
      setIsOpen(false);
      setCaseData({ respondent_id: '', title: '', description: '', evidence: [] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <AlertTriangle className="w-4 h-4 mr-2" />
          File Arbitration Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>File an Arbitration Case</DialogTitle>
          <DialogDescription>
            File an arbitration case against a group member. This will temporarily freeze the group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="respondent_id" className="text-right">
              Respondent ID
            </Label>
            <Input
              type="text"
              id="respondent_id"
              name="respondent_id"
              value={caseData.respondent_id}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={caseData.title}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={caseData.description}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'File Arbitration Case'
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
