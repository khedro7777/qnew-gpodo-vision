
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Users, 
  Vote, 
  BarChart3, 
  FileText, 
  Shield, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Crown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import MCPGroupManager from './MCPGroupManager';
import MCPElectionManager from './MCPElectionManager';
import MCPOfferAnalyzer from './MCPOfferAnalyzer';
import MCPPerformanceReports from './MCPPerformanceReports';
import MCPTestSetup from './MCPTestSetup';

const MCPAgentTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mcpAgent, setMcpAgent] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalGroups: 0,
    activeElections: 0,
    pendingOffers: 0,
    completedReports: 0,
    totalMembers: 0,
    recentActivities: []
  });
  const [showTestSetup, setShowTestSetup] = useState(false);

  useEffect(() => {
    loadMCPAgent();
    loadDashboardStats();
  }, [user]);

  const loadMCPAgent = async () => {
    try {
      // Check if user is an MCP agent
      const { data: agent } = await supabase
        .from('mcp_agents')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (agent) {
        setMcpAgent(agent);
      } else {
        setShowTestSetup(true);
      }
    } catch (error) {
      console.error('Error loading MCP agent:', error);
      setShowTestSetup(true);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Load comprehensive dashboard statistics
      const mockStats = {
        totalGroups: 24,
        activeElections: 3,
        pendingOffers: 12,
        completedReports: 18,
        totalMembers: 156,
        recentActivities: [
          {
            id: '1',
            type: 'election_arranged',
            description: 'Started manager election for Group P 105',
            timestamp: new Date().toISOString(),
            group: 'Medical Equipment Group'
          },
          {
            id: '2',
            type: 'offer_analyzed',
            description: 'Analyzed supplier offer from TechCorp',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            group: 'Tech Supplies Group'
          },
          {
            id: '3',
            type: 'decision_created',
            description: 'Created voting decision for contract approval',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            group: 'Manufacturing Group'
          }
        ]
      };

      setDashboardStats(mockStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const logMCPActivity = async (activityType: string, description: string, groupId?: string, metadata?: any) => {
    try {
      await supabase.from('mcp_activities').insert({
        mcp_agent_id: mcpAgent?.id,
        group_id: groupId,
        activity_type: activityType,
        description,
        metadata
      });
    } catch (error) {
      console.error('Error logging MCP activity:', error);
    }
  };

  if (!mcpAgent && showTestSetup) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">MCP Agent Setup Required</h3>
            <p className="text-gray-600">
              Set up MCP Agent privileges and test data to access the control panel.
            </p>
          </div>
        </Card>
        
        <MCPTestSetup />
        
        <div className="text-center">
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Refresh to Check Setup
          </Button>
        </div>
      </div>
    );
  }

  if (!mcpAgent) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">
            MCP Agent privileges required. Contact administrator for access.
          </p>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Agent Overview', icon: Bot },
    { id: 'groups', label: 'Group Manager', icon: Users },
    { id: 'elections', label: 'Election Manager', icon: Vote },
    { id: 'offers', label: 'Offer Analyzer', icon: BarChart3 },
    { id: 'reports', label: 'Performance Reports', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* MCP Agent Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">MCP Agent Control Panel</h1>
                  <p className="text-white/80">{mcpAgent.full_name} • {mcpAgent.agent_code}</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                <Crown className="w-3 h-3 mr-1" />
                Full Admin Access
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Specialization</p>
              <p className="font-semibold">{mcpAgent.specialization}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalGroups}</p>
                <p className="text-sm text-gray-600">Total Groups</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Vote className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{dashboardStats.activeElections}</p>
                <p className="text-sm text-gray-600">Active Elections</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingOffers}</p>
                <p className="text-sm text-gray-600">Pending Offers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.completedReports}</p>
                <p className="text-sm text-gray-600">Reports Generated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-600">{dashboardStats.totalMembers}</p>
                <p className="text-sm text-gray-600">Total Members</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent MCP Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardStats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{activity.group}</span>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setActiveTab('elections')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Vote className="w-6 h-6" />
                  Start Election
                </Button>
                <Button 
                  onClick={() => setActiveTab('offers')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <BarChart3 className="w-6 h-6" />
                  Analyze Offers
                </Button>
                <Button 
                  onClick={() => setActiveTab('reports')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  Generate Report
                </Button>
                <Button 
                  onClick={() => setActiveTab('groups')}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Database className="w-6 h-6" />
                  Manage IPFS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'groups' && (
        <MCPGroupManager mcpAgent={mcpAgent} onLogActivity={logMCPActivity} />
      )}

      {activeTab === 'elections' && (
        <MCPElectionManager mcpAgent={mcpAgent} onLogActivity={logMCPActivity} />
      )}

      {activeTab === 'offers' && (
        <MCPOfferAnalyzer mcpAgent={mcpAgent} onLogActivity={logMCPActivity} />
      )}

      {activeTab === 'reports' && (
        <MCPPerformanceReports mcpAgent={mcpAgent} onLogActivity={logMCPActivity} />
      )}
    </div>
  );
};

export default MCPAgentTab;
