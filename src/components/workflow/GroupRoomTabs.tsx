
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
  Shield,
  Gavel
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
import FinalDecisionsTab from './FinalDecisionsTab';
import MCPAgentTab from '@/components/dashboard/MCPAgentTab';
import { useAuth } from '@/contexts/AuthContext';

interface GroupRoomTabsProps {
  groupId: string;
  group?: any;
  userRole?: string;
  isManager?: boolean;
}

const GroupRoomTabs = ({ groupId, group, userRole = 'member', isManager = false }: GroupRoomTabsProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // For testing purposes, assume current user can be MCP agent
  const isMCPAgent = true; // In production, this would check actual MCP agent status

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'managers', label: 'Managers', icon: Crown },
    { id: 'proposals', label: 'Proposals', icon: Vote }, // Changed from 'decisions' to 'proposals'
    { id: 'voting', label: 'Voting', icon: UserCheck },
    { id: 'final-decisions', label: 'Final Decisions', icon: Gavel },
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
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 mb-6">
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
          <GroupOverview group={group} userRole={userRole} />
        </TabsContent>

        <TabsContent value="members">
          <GroupMembersTab groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="managers">
          <GroupManagersTab groupId={groupId} />
        </TabsContent>

        <TabsContent value="proposals"> {/* Changed from 'decisions' to 'proposals' */}
          <GroupDecisionsTab groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="voting">
          <GroupVotingTab groupId={groupId} userRole={userRole} isManager={isManager} />
        </TabsContent>

        <TabsContent value="final-decisions">
          <FinalDecisionsTab groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="offers">
          <GroupOffersTab groupId={groupId} userRole={userRole} isManager={isManager} />
        </TabsContent>

        <TabsContent value="contracts">
          <GroupContractsTab groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="inbox">
          <GroupInbox groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="outbox">
          <GroupOutbox groupId={groupId} userRole={userRole} />
        </TabsContent>

        <TabsContent value="external">
          <GroupExternalTab groupId={groupId} userRole={userRole} />
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
