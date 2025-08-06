
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Crown, 
  Shield, 
  Eye, 
  Calendar, 
  Users, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GroupManagersTabProps {
  groupId: string;
}

const GroupManagersTab = ({ groupId }: GroupManagersTabProps) => {
  const [managers, setManagers] = useState<any[]>([]);
  const [mcpAgent, setMcpAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagersData();
  }, [groupId]);

  const loadManagersData = async () => {
    try {
      // Mock data showing the new management structure
      const mockManagers = [
        {
          id: 'manager-1',
          user_id: 'user-1',
          name: 'أحمد محمد السالم',
          email: 'ahmed.salem@example.com',
          role: 'honorary_manager', // New role type
          elected_at: '2024-01-20',
          vote_count: 45,
          status: 'active',
          avatar_url: null,
          responsibilities: [
            'Supervisory oversight',
            'Approve major decisions',
            'Member dispute resolution',
            'Group representation'
          ],
          actual_permissions: [
            'View all activities',
            'Approve/Reject MCP actions',
            'Access reports',
            'Communicate with members'
          ],
          mcp_override: false // Cannot override MCP decisions
        }
      ];

      const mockMcpAgent = {
        id: 'mcp-agent-1',
        agent_code: 'MCP-2024-001',
        full_name: 'GPODO MCP Agent',
        specialization: 'Group Management',
        responsibilities: [
          'Day-to-day operations',
          'Member invitations',
          'Offer management',
          'Voting coordination',
          'Contract execution',
          'IPFS management',
          'Performance monitoring'
        ],
        authority_level: 'full_control',
        manager_approval_required: true // For major decisions
      };

      setManagers(mockManagers);
      setMcpAgent(mockMcpAgent);
    } catch (error) {
      console.error('Error loading managers data:', error);
      toast.error('Failed to load managers information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Group Management Structure</h2>
          <p className="text-gray-600 mt-1">
            MCP Agent handles operations • Elected managers provide oversight
          </p>
        </div>
      </div>

      {/* Management Structure Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Management Structure Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">MCP Agent (Executive)</h4>
                  <p className="text-sm text-blue-700">
                    Handles all day-to-day operations, member management, and decision execution
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Elected Manager (Supervisory)</h4>
                  <p className="text-sm text-yellow-700">
                    Provides oversight, approves major decisions, and represents the group
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCP Agent Section */}
      {mcpAgent && (
        <Card className="border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                MCP Agent (Executive Control)
              </CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                Active Control
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{mcpAgent.full_name}</h3>
                  <p className="text-sm text-gray-600">{mcpAgent.agent_code}</p>
                  <p className="text-sm text-gray-600">Specialization: {mcpAgent.specialization}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Full Administrative Authority
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Executive Responsibilities:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {mcpAgent.responsibilities.map((responsibility: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {mcpAgent.manager_approval_required && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Manager Approval Required
                      </p>
                      <p className="text-xs text-yellow-700">
                        Major decisions require honorary manager approval for transparency
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Honorary Managers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            Honorary Managers (Supervisory Role)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {managers.map((manager) => (
              <div key={manager.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={manager.avatar_url} />
                      <AvatarFallback>
                        {manager.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{manager.name}</h3>
                      <p className="text-sm text-gray-600">{manager.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Honorary Manager
                        </Badge>
                        <Badge className={manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {manager.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-4 h-4" />
                      <span>{manager.vote_count} votes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Since {new Date(manager.elected_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Supervisory Responsibilities:</h4>
                    <div className="space-y-1">
                      {manager.responsibilities.map((responsibility: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{responsibility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Actual Permissions:</h4>
                    <div className="space-y-1">
                      {manager.actual_permissions.map((permission: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-gray-600">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Cannot override MCP Agent decisions</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Activity Log
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {managers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Crown className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Elected Managers</h3>
              <p className="text-sm">
                Group is fully managed by MCP Agent. Elections can be arranged if needed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="font-medium">Arrange Manager Election</p>
                <p className="text-xs text-gray-600">Start election for honorary manager</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Eye className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="font-medium">View MCP Activities</p>
                <p className="text-xs text-gray-600">See all management actions</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupManagersTab;
