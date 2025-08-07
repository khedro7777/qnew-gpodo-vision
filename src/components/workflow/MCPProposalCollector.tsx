
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  FileText, 
  Send, 
  Clock, 
  CheckCircle, 
  MessageSquare,
  Vote,
  User,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface MCPProposalCollectorProps {
  groupId: string;
  group?: any;
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

const MCPProposalCollector = ({ groupId, group }: MCPProposalCollectorProps) => {
  const { t, isRTL } = useTranslation();
  
  const [submissions, setSubmissions] = useState<ProposalSubmission[]>([
    {
      id: '1',
      member_id: 'member-1',
      member_name: 'Ahmed Al-Saudi',
      title: 'Equipment Bulk Purchase Program',
      description: 'Propose a structured program for bulk purchasing medical equipment to achieve 25-30% cost savings across all group members through coordinated procurement.',
      category: 'purchasing',
      status: 'collected',
      mcp_notes: '',
      submitted_at: '2024-01-15T10:00:00Z'
    }
  ]);

  const [processing, setProcessing] = useState(false);

  const processMCPAnalysis = async (submissionId: string) => {
    setProcessing(true);
    
    try {
      const submission = submissions.find(s => s.id === submissionId);
      if (!submission) {
        throw new Error('Proposal not found');
      }

      console.log('Analyzing proposal with DeepSeek MCP...');
      
      const { data, error } = await supabase.functions.invoke('deepseek-mcp', {
        body: {
          action: 'analyze_proposal',
          groupData: group,
          content: `Title: ${submission.title}\n\nDescription: ${submission.description}\n\nCategory: ${submission.category}`
        }
      });

      if (error) {
        console.error('DeepSeek MCP error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze proposal');
      }
      
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? {
              ...sub,
              status: 'sent_to_voting' as const,
              mcp_notes: data.content
            }
          : sub
      ));
      
      toast.success('Proposal analyzed successfully by DeepSeek R1');
    } catch (error) {
      console.error('MCP analysis error:', error);
      toast.error('Failed to analyze proposal. Please check your DeepSeek API configuration.');
    } finally {
      setProcessing(false);
    }
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
      {/* Enhanced MCP Assistant Header */}
      <Card className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {t('MCP Assistant')}
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </h3>
              <p className="text-white/80">Powered by DeepSeek R1 - Intelligent Proposal Analysis</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-white/90 text-sm">
              ✨ Advanced AI reasoning for comprehensive proposal evaluation, feasibility analysis, and strategic recommendations
            </p>
          </div>
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

                    {/* Enhanced MCP Analysis with DeepSeek */}
                    {submission.mcp_notes && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-1">
                            <Bot className="w-5 h-5 text-purple-600" />
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-purple-900 font-medium mb-1 flex items-center gap-2">
                              {t('DeepSeek R1 Analysis')}
                            </p>
                            <div className="text-purple-800 text-sm whitespace-pre-wrap leading-relaxed">
                              {submission.mcp_notes}
                            </div>
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
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {processing ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-1" />
                      )}
                      {t('Analyze with DeepSeek')}
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
            <div className="flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-gray-400 mr-2" />
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No proposals collected yet
            </h3>
            <p className="text-gray-600">
              MCP Assistant powered by DeepSeek R1 is ready to analyze member proposals with advanced reasoning capabilities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPProposalCollector;
