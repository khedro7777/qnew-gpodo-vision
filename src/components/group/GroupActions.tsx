import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  Vote, 
  Settings, 
  UserPlus,
  Shield,
  Bell,
  Star,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GroupActionsProps {
  groupId: string;
  isLoggedIn: boolean;
}

const GroupActions: React.FC<GroupActionsProps> = ({ groupId, isLoggedIn }) => {
  const { user } = useAuth();
  const { joinGroup, loading: joinLoading } = useGroupWorkflow(groupId);

  const { data: group, isLoading } = useQuery({
    queryKey: ['group-actions', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const handleJoinGroup = async () => {
    if (group) {
      await joinGroup(group);
    }
  };

  if (isLoading) {
    return <CardContent>Loading...</CardContent>;
  }

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Group Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoggedIn ? (
          <>
            <Button className="w-full justify-start gap-3" onClick={handleJoinGroup} disabled={joinLoading}>
              <UserPlus className="w-4 h-4" />
              {group?.is_public ? 'Join Group' : 'Request to Join'}
            </Button>
            <Link to={`/group/${groupId}/room`}>
              <Button variant="outline" className="w-full justify-start gap-3">
                <MessageCircle className="w-4 h-4" />
                Enter Group Room
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start gap-3">
              <FileText className="w-4 h-4" />
              View Group Documents
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Vote className="w-4 h-4" />
              Participate in Elections
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Share2 className="w-4 h-4" />
              Invite Members
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth">
              <Button className="w-full justify-start gap-3">
                <UserPlus className="w-4 h-4" />
                Join to Participate
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupActions;
