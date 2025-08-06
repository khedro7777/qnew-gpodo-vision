
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Clock,
  TrendingDown,
  MapPin,
  Building2,
  Calendar,
  Eye,
  UserPlus,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupDiscountOfferProps {
  offer: {
    id: string;
    title: string;
    supplier: {
      name: string;
      logo?: string;
      verified: boolean;
    };
    product: {
      name: string;
      description: string;
      image?: string;
    };
    pricing: {
      basePrice: number;
      currentDiscount: number;
      maxDiscount: number;
      currency: string;
    };
    groupDetails: {
      currentMembers: number;
      targetMembers: number;
      minMembers: number;
    };
    location: {
      country: string;
      flag: string;
    };
    timing: {
      deadline: string;
      createdAt: string;
    };
    status: 'active' | 'closed' | 'completed';
    category: string;
  };
  variant?: 'card' | 'featured';
}

const GroupDiscountOffer = ({ offer, variant = 'card' }: GroupDiscountOfferProps) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);

  const discountProgress = (offer.groupDetails.currentMembers / offer.groupDetails.targetMembers) * 100;
  const daysLeft = Math.ceil((new Date(offer.timing.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const currentPrice = offer.pricing.basePrice * (1 - (offer.pricing.currentDiscount / 100));
  const potentialPrice = offer.pricing.basePrice * (1 - (offer.pricing.maxDiscount / 100));

  const handleViewDetails = () => {
    navigate(`/offer/${offer.id}`);
  };

  const handleJoinOffer = async () => {
    setIsJoining(true);
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      // Navigate to offer details or show success message
      navigate(`/offer/${offer.id}/join`);
    }, 1500);
  };

  if (variant === 'featured') {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            🔥 عرض مميز
          </Badge>
        </div>
        
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {offer.product.image && (
              <img 
                src={offer.product.image} 
                alt={offer.product.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                {offer.title}
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{offer.supplier.name}</span>
                {offer.supplier.verified && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    ✓ موثق
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {offer.location.flag} {offer.location.country}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pricing Section */}
          <div className="bg-white/80 rounded-xl p-4 border border-white/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-500">السعر الحالي</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentPrice.toFixed(2)} {offer.pricing.currency}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">السعر المحتمل</p>
                <p className="text-xl font-bold text-green-600">
                  {potentialPrice.toFixed(2)} {offer.pricing.currency}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800 border-0">
                خصم {offer.pricing.currentDiscount}%
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-0">
                يصل إلى {offer.pricing.maxDiscount}%
              </Badge>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {offer.groupDetails.currentMembers} / {offer.groupDetails.targetMembers} منضم
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">
                  {daysLeft > 0 ? `${daysLeft} يوم متبقي` : 'انتهت المهلة'}
                </span>
              </div>
            </div>
            
            <Progress value={discountProgress} className="h-3" />
            
            <p className="text-xs text-gray-500">
              الحد الأدنى: {offer.groupDetails.minMembers} أشخاص للتفعيل
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleJoinOffer}
              disabled={isJoining || offer.status === 'closed'}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isJoining ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الانضمام...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  انضم للعرض
                </div>
              )}
            </Button>
            
            <Button variant="outline" onClick={handleViewDetails} className="px-6">
              <Eye className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" className="px-6">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
              {offer.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{offer.supplier.name}</span>
              {offer.supplier.verified && (
                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                  ✓
                </Badge>
              )}
            </div>
          </div>
          
          <Badge className={`${
            offer.status === 'active' ? 'bg-green-100 text-green-800' :
            offer.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          } border-0 capitalize`}>
            {offer.status === 'active' ? 'نشط' : 
             offer.status === 'closed' ? 'مغلق' : 'مكتمل'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing Display */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">السعر الحالي</p>
            <p className="text-xl font-bold text-blue-600">
              {currentPrice.toFixed(2)} {offer.pricing.currency}
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-green-100 text-green-800 border-0">
              خصم {offer.pricing.currentDiscount}%
            </Badge>
          </div>
        </div>

        {/* Progress and Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{offer.groupDetails.currentMembers}/{offer.groupDetails.targetMembers}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{offer.location.flag} {offer.location.country}</span>
            </div>
          </div>
          
          <Progress value={discountProgress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>يصل إلى {offer.pricing.maxDiscount}% خصم</span>
            <span>{daysLeft > 0 ? `${daysLeft} يوم متبقي` : 'انتهت'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleViewDetails} 
            variant="outline" 
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            عرض التفاصيل
          </Button>
          <Button 
            onClick={handleJoinOffer}
            disabled={offer.status === 'closed'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupDiscountOffer;
