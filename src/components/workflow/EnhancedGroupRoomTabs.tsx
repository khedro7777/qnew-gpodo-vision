
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Scale, 
  Package,
  Send,
  Vote,
  Settings
} from 'lucide-react';
import GroupMembersTab from './GroupMembersTab';
import GroupContractsTab from './GroupContractsTab';
import GroupOffersTab from './GroupOffersTab';
import GroupOutbox from './GroupOutbox';
import EnhancedVotingSystem from '../voting/EnhancedVotingSystem';
import EnhancedDiscussionSystem from '../discussion/EnhancedDiscussionSystem';
import EnhancedArbitrationSystem from '../arbitration/EnhancedArbitrationSystem';
import { useTranslation } from '@/hooks/useTranslation';

interface EnhancedGroupRoomTabsProps {
  groupId: string;
  group: any;
  userRole: string;
  isManager: boolean;
}

const EnhancedGroupRoomTabs = ({ groupId, group, userRole, isManager }: EnhancedGroupRoomTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="discussion" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="discussion" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          {t('Discussion')}
        </TabsTrigger>
        
        <TabsTrigger value="voting" className="flex items-center gap-2">
          <Vote className="w-4 h-4" />
          {t('Governance')}
        </TabsTrigger>
        
        <TabsTrigger value="members" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('Members')}
        </TabsTrigger>
        
        <TabsTrigger value="offers" className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          {t('Offers')}
        </TabsTrigger>
        
        <TabsTrigger value="contracts" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t('Contracts')}
        </TabsTrigger>
        
        <TabsTrigger value="outbox" className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          {t('Outbox')}
        </TabsTrigger>
        
        <TabsTrigger value="arbitration" className="flex items-center gap-2">
          <Scale className="w-4 h-4" />
          {t('Disputes')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="discussion" className="mt-6">
        <EnhancedDiscussionSystem 
          groupId={groupId} 
          userRole={userRole} 
          isManager={isManager}
        />
      </TabsContent>

      <TabsContent value="voting" className="mt-6">
        <EnhancedVotingSystem 
          groupId={groupId} 
          userRole={userRole} 
          isManager={isManager}
        />
      </TabsContent>

      <TabsContent value="members" className="mt-6">
        <GroupMembersTab groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="offers" className="mt-6">
        <GroupOffersTab 
          groupId={groupId} 
          userRole={userRole} 
          isManager={isManager}
        />
      </TabsContent>

      <TabsContent value="contracts" className="mt-6">
        <GroupContractsTab groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="outbox" className="mt-6">
        <GroupOutbox groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="arbitration" className="mt-6">
        <EnhancedArbitrationSystem groupId={groupId} />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedGroupRoomTabs;
