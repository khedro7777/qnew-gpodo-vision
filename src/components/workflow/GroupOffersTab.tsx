
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupOffersTabProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const GroupOffersTab = ({ groupId, userRole, isManager }: GroupOffersTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const offers = [
    {
      id: '1',
      title: 'أجهزة كمبيوتر مكتبية - HP EliteDesk',
      company: 'شركة التقنيات المتطورة',
      price: '2,500 ريال/جهاز',
      quantity: '50 جهاز',
      status: 'pending',
      submittedDate: '2024-01-15',
      validUntil: '2024-01-30',
      description: 'أجهزة كمبيوتر مكتبية عالية الأداء مع ضمان 3 سنوات'
    },
    {
      id: '2',
      title: 'خدمات التسويق الرقمي',
      company: 'وكالة الإبداع الرقمي',
      price: '15,000 ريال/شهر',
      quantity: '6 أشهر',
      status: 'approved',
      submittedDate: '2024-01-10',
      validUntil: '2024-01-25',
      description: 'حملة تسويق رقمي شاملة تشمل السوشيال ميديا و Google Ads'
    },
    {
      id: '3',
      title: 'استشارات قانونية متخصصة',
      company: 'مكتب المحاماة المتميز',
      price: '500 ريال/ساعة',
      quantity: '20 ساعة',
      status: 'rejected',
      submittedDate: '2024-01-08',
      validUntil: '2024-01-20',
      description: 'استشارات قانونية في مجال الشركات والعقود التجارية'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">مُوافق عليه</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApproveOffer = (offerId: string) => {
    toast.success('تم قبول العرض بنجاح');
  };

  const handleRejectOffer = (offerId: string) => {
    toast.success('تم رفض العرض');
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">العروض المقدمة</h2>
          <p className="text-gray-600">مراجعة وإدارة العروض المقدمة للمجموعة</p>
        </div>
        {isManager && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            طلب عرض جديد
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="البحث في العروض..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-3 py-2 border rounded-md">
          <option value="">جميع الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">مُوافق عليه</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* Offers List */}
      <div className="grid gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{offer.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>صالح حتى {new Date(offer.validUntil).toLocaleDateString('ar')}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(offer.status)}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{offer.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">السعر</p>
                      <p className="font-medium">{offer.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">الكمية</p>
                      <p className="font-medium">{offer.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">تاريخ التقديم</p>
                      <p className="font-medium">{new Date(offer.submittedDate).toLocaleDateString('ar')}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  
                  {isManager && offer.status === 'pending' && (
                    <>
                      <Button 
                        onClick={() => handleApproveOffer(offer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        موافقة
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleRejectOffer(offer.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        رفض
                      </Button>
                    </>
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
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي العروض</h3>
            <p className="text-2xl font-bold text-blue-600">{offers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">قيد المراجعة</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {offers.filter(o => o.status === 'pending').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">مُوافق عليها</h3>
            <p className="text-2xl font-bold text-green-600">
              {offers.filter(o => o.status === 'approved').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي القيمة</h3>
            <p className="text-2xl font-bold text-purple-600">180,000 ريال</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupOffersTab;
