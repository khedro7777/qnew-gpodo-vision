
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Vote, 
  Plus, 
  Clock, 
  Users, 
  TrendingUp, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface VotingProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'ended' | 'pending';
  startDate: string;
  endDate: string;
  votingType: 'single-choice' | 'approval' | 'quadratic' | 'weighted';
  options: VotingOption[];
  totalVotes: number;
  quorum: number;
  strategies: VotingStrategy[];
  discussion: DiscussionThread[];
}

interface VotingOption {
  id: string;
  title: string;
  description?: string;
  votes: number;
  percentage: number;
}

interface VotingStrategy {
  name: string;
  network: string;
  params: Record<string, any>;
}

interface DiscussionThread {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  replies: DiscussionThread[];
}

interface VotingSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const VotingSystem = ({ groupId, userRole, isManager }: VotingSystemProps) => {
  const [proposals, setProposals] = useState<VotingProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    votingType: 'single-choice' as const,
    options: ['', ''],
    endDate: '',
    quorum: 50
  });

  useEffect(() => {
    loadProposals();
  }, [groupId]);

  const loadProposals = async () => {
    // Mock data with enhanced voting features
    const mockProposals: VotingProposal[] = [
      {
        id: '1',
        title: 'Select Medical Equipment Supplier',
        description: 'Vote on the preferred supplier for our medical equipment procurement initiative',
        proposer: 'Group Manager',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        votingType: 'single-choice',
        totalVotes: 28,
        quorum: 30,
        strategies: [
          { name: 'erc20-balance-of', network: '1', params: { symbol: 'GROUP', address: '0x...' } }
        ],
        options: [
          { id: '1a', title: 'Advanced Medical Corp', description: 'Best pricing, good quality', votes: 15, percentage: 53.6 },
          { id: '1b', title: 'Healthcare Solutions Ltd', description: 'Premium quality, higher price', votes: 8, percentage: 28.6 },
          { id: '1c', title: 'MedTech Supplies', description: 'Fast delivery, competitive price', votes: 5, percentage: 17.8 }
        ],
        discussion: [
          {
            id: '1',
            author: 'Dr. Sarah Johnson',
            message: 'I recommend Advanced Medical Corp based on our previous experience with their products.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            replies: []
          }
        ]
      }
    ];

    setProposals(mockProposals);
  };

  const createProposal = async () => {
    try {
      const proposal: VotingProposal = {
        id: Date.now().toString(),
        title: newProposal.title,
        description: newProposal.description,
        proposer: 'Current User',
        status: 'pending',
        startDate: new Date().toISOString(),
        endDate: newProposal.endDate,
        votingType: newProposal.votingType,
        totalVotes: 0,
        quorum: newProposal.quorum,
        strategies: [],
        options: newProposal.options
          .filter(opt => opt.trim())
          .map((opt, idx) => ({
            id: `${Date.now()}-${idx}`,
            title: opt,
            votes: 0,
            percentage: 0
          })),
        discussion: []
      };

      setProposals(prev => [...prev, proposal]);
      setShowCreateForm(false);
      setNewProposal({
        title: '',
        description: '',
        votingType: 'single-choice',
        options: ['', ''],
        endDate: '',
        quorum: 50
      });
      
      toast.success('Proposal created successfully');
    } catch (error) {
      toast.error('Failed to create proposal');
    }
  };

  const castVote = async (proposalId: string, optionId: string) => {
    try {
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          const updatedOptions = proposal.options.map(option => {
            if (option.id === optionId) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
          const optionsWithPercentage = updatedOptions.map(option => ({
            ...option,
            percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
          }));

          return {
            ...proposal,
            options: optionsWithPercentage,
            totalVotes
          };
        }
        return proposal;
      }));

      toast.success('Vote cast successfully');
    } catch (error) {
      toast.error('Failed to cast vote');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Vote className="w-4 h-4 text-green-600" />;
      case 'ended':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getQuorumStatus = (proposal: VotingProposal) => {
    const progress = (proposal.totalVotes / proposal.quorum) * 100;
    const isReached = progress >= 100;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4" />
        <span>Quorum: {proposal.totalVotes}/{proposal.quorum}</span>
        <div className="w-20">
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>
        {isReached && <CheckCircle2 className="w-4 h-4 text-green-600" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Governance & Voting</h2>
          <p className="text-gray-600">Decentralized decision making for your group</p>
        </div>
        {isManager && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Proposal
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Vote className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Active Proposals</h3>
            <p className="text-2xl font-bold text-blue-600">
              {proposals.filter(p => p.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Passed Proposals</h3>
            <p className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === 'ended').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Participation Rate</h3>
            <p className="text-2xl font-bold text-purple-600">87%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold">Discussions</h3>
            <p className="text-2xl font-bold text-orange-600">
              {proposals.reduce((sum, p) => sum + p.discussion.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{proposal.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(proposal.status)}
                      {proposal.status}
                    </Badge>
                    <Badge variant="secondary">{proposal.votingType}</Badge>
                  </div>
                  <p className="text-gray-600">{proposal.description}</p>
                  
                  <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Ends: {new Date(proposal.endDate).toLocaleDateString()}</span>
                    </div>
                    {getQuorumStatus(proposal)}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {proposal.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{option.title}</span>
                        {option.description && (
                          <p className="text-sm text-gray-500">{option.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {option.votes} votes ({option.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Progress value={option.percentage} className="flex-1" />
                      {proposal.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => castVote(proposal.id, option.id)}
                        >
                          Vote
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Discussion Preview */}
                {proposal.discussion.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">Recent Discussion</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm">{proposal.discussion[0].message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {proposal.discussion[0].author} • {new Date(proposal.discussion[0].timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2">
                      View Full Discussion
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Proposal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Proposal</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Proposal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the proposal"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Voting Type</label>
                  <select 
                    value={newProposal.votingType}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, votingType: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="single-choice">Single Choice</option>
                    <option value="approval">Approval Voting</option>
                    <option value="quadratic">Quadratic Voting</option>
                    <option value="weighted">Weighted Voting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="datetime-local"
                    value={newProposal.endDate}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                {newProposal.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newProposal.options];
                        newOptions[index] = e.target.value;
                        setNewProposal(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    {index > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = newProposal.options.filter((_, i) => i !== index);
                          setNewProposal(prev => ({ ...prev, options: newOptions }));
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewProposal(prev => ({ ...prev, options: [...prev.options, ''] }))}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={createProposal}>
                  Create Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingSystem;
