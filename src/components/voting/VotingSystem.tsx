
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Vote, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useVoting } from '@/hooks/useVoting';
import { useAuth } from '@/contexts/AuthContext';

interface VotingSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const VotingSystem = ({ groupId, userRole, isManager }: VotingSystemProps) => {
  const { user } = useAuth();
  const { votes, userVotes, isLoading, createVote, castVote, isCreatingVote, isCastingVote } = useVoting(groupId);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVote, setNewVote] = useState({
    title: '',
    description: '',
    options: ['', ''],
    deadline: '',
    isMultiChoice: false
  });

  const handleCreateVote = () => {
    if (!newVote.title.trim() || newVote.options.some(opt => !opt.trim())) {
      return;
    }

    const validOptions = newVote.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      return;
    }

    createVote({
      title: newVote.title,
      description: newVote.description,
      group_id: groupId,
      created_by: user?.id || '',
      deadline: newVote.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      vote_options: validOptions.map((option, index) => ({
        option_text: option,
        vote_count: 0,
        order_index: index
      }))
    });

    // Reset form
    setNewVote({
      title: '',
      description: '',
      options: ['', ''],
      deadline: '',
      isMultiChoice: false
    });
    setIsCreateModalOpen(false);
  };

  const handleCastVote = (voteId: string, optionId: string) => {
    castVote({ voteId, optionId });
  };

  const addOption = () => {
    setNewVote(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (newVote.options.length > 2) {
      setNewVote(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setNewVote(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const getVoteStatus = (vote: any) => {
    const now = new Date();
    const deadline = new Date(vote.deadline);
    
    if (deadline < now) {
      return 'expired';
    }
    return vote.is_active ? 'active' : 'closed';
  };

  const hasUserVoted = (voteId: string) => {
    return userVotes.some(uv => uv.vote_id === voteId);
  };

  const getUserVoteOption = (voteId: string) => {
    const userVote = userVotes.find(uv => uv.vote_id === voteId);
    return userVote?.option_id;
  };

  const calculateResults = (vote: any) => {
    const totalVotes = vote.vote_options?.reduce((sum: number, option: any) => sum + option.vote_count, 0) || 0;
    return vote.vote_options?.map((option: any) => ({
      ...option,
      percentage: totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0
    })) || [];
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Voting</h2>
          <p className="text-gray-600">Participate in group decisions and vote on proposals</p>
        </div>
        
        {isManager && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Vote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Vote</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vote-title">Vote Title</Label>
                  <Input
                    id="vote-title"
                    placeholder="Enter vote title"
                    value={newVote.title}
                    onChange={(e) => setNewVote(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="vote-description">Description (Optional)</Label>
                  <Textarea
                    id="vote-description"
                    placeholder="Provide additional context for the vote"
                    value={newVote.description}
                    onChange={(e) => setNewVote(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Vote Options</Label>
                  <div className="space-y-2">
                    {newVote.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                        />
                        {newVote.options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="vote-deadline">Deadline (Optional)</Label>
                  <Input
                    id="vote-deadline"
                    type="datetime-local"
                    value={newVote.deadline}
                    onChange={(e) => setNewVote(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateVote} disabled={isCreatingVote}>
                    {isCreatingVote ? 'Creating...' : 'Create Vote'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Votes List */}
      {votes.length === 0 ? (
        <Card className="p-8 text-center">
          <Vote className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Votes Yet</h3>
          <p className="text-gray-500 mb-4">
            {isManager 
              ? "Create the first vote to start group decision making."
              : "Waiting for managers to create votes for group decisions."
            }
          </p>
          {isManager && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Vote
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6">
          {votes.map((vote) => {
            const status = getVoteStatus(vote);
            const hasVoted = hasUserVoted(vote.id);
            const userVoteOption = getUserVoteOption(vote.id);
            const results = calculateResults(vote);

            return (
              <Card key={vote.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {vote.title}
                    </h3>
                    {vote.description && (
                      <p className="text-gray-600 mb-3">{vote.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {status === 'expired' 
                            ? 'Expired' 
                            : `Ends ${new Date(vote.deadline).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{results.reduce((sum, opt) => sum + opt.vote_count, 0)} votes</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant={
                    status === 'active' ? 'default' : 
                    status === 'expired' ? 'destructive' : 'secondary'
                  }>
                    {status === 'active' ? 'Active' : 
                     status === 'expired' ? 'Expired' : 'Closed'}
                  </Badge>
                </div>

                {/* Vote Options */}
                <div className="space-y-3">
                  {results.map((option, index) => {
                    const isSelected = userVoteOption === option.id;
                    const canVote = status === 'active' && !hasVoted;

                    return (
                      <div key={option.id || index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {canVote ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCastVote(vote.id, option.id || `${index}`)}
                                disabled={isCastingVote}
                                className="min-w-0"
                              >
                                <Vote className="w-4 h-4" />
                              </Button>
                            ) : (
                              <div className="w-10 flex justify-center">
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                            )}
                            
                            <span className={`flex-1 ${isSelected ? 'font-medium' : ''}`}>
                              {option.option_text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {option.vote_count} ({option.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <Progress value={option.percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                {hasVoted && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">You have voted in this poll</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VotingSystem;
