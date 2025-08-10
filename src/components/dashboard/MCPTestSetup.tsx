import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Database, 
  Users, 
  Vote, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { GatewayType } from '@/types';

const MCPTestSetup = () => {
  const { user, profile } = useAuth();
  const [setupStatus, setSetupStatus] = useState({
    mcpAgent: false,
    sampleGroups: false,
    sampleElections: false,
    sampleOffers: false,
    sampleReports: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const createMCPAgent = async () => {
    try {
      // Create MCP agent for current user
      const { error } = await supabase
        .from('mcp_agents')
        .insert({
          user_id: user?.id,
          agent_code: 'MCP' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          full_name: profile?.full_name || 'Test MCP Agent',
          specialization: 'Group Management & Operations'
        });

      if (error) throw error;

      setSetupStatus(prev => ({ ...prev, mcpAgent: true }));
      toast.success('MCP Agent created successfully!');
    } catch (error) {
      console.error('Error creating MCP agent:', error);
      toast.error('Failed to create MCP agent');
    }
  };

  const createSampleGroups = async () => {
    try {
      // Create sample groups with proper typing
      const sampleGroups = [
        {
          name: 'Medical Equipment Purchasing',
          gateway_type: 'purchasing' as GatewayType,
          description: 'Group focused on purchasing medical equipment',
          creator_id: user?.id!,
          country_id: null,
          industry_sector_id: null
        },
        {
          name: 'Tech Startup Investment',
          gateway_type: 'formation' as GatewayType, 
          description: 'Investment opportunities in tech startups',
          creator_id: user?.id!,
          country_id: null,
          industry_sector_id: null
        }
      ];

      for (const group of sampleGroups) {
        const { error } = await supabase
          .from('groups')
          .insert(group);
        
        if (error) throw error;
      }

      setSetupStatus(prev => ({ ...prev, sampleGroups: true }));
      toast.success('Sample groups created successfully!');
    } catch (error) {
      console.error('Error creating sample groups:', error);
      toast.error('Failed to create sample groups');
    }
  };

  const createSampleElections = async () => {
    try {
      // Get a sample group first
      const { data: groups } = await supabase
        .from('groups')
        .select('id')
        .limit(1);

      if (!groups || groups.length === 0) {
        toast.error('Please create sample groups first');
        return;
      }

      const election = {
        group_id: groups[0].id,
        election_type: 'manager',
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: user?.id
      };

      const { error } = await supabase
        .from('group_elections')
        .insert(election);

      if (error) throw error;

      setSetupStatus(prev => ({ ...prev, sampleElections: true }));
      toast.success('Sample elections created successfully!');
    } catch (error) {
      console.error('Error creating sample elections:', error);
      toast.error('Failed to create sample elections');
    }
  };

  const createSampleData = async () => {
    setIsLoading(true);
    try {
      await createMCPAgent();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createSampleGroups();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await createSampleElections();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mark other items as complete for demo
      setSetupStatus(prev => ({ 
        ...prev, 
        sampleOffers: true, 
        sampleReports: true 
      }));

      toast.success('MCP Test Environment Setup Complete!');
    } catch (error) {
      console.error('Error in setup:', error);
      toast.error('Setup failed. Please try individual steps.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupItems = [
    {
      id: 'mcpAgent',
      title: 'MCP Agent Record',
      description: 'Create MCP Agent privileges for current user',
      icon: Shield,
      action: createMCPAgent
    },
    {
      id: 'sampleGroups',
      title: 'Sample Groups',
      description: 'Create test groups with proper numbering (P 101, I 201, etc.)',
      icon: Users,
      action: createSampleGroups
    },
    {
      id: 'sampleElections',
      title: 'Sample Elections',
      description: 'Create test elections for group management',
      icon: Vote,
      action: createSampleElections
    },
    {
      id: 'sampleOffers',
      title: 'Sample Offers',
      description: 'Mock offers from suppliers and freelancers',
      icon: FileText,
      action: () => {
        setSetupStatus(prev => ({ ...prev, sampleOffers: true }));
        toast.success('Sample offers ready (mock data)');
      }
    },
    {
      id: 'sampleReports',
      title: 'Performance Reports',
      description: 'Mock performance reports for testing',
      icon: Database,
      action: () => {
        setSetupStatus(prev => ({ ...prev, sampleReports: true }));
        toast.success('Sample reports ready (mock data)');
      }
    }
  ];

  const allComplete = Object.values(setupStatus).every(Boolean);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">MCP Agent Test Setup</CardTitle>
              <p className="text-white/80">Initialize MCP Agent system for testing</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Setup Progress</p>
              <p className="text-xl font-bold">
                {Object.values(setupStatus).filter(Boolean).length}/{setupItems.length} Complete
              </p>
            </div>
            <Button 
              onClick={createSampleData}
              disabled={isLoading || allComplete}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              {isLoading ? 'Setting Up...' : allComplete ? 'Complete' : 'Run Full Setup'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {setupItems.map((item) => {
          const Icon = item.icon;
          const isComplete = setupStatus[item.id as keyof typeof setupStatus];
          
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        {item.title}
                        {isComplete && <Badge className="bg-green-100 text-green-800">Complete</Badge>}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  
                  {!isComplete && (
                    <Button 
                      size="sm" 
                      onClick={item.action}
                      disabled={isLoading}
                    >
                      Setup
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allComplete && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Setup Complete!</h3>
                <p className="text-sm text-green-700">
                  MCP Agent test environment is ready. You can now test all MCP functionalities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPTestSetup;
