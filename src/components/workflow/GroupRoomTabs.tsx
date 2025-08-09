
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
import { useTranslation } from '@/hooks/useTranslation';

interface GroupRoomTabsProps {
  groupId: string;
  group: any;
  userRole: string;
  isManager: boolean;
}

const GroupRoomTabs = ({ groupId, group, userRole, isManager }: GroupRoomTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
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
        
        <TabsTrigger value="voting" className="flex items-center gap-2">
          <Vote className="w-4 h-4" />
          {t('Voting')}
        </TabsTrigger>
        
        <TabsTrigger value="outbox" className="flex items-center gap-2">
          <Send className="w-4 h-4" />
          {t('Outbox')}
        </TabsTrigger>
        
        <TabsTrigger value="arbitration" className="flex items-center gap-2">
          <Scale className="w-4 h-4" />
          {t('Arbitration')}
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="voting" className="mt-6">
        <div className="text-center py-12">
          <Vote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('Voting Section')}</h3>
          <p className="text-gray-500">{t('Manage voting on decisions and proposals')}</p>
        </div>
      </TabsContent>

      <TabsContent value="outbox" className="mt-6">
        <GroupOutbox groupId={groupId} userRole={userRole} />
      </TabsContent>

      <TabsContent value="arbitration" className="mt-6">
        <div className="text-center py-12">
          <Scale className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('Arbitration Section')}</h3>
          <p className="text-gray-500">{t('Manage disputes and arbitration cases')}</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default GroupRoomTabs;
