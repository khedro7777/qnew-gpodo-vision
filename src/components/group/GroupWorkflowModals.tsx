import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Vote, 
  Gavel, 
  UserPlus, 
  Send, 
  Upload,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  votes: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in progress' | 'completed';
  dueDate: Date;
  assignedTo: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  attendees: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface GroupWorkflowModalsProps {
  groupId: string;
}

const GroupWorkflowModals: React.FC<GroupWorkflowModalsProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalDescription, setNewProposalDescription] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingDescription, setNewMeetingDescription] = useState('');
  const [newMeetingDateTime, setNewMeetingDateTime] = useState('');
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleCreateProposal = async () => {
    if (!newProposalTitle || !newProposalDescription) {
      toast.error('Title and description are required');
      return;
    }

    try {
      // Simulate API call
      toast.success('Proposal created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create proposal');
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle || !newTaskDescription) {
      toast.error('Title and description are required');
      return;
    }

    try {
      // Simulate API call
      toast.success('Task created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleAddAttendee = () => {
    if (newAttendeeEmail && !attendees.includes(newAttendeeEmail)) {
      setAttendees([...attendees, newAttendeeEmail]);
      setNewAttendeeEmail('');
    }
  };

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter(attendee => attendee !== email));
  };

  const handleCreateMeeting = async () => {
    if (!newMeetingTitle || !newMeetingDescription || !newMeetingDateTime) {
      toast.error('Title, description, and date/time are required');
      return;
    }

    try {
      // Simulate API call
      toast.success('Meeting created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create meeting');
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      // Simulate API call
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    }
  };

  return (
    <>
      {/* Create Proposal Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Vote className="w-4 h-4" />
            Create Proposal
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Proposal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newProposalTitle}
                onChange={(e) => setNewProposalTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProposalDescription}
                onChange={(e) => setNewProposalDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateProposal}>Create Proposal</Button>
        </DialogContent>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <FileText className="w-4 h-4" />
            Create Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateTask}>Create Task</Button>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newMeetingTitle}
                onChange={(e) => setNewMeetingTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newMeetingDescription}
                onChange={(e) => setNewMeetingDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateTime" className="text-right">
                Date/Time
              </Label>
              <Input
                type="datetime-local"
                id="dateTime"
                value={newMeetingDateTime}
                onChange={(e) => setNewMeetingDateTime(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendeeEmail" className="text-right">
                Add Attendee
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  type="email"
                  id="attendeeEmail"
                  value={newAttendeeEmail}
                  onChange={(e) => setNewAttendeeEmail(e.target.value)}
                  placeholder="Email address"
                />
                <Button type="button" size="sm" onClick={handleAddAttendee}>
                  Add
                </Button>
              </div>
            </div>
            {attendees.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Attendees</Label>
                <div className="col-span-3 space-y-2">
                  {attendees.map((email) => (
                    <div key={email} className="flex items-center justify-between rounded-md border p-2">
                      <span>{email}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveAttendee(email)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Select File
              </Label>
              <Input
                type="file"
                id="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleFileUpload}>Upload File</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupWorkflowModals;
