import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Send, 
  Users, 
  MessageSquare, 
  Vote, 
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface ProposalSubmission {
  id: string;
  member_id: string;
  member_name: string;
  title: string;
  description: string;
  category: string;
  submitted_at: string;
  status: 'collected' | 'sent_to_voting' | 'sent_to_discussion' | 'final_decision';
  mcp_notes?: string;
}

interface MCPProposalCollectorProps {
  groupId: string;
  userRole: string;
}

const MCPProposalCollector = ({ groupId, userRole }: MCPProposalCollectorProps) => {
  const [proposals, setProposals] = useState<ProposalSubmission[]>([
    {
      id: '1',
      member_id: 'member-1',
      member_name: 'أحمد محمد',
      title: 'اقتراح تحسين عملية الشراء',
      description: 'اقترح تطوير نظام جديد لتحسين عملية الشراء الجماعي وتوفير المزيد من الخيارات',
      category: 'operations',
      submitted_at: new Date().toISOString(),
      status: 'collected',
      mcp_notes: 'تم استلام الاقتراح وجاري المراجعة الأولية'
    },
    {
      id: '2',
      member_id: 'member-2',
      member_name: 'فاطمة أحمد',
      title: 'اقتراح برنامج تدريبي',
      description: 'اقتراح تنظيم برنامج تدريبي للأعضاء الجدد لتعريفهم بآلية عمل المجموعة',
      category: 'training',
      submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'sent_to_discussion',
      mcp_notes: 'تم إرسال الاقتراح للنقاش في قاعة المجموعة'
    }
  ]);

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const submitProposal = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const proposal: ProposalSubmission = {
      id: Date.now().toString(),
      member_id: 'current-user',
      member_name: 'المستخدم الحالي',
      title: newProposal.title,
      description: newProposal.description,
      category: newProposal.category,
      submitted_at: new Date().toISOString(),
      status: 'collected',
      mcp_notes: 'تم استلام الاقتراح من العضو وجاري المراجعة بواسطة MCP Agent'
    };

    setProposals([proposal, ...proposals]);
    setNewProposal({ title: '', description: '', category: 'general' });
    setShowSubmissionForm(false);
    
    toast.success('تم إرسال الاقتراح بنجاح! سيقوم MCP Agent بمراجعته');
  };

  const mcpProcessProposal = (proposalId: string, action: 'sent_to_voting' | 'sent_to_discussion') => {
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: action,
          mcp_notes: action === 'sent_to_voting' 
            ? 'تم إرسال الاقتراح للتصويت بناءً على تحليل MCP Agent'
            : 'تم إرسال الاقتراح للنقاش في قاعة المجموعة لجمع المزيد من الآراء'
        };
      }
      return p;
    }));

    const actionText = action === 'sent_to_voting' ? 'التصويت' : 'النقاش';
    toast.success(`تم إرسال الاقتراح إلى ${actionText} بواسطة MCP Agent`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />تم الجمع</Badge>;
      case 'sent_to_voting':
        return <Badge className="bg-green-100 text-green-800"><Vote className="w-3 h-3 mr-1" />في التصويت</Badge>;
      case 'sent_to_discussion':
        return <Badge className="bg-purple-100 text-purple-800"><MessageSquare className="w-3 h-3 mr-1" />في النقاش</Badge>;
      case 'final_decision':
        return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="w-3 h-3 mr-1" />قرار نهائي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryText = (category: string) => {
    const categories = {
      'general': 'عام',
      'operations': 'العمليات',
      'training': 'التدريب',
      'finance': 'المالية',
      'governance': 'الحوكمة'
    };
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">جامع اقتراحات الأعضاء</h2>
          <p className="text-gray-600">يقوم MCP Agent بجمع الاقتراحات وإرسالها للتصويت أو النقاش</p>
        </div>
        <Button onClick={() => setShowSubmissionForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          اقتراح جديد
        </Button>
      </div>

      {/* MCP Process Flow */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            عملية MCP Agent لمعالجة الاقتراحات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">1. جمع الاقتراحات</h4>
              <p className="text-sm text-gray-600">من الأعضاء</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">2. مراجعة MCP</h4>
              <p className="text-sm text-gray-600">تحليل وتصنيف</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">3. إرسال للتصويت</h4>
              <p className="text-sm text-gray-600">أو النقاش</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold">4. القرار النهائي</h4>
              <p className="text-sm text-gray-600">بناءً على النتائج</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>بواسطة: {proposal.member_name}</span>
                    <span>التصنيف: {getCategoryText(proposal.category)}</span>
                    <span>تاريخ الإرسال: {new Date(proposal.submitted_at).toLocaleDateString('ar')}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 mb-4">{proposal.description}</p>
              
              {proposal.mcp_notes && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-blue-800">ملاحظات MCP Agent</span>
                  </div>
                  <p className="text-sm text-blue-700">{proposal.mcp_notes}</p>
                </div>
              )}

              {/* MCP Actions - Only show if status is 'collected' and user has MCP privileges */}
              {proposal.status === 'collected' && userRole === 'admin' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm"
                    onClick={() => mcpProcessProposal(proposal.id, 'sent_to_voting')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Vote className="w-4 h-4 mr-1" />
                    إرسال للتصويت
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => mcpProcessProposal(proposal.id, 'sent_to_discussion')}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    إرسال للنقاش
                  </Button>
                </div>
              )}

              {/* Status Actions */}
              {proposal.status === 'sent_to_voting' && (
                <div className="flex items-center gap-2 pt-4 border-t text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم إرسال هذا الاقتراح للتصويت في تبويب "التصويت"</span>
                </div>
              )}

              {proposal.status === 'sent_to_discussion' && (
                <div className="flex items-center gap-2 pt-4 border-t text-sm text-purple-600">
                  <MessageSquare className="w-4 h-4" />
                  <span>جاري النقاش حول هذا الاقتراح في قاعة المجموعة</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Proposal Submission Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>إرسال اقتراح جديد</CardTitle>
              <p className="text-sm text-gray-600">
                سيقوم MCP Agent بمراجعة اقتراحك وإرساله للتصويت أو النقاش حسب المناسب
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">عنوان الاقتراح</label>
                <Input
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  placeholder="اكتب عنوان مختصر للاقتراح"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">تصنيف الاقتراح</label>
                <select
                  value={newProposal.category}
                  onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="general">عام</option>
                  <option value="operations">العمليات</option>
                  <option value="training">التدريب</option>
                  <option value="finance">المالية</option>
                  <option value="governance">الحوكمة</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">وصف تفصيلي للاقتراح</label>
                <Textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  placeholder="اشرح اقتراحك بالتفصيل وفوائده للمجموعة"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={submitProposal} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  إرسال الاقتراح
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSubmissionForm(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MCPProposalCollector;
