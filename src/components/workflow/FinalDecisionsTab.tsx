
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Eye,
  Users,
  Vote,
  MessageSquare,
  Shield
} from 'lucide-react';

interface FinalDecision {
  id: string;
  title: string;
  description: string;
  proposal_id: string;
  decision_type: 'approved' | 'rejected' | 'pending';
  voting_results: {
    total_votes: number;
    approve_votes: number;
    reject_votes: number;
    abstain_votes: number;
  };
  discussion_summary?: string;
  mcp_notes: string;
  created_at: string;
  finalized_at?: string;
  implementation_status: 'pending' | 'in_progress' | 'completed';
}

interface FinalDecisionsTabProps {
  groupId: string;
  userRole: string;
}

const FinalDecisionsTab = ({ groupId, userRole }: FinalDecisionsTabProps) => {
  const [decisions, setDecisions] = useState<FinalDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<FinalDecision | null>(null);

  useEffect(() => {
    loadFinalDecisions();
  }, [groupId]);

  const loadFinalDecisions = async () => {
    try {
      // Mock data for demonstration
      const mockDecisions: FinalDecision[] = [
        {
          id: '1',
          title: 'اختيار مورد المعدات الطبية الجديد',
          description: 'قرار نهائي بشأن اختيار أفضل مورد للمعدات الطبية بعد التصويت والنقاش',
          proposal_id: 'prop-1',
          decision_type: 'approved',
          voting_results: {
            total_votes: 18,
            approve_votes: 14,
            reject_votes: 2,
            abstain_votes: 2
          },
          discussion_summary: 'تم النقاش المفصل حول جودة المنتجات وأسعار الموردين المختلفين',
          mcp_notes: 'تم جمع آراء الأعضاء وتحليل نتائج التصويت. القرار النهائي: الموافقة على الشركة الطبية المتقدمة',
          created_at: new Date().toISOString(),
          finalized_at: new Date().toISOString(),
          implementation_status: 'in_progress'
        },
        {
          id: '2',
          title: 'تعديل لوائح المجموعة الداخلية',
          description: 'قرار نهائي حول التعديلات المقترحة على اللوائح الداخلية للمجموعة',
          proposal_id: 'prop-2',
          decision_type: 'approved',
          voting_results: {
            total_votes: 20,
            approve_votes: 16,
            reject_votes: 3,
            abstain_votes: 1
          },
          mcp_notes: 'بعد مراجعة شاملة لآراء الأعضاء والتصويت، تم اعتماد التعديلات المقترحة',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          finalized_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          implementation_status: 'completed'
        },
        {
          id: '3',
          title: 'استراتيجية التسويق الجديدة',
          description: 'اقتراح حول تطوير استراتيجية تسويق جديدة للمجموعة',
          proposal_id: 'prop-3',
          decision_type: 'pending',
          voting_results: {
            total_votes: 15,
            approve_votes: 8,
            reject_votes: 7,
            abstain_votes: 0
          },
          mcp_notes: 'جاري جمع المزيد من الآراء والتوضيحات قبل اتخاذ القرار النهائي',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          implementation_status: 'pending'
        }
      ];

      setDecisions(mockDecisions);
    } catch (error) {
      console.error('Error loading final decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadge = (type: string) => {
    switch (type) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />معتمد</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />مرفوض</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />قيد المراجعة</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getImplementationBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">مكتمل التنفيذ</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-100 text-purple-800">قيد التنفيذ</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">في انتظار التنفيذ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">القرارات النهائية</h2>
          <p className="text-gray-600">القرارات المعتمدة من قبل MCP Agent بعد جمع آراء الأعضاء والتصويت</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>معالج بواسطة MCP Agent</span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">
              {decisions.filter(d => d.decision_type === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">قرارات معتمدة</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">
              {decisions.filter(d => d.decision_type === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">قيد المراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {decisions.reduce((sum, d) => sum + d.voting_results.total_votes, 0)}
            </p>
            <p className="text-sm text-gray-600">إجمالي الأصوات</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {decisions.filter(d => d.implementation_status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">مكتمل التنفيذ</p>
          </CardContent>
        </Card>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((decision) => (
          <Card key={decision.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{decision.title}</CardTitle>
                  <p className="text-gray-600 mb-3">{decision.description}</p>
                  
                  <div className="flex items-center gap-3 mb-3">
                    {getDecisionBadge(decision.decision_type)}
                    {getImplementationBadge(decision.implementation_status)}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDecision(decision)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  عرض التفاصيل
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Voting Results */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Vote className="w-4 h-4" />
                    نتائج التصويت
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">موافق</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ 
                              width: `${(decision.voting_results.approve_votes / decision.voting_results.total_votes) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{decision.voting_results.approve_votes}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">معارض</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ 
                              width: `${(decision.voting_results.reject_votes / decision.voting_results.total_votes) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{decision.voting_results.reject_votes}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ممتنع</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{ 
                              width: `${(decision.voting_results.abstain_votes / decision.voting_results.total_votes) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{decision.voting_results.abstain_votes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MCP Analysis */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    تحليل MCP Agent
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{decision.mcp_notes}</p>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <p>تاريخ الإنشاء: {new Date(decision.created_at).toLocaleDateString('ar')}</p>
                    {decision.finalized_at && (
                      <p>تاريخ الاعتماد: {new Date(decision.finalized_at).toLocaleDateString('ar')}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Decision Details Modal */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedDecision.title}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDecision(null)}
                >
                  إغلاق
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">الوصف التفصيلي</h4>
                <p className="text-gray-700">{selectedDecision.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">نتائج التصويت المفصلة</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span>الأصوات الموافقة</span>
                      <span className="font-bold text-green-600">
                        {selectedDecision.voting_results.approve_votes} 
                        ({((selectedDecision.voting_results.approve_votes / selectedDecision.voting_results.total_votes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                      <span>الأصوات المعارضة</span>
                      <span className="font-bold text-red-600">
                        {selectedDecision.voting_results.reject_votes}
                        ({((selectedDecision.voting_results.reject_votes / selectedDecision.voting_results.total_votes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>الأصوات الممتنعة</span>
                      <span className="font-bold text-gray-600">
                        {selectedDecision.voting_results.abstain_votes}
                        ({((selectedDecision.voting_results.abstain_votes / selectedDecision.voting_results.total_votes) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">تحليل وقرار MCP Agent</h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 mb-3">{selectedDecision.mcp_notes}</p>
                    
                    {selectedDecision.discussion_summary && (
                      <div className="mt-3">
                        <h5 className="font-medium text-sm mb-2">ملخص النقاشات:</h5>
                        <p className="text-sm text-gray-600">{selectedDecision.discussion_summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  {getDecisionBadge(selectedDecision.decision_type)}
                  {getImplementationBadge(selectedDecision.implementation_status)}
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>معرف الاقتراح الأصلي: {selectedDecision.proposal_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FinalDecisionsTab;
