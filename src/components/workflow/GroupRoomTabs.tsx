
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Crown, 
  Vote, 
  FileText, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Settings,
  Shield
} from 'lucide-react';
import GroupOverview from './GroupOverview';
import GroupMembersTab from './GroupMembersTab';
import GroupManagersTab from './GroupManagersTab';
import GroupDecisionsTab from './GroupDecisionsTab';
import GroupVotingTab from './GroupVotingTab';
import GroupOffersTab from './GroupOffersTab';
import GroupContractsTab from './GroupContractsTab';
import GroupInbox from './GroupInbox';
import GroupOutbox from './GroupOutbox';
import GroupExternalTab from './GroupExternalTab';
import MCPAgentTab from '@/components/dashboard/MCPAgentTab';
import { useAuth } from '@/contexts/AuthContext';

interface GroupRoomTabsProps {
  groupId: string;
}

const GroupRoomTabs = ({ groupId }: GroupRoomTabsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // For testing purposes, assume current user can be MCP agent
  const isMCPAgent = true; // In production, this would check actual MCP agent status

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'managers', label: 'Managers', icon: Crown },
    { id: 'decisions', label: 'Decisions', icon: Vote },
    { id: 'voting', label: 'Voting', icon: UserCheck },
    { id: 'offers', label: 'Offers', icon: FileText },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare },
    { id: 'outbox', label: 'Outbox', icon: Send },
    { id: 'external', label: 'External', icon: Users },
    ...(isMCPAgent ? [{ id: 'mcp', label: 'MCP Agent', icon: Shield }] : [])
  ];

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-xs"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="overview">
          <GroupOverview groupId={groupId} />
        </TabsContent>

        <TabsContent value="members">
          <GroupMembersTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="managers">
          <GroupManagersTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="decisions">
          <GroupDecisionsTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="voting">
          <GroupVotingTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="offers">
          <GroupOffersTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="contracts">
          <GroupContractsTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="inbox">
          <GroupInbox groupId={groupId} />
        </TabsContent>

        <TabsContent value="outbox">
          <GroupOutbox groupId={groupId} />
        </TabsContent>

        <TabsContent value="external">
          <GroupExternalTab groupId={groupId} />
        </TabsContent>

        {isMCPAgent && (
          <TabsContent value="mcp">
            <MCPAgentTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default GroupRoomTabs;
