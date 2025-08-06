
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Globe, 
  Lock, 
  Plus,
  Search,
  Filter,
  Database,
  Shield
} from 'lucide-react';
import IPFSFileManager from '@/components/ipfs/IPFSFileManager';
import IPFSAnalytics from '@/components/ipfs/IPFSAnalytics';
import { useIPFS } from '@/hooks/useIPFS';

const GroupRoomsTab = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchTerm, setSearchTerm] = useState('');
  const { getStorageStats } = useIPFS();
  
  // Mock data for demo
  const mockGroups = [
    {
      id: '1',
      name: 'Tech Innovators Hub',
      description: 'Connecting technology professionals and startups',
      members: 42,
      maxMembers: 100,
      status: 'active',
      isPublic: true,
      entryFee: 0,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Green Energy Coalition',
      description: 'Sustainable energy projects and partnerships',
      members: 28,
      maxMembers: 50,
      status: 'active',
      isPublic: false,
      entryFee: 100,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Digital Marketing Collective',
      description: 'Marketing professionals and agencies collaboration',
      members: 67,
      maxMembers: 150,
      status: 'active',
      isPublic: true,
      entryFee: 50,
      createdAt: new Date('2024-01-05'),
    }
  ];

  const { data: storageStats } = getStorageStats('default');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Rooms & IPFS Vault</h2>
          <p className="text-gray-600">Manage group collaborations and decentralized storage</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Group Rooms
          </TabsTrigger>
          <TabsTrigger value="ipfs" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            IPFS Vault
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Group Rooms</CardTitle>
              <CardDescription>Browse and join collaborative group rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="grid gap-4">
                {mockGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            <Badge variant={group.isPublic ? 'default' : 'secondary'}>
                              {group.isPublic ? (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  Public
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Private
                                </>
                              )}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              {group.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{group.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{group.members}/{group.maxMembers} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Created {group.createdAt.toLocaleDateString()}</span>
                            </div>
                            {group.entryFee > 0 && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{group.entryFee} points</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Join Group
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ipfs" className="space-y-6">
          <IPFSFileManager groupId="default" />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {storageStats && (
            <IPFSAnalytics stats={storageStats} groupId="default" />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Group Activity Analytics</CardTitle>
              <CardDescription>Insights into group participation and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Active Groups</h3>
                  <p className="text-2xl font-bold text-blue-600">{mockGroups.length}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Total Members</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {mockGroups.reduce((sum, group) => sum + group.members, 0)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Files Stored</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {storageStats?.totalFiles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IPFS Configuration</CardTitle>
              <CardDescription>Manage your IPFS settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Group ID
                  </label>
                  <Input value="default" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-pin Files
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">DID Authentication</h4>
                <p className="text-sm text-gray-600 mb-2">Your DID Key:</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  did:key:z6Mkq6THPd7eczYjwWU62wmLWpiAPejWHvnj9BT9yi3RK4sS
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupRoomsTab;
