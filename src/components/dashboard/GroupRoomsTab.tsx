
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Video, Vote, FileText, Users, Calendar, AlertTriangle } from 'lucide-react';

const GroupRoomsTab = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groupRooms = [
    {
      id: '1',
      name: 'Tech Supplies Group',
      members: 12,
      managers: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      activeDiscussions: 3,
      pendingVotes: 2,
      nextMeeting: '2025-08-10T14:00:00Z'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Group Selection */}
        <div className="lg:w-1/3">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Group Rooms</h3>
          <div className="space-y-3">
            {groupRooms.map((room) => (
              <Card 
                key={room.id} 
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedGroup?.id === room.id ? 'ring-2 ring-productivity-blue' : ''
                }`}
                onClick={() => setSelectedGroup(room)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <Badge className="bg-green-100 text-green-800 border-0">Active</Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{room.members} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{room.activeDiscussions} active discussions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    <span>{room.pendingVotes} pending votes</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Group Room Interface */}
        <div className="lg:w-2/3">
          {selectedGroup ? (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedGroup.name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="voting">Voting</TabsTrigger>
                  <TabsTrigger value="offers">Offers</TabsTrigger>
                  <TabsTrigger value="vault">IPFS Vault</TabsTrigger>
                  <TabsTrigger value="legal">Legal</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Timeline & Milestones</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">LOI Completed</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">ICPO In Progress</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <span className="text-sm text-gray-500">FCO Pending</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Elected Managers</h4>
                      <div className="space-y-2">
                        {selectedGroup.managers.map((manager, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-productivity-blue to-productivity-purple rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {manager.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-sm font-medium">{manager}</span>
                            <Badge variant="outline" className="text-xs">Manager</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Smart Suggestions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded">
                          <AlertTriangle className="w-4 h-4" />
                          <span>MCP Agent recommends reviewing supplier credentials</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-2 rounded">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Market pricing suggests 15% better deal available</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Next Meeting</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{new Date(selectedGroup.nextMeeting).toLocaleString()}</span>
                      </div>
                      <Button size="sm" className="mt-2 w-full">
                        <Video className="w-4 h-4 mr-2" />
                        Schedule Zoom Meeting
                      </Button>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="discussions" className="mt-6">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Group Discussions</h4>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-gray-900">Supplier Selection Discussion</h5>
                        <p className="text-sm text-gray-600 mb-2">3 participants • Active</p>
                        <p className="text-sm text-gray-700">Latest: "I think we should go with Supplier B for better pricing..."</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-medium text-gray-900">Delivery Timeline</h5>
                        <p className="text-sm text-gray-600 mb-2">5 participants • Resolved</p>
                        <p className="text-sm text-gray-700">Latest: "Agreed on 30-day delivery window"</p>
                      </div>
                    </div>
                    <Button className="mt-4">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start New Discussion
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="voting" className="mt-6">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Active Votes</h4>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">Approve Final Contract Terms</h5>
                          <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Vote on the final contract terms with Supplier XYZ</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">60% (6/10 votes)</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Vote Yes</Button>
                          <Button size="sm" variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">Vote No</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="offers" className="mt-6">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Supplier & Freelancer Offers</h4>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No offers submitted yet</p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="vault" className="mt-6">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">IPFS Document Vault</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>/ipfs/groups/{selectedGroup.id}/loi/</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>/ipfs/groups/{selectedGroup.id}/icpo/</span>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-100 rounded opacity-50">
                        <span>/ipfs/groups/{selectedGroup.id}/fco/</span>
                        <Button size="sm" variant="outline" disabled>Pending</Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="legal" className="mt-6">
                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Legal Documents & Bot</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <FileText className="w-6 h-6 mb-1" />
                        Generate SPA
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                        <AlertTriangle className="w-6 h-6 mb-1" />
                        Risk Warnings
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Group Room</h3>
              <p className="text-gray-500">Choose a group from the left to access its room interface</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupRoomsTab;
