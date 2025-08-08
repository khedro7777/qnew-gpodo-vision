import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageCircle, 
  Users, 
  Vote, 
  FileText, 
  Settings, 
  Activity, 
  BarChart3
} from 'lucide-react';
import GroupRoomTabs from './GroupRoomTabs';

interface GroupRoomInterfaceProps {
  groupId: string;
}

const GroupRoomInterface: React.FC<GroupRoomInterfaceProps> = ({ groupId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    console.log(`GroupRoomInterface loaded for group: ${groupId}`);
  }, [groupId]);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Group Room Interface
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              Group ID: {groupId}
            </Badge>
            {user ? (
              <Badge>
                Logged in as: {user.email}
              </Badge>
            ) : (
              <Badge variant="outline">
                Not Logged In
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          <GroupRoomTabs groupId={groupId} activeTab={activeTab} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupRoomInterface;
