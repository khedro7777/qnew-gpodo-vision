
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Vote, 
  Plus, 
  Calendar, 
  Users, 
  Crown,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MCPElectionManagerProps {
  mcpAgent: any;
  onLogActivity: (type: string, description: string, groupId?: string, metadata?: any) => void;
}

const MCPElectionManager = ({ mcpAgent, onLogActivity }: MCPElectionManagerProps) => {
  const [elections, setElections] = useState<any[]>([]);
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [electionType, setElectionType] = useState('manager');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadElections();
  }, []);

  const loadElections = async () => {
    try {
      // Load elections with mock data
      const mockElections = [
        {
          id: '1',
          group_id: '1',
          group_name: 'Medical Equipment Purchasing',
          group_number: 'P 105',
          election_type: 'manager',
          status: 'active',
          start_date: '2024-01-20T00:00:00Z',
          end_date: '2024-01-25T23:59:59Z',
          candidates: 3,
          total_votes: 8,
          eligible_voters: 12
        },
        {
          id: '2',
          group_id: '2',
          group_name: 'Tech Startup Investment',
          group_number: 'I 203',
          election_type: 'level_1',
          status: 'completed',
          start_date: '2024-01-15T00:00:00Z',
          end_date: '2024-01-18T23:59:59Z',
          candidates: 4,
          total_votes: 8,
          eligible_voters: 8,
          winner: 'Ahmed Al-Rashid'
        }
      ];

      setElections(mockElections);
    } catch (error) {
      console.error('Error loading elections:', error);
    }
  };

  const createElection = async () => {
    try {
      if (!selectedGroup || !startDate || !endDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      // In real implementation, this would create the election in Supabase
      const newElection = {
        group_id: selectedGroup,
        election_type: electionType,
        status: 'pending',
        start_date: startDate,
        end_date: endDate,
        max_candidates: 4
      };

      toast.success('Election created successfully');
      
      onLogActivity(
        'election_created',
        `Created ${electionType} election for group ${selectedGroup}`,
        selectedGroup,
        newElection
      );

      setShowCreateElection(false);
      setSelectedGroup('');
      setStartDate('');
      setEndDate('');
      loadElections();
    } catch (error) {
      console.error('Error creating election:', error);
      toast.error('Failed to create election');
    }
  };

  const manageElection = async (electionId: string, action: string) => {
    try {
      // Handle election management actions
      switch (action) {
        case 'start':
          toast.success('Election started successfully');
          onLogActivity('election_started', `Started election ${electionId}`);
          break;
        case 'end':
          toast.success('Election ended successfully');
          onLogActivity('election_ended', `Ended election ${electionId}`);
          break;
        case 'cancel':
          toast.success('Election cancelled successfully');
          onLogActivity('election_cancelled', `Cancelled election ${electionId}`);
          break;
      }

      loadElections();
    } catch (error) {
      console.error('Error managing election:', error);
      toast.error(`Failed to ${action} election`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getElectionTypeIcon = (type: string) => {
    switch (type) {
      case 'manager': return <Crown className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Election Management Center</h2>
        <Button onClick={() => setShowCreateElection(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </Button>
      </div>

      {/* Elections List */}
      <div className="space-y-4">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getElectionTypeIcon(election.election_type)}
                    <CardTitle className="text-lg">
                      {election.group_name} - {election.election_type} Election
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 font-mono">
                      {election.group_number}
                    </Badge>
                    <Badge className={getStatusColor(election.status)}>
                      {election.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(election.start_date).toLocaleDateString()} - 
                        {new Date(election.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{election.candidates} candidates</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Vote className="w-3 h-3" />
                      <span>{election.total_votes}/{election.eligible_voters} votes</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {election.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => manageElection(election.id, 'start')}
                    >
                      Start Election
                    </Button>
                  )}
                  {election.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => manageElection(election.id, 'end')}
                    >
                      End Election
                    </Button>
                  )}
                  {election.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => manageElection(election.id, 'cancel')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Participation Rate</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${(election.total_votes / election.eligible_voters) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round((election.total_votes / election.eligible_voters) * 100)}% participation
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Time Remaining</p>
                  {election.status === 'active' && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-orange-600">
                        {Math.ceil((new Date(election.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  )}
                  {election.status === 'completed' && (
                    <div className="flex items-center gap-1 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-green-600">Completed</span>
                    </div>
                  )}
                </div>

                <div>
                  {election.status === 'completed' && election.winner && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Winner</p>
                      <div className="flex items-center gap-1">
                        <Crown className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium text-yellow-700">{election.winner}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Election Modal */}
      {showCreateElection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Create New Election</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Group</option>
                  <option value="1">Medical Equipment Purchasing (P 105)</option>
                  <option value="2">Tech Startup Investment (I 203)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Election Type</label>
                <select
                  value={electionType}
                  onChange={(e) => setElectionType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="manager">Manager Election</option>
                  <option value="level_1">Level 1 Election</option>
                  <option value="level_2">Level 2 Election</option>
                  <option value="level_3">Level 3 Election</option>
                  <option value="level_4">Level 4 Election</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={createElection} className="flex-1">
                  Create Election
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateElection(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MCPElectionManager;
