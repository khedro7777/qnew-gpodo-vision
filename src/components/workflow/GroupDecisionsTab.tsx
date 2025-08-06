
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
  Eye
} from 'lucide-react';
import MCPProposalCollector from './MCPProposalCollector';

interface GroupDecisionsTabProps {
  groupId: string;
  userRole: string;
}

const GroupDecisionsTab = ({ groupId, userRole }: GroupDecisionsTabProps) => {
  const [activeTab, setActiveTab] = useState('proposals');

  // Mock data for active decisions
  const activeDecisions = [
    {
      id: '1',
      title: 'اختيار مورد المعدات الطبية',
      description: 'قرار حول اختيار أفضل مورد للمعدات الطبية',
      status: 'voting',
      votes: { total: 15, approve: 10, reject: 3, abstain: 2 },
      deadline: '2024-01-20',
      mcp_managed: true
    },
    {
      id: '2',
      title: 'تحديث اللوائح الداخلية',
      description: 'اقتراح تحديث بعض اللوائح الداخلية للمجموعة',
      status: 'discussion',
      comments: 8,
      participants: 12,
      mcp_managed: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة القرارات والاقتراحات</h2>
          <p className="text-gray-600">نظام شامل لإدارة اقتراحات الأعضاء والقرارات</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <Shield className="w-4 h-4" />
          <span>مُدار بواسطة MCP Agent</span>
        </div>
      </div>

      {/* MCP Process Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-bold text-lg">نظام MCP Agent للقرارات</h3>
              <p className="text-gray-600">MCP Agent يجمع الاقتراحات، يحللها، ويرسلها للتصويت أو النقاش</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">الأعضاء يرسلون اقتراحات</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm">MCP يجمع ويحلل</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
            
            <div className="flex items-center gap-2">
              <Vote className="w-5 h-5 text-green-500" />
              <span className="text-sm">يخرج القرار النهائي</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different aspects */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="proposals" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>جمع الاقتراحات</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Vote className="w-4 h-4" />
            <span>القرارات النشطة</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>تحليلات MCP</span>
          </TabsTrigger>
        </TabsList>

        {/* Proposals Collection Tab */}
        <TabsContent value="proposals">
          <MCPProposalCollector groupId={groupId} userRole={userRole} />
        </TabsContent>

        {/* Active Decisions Tab */}
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">القرارات قيد المعالجة</h3>
            <Badge className="bg-blue-100 text-blue-800">
              {activeDecisions.length} قرار نشط
            </Badge>
          </div>

          {activeDecisions.map((decision) => (
            <Card key={decision.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{decision.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{decision.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {decision.mcp_managed && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" />
                        MCP مُدار
                      </Badge>
                    )}
                    <Badge className={decision.status === 'voting' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                      {decision.status === 'voting' ? 'في التصويت' : 'في النقاش'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {decision.status === 'voting' && decision.votes && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">نتائج التصويت الحالية</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">موافق</span>
                          <span className="text-green-600 font-medium">{decision.votes.approve}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">معارض</span>
                          <span className="text-red-600 font-medium">{decision.votes.reject}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">ممتنع</span>
                          <span className="text-gray-600 font-medium">{decision.votes.abstain}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">معلومات التصويت</h4>
                      <p className="text-sm text-gray-600">إجمالي الأصوات: {decision.votes.total}</p>
                      <p className="text-sm text-gray-600">تاريخ الانتهاء: {decision.deadline}</p>
                    </div>
                  </div>
                )}

                {decision.status === 'discussion' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">حالة النقاش</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{decision.comments} تعليق</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{decision.participants} مشارك</span>
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
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    عرض التفاصيل
                  </Button>
                  {decision.status === 'voting' && (
                    <Button size="sm">
                      <Vote className="w-4 h-4 mr-1" />
                      الذهاب للتصويت
                    </Button>
                  )}
                  {decision.status === 'discussion' && (
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
