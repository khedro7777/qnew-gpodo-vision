
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  ThumbsUp, 
  ThumbsDown,
  Eye,
  MessageSquare,
  FileText,
  Download,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Offer {
  id: string;
  title: string;
  description: string;
  supplier: string;
  price: string;
  quantity: number;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  votes_for: number;
  votes_against: number;
  created_at: string;
  attachments?: string[];
  category: string;
}

interface GroupOffersTabProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const GroupOffersTab = ({ groupId, userRole, isManager }: GroupOffersTabProps) => {
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    supplier: '',
    price: '',
    quantity: '',
    category: '',
    deadline: ''
  });

  // Mock offers data
  const [offers] = useState<Offer[]>([
    {
      id: '1',
      title: 'أجهزة كمبيوتر محمولة - Dell Latitude',
      description: 'مجموعة من أجهزة الكمبيوتر المحمولة عالية الأداء مناسبة للشركات',
      supplier: 'شركة التقنيات المتطورة',
      price: '2,500 ريال',
      quantity: 50,
      deadline: '2024-02-15',
      status: 'pending',
      votes_for: 8,
      votes_against: 2,
      created_at: '2024-01-10T10:00:00Z',
      category: 'تقنية',
      attachments: ['specifications.pdf', 'warranty.pdf']
    },
    {
      id: '2',
      title: 'أثاث مكتبي - طاولات وكراسي',
      description: 'مجموعة متكاملة من الأثاث المكتبي العصري',
      supplier: 'مؤسسة الأثاث الراقي',
      price: '1,200 ريال',
      quantity: 30,
      deadline: '2024-02-20',
      status: 'approved',
      votes_for: 15,
      votes_against: 1,
      created_at: '2024-01-08T14:30:00Z',
      category: 'أثاث'
    }
  ]);

  const handleCreateOffer = () => {
    if (!newOffer.title || !newOffer.supplier || !newOffer.price) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    toast.success('تم إنشاء العرض بنجاح');
    setIsCreateOfferOpen(false);
    setNewOffer({
      title: '',
      description: '',
      supplier: '',
      price: '',
      quantity: '',
      category: '',
      deadline: ''
    });
  };

  const handleVote = (offerId: string, voteType: 'for' | 'against') => {
    toast.success(`تم تسجيل صوتك ${voteType === 'for' ? 'بالموافقة' : 'بالرفض'}`);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'موافق عليه', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-800' },
      expired: { label: 'منتهي الصلاحية', className: 'bg-gray-100 text-gray-800' }
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'تقنية': return '💻';
      case 'أثاث': return '🪑';
      case 'معدات': return '🔧';
      case 'خدمات': return '⚙️';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">العروض والمناقصات</h2>
          <p className="text-gray-600">إدارة العروض المقدمة للمجموعة</p>
        </div>
        
        {isManager && (
          <Dialog open={isCreateOfferOpen} onOpenChange={setIsCreateOfferOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                عرض جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>إنشاء عرض جديد</DialogTitle>
                <DialogDescription>
                  أضف عرض جديد للمجموعة للمراجعة والتصويت
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان العرض</label>
                  <Input
                    placeholder="مثال: أجهزة كمبيوتر محمولة"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الموردل</label>
                  <Input
                    placeholder="اسم الشركة المورد"
                    value={newOffer.supplier}
                    onChange={(e) => setNewOffer({...newOffer, supplier: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر</label>
                    <Input
                      placeholder="1,000 ريال"
                      value={newOffer.price}
                      onChange={(e) => setNewOffer({...newOffer, price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الكمية</label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={newOffer.quantity}
                      onChange={(e) => setNewOffer({...newOffer, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <Select value={newOffer.category} onValueChange={(value) => setNewOffer({...newOffer, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تقنية">تقنية</SelectItem>
                      <SelectItem value="أثاث">أثاث</SelectItem>
                      <SelectItem value="معدات">معدات</SelectItem>
                      <SelectItem value="خدمات">خدمات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ انتهاء العرض</label>
                  <Input
                    type="date"
                    value={newOffer.deadline}
                    onChange={(e) => setNewOffer({...newOffer, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الوصف</label>
                  <Textarea
                    placeholder="تفاصيل العرض..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreateOffer} className="w-full">
                  إنشاء العرض
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Offers List */}
      <div className="grid gap-6">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(offer.category)}</span>
                  <div>
                    <CardTitle className="text-xl">{offer.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>الموردل: {offer.supplier}</span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(offer.created_at).toLocaleDateString('ar')}</span>
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
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">السعر</div>
                      <div className="font-semibold text-green-600">{offer.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">الكمية</div>
                      <div className="font-semibold">{offer.quantity} قطعة</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm text-gray-500">ينتهي في</div>
                      <div className="font-semibold">{new Date(offer.deadline).toLocaleDateString('ar')}</div>
                    </div>
                  </div>
                </div>

                {offer.attachments && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">المرفقات:</div>
                    <div className="flex flex-wrap gap-2">
                      {offer.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voting Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-600">{offer.votes_for}</span>
                        <span className="text-sm text-gray-500">موافق</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-red-600" />
                        <span className="font-semibold text-red-600">{offer.votes_against}</span>
                        <span className="text-sm text-gray-500">معارض</span>
                      </div>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleVote(offer.id, 'for')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          أوافق
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVote(offer.id, 'against')}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          أعارض
                        </Button>
                      </div>
                    )}

                    {offer.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        تمت الموافقة
                      </Badge>
                    )}
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(offer.votes_for / (offer.votes_for + offer.votes_against)) * 100}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    عرض التفاصيل
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    التعليقات
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل العرض
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
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
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">العروض المعتمدة</h3>
            <p className="text-2xl font-bold text-green-600">
              {offers.filter(o => o.status === 'approved').length}
            </p>
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
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">إجمالي القيمة</h3>
            <p className="text-2xl font-bold text-purple-600">125,000 ريال</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupOffersTab;
