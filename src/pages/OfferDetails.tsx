
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Clock, TrendingDown, MapPin, Building2, Calendar, Share2, UserPlus, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OfferDetails = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const [isJoining, setIsJoining] = useState(false);

  // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من API
  const offer = {
    id: offerId,
    title: 'أجهزة كمبيوتر مكتبية HP EliteDesk - عرض جماعي',
    description: 'احصل على أجهزة كمبيوتر HP EliteDesk 800 G9 عالية الأداء بخصومات حصرية عند الوصول للعدد المطلوب. الأجهزة جديدة مع ضمان 3 سنوات وخدمة صيانة مجانية لأول سنة.',
    supplier: {
      name: 'شركة التقنيات المتطورة',
      logo: '/placeholder.svg',
      verified: true,
      rating: 4.8,
      completedOffers: 156
    },
    product: {
      name: 'HP EliteDesk 800 G9',
      description: 'معالج Intel Core i7، ذاكرة 16GB، تخزين SSD 512GB، نظام Windows 11 Pro',
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      specifications: [
        'معالج Intel Core i7-12700 (الجيل الثاني عشر)',
        'ذاكرة عشوائية 16GB DDR4',
        'قرص صلب SSD بسعة 512GB',
        'نظام تشغيل Windows 11 Pro أصلي',
        'كرت شاشة Intel UHD Graphics 770',
        'منافذ USB 3.0 وUSB-C',
        'ضمان 3 سنوات من الشركة المصنعة'
      ]
    },
    pricing: {
      basePrice: 3000,
      currentDiscount: 15,
      maxDiscount: 35,
      currency: 'ريال',
      discountTiers: [
        { members: 10, discount: 10 },
        { members: 25, discount: 20 },
        { members: 40, discount: 30 },
        { members: 50, discount: 35 }
      ]
    },
    groupDetails: {
      currentMembers: 12,
      targetMembers: 50,
      minMembers: 10,
      membersList: [
        { name: 'أحمد محمد', joinedAt: '2024-01-10', avatar: '/placeholder.svg' },
        { name: 'فاطمة علي', joinedAt: '2024-01-11', avatar: '/placeholder.svg' },
        { name: 'محمد سعد', joinedAt: '2024-01-12', avatar: '/placeholder.svg' }
      ]
    },
    location: {
      country: 'السعودية',
      flag: '🇸🇦',
      city: 'الرياض'
    },
    timing: {
      deadline: '2024-02-15',
      createdAt: '2024-01-10T00:00:00Z',
      estimatedDelivery: '7-10 أيام عمل'
    },
    status: 'active' as const,
    category: 'تقنية',
    terms: [
      'دفع 50% مقدم عند تأكيد العرض',
      'الباقي عند الاستلام',
      'ضمان استرداد كامل في حالة عدم الوصول للحد الأدنى',
      'التسليم خلال 7-10 أيام عمل من تأكيد الطلب',
      'خدمة توصيل مجانية داخل المدن الرئيسية'
    ]
  };

  const discountProgress = (offer.groupDetails.currentMembers / offer.groupDetails.targetMembers) * 100;
  const daysLeft = Math.ceil((new Date(offer.timing.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const currentPrice = offer.pricing.basePrice * (1 - (offer.pricing.currentDiscount / 100));

  const handleJoinOffer = async () => {
    setIsJoining(true);
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      // Show success message or redirect
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Offer Header */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                        {offer.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{offer.supplier.name}</span>
                          {offer.supplier.verified && (
                            <Badge className="bg-green-100 text-green-800 border-0">
                              ✓ موثق
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span>{offer.location.flag} {offer.location.country}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-0 capitalize">
                      نشط
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {offer.description}
                  </p>
                </CardContent>
              </Card>

              {/* Tabs Content */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">تفاصيل المنتج</TabsTrigger>
                  <TabsTrigger value="pricing">الأسعار والخصومات</TabsTrigger>
                  <TabsTrigger value="members">المشاركين</TabsTrigger>
                  <TabsTrigger value="terms">الشروط والأحكام</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>مواصفات المنتج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {offer.product.specifications.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-gray-700">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>هيكل الخصومات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {offer.pricing.discountTiers.map((tier, index) => (
                          <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                            offer.groupDetails.currentMembers >= tier.members 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-gray-500" />
                              <span className="font-medium">{tier.members} مشترك أو أكثر</span>
                            </div>
                            <Badge className={
                              offer.groupDetails.currentMembers >= tier.members 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-700'
                            }>
                              خصم {tier.discount}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>المشاركون في العرض</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {offer.groupDetails.membersList.map((member, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">
                                انضم في {new Date(member.joinedAt).toLocaleDateString('ar')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="terms" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>الشروط والأحكام</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {offer.terms.map((term, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <span className="text-gray-700">{term}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-center">السعر الحالي</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 mb-2">
                      {currentPrice.toFixed(2)} {offer.pricing.currency}
                    </p>
                    <p className="text-sm text-gray-500 line-through">
                      السعر الأصلي: {offer.pricing.basePrice} {offer.pricing.currency}
                    </p>
                    <Badge className="bg-green-100 text-green-800 border-0 mt-2">
                      وفر {(offer.pricing.basePrice - currentPrice).toFixed(2)} {offer.pricing.currency}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {offer.groupDetails.currentMembers} / {offer.groupDetails.targetMembers}
                      </span>
                      <span className="text-sm text-gray-500">
                        {Math.round(discountProgress)}%
                      </span>
                    </div>
                    <Progress value={discountProgress} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>الحد الأدنى: {offer.groupDetails.minMembers}</span>
                      <span>{daysLeft} يوم متبقي</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={handleJoinOffer}
                      disabled={isJoining}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      size="lg"
                    >
                      {isJoining ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          جاري الانضمام...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-5 h-5" />
                          انضم للعرض الآن
                        </div>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        تواصل
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="w-4 h-4 mr-2" />
                        مشاركة
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="pt-4 border-t space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">مدة التسليم:</span>
                      <span className="font-medium">{offer.timing.estimatedDelivery}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">تقييم المورد:</span>
                      <span className="font-medium">⭐ {offer.supplier.rating}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Card */}
              <Card>
                <CardContent className="p-4">
                  <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Flag className="w-4 h-4 mr-2" />
                    الإبلاغ عن العرض
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfferDetails;
