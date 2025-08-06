
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  Send, 
  FileText, 
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

interface GroupDecisionsTabProps {
  groupId: string;
  userRole: string;
}

const GroupDecisionsTab = ({ groupId, userRole }: GroupDecisionsTabProps) => {
  const incomingDecisions = [
    {
      id: '1',
      title: 'موافقة على العرض المالي',
      from: 'إدارة المجموعة',
      date: '2024-01-15',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2', 
      title: 'تحديث شروط التعاون',
      from: 'اللجنة القانونية',
      date: '2024-01-14',
      status: 'read',
      priority: 'medium'
    }
  ];

  const outgoingDecisions = [
    {
      id: '1',
      title: 'طلب تعديل الأسعار',
      to: 'المورد الرئيسي',
      date: '2024-01-13',
      status: 'sent',
      response: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">مُوافق عليه</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">مُرسل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Incoming Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            الواردات - القرارات المُستلمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomingDecisions.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{decision.title}</h4>
                      {getStatusBadge(decision.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>من: {decision.from}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(decision.date).toLocaleDateString('ar')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      عرض
                    </Button>
                    {decision.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          موافق
                        </Button>
                        <Button variant="outline" size="sm">
                          رفض
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outgoing Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            الصادرات - القرارات المُرسلة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {outgoingDecisions.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{decision.title}</h4>
                      {getStatusBadge(decision.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        <span>إلى: {decision.to}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(decision.date).toLocaleDateString('ar')}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        حالة الرد: {decision.response === 'pending' ? 'في الانتظار' : decision.response}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    تفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Inbox className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">الواردات</h3>
            <p className="text-2xl font-bold text-blue-600">{incomingDecisions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Send className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">الصادرات</h3>
            <p className="text-2xl font-bold text-green-600">{outgoingDecisions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">معلق</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {incomingDecisions.filter(d => d.status === 'pending').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">مكتمل</h3>
            <p className="text-2xl font-bold text-purple-600">
              {incomingDecisions.filter(d => d.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupDecisionsTab;
