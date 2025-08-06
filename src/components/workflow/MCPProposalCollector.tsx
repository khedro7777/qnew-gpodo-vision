import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  FileText, 
  Send, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  Vote,
  User,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface MCPProposalCollectorProps {
  groupId: string;
}

interface ProposalSubmission {
  id: string;
  member_id: string;
  member_name: string;
  title: string;
  description: string;
  category: string;
  status: 'collected' | 'sent_to_voting' | 'sent_to_discussion' | 'final_decision';
  mcp_notes: string;
  submitted_at: string;
}

const MCPProposalCollector = ({ groupId }: MCPProposalCollectorProps) => {
  const { t, isRTL } = useTranslation();
  
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>([
    {
      id: '1',
      member_id: 'member-1',
      member_name: 'Ahmed Al-Saudi',
      title: 'Equipment Bulk Purchase Program',
      description: 'Propose a structured program for bulk purchasing medical equipment to achieve 25-30% cost savings',
      category: 'purchasing',
      status: 'collected',
      mcp_notes: 'Excellent proposal with clear financial benefits. Recommend proceeding to voting.',
      submitted_at: '2024-01-15T10:00:00Z'
    }
  ]);

  const [processing, setProcessing] = useState(false);

  const processMCPAnalysis = async (submissionId: string) => {
    setProcessing(true);
    
    // Simulate MCP processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? {
            ...sub,
            status: 'sent_to_voting' as const,
            mcp_notes: 'MCP has analyzed this proposal and recommends proceeding to group voting. The proposal shows strong merit and alignment with group objectives.'
          }
        : sub
    ));
    
    setProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-blue-100 text-blue-800';
      case 'sent_to_voting': return 'bg-green-100 text-green-800';
      case 'sent_to_discussion': return 'bg-yellow-100 text-yellow-800';
      case 'final_decision': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collected': return Clock;
      case 'sent_to_voting': return Vote;
      case 'sent_to_discussion': return MessageSquare;
      case 'final_decision': return CheckCircle;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* MCP Assistant Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t('MCP Assistant')}</h3>
              <p className="text-white/80">Automated Proposal Collection & Analysis</p>
            </div>
          </div>
          <p className="text-white/90 text-sm">
            MCP Assistant collects member proposals, analyzes them for feasibility and impact, 
            then routes them to appropriate workflows (voting or discussion) before making final decisions.
          </p>
        </CardContent>
      </Card>

      {/* Collected Proposals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Collected Member Proposals</h3>
        
        {submissions.map((submission) => {
          const StatusIcon = getStatusIcon(submission.status);
          return (
            <Card key={submission.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {submission.title}
                      </h4>
                      <Badge className={getStatusColor(submission.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {t(submission.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{submission.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{submission.member_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* MCP Analysis */}
                    {submission.mcp_notes && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Bot className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-purple-900 font-medium mb-1">{t('MCP Recommendation')}</p>
                            <p className="text-purple-800 text-sm">{submission.mcp_notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {submission.status === 'collected' && (
                    <Button 
                      size="sm"
                      onClick={() => processMCPAnalysis(submission.id)}
                      disabled={processing}
                    >
                      {processing ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-1" />
                      )}
                      {t('Submit to MCP')}
                    </Button>
                  )}
                  
                  {submission.status === 'sent_to_voting' && (
                    <Button size="sm" variant="outline">
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

      {submissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No proposals collected yet
            </h3>
            <p className="text-gray-600">
              MCP Assistant is waiting for member proposals to analyze and process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPProposalCollector;
