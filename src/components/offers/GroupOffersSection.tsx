
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter, Plus } from 'lucide-react';
import GroupDiscountOffer from './GroupDiscountOffer';
import { useNavigate } from 'react-router-dom';

const GroupOffersSection = () => {
  const navigate = useNavigate();

  // Mock data for group discount offers
  const groupOffers = [
    {
      id: '1',
      title: 'أجهزة كمبيوتر مكتبية HP EliteDesk - عرض جماعي',
      supplier: {
        name: 'شركة التقنيات المتطورة',
        verified: true
      },
      product: {
        name: 'HP EliteDesk 800 G9',
        description: 'أجهزة كمبيوتر مكتبية عالية الأداء'
      },
      pricing: {
        basePrice: 3000,
        currentDiscount: 15,
        maxDiscount: 35,
        currency: 'ريال'
      },
      groupDetails: {
        currentMembers: 12,
        targetMembers: 50,
        minMembers: 10
      },
      location: {
        country: 'السعودية',
        flag: '🇸🇦'
      },
      timing: {
        deadline: '2024-02-15',
        createdAt: '2024-01-10'
      },
      status: 'active' as const,
      category: 'تقنية'
    },
    {
      id: '2',
      title: 'خدمات التسويق الرقمي الشامل - باقة المجموعات',
      supplier: {
        name: 'وكالة الإبداع الرقمي',
        verified: true
      },
      product: {
        name: 'باقة التسويق الرقمي',
        description: 'حملة تسويقية شاملة لمدة 6 أشهر'
      },
      pricing: {
        basePrice: 25000,
        currentDiscount: 20,
        maxDiscount: 45,
        currency: 'ريال'
      },
      groupDetails: {
        currentMembers: 8,
        targetMembers: 20,
        minMembers: 5
      },
      location: {
        country: 'الإمارات',
        flag: '🇦🇪'
      },
      timing: {
        deadline: '2024-02-20',
        createdAt: '2024-01-08'
      },
      status: 'active' as const,
      category: 'تسويق'
    },
    {
      id: '3',
      title: 'مستلزمات المكاتب الفاخرة - عرض نهاية الشهر',
      supplier: {
        name: 'مؤسسة الأثاث الحديث',
        verified: false
      },
      product: {
        name: 'مجموعة أثاث مكتبي',
        description: 'أثاث مكتبي عصري وعملي'
      },
      pricing: {
        basePrice: 15000,
        currentDiscount: 10,
        maxDiscount: 30,
        currency: 'ريال'
      },
      groupDetails: {
        currentMembers: 25,
        targetMembers: 40,
        minMembers: 15
      },
      location: {
        country: 'الكويت',
        flag: '🇰🇼'
      },
      timing: {
        deadline: '2024-01-31',
        createdAt: '2024-01-05'
      },
      status: 'active' as const,
      category: 'أثاث'
    }
  ];

  // Featured offer (first one)
  const featuredOffer = groupOffers[0];
  const regularOffers = groupOffers.slice(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            عروض البيع الجماعي النشطة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            انضم لعروض البيع الجماعي واحصل على خصومات حصرية عند تجمع العدد المطلوب
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/offers/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              إنشاء عرض جماعي
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              تصفية العروض
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/offers')}>
              عرض جميع العروض
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <span className="font-medium text-gray-900">العروض النشطة: </span>
              <span className="font-bold text-blue-600">{groupOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">المنضمين اليوم: </span>
              <span className="font-bold text-green-600">127</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">متوسط الخصم: </span>
              <span className="font-bold text-orange-600">28%</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">العرض المميز</h3>
            </div>
            <GroupDiscountOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">عروض أخرى نشطة</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => (
                <GroupDiscountOffer key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              لديك منتج تريد بيعه بعرض جماعي؟
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              أنشئ عرضك الجماعي الآن وابدأ في جمع المشترين للحصول على أفضل الأسعار والخصومات
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/supplier/dashboard')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              ابدأ كمورد
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupOffersSection;
