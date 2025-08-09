
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Upload,
  Download,
  Gavel,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface ArbitrationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  claimant: string;
  respondent: string;
  disputeAmount: number;
  currency: string;
  status: 'pending' | 'in_progress' | 'evidence_review' | 'hearing' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  hearingDate?: string;
  arbitrator?: string;
  documents: Document[];
  timeline: TimelineEvent[];
  resolution?: Resolution;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

interface TimelineEvent {
  id: string;
  type: 'case_filed' | 'response_submitted' | 'evidence_uploaded' | 'hearing_scheduled' | 'decision_rendered';
  description: string;
  date: string;
  actor: string;
}

interface Resolution {
  decision: string;
  award?: number;
  costs: number;
  enforceable: boolean;
  appealDeadline?: string;
}

const ArbitrationSystem = () => {
  const [cases, setCases] = useState<ArbitrationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showNewCase, setShowNewCase] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    respondent: '',
    disputeAmount: '',
    currency: 'USD',
    priority: 'medium' as const
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    // Mock data with enhanced arbitration features
    const mockCases: ArbitrationCase[] = [
      {
        id: '1',
        caseNumber: 'ARB-2025-001',
        title: 'Supply Contract Breach - Medical Equipment',
        description: 'Dispute regarding delivery delays and quality issues with medical equipment order worth $50,000',
        claimant: 'Healthcare Group LLC',
        respondent: 'Global Medical Supplies Inc.',
        disputeAmount: 50000,
        currency: 'USD',
        status: 'in_progress',
        priority: 'high',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        hearingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        arbitrator: 'Dr. John Smith, Commercial Arbitrator',
        documents: [
          {
            id: '1-1',
            name: 'Purchase Contract.pdf',
            type: 'pdf',
            size: 1024000,
            uploadedBy: 'Legal Team',
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            url: '/documents/contract.pdf'
          }
        ],
        timeline: [
          {
            id: '1-t1',
            type: 'case_filed',
            description: 'Arbitration case filed',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'Healthcare Group LLC'
          },
          {
            id: '1-t2',
            type: 'response_submitted',
            description: 'Response to claim submitted',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            actor: 'Global Medical Supplies Inc.'
          }
        ]
      }
    ];

    setCases(mockCases);
  };

  const createCase = async () => {
    try {
      const caseData: ArbitrationCase = {
        id: Date.now().toString(),
        caseNumber: `ARB-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`,
        title: newCase.title,
        description: newCase.description,
        claimant: 'Current User',
        respondent: newCase.respondent,
        disputeAmount: parseFloat(newCase.disputeAmount),
        currency: newCase.currency,
        status: 'pending',
        priority: newCase.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [],
        timeline: [
          {
            id: `${Date.now()}-t1`,
            type: 'case_filed',
            description: 'Arbitration case filed',
            date: new Date().toISOString(),
            actor: 'Current User'
          }
        ]
      };

      setCases(prev => [caseData, ...prev]);
      setShowNewCase(false);
      setNewCase({
        title: '',
        description: '',
        respondent: '',
        disputeAmount: '',
        currency: 'USD',
        priority: 'medium'
      });

      toast.success('Arbitration case created successfully');
    } catch (error) {
      toast.error('Failed to create arbitration case');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'evidence_review': return 'bg-purple-100 text-purple-800';
      case 'hearing': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'in_progress': return 40;
      case 'evidence_review': return 60;
      case 'hearing': return 80;
      case 'closed': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Arbitration & Dispute Resolution</h2>
          <p className="text-gray-600">Manage legal disputes and arbitration cases</p>
        </div>
        <Button onClick={() => setShowNewCase(true)}>
          <Plus className="w-4 h-4 mr-2" />
          File New Case
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Scale className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Active Cases</h3>
            <p className="text-2xl font-bold text-blue-600">
              {cases.filter(c => !['closed'].includes(c.status)).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Resolved Cases</h3>
            <p className="text-2xl font-bold text-green-600">
              {cases.filter(c => c.status === 'closed').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Dispute Value</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${cases.reduce((sum, c) => sum + c.disputeAmount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold">Avg. Resolution Time</h3>
            <p className="text-2xl font-bold text-orange-600">45 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((arbitrationCase) => (
          <Card key={arbitrationCase.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{arbitrationCase.title}</CardTitle>
                    <Badge className={getStatusColor(arbitrationCase.status)}>
                      {arbitrationCase.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(arbitrationCase.priority)}>
                      {arbitrationCase.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Case #:</span> {arbitrationCase.caseNumber}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {arbitrationCase.currency} {arbitrationCase.disputeAmount.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Respondent:</span> {arbitrationCase.respondent}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(arbitrationCase.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 mb-4">{arbitrationCase.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Case Progress</span>
                  <span className="text-sm text-gray-500">
                    {getProgressPercentage(arbitrationCase.status)}%
                  </span>
                </div>
                <Progress value={getProgressPercentage(arbitrationCase.status)} className="h-2" />
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {arbitrationCase.arbitrator && (
                  <div className="flex items-center gap-2 text-sm">
                    <Gavel className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Arbitrator:</span>
                    <span>{arbitrationCase.arbitrator}</span>
                  </div>
                )}
                
                {arbitrationCase.hearingDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Hearing:</span>
                    <span>{new Date(arbitrationCase.hearingDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Documents:</span>
                  <span>{arbitrationCase.documents.length}</span>
                </div>
              </div>

              {/* Recent Timeline Event */}
              {arbitrationCase.timeline.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Latest Update</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {arbitrationCase.timeline[arbitrationCase.timeline.length - 1].description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(arbitrationCase.timeline[arbitrationCase.timeline.length - 1].date).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Case File
                </Button>
                {arbitrationCase.status !== 'closed' && (
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Schedule Conference
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Case Modal */}
      {showNewCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">File New Arbitration Case</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Case Title</label>
                <Input
                  value={newCase.title}
                  onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the dispute"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Detailed Description</label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide full details of the dispute, including timeline and relevant facts"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Respondent</label>
                  <Input
                    value={newCase.respondent}
                    onChange={(e) => setNewCase(prev => ({ ...prev, respondent: e.target.value }))}
                    placeholder="Name of the other party"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select 
                    value={newCase.priority}
                    onChange={(e) => setNewCase(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dispute Amount</label>
                  <Input
                    type="number"
                    value={newCase.disputeAmount}
                    onChange={(e) => setNewCase(prev => ({ ...prev, disputeAmount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select 
                    value={newCase.currency}
                    onChange={(e) => setNewCase(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AED">AED</option>
                    <option value="SAR">SAR</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewCase(false)}>
                  Cancel
                </Button>
                <Button onClick={createCase}>
                  File Case
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArbitrationSystem;
