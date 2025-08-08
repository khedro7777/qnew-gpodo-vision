import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Users, MessageSquare, Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupRoomTabs from './GroupRoomTabs';

interface GroupRoomInterfaceProps {
  groupId: string;
}

const GroupRoomInterface: React.FC<GroupRoomInterfaceProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    console.log(`Joined group room with ID: ${groupId}`);
  }, [groupId]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Top Navigation */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/group/${groupId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Group
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">
              Group Room <Badge variant="secondary">{groupId}</Badge>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Members
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleSettings}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <GroupRoomTabs groupId={groupId} />

      {/* Settings Sidebar (Example) */}
      {isSettingsOpen && (
        <Card className="mt-4 p-4">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          {/* Add settings content here */}
          <p>User ID: {user?.id}</p>
          <p>Email: {user?.email}</p>
        </Card>
      )}
    </div>
  );
};

export default GroupRoomInterface;
