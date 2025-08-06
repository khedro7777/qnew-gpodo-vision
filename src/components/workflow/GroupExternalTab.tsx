
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ExternalLink, 
  Plus, 
  User, 
  Building,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupExternalTabProps {
  groupId: string;
  userRole: string;
}

const GroupExternalTab = ({ groupId, userRole }: GroupExternalTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const externalParties = [
    {
      id: '1',
      name: 'شركة التقنيات المتطورة',
      type: 'supplier',
      contact: {
        email: 'info@advtech.sa',
        phone: '+966501234567',
        website: 'www.advtech.sa'
      },
      relationship: 'active_supplier',
      lastInteraction: '2024-01-15',
      totalContracts: 3,
      status: 'verified'
    },
    {
      id: '2',
      name: 'وكالة الإبداع الرقمي',
      type: 'service_provider',
      contact: {
        email: 'contact@creativedigital.sa',
        phone: '+966501234568',
        website: 'www.creativedigital.sa'
      },
      relationship: 'marketing_partner',
      lastInteraction: '2024-01-12',
      totalContracts: 1,
      status: 'pending'
    },
    {
      id: '3',
      name: 'مكتب المحاماة المتميز',
      type: 'consultant',
      contact: {
        email: 'legal@excellentlaw.sa',
        phone: '+966501234569',
        website: 'www.excellentlaw.sa'
      },
      relationship: 'legal_advisor',
      lastInteraction: '2024-01-10',
      totalContracts: 2,
      status: 'verified'
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'supplier':
        return <Badge className="bg-blue-100 text-blue-800">مورد</Badge>;
      case 'service_provider':
        return <Badge className="bg-green-100 text-green-800">مزود خدمة</Badge>;
      case 'consultant':
        return <Badge className="bg-purple-100 text-purple-800">مستشار</Badge>;
      case 'partner':
        return <Badge className="bg-orange-100 text-orange-800">شريك</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">موثق</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">محظور</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRelationshipText = (relationship: string) => {
    switch (relationship) {
      case 'active_supplier':
        return 'مورد نشط';
      case 'marketing_partner':
        return 'شريك تسويقي';
      case 'legal_advisor':
        return 'مستشار قانوني';
      case 'financial_partner':
        return 'شريك مالي';
      default:
        return relationship;
    }
  };

  const inviteExternalParty = () => {
    toast.success('تم إرسال دعوة للطرف الخارجي');
  };

  const filteredParties = externalParties.filter(party =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">الأطراف الخارجية</h2>
          <p className="text-gray-600">إدارة العلاقات مع الموردين والشركاء الخارجيين</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={inviteExternalParty}>
            <Plus className="w-4 h-4 mr-2" />
            دعوة طرف خارجي
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="البحث في الأطراف الخارجية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-3 py-2 border rounded-md">
          <option value="">جميع الأنواع</option>
          <option value="supplier">موردين</option>
          <option value="service_provider">مزودي خدمة</option>
          <option value="consultant">مستشارين</option>
          <option value="partner">شركاء</option>
        </select>
        <select className="px-3 py-2 border rounded-md">
          <option value="">جميع الحالات</option>
          <option value="verified">موثق</option>
          <option value="pending">قيد المراجعة</option>
          <option value="blocked">محظور</option>
        </select>
      </div>

      {/* External Parties List */}
      <div className="grid gap-6">
        {filteredParties.map((party) => (
          <Card key={party.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Building className="w-8 h-8 text-gray-400" />
                  <div>
                    <CardTitle className="text-xl">{party.name}</CardTitle>
                    <p className="text-gray-600">{getRelationshipText(party.relationship)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getTypeBadge(party.type)}
                  {getStatusBadge(party.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">معلومات الاتصال</h4>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{party.contact.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{party.contact.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{party.contact.website}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">إحصائيات التعامل</h4>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">العقود النشطة</span>
                    <span className="font-medium">{party.totalContracts}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">آخر تفاعل</span>
                    <span className="font-medium">
                      {new Date(party.lastInteraction).toLocaleDateString('ar')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">تقييم الأداء</span>
                    <span className="font-medium">⭐ 4.7/5</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  عرض الملف
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  إرسال رسالة
                </Button>
                <Button className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  بدء تعاون
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Building className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي الأطراف</h3>
            <p className="text-2xl font-bold text-blue-600">{externalParties.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <User className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">الموردين</h3>
            <p className="text-2xl font-bold text-green-600">
              {externalParties.filter(p => p.type === 'supplier').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <ExternalLink className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">مزودي الخدمة</h3>
            <p className="text-2xl font-bold text-purple-600">
              {externalParties.filter(p => p.type === 'service_provider').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold">الشركاء النشطين</h3>
            <p className="text-2xl font-bold text-orange-600">
              {externalParties.filter(p => p.status === 'verified').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupExternalTab;
