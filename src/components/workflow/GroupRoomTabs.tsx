
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp,
  Users, 
  Vote, 
  FileText, 
  CheckSquare,
  MessageCircle,
  Settings,
  AlertTriangle,
  Crown,
  ExternalLink,
  Inbox,
  Send
} from 'lucide-react';
import GroupOverview from './GroupOverview';
import GroupMembersTab from './GroupMembersTab';
import GroupVotingTab from './GroupVotingTab';
import GroupDecisionsTab from './GroupDecisionsTab';
import GroupOffersTab from './GroupOffersTab';
import GroupContractsTab from './GroupContractsTab';
import GroupComplaints from './GroupComplaints';
import GroupManagersTab from './GroupManagersTab';
import GroupExternalTab from './GroupExternalTab';
import GroupInbox from './GroupInbox';
import GroupOutbox from './GroupOutbox';

interface GroupRoomTabsProps {
  group: any;
  userRole: string;
  isManager: boolean;
  groupId: string;
}

const GroupRoomTabs = ({ group, userRole, isManager, groupId }: GroupRoomTabsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: TrendingUp, show: true },
    { id: 'inbox', label: 'صندوق الوارد', icon: Inbox, show: isManager || userRole === 'founder' },
    { id: 'outbox', label: 'صندوق الصادر', icon: Send, show: isManager || userRole === 'founder' },
    { id: 'members', label: 'الأعضاء', icon: Users, show: true },
    { id: 'voting', label: 'القرارات والتصويت', icon: Vote, show: true },
    { id: 'decisions', label: 'الصادر/الوارد', icon: FileText, show: true },
    { id: 'offers', label: 'العروض', icon: CheckSquare, show: userRole !== 'external' },
    { id: 'contracts', label: 'العقود', icon: MessageCircle, show: userRole !== 'external' },
    { id: 'complaints', label: 'الشكاوى', icon: AlertTriangle, show: true },
    { id: 'managers', label: 'المديرين', icon: Crown, show: isManager },
    { id: 'external', label: 'الأطراف الخارجية', icon: ExternalLink, show: userRole !== 'external' }
  ];

  const visibleTabs = tabs.filter(tab => tab.show);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
      <TabsList className={`grid gap-2 h-auto p-2 grid-cols-${Math.min(visibleTabs.length, 4)}`}>
        {visibleTabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id} 
            className="flex flex-col gap-1 py-3 text-xs"
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.id === 'managers' && isManager && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">منتخب</Badge>
            )}
            {tab.id === 'inbox' && (
              <Badge className="bg-red-100 text-red-800 text-xs">1</Badge>
            )}
            {tab.id === 'outbox' && (
              <Badge className="bg-green-100 text-green-800 text-xs">3</Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview">
        <GroupOverview group={group} userRole={userRole} />
      </TabsContent>

      {(isManager || userRole === 'founder') && (
        <TabsContent value="inbox">
          <GroupInbox groupId={groupId} userRole={userRole} />
        </TabsContent>
      )}

      {(isManager || userRole === 'founder') && (
        <TabsContent value="outbox">
          <GroupOutbox groupId={groupId} userRole={userRole} />
        </TabsContent>
      )}

      <TabsContent value="members">
        <GroupMembersTab groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="voting">
        <GroupVotingTab groupId={groupId} userRole={userRole} isManager={isManager} />
      </TabsContent>

      <TabsContent value="decisions">
        <GroupDecisionsTab groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="offers">
        <GroupOffersTab groupId={groupId} userRole={userRole} isManager={isManager} />
      </TabsContent>

      <TabsContent value="contracts">
        <GroupContractsTab groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="complaints">
        <GroupComplaints groupId={groupId} userRole={userRole} />
      </TabsContent>

      {isManager && (
        <TabsContent value="managers">
          <GroupManagersTab groupId={groupId} />
        </TabsContent>
      )}

      {userRole !== 'external' && (
        <TabsContent value="external">
          <GroupExternalTab groupId={groupId} userRole={userRole} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default GroupRoomTabs;
