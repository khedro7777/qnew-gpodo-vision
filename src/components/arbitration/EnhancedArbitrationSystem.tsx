import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Scale, 
  Plus, 
  Clock, 
  FileText, 
  Users, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Gavel,
  Shield,
  Calendar,
  MessageSquare,
  Upload,
  Download,
  Eye
} from 'lucide-react';
import { useArbitration } from '@/hooks/useArbitration';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedArbitrationSystemProps {
  groupId?: string;
}

const EnhancedArbitrationSystem = ({ groupId }: EnhancedArbitrationSystemProps) => {
  const { user } = useAuth();
  const { cases, isLoading, createCase, isCreating } = useArbitration();
  
  const [activeTab, setActiveTab] = useState('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    type: '',
    priority: 'medium',
    respondent_id: '',
    requested_remedy: ''
  });

  // Mock data for demonstration
  const mockCases = [
    {
      id: '1',
      case_number: 'ARB-2024-001',
      title: 'Contract Dispute - Late Delivery',
      description: 'Supplier failed to deliver goods within agreed timeframe causing financial losses.',
      status: 'in_progress',
      priority: 'high',
      type: 'contract_dispute',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
      complainant_id: user?.id || 'user1',
      respondent_id: 'user2',
      arbitrator_id: 'arbitrator1',
      evidence_urls: ['doc1.pdf', 'contract.pdf'],
      requested_remedy: 'Full refund plus damages',
      arbitrator_notes: 'Case under review. Awaiting respondent evidence.',
      resolution_deadline: '2024-02-15T00:00:00Z'
    },
    {
      id: '2',
      case_number: 'ARB-2024-002',
      title: 'Payment Disagreement',
      description: 'Dispute over payment terms and additional charges not agreed upon.',
      status: 'pending',
      priority: 'medium',
      type: 'payment_dispute',
      created_at: '2024-01-10T00:00:00Z',
      updated_at: '2024-01-10T00:00:00Z',
      complainant_id: user?.id || 'user1',
      respondent_id: 'user3',
      arbitrator_id: null,
      evidence_urls: ['invoice.pdf'],
      requested_remedy: 'Partial refund of disputed charges',
      arbitrator_notes: null,
      resolution_deadline: null
    }
  ];

  const handleCreateCase = () => {
    if (!newCase.title.trim() || !newCase.description.trim()) {
      return;
    }

    createCase({
      title: newCase.title,
      description: newCase.description,
      type: newCase.type,
      priority: newCase.priority as 'low' | 'medium' | 'high',
      status: 'pending',
      complainant_id: user?.id || '',
      respondent_id: newCase.respondent_id,
      group_id: groupId || null
    });

    setNewCase({
      title: '',
      description: '',
      type: '',
      priority: 'medium',
      respondent_id: '',
      requested_remedy: ''
    });
    setIsCreateModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filterCases = (cases: any[]) => {
    switch (activeTab) {
      case 'active':
        return cases.filter(c => c.status === 'in_progress');
      case 'pending':
        return cases.filter(c => c.status === 'pending');
      case 'resolved':
        return cases.filter(c => c.status === 'resolved');
      case 'my-cases':
        return cases.filter(c => c.complainant_id === user?.id);
      default:
        return cases;
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

  const filteredCases = filterCases(mockCases);

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dispute Resolution & Arbitration</h2>
          <p className="text-muted-foreground">Online dispute resolution system for fair conflict resolution</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              File New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>File New Arbitration Case</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="case-title">Case Title</Label>
                <Input
                  id="case-title"
                  placeholder="Brief description of the dispute"
                  value={newCase.title}
                  onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="case-description">Detailed Description</Label>
                <Textarea
                  id="case-description"
                  placeholder="Provide a comprehensive description of the dispute, including timeline and relevant details"
                  value={newCase.description}
                  onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={newCase.type} onValueChange={(value) => setNewCase(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract_dispute">Contract Dispute</SelectItem>
                      <SelectItem value="payment_dispute">Payment Dispute</SelectItem>
                      <SelectItem value="quality_issue">Quality Issue</SelectItem>
                      <SelectItem value="delivery_issue">Delivery Issue</SelectItem>
                      <SelectItem value="service_issue">Service Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Priority</Label>
                  <Select value={newCase.priority} onValueChange={(value) => setNewCase(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="respondent">Respondent (Other Party)</Label>
                <Input
                  id="respondent"
                  placeholder="Enter respondent's user ID or email"
                  value={newCase.respondent_id}
                  onChange={(e) => setNewCase(prev => ({ ...prev, respondent_id: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="remedy">Requested Remedy</Label>
                <Textarea
                  id="remedy"
                  placeholder="What resolution are you seeking? (e.g., refund, replacement, compensation)"
                  value={newCase.requested_remedy}
                  onChange={(e) => setNewCase(prev => ({ ...prev, requested_remedy: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>Evidence Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: PDF, DOC, images up to 10MB each
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCase} disabled={isCreating}>
                  {isCreating ? 'Filing...' : 'File Case'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Case Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Scale className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Cases</h3>
            <p className="text-3xl font-bold text-blue-600">{mockCases.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {mockCases.filter(c => c.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Gavel className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">
              {mockCases.filter(c => c.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">
              {mockCases.filter(c => c.status === 'resolved').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cases Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            All ({mockCases.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({mockCases.filter(c => c.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Active ({mockCases.filter(c => c.status === 'in_progress').length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resolved ({mockCases.filter(c => c.status === 'resolved').length})
          </TabsTrigger>
          <TabsTrigger value="my-cases" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            My Cases ({mockCases.filter(c => c.complainant_id === user?.id).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredCases.length === 0 ? (
            <Card className="p-8 text-center">
              <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Cases Found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === 'my-cases' 
                  ? "You haven't filed any cases yet."
                  : `No ${activeTab} cases at the moment.`
                }
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                File Your First Case
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{case_.title}</CardTitle>
                          <Badge className={getStatusColor(case_.status)}>
                            {case_.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          {getPriorityIcon(case_.priority)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="font-mono">{case_.case_number}</span>
                          <span>•</span>
                          <span>{case_.type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>Filed {new Date(case_.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="text-muted-foreground">{case_.description}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Case Progress */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Progress
                        </h4>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Case Filed</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Arbitrator Assigned</span>
                            {case_.arbitrator_id ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Evidence Review</span>
                            {case_.status === 'in_progress' ? (
                              <Clock className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Resolution</span>
                            {case_.status === 'resolved' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        
                        <Progress 
                          value={
                            case_.status === 'pending' ? 25 :
                            case_.status === 'in_progress' ? 60 :
                            case_.status === 'resolved' ? 100 : 0
                          } 
                          className="h-2" 
                        />
                      </div>

                      {/* Case Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Details
                        </h4>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Requested Remedy:</span>
                          </div>
                          <p className="text-foreground">{case_.requested_remedy}</p>
                          
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Evidence Files:</span>
                            <span>{case_.evidence_urls.length} files</span>
                          </div>
                          
                          {case_.resolution_deadline && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Deadline:</span>
                              <span>{new Date(case_.resolution_deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Gavel className="w-4 h-4" />
                          Actions
                        </h4>
                        
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Case Messages
                          </Button>
                          
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Download Evidence
                          </Button>
                          
                          {case_.complainant_id === user?.id && case_.status === 'pending' && (
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Upload className="w-4 h-4 mr-2" />
                              Add Evidence
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Arbitrator Notes */}
                    {case_.arbitrator_notes && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4" />
                          Arbitrator Notes
                        </h5>
                        <p className="text-sm text-muted-foreground">{case_.arbitrator_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedArbitrationSystem;
