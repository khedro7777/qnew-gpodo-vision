
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Edit,
  Calendar,
  User,
  CheckCircle,
  Clock
} from 'lucide-react';

interface GroupContractsTabProps {
  groupId: string;
  userRole: string;
}

const GroupContractsTab = ({ groupId, userRole }: GroupContractsTabProps) => {
  const contracts = [
    {
      id: '1',
      title: 'عقد توريد أجهزة الكمبيوتر',
      parties: ['المجموعة', 'شركة التقنيات المتطورة'],
      status: 'active',
      signedDate: '2024-01-10',
      expiryDate: '2024-07-10',
      value: '125,000 ريال',
      type: 'purchase'
    },
    {
      id: '2',
      title: 'اتفاقية الخدمات التسويقية',
      parties: ['المجموعة', 'وكالة الإبداع الرقمي'],
      status: 'draft',
      signedDate: null,
      expiryDate: '2024-12-31',
      value: '90,000 ريال',
      type: 'service'
    },
    {
      id: '3',
      title: 'عقد الاستشارات القانونية',
      parties: ['المجموعة', 'مكتب المحاماة المتميز'],
      status: 'completed',
      signedDate: '2023-11-15',
      expiryDate: '2024-01-15',
      value: '15,000 ريال',
      type: 'consultation'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">مسودة</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">مكتمل</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'service':
        return '🔧';
      case 'consultation':
        return '💼';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">العقود والاتفاقيات</h2>
          <p className="text-gray-600">إدارة جميع العقود والاتفاقيات الخاصة بالمجموعة</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          عقد جديد
        </Button>
      </div>

      {/* Contracts List */}
      <div className="grid gap-6">
        {contracts.map((contract) => (
          <Card key={contract.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(contract.type)}</span>
                    <CardTitle className="text-xl">{contract.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>الأطراف: {contract.parties.join(' • ')}</span>
                  </div>
                </div>
                {getStatusBadge(contract.status)}
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">قيمة العقد</span>
                    <span className="font-medium text-green-600">{contract.value}</span>
                  </div>
                  
                  {contract.signedDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">تاريخ التوقيع</span>
                      <span className="font-medium">{new Date(contract.signedDate).toLocaleDateString('ar')}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">تاريخ الانتهاء</span>
                    <span className="font-medium">{new Date(contract.expiryDate).toLocaleDateString('ar')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الحالة</span>
                    <div className="flex items-center gap-2">
                      {contract.status === 'active' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="text-sm">{
                        contract.status === 'active' ? 'ساري المفعول' :
                        contract.status === 'draft' ? 'في انتظار التوقيع' :
                        contract.status === 'completed' ? 'منتهي' : 'ملغي'
                      }</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">المدة المتبقية</span>
                    <span className="font-medium">
                      {contract.status === 'active' 
                        ? `${Math.ceil((new Date(contract.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} يوم`
                        : 'منتهي'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  عرض العقد
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  تحميل PDF
                </Button>
                {contract.status === 'draft' && (
                  <Button className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    تحرير
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي العقود</h3>
            <p className="text-2xl font-bold text-blue-600">{contracts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">العقود النشطة</h3>
            <p className="text-2xl font-bold text-green-600">
              {contracts.filter(c => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">في الانتظار</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'draft').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي القيمة</h3>
            <p className="text-2xl font-bold text-purple-600">230,000 ريال</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupContractsTab;
