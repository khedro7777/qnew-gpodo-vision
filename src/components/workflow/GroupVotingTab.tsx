
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Vote, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

interface VoteProposal {
  id: string;
  title: string;
  description: string;
  status: string;
  end_date: string;
  options: VoteOption[];
  total_votes: number;
  user_voted: boolean;
}

interface GroupVotingTabProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const GroupVotingTab = ({ groupId, userRole, isManager }: GroupVotingTabProps) => {
  const [proposals, setProposals] = useState<VoteProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [groupId]);

  const loadProposals = async () => {
    try {
      // Load mock data for demo
      const mockProposals: VoteProposal[] = [
        {
          id: '1',
          title: 'اختيار مورد المعدات الطبية',
          description: 'التصويت على أفضل مورد للمعدات الطبية للمجموعة',
          status: 'active',
          end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          options: [
            { id: '1a', text: 'الشركة الطبية المتقدمة', votes: 12 },
            { id: '1b', text: 'مجموعة الرعاية الصحية', votes: 8 },
            { id: '1c', text: 'التقنيات الطبية الحديثة', votes: 15 }
          ],
          total_votes: 35,
          user_voted: false
        },
        {
          id: '2',
          title: 'تعديل لوائح المجموعة',
          description: 'اقتراح تعديل بعض القوانين الداخلية للمجموعة',
          status: 'completed',
          end_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          options: [
            { id: '2a', text: 'موافق على التعديل', votes: 28 },
            { id: '2b', text: 'غير موافق', votes: 7 }
          ],
          total_votes: 35,
          user_voted: true
        }
      ];

      setProposals(mockProposals);
    } catch (error) {
      console.error('Load proposals error:', error);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (proposalId: string, optionId: string) => {
    try {
      // Update the proposal locally for demo
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          return {
            ...proposal,
            user_voted: true,
            options: proposal.options.map(option =>
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            total_votes: proposal.total_votes + 1
          };
        }
        return proposal;
      }));

      toast.success('تم تسجيل صوتك بنجاح');
    } catch (error) {
      toast.error('فشل في تسجيل الصوت');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
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
          <h2 className="text-2xl font-bold">القرارات والتصويت</h2>
          <p className="text-gray-600">شارك في اتخاذ قرارات المجموعة</p>
        </div>
        {isManager && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء تصويت جديد
          </Button>
        )}
      </div>

      {/* Active Proposals */}
      <div className="grid gap-6">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{proposal.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{proposal.description}</p>
                </div>
                {getStatusBadge(proposal.status)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isExpired(proposal.end_date) 
                      ? `انتهى في ${new Date(proposal.end_date).toLocaleDateString('ar')}`
                      : `ينتهي في ${new Date(proposal.end_date).toLocaleDateString('ar')}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{proposal.total_votes} صوت</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {proposal.options.map((option) => {
                  const percentage = proposal.total_votes > 0 
                    ? (option.votes / proposal.total_votes) * 100 
                    : 0;
                  
                  return (
                    <div key={option.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-gray-500">
                          {option.votes} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Progress value={percentage} className="flex-1" />
                        {!proposal.user_voted && !isExpired(proposal.end_date) && proposal.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => castVote(proposal.id, option.id)}
                          >
                            صوت
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {proposal.user_voted && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>لقد صوت بالفعل في هذا الاقتراح</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Vote className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">التصويتات النشطة</h3>
            <p className="text-2xl font-bold text-blue-600">
              {proposals.filter(p => p.status === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">القرارات المكتملة</h3>
            <p className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === 'completed').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">معدل المشاركة</h3>
            <p className="text-2xl font-bold text-purple-600">89%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupVotingTab;
