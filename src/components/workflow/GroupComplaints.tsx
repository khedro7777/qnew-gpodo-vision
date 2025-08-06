
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Plus, 
  Eye, 
  MessageSquare,
  Calendar,
  User,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupComplaintsProps {
  groupId: string;
  userRole: string;
}

const GroupComplaints = ({ groupId, userRole }: GroupComplaintsProps) => {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');

  const complaints = [
    {
      id: '1',
      title: 'تأخير في تسليم الطلبية',
      description: 'تم تأخير تسليم المعدات المطلوبة لأكثر من أسبوعين',
      complainant: 'أحمد محمد',
      respondent: 'شركة التقنيات المتطورة',
      status: 'under_review',
      priority: 'high',
      submittedDate: '2024-01-12',
      category: 'delivery'
    },
    {
      id: '2',
      title: 'جودة الخدمة غير مطابقة للمواصفات',
      description: 'الخدمات المقدمة لا تتطابق مع المواصفات المتفق عليها في العقد',
      complainant: 'سارة أحمد',
      respondent: 'وكالة الإبداع الرقمي',
      status: 'resolved',
      priority: 'medium',
      submittedDate: '2024-01-08',
      category: 'quality'
    },
    {
      id: '3',
      title: 'مخالفة شروط العقد المالية',
      description: 'تم تغيير الأسعار المتفق عليها دون إشعار مسبق',
      complainant: 'خالد علي',
      respondent: 'مجموعة الخدمات المالية',
      status: 'arbitration',
      priority: 'urgent',
      submittedDate: '2024-01-05',
      category: 'financial'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">مقدمة</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">محلولة</Badge>;
      case 'arbitration':
        return <Badge className="bg-red-100 text-red-800">تحكيم</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">مغلقة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">عاجل</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">عالي</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">متوسط</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">منخفض</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const submitComplaint = () => {
    if (!complaintTitle.trim()) {
      toast.error('يرجى إدخال عنوان الشكوى');
      return;
    }

    toast.success('تم تقديم الشكوى بنجاح - سيتم مراجعتها خلال 24 ساعة');
    setComplaintTitle('');
    setComplaintDescription('');
    setShowComplaintForm(false);
  };

  const escalateToArbitration = (complaintId: string) => {
    toast.success('تم رفع الشكوى للتحكيم');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">الشكاوى والنزاعات</h2>
          <p className="text-gray-600">نظام إدارة الشكاوى وحل النزاعات</p>
        </div>
        <Button onClick={() => setShowComplaintForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          تقديم شكوى
        </Button>
      </div>

      {/* Complaint Form */}
      {showComplaintForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              تقديم شكوى جديدة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="عنوان الشكوى"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
            />
            <Textarea
              placeholder="تفاصيل الشكوى"
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              rows={4}
            />
            <select className="w-full px-3 py-2 border rounded-md">
              <option value="">اختر نوع الشكوى</option>
              <option value="delivery">تأخير في التسليم</option>
              <option value="quality">جودة الخدمة/المنتج</option>
              <option value="financial">مشكلة مالية</option>
              <option value="contract">مخالفة العقد</option>
              <option value="other">أخرى</option>
            </select>
            <div className="flex gap-3">
              <Button onClick={submitComplaint} className="flex-1">
                تقديم الشكوى
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowComplaintForm(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complaints List */}
      <div className="grid gap-6">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{complaint.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>المشتكي: {complaint.complainant}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(complaint.submittedDate).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(complaint.status)}
                  {getPriorityBadge(complaint.priority)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{complaint.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">الطرف المشتكى عليه:</span>
                    <p className="font-medium">{complaint.respondent}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">نوع الشكوى:</span>
                    <p className="font-medium">
                      {complaint.category === 'delivery' ? 'تأخير في التسليم' :
                       complaint.category === 'quality' ? 'جودة الخدمة' :
                       complaint.category === 'financial' ? 'مشكلة مالية' : 'أخرى'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    الرسائل (3)
                  </Button>
                  {complaint.status === 'under_review' && userRole === 'admin' && (
                    <Button 
                      onClick={() => escalateToArbitration(complaint.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      رفع للتحكيم
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي الشكاوى</h3>
            <p className="text-2xl font-bold text-red-600">{complaints.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">قيد المراجعة</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {complaints.filter(c => c.status === 'under_review').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Scale className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold">في التحكيم</h3>
            <p className="text-2xl font-bold text-red-600">
              {complaints.filter(c => c.status === 'arbitration').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">محلولة</h3>
            <p className="text-2xl font-bold text-green-600">
              {complaints.filter(c => c.status === 'resolved').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupComplaints;
