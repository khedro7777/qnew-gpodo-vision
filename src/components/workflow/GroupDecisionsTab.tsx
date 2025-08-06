import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Eye, 
  Vote, 
  MessageSquare, 
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Bot
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import MCPProposalCollector from './MCPProposalCollector';

interface GroupDecisionsTabProps {
  groupId: string;
  userRole: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  created_at: string;
  status: 'draft' | 'under_review' | 'voting' | 'approved' | 'rejected';
  votes_for: number;
  votes_against: number;
  category: string;
}

const GroupDecisionsTab = ({ groupId, userRole }: GroupDecisionsTabProps) => {
  const { t, isRTL } = useTranslation();
  
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Bulk Purchase of Medical Equipment',
      description: 'Proposal to coordinate bulk purchase of MRI machines to reduce costs by 30%',
      author: 'Dr. Ahmed',
      created_at: '2024-01-15',
      status: 'voting',
      votes_for: 8,
      votes_against: 2,
      category: 'purchasing'
    },
    {
      id: '2',
      title: 'Quality Standards Implementation',
      description: 'Establish unified quality standards for all group purchases',
      author: 'Sarah Johnson',
      created_at: '2024-01-12',
      status: 'approved',
      votes_for: 12,
      votes_against: 0,
      category: 'policy'
    }
  ]);

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'voting': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Clock;
      case 'under_review': return AlertCircle;
      case 'voting': return Vote;
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  const handleCreateProposal = () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) return;

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      author: 'Current User', // Would be from auth context
      created_at: new Date().toISOString().split('T')[0],
      status: 'draft',
      votes_for: 0,
      votes_against: 0,
      category: newProposal.category
    };

    setProposals(prev => [proposal, ...prev]);
    setNewProposal({ title: '', description: '', category: 'general' });
    setShowCreateForm(false);
  };

  const handleGoToVoting = (proposalId: string) => {
    // This would navigate to the voting tab with the specific proposal
    console.log(`Navigating to voting for proposal ${proposalId}`);
    // In a real app: navigate(`/group-room/${groupId}?tab=voting&proposal=${proposalId}`);
  };

  const handleViewDetails = (proposal: Proposal) => {
    setSelectedProposal(proposal);
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* MCP Proposal Collector */}
      <MCPProposalCollector groupId={groupId} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Proposals')}</h2>
          <p className="text-gray-600 mt-1">
            Manage and review group proposals and decisions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('Create New Proposal')}
        </Button>
      </div>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter proposal title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your proposal in detail..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateProposal}>
                Create Proposal
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                {t('Cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const StatusIcon = getStatusIcon(proposal.status);
          return (
            <Card key={proposal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {proposal.title}
                      </h3>
                      <Badge className={getStatusColor(proposal.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {t(proposal.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{proposal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>By {proposal.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{proposal.created_at}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {proposal.status === 'voting' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Voting Results</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>For: {proposal.votes_for}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>Against: {proposal.votes_against}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(proposal)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t('View Details')}
                  </Button>
                  {proposal.status === 'under_review' && (
                    <Button 
                      size="sm"
                      onClick={() => handleGoToVoting(proposal.id)}
                    >
                      <Vote className="w-4 h-4 mr-1" />
                      {t('Go to Voting')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Proposal Details Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedProposal.title}</h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedProposal(null)}>
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedProposal.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">MCP Recommendation</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-blue-900 font-medium">MCP Analysis:</p>
                      <p className="text-blue-800 mt-1">
                        This proposal shows strong potential for cost savings and improved efficiency. 
                        Recommended to proceed to voting with suggested modifications to timeline.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDecisionsTab;
