
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  Calendar,
  Lock,
  Globe,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useVoting } from '@/hooks/useVoting';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedVotingSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const EnhancedVotingSystem = ({ groupId, userRole, isManager }: EnhancedVotingSystemProps) => {
  const { user } = useAuth();
  const { votes, userVotes, isLoading, createVote, castVote, isCreatingVote, isCastingVote } = useVoting(groupId);
  
  const [activeTab, setActiveTab] = useState('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVote, setNewVote] = useState({
    title: '',
    description: '',
    options: ['', ''],
    deadline: '',
    votingType: 'single-choice',
    privacy: 'group',
    quorum: 50,
    strategy: 'simple-majority'
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

    setNewVote({
      title: '',
      description: '',
      options: ['', ''],
      deadline: '',
      votingType: 'single-choice',
      privacy: 'group',
      quorum: 50,
      strategy: 'simple-majority'
    });
    setIsCreateModalOpen(false);
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

  const calculateResults = (vote: any) => {
    const totalVotes = vote.vote_options?.reduce((sum: number, option: any) => sum + option.vote_count, 0) || 0;
    return vote.vote_options?.map((option: any) => ({
      ...option,
      percentage: totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0
    })) || [];
  };

  const filterVotes = (votes: any[]) => {
    switch (activeTab) {
      case 'active':
        return votes.filter(vote => getVoteStatus(vote) === 'active');
      case 'closed':
        return votes.filter(vote => getVoteStatus(vote) === 'expired' || getVoteStatus(vote) === 'closed');
      case 'my-votes':
        return votes.filter(vote => hasUserVoted(vote.id));
      default:
        return votes;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  const filteredVotes = filterVotes(votes);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Governance & Voting</h2>
          <p className="text-muted-foreground">Participate in decentralized decision making</p>
        </div>
        
        {isManager && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Voting Proposal</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="vote-title">Proposal Title</Label>
                    <Input
                      id="vote-title"
                      placeholder="Enter proposal title"
                      value={newVote.title}
                      onChange={(e) => setNewVote(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vote-description">Description</Label>
                    <Textarea
                      id="vote-description"
                      placeholder="Provide detailed context for the proposal"
                      value={newVote.description}
                      onChange={(e) => setNewVote(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label>Voting Options</Label>
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
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Voting Type</Label>
                      <Select value={newVote.votingType} onValueChange={(value) => setNewVote(prev => ({ ...prev, votingType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-choice">Single Choice</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="ranked-choice">Ranked Choice</SelectItem>
                          <SelectItem value="weighted">Weighted Voting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Privacy Level</Label>
                      <Select value={newVote.privacy} onValueChange={(value) => setNewVote(prev => ({ ...prev, privacy: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="group">Group Members Only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quorum">Quorum (%)</Label>
                      <Input
                        id="quorum"
                        type="number"
                        min="1"
                        max="100"
                        value={newVote.quorum}
                        onChange={(e) => setNewVote(prev => ({ ...prev, quorum: parseInt(e.target.value) || 50 }))}
                      />
                    </div>
                    
                    <div>
                      <Label>Decision Strategy</Label>
                      <Select value={newVote.strategy} onValueChange={(value) => setNewVote(prev => ({ ...prev, strategy: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple-majority">Simple Majority</SelectItem>
                          <SelectItem value="super-majority">Super Majority (66%)</SelectItem>
                          <SelectItem value="unanimous">Unanimous</SelectItem>
                          <SelectItem value="plurality">Plurality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vote-deadline">Voting Deadline</Label>
                    <Input
                      id="vote-deadline"
                      type="datetime-local"
                      value={newVote.deadline}
                      onChange={(e) => setNewVote(prev => ({ ...prev, deadline: e.target.value }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVote} disabled={isCreatingVote}>
                  {isCreatingVote ? 'Creating...' : 'Create Proposal'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Voting Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Active ({votes.filter(v => getVoteStatus(v) === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Closed ({votes.filter(v => getVoteStatus(v) !== 'active').length})
          </TabsTrigger>
          <TabsTrigger value="my-votes" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            My Votes ({votes.filter(v => hasUserVoted(v.id)).length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Vote className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Total Proposals</h3>
                <p className="text-3xl font-bold text-primary">{votes.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Participation Rate</h3>
                <p className="text-3xl font-bold text-green-600">87%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Active Discussions</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredVotes.length === 0 ? (
            <Card className="p-8 text-center">
              <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {activeTab === 'active' ? 'No Active Proposals' : 
                 activeTab === 'closed' ? 'No Closed Proposals' : 
                 'No Votes Cast Yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isManager 
                  ? "Create the first proposal to start group decision making."
                  : "Waiting for proposals to participate in governance."
                }
              </p>
              {isManager && activeTab === 'active' && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Proposal
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredVotes.map((vote) => {
                const status = getVoteStatus(vote);
                const hasVoted = hasUserVoted(vote.id);
                const results = calculateResults(vote);
                const totalVotes = results.reduce((sum, opt) => sum + opt.vote_count, 0);

                return (
                  <Card key={vote.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{vote.title}</CardTitle>
                            <Badge variant={
                              status === 'active' ? 'default' : 
                              status === 'expired' ? 'destructive' : 'secondary'
                            }>
                              {status === 'active' ? (
                                <>
                                  <Globe className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : status === 'expired' ? (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Expired
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3 mr-1" />
                                  Closed
                                </>
                              )}
                            </Badge>
                          </div>
                          
                          {vote.description && (
                            <p className="text-muted-foreground mb-3">{vote.description}</p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {status === 'expired' 
                                  ? `Ended ${new Date(vote.deadline).toLocaleDateString()}`
                                  : `Ends ${new Date(vote.deadline).toLocaleDateString()}`
                                }
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{totalVotes} votes cast</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>Quorum: 50%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {results.map((option, index) => {
                          const canVote = status === 'active' && !hasVoted;

                          return (
                            <div key={option.id || index} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  {canVote ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => castVote({ voteId: vote.id, optionId: option.id || `${index}` })}
                                      disabled={isCastingVote}
                                      className="min-w-[80px]"
                                    >
                                      <Vote className="w-4 h-4 mr-1" />
                                      Vote
                                    </Button>
                                  ) : (
                                    <div className="w-[80px] flex justify-center">
                                      {hasVoted && (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                      )}
                                    </div>
                                  )}
                                  
                                  <span className="flex-1 font-medium">
                                    {option.option_text}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                                    {option.vote_count} votes ({option.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>

                              <Progress value={option.percentage} className="h-3" />
                            </div>
                          );
                        })}

                        {hasVoted && (
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-medium">Vote Recorded</span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                              Your vote has been successfully recorded and cannot be changed.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedVotingSystem;
