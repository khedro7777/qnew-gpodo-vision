
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Crown, 
  Settings, 
  Users, 
  FileText, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GroupManagersTabProps {
  groupId: string;
}

const GroupManagersTab = ({ groupId }: GroupManagersTabProps) => {
  const [managerData, setManagerData] = useState({
    notifications: 3,
    pendingDecisions: 5,
    groupPerformance: 92,
    recentActivity: []
  });
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [decisionTitle, setDecisionTitle] = useState('');
  const [decisionDescription, setDecisionDescription] = useState('');

  const createDecision = async () => {
    if (!decisionTitle.trim()) {
      toast.error('يرجى إدخال عنوان القرار');
      return;
    }

    try {
      const { error } = await supabase
        .from('group_proposals')
        .insert({
          group_id: groupId,
          title: decisionTitle,
          description: decisionDescription,
          status: 'active',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success('تم إنشاء القرار بنجاح');
      setDecisionTitle('');
      setDecisionDescription('');
      setShowDecisionForm(false);
    } catch (error) {
      toast.error('فشل في إنشاء القرار');
    }
  };

  const contactMCP = async () => {
    toast.success('تم إرسال طلب للتواصل مع MCP');
  };

  return (
    <div className="space-y-6">
      {/* Manager Welcome */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-purple-900">مرحباً بك في لوحة المديرين</h2>
              <p className="text-purple-700">أنت مدير منتخب لهذه المجموعة - استخدم صلاحياتك بحكمة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold">إشعارات MCP</h3>
            <p className="text-2xl font-bold text-red-600">{managerData.notifications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">قرارات معلقة</h3>
            <p className="text-2xl font-bold text-yellow-600">{managerData.pendingDecisions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">أداء المجموعة</h3>
            <p className="text-2xl font-bold text-green-600">{managerData.groupPerformance}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">العروض المقبولة</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Manager Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              إنشاء قرار جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showDecisionForm ? (
              <div className="text-center py-8">
                <Button onClick={() => setShowDecisionForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  إنشاء قرار
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="عنوان القرار"
                  value={decisionTitle}
                  onChange={(e) => setDecisionTitle(e.target.value)}
                />
                <Textarea
                  placeholder="تفاصيل القرار"
                  value={decisionDescription}
                  onChange={(e) => setDecisionDescription(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button onClick={createDecision} className="flex-1">
                    نشر القرار
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDecisionForm(false)}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              التواصل مع MCP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">تواصل مع منسق المشروع الرئيسي (MCP) لأي استفسارات أو طلبات خاصة.</p>
              <Button onClick={contactMCP} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                إرسال رسالة للـ MCP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            العروض المعلقة للموافقة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, title: 'عرض أسعار للمعدات الطبية', company: 'شركة التقنيات الطبية', amount: '150,000 ريال' },
              { id: 2, title: 'خدمات النقل واللوجستيات', company: 'مجموعة النقل السريع', amount: '75,000 ريال' },
              { id: 3, title: 'استشارات قانونية', company: 'مكتب الاستشارات القانونية', amount: '25,000 ريال' }
            ].map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{offer.title}</h4>
                  <p className="text-sm text-gray-500">{offer.company}</p>
                  <p className="text-sm font-medium text-green-600">{offer.amount}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    مراجعة
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    موافقة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manager Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            تقارير الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">نشاط الأعضاء</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المشاركة في التصويت</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>مشاركة الرسائل</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between">
                  <span>حضور الاجتماعات</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">إنجازات المجموعة</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>المشاريع المكتملة</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>الوفورات المحققة</span>
                  <span className="font-medium">340,000 ريال</span>
                </div>
                <div className="flex justify-between">
                  <span>رضا الأعضاء</span>
                  <span className="font-medium">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupManagersTab;
