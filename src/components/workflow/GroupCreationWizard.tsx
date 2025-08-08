import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GroupCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated?: (groupId: string) => void;
}

const GroupCreationWizard: React.FC<GroupCreationWizardProps> = ({ open, onClose, onGroupCreated }) => {
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    if (!user) {
      toast.error('You must be logged in to create a group.');
      return;
    }

    if (!groupName || !groupDescription) {
      toast.error('Please provide a group name and description.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            name: groupName,
            description: groupDescription,
            owner_id: user.id,
          },
        ])
        .select()

      if (error) {
        toast.error(`Error creating group: ${error.message}`);
      } else if (data && data.length > 0) {
        const newGroupId = data[0].id;
        toast.success('Group created successfully!');
        onClose();
        setGroupName('');
        setGroupDescription('');
        if (onGroupCreated) {
          onGroupCreated(newGroupId);
        }
      }
    } catch (error: any) {
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Group Name
            </Label>
            <Input
              id="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleCreateGroup} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default GroupCreationWizard;
