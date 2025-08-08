import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Database, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Settings,
  FileText,
  Bot,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MCPTestSetup = () => {
  const { user } = useAuth();
  const [setupData, setSetupData] = useState({
    agentCode: '',
    fullName: '',
    specialization: '',
    testGroupId: '',
    testGroupName: '',
    testElectionId: '',
    testOfferId: '',
    testReportId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSetupData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetup = async () => {
    setIsSubmitting(true);
    setSetupProgress(10);

    try {
      // 1. Create MCP Agent Profile
      const { data: agent, error: agentError } = await supabase
        .from('mcp_agents')
        .insert({
          user_id: user?.id,
          agent_code: setupData.agentCode,
          full_name: setupData.fullName,
          specialization: setupData.specialization,
          status: 'active'
        })
        .select()
        .single();

      if (agentError) throw agentError;
      setSetupProgress(30);

      // 2. Create Test Group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: setupData.testGroupName,
          description: 'Test Group for MCP Agent',
          industry_sector_id: 'default',
          country_id: 'default',
          created_by: user?.id,
          status: 'active',
          is_public: true,
          current_members: 1
        })
        .select()
        .single();

      if (groupError) throw groupError;
      setSetupProgress(50);

      // 3. Add MCP Agent to Test Group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user?.id,
          role: 'admin'
        });

      if (memberError) throw memberError;
      setSetupProgress(70);

      // 4. Create Mock Election, Offer, and Report (Placeholder)
      // In a real scenario, you would create actual records in the database
      // and store their IDs in the setupData state.

      // 5. Update MCP Test Results
      const { error: testError } = await supabase
        .from('mcp_test_results')
        .insert({
          user_id: user?.id,
          mcp_agent_id: agent.id,
          group_id: group.id,
          election_id: 'mock-election-id',
          offer_id: 'mock-offer-id',
          report_id: 'mock-report-id',
          status: 'approved',
          test_date: new Date().toISOString()
        });

      if (testError) throw testError;
      setSetupProgress(90);

      toast.success('MCP Agent setup completed successfully!');
      setSetupProgress(100);
    } catch (error: any) {
      console.error('MCP Agent setup error:', error);
      toast.error('MCP Agent setup failed: ' + error.message);
      setSetupProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">MCP Agent Test Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {setupProgress > 0 && setupProgress < 100 && (
          <div className="space-y-2">
            <Label>Setup Progress</Label>
            <Progress value={setupProgress} />
            <p className="text-sm text-gray-500">Setting up your MCP Agent profile...</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="agentCode">Agent Code</Label>
            <Input
              id="agentCode"
              name="agentCode"
              value={setupData.agentCode}
              onChange={handleChange}
              placeholder="Enter Agent Code"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={setupData.fullName}
              onChange={handleChange}
              placeholder="Enter Full Name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Select
            onValueChange={(value) => setSetupData(prev => ({ ...prev, specialization: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="testGroupName">Test Group Name</Label>
            <Input
              id="testGroupName"
              name="testGroupName"
              value={setupData.testGroupName}
              onChange={handleChange}
              placeholder="Enter Test Group Name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <Button onClick={handleSetup} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting Up...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Run Test Setup
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MCPTestSetup;
