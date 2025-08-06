import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Vote, 
  MessageSquare, 
  Users, 
  Shield,
  Lightbulb,
  ArrowRight,
  Eye,
  Globe
} from 'lucide-react';
import MCPProposalCollector from './MCPProposalCollector';
import { useTranslation } from '@/hooks/useTranslation';

interface GroupDecisionsTabProps {
  groupId: string;
  userRole: string;
}

const GroupDecisionsTab = ({ groupId, userRole }: GroupDecisionsTabProps) => {
  const [activeTab, setActiveTab] = useState('proposals');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const { translate } = useTranslation();

  // Function to handle navigation to voting tab
  const navigateToVoting = (proposalId: string) => {
    // In a real app, this would use React Router or similar navigation
    console.log(`Navigating to voting for proposal: ${proposalId}`);
    // For demo purposes, we'll switch to voting tab
    const event = new CustomEvent('switchTab', { detail: { tab: 'voting', proposalId } });
    window.dispatchEvent(event);
  };

  // Function to show proposal details
  const showProposalDetails = (proposal: any) => {
    // In a real app, this would open a modal or navigate to details page
    console.log('Showing proposal details:', proposal);
    alert(`تفاصيل المقترح: ${proposal.title}\n\nالوصف: ${proposal.description}\n\nالتوصية: ${proposal.recommendation || 'لم يتم تحديد توصية بعد'}`);
  };

  // Translation function
  const handleTranslation = async () => {
    setIsTranslating(true);
    try {
      const textsToTranslate = {
        'header_title': 'إدارة المقترحات والاقتراحات',
        'header_desc': 'نظام شامل لإدارة اقتراحات الأعضاء والمقترحات',
        'mcp_managed': 'مُدار بواسطة MCP Agent',
        'mcp_title': 'نظام MCP Agent للمقترحات',
        'mcp_desc': 'MCP Agent يجمع الاقتراحات، يحللها، ويرسلها للتصويت أو النقاش',
        'members_send': 'الأعضاء يرسلون اقتراحات',
        'mcp_collects': 'MCP يجمع ويحلل',
        'final_decision': 'يخرج المقترح النهائي',
        'collect_proposals': 'جمع الاقتراحات',
        'active_proposals': 'المقترحات النشطة',
        'mcp_analytics': 'تحليلات MCP'
      };

      const translated: Record<string, string> = {};
      for (const [key, text] of Object.entries(textsToTranslate)) {
        try {
          translated[key] = await translate(text, 'EN');
        } catch (error) {
          console.error(`Translation failed for ${key}:`, error);
          translated[key] = text; // Fallback to original text
        }
      }
      setTranslatedTexts(translated);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const getDisplayText = (key: string, fallback: string) => {
    return translatedTexts[key] || fallback;
  };

  // Mock data for active proposals (updated terminology)
  const activeProposals = [
    {
      id: '1',
      title: 'اختيار مورد المعدات الطبية',
      description: 'مقترح حول اختيار أفضل مورد للمعدات الطبية',
      recommendation: 'ينصح MCP Agent بالموافقة على هذا المقترح بناءً على التحليل المالي',
      status: 'voting',
      votes: { total: 15, approve: 10, reject: 3, abstain: 2 },
      deadline: '2024-01-20',
      mcp_managed: true
    },
    {
      id: '2',
      title: 'تحديث اللوائح الداخلية',
      description: 'اقتراح تحديث بعض اللوائح الداخلية للمجموعة',
      recommendation: 'يحتاج هذا المقترح إلى مزيد من النقاش قبل اتخاذ قرار نهائي',
      status: 'discussion',
      comments: 8,
      participants: 12,
      mcp_managed: true
    }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              {getDisplayText('header_title', 'إدارة المقترحات والاقتراحات')}
            </h2>
            <Button
              onClick={handleTranslation}
              size="sm"
              variant="outline"
              disabled={isTranslating}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {isTranslating ? 'جاري الترجمة...' : 'ترجمة'}
            </Button>
          </div>
          <p className="text-gray-600">
            {getDisplayText('header_desc', 'نظام شامل لإدارة اقتراحات الأعضاء والمقترحات')}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Shield className="w-4 h-4" />
          <span>{getDisplayText('mcp_managed', 'مُدار بواسطة MCP Agent')}</span>
        </div>
      </div>

      {/* MCP Process Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-bold text-lg">
                {getDisplayText('mcp_title', 'نظام MCP Agent للمقترحات')}
              </h3>
              <p className="text-gray-600">
                {getDisplayText('mcp_desc', 'MCP Agent يجمع الاقتراحات، يحللها، ويرسلها للتصويت أو النقاش')}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">{getDisplayText('members_send', 'الأعضاء يرسلون اقتراحات')}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm">{getDisplayText('mcp_collects', 'MCP يجمع ويحلل')}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
            
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-green-500" />
              <span className="text-sm">{getDisplayText('final_decision', 'يخرج المقترح النهائي')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different aspects */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>{getDisplayText('collect_proposals', 'جمع الاقتراحات')}</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            <span>{getDisplayText('active_proposals', 'المقترحات النشطة')}</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>{getDisplayText('mcp_analytics', 'تحليلات MCP')}</span>
          </TabsTrigger>
        </TabsList>

        {/* Proposals Collection Tab */}
        <TabsContent value="proposals">
          <MCPProposalCollector groupId={groupId} userRole={userRole} />
        </TabsContent>

        {/* Active Proposals Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المقترحات قيد المعالجة</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {activeProposals.length} مقترح نشط
            </Badge>
          </div>

          {activeProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{proposal.description}</p>
                    {proposal.recommendation && (
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-purple-800">توصية MCP Agent</span>
                        </div>
                        <p className="text-sm text-purple-700">{proposal.recommendation}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.mcp_managed && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" />
                        MCP مُدار
                      </Badge>
                    )}
                    <Badge className={proposal.status === 'voting' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {proposal.status === 'voting' ? 'في التصويت' : 'في النقاش'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {proposal.status === 'voting' && proposal.votes && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">نتائج التصويت الحالية</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">موافق</span>
                          <span className="text-green-600 font-medium">{proposal.votes.approve}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">معارض</span>
                          <span className="text-red-600 font-medium">{proposal.votes.reject}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ممتنع</span>
                          <span className="text-gray-600 font-medium">{proposal.votes.abstain}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">معلومات التصويت</h4>
                      <p className="text-sm text-gray-600">إجمالي الأصوات: {proposal.votes.total}</p>
                      <p className="text-sm text-gray-600">تاريخ الانتهاء: {proposal.deadline}</p>
                    </div>
                  </div>
                )}

                {proposal.status === 'discussion' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">حالة النقاش</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{proposal.comments} تعليق</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{proposal.participants} مشارك</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">إجراءات MCP</h4>
                      <p className="text-sm text-gray-600">جاري جمع الآراء والتحليل</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => showProposalDetails(proposal)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                  {proposal.status === 'voting' && (
                    <Button 
                      size="sm"
                      onClick={() => navigateToVoting(proposal.id)}
                    >
                      <Vote className="w-4 h-4 mr-1" />
                      الذهاب للتصويت
                    </Button>
                  )}
                  {proposal.status === 'discussion' && (
                    <Button size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      المشاركة في النقاش
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* MCP Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Lightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-gray-600">اقتراحات تم جمعها</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Vote className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-600">أُرسلت للتصويت</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">4</p>
                <p className="text-sm text-gray-600">أُرسلت للنقاش</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                تحليل أداء MCP Agent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">معدل المعالجة</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">85% من الاقتراحات تتم معالجتها خلال 24 ساعة</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">دقة التصنيف</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">92% دقة في تحديد ما إذا كان الاقتراح يحتاج تصويت أم نقاش</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">رضا الأعضاء</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">89% من الأعضاء راضون عن عملية معالجة MCP للاقتراحات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDecisionsTab;
