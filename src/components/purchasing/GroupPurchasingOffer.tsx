
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Clock, 
  ShoppingCart,
  TrendingDown,
  Shield,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GroupPurchasingOfferProps {
  offer: {
    id: string;
    title: string;
    supplier: {
      name: string;
      verified: boolean;
    };
    product: {
      name: string;
      description: string;
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
    status: 'active' | 'pending' | 'closed';
    category: string;
  };
  variant?: 'featured' | 'regular';
}

const GroupPurchasingOffer = ({ offer, variant = 'regular' }: GroupPurchasingOfferProps) => {
  const navigate = useNavigate();
  
  const progressPercentage = Math.round((offer.groupDetails.currentMembers / offer.groupDetails.targetMembers) * 100);
  const daysLeft = Math.ceil((new Date(offer.timing.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const handleViewDetails = () => {
    navigate(`/group/${offer.id}/profile`);
  };

  const handleJoinGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/group/${offer.id}/profile`);
  };

  if (variant === 'featured') {
    return (
      <Card 
        className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="absolute top-4 right-4">
          <Badge className="bg-orange-500 text-white font-semibold px-3 py-1">
            Featured Purchasing
          </Badge>
        </div>
        
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{offer.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{offer.supplier.name}</span>
                    {offer.supplier.verified && (
                      <Shield className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">{offer.product.name}</h4>
                <p className="text-gray-600 text-sm">{offer.product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Location</span>
                  </div>
                  <span className="font-medium">{offer.location.flag} {offer.location.country}</span>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Category</span>
                  </div>
                  <span className="font-medium">{offer.category}</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div>
              {/* Pricing Card */}
              <div className="bg-white rounded-xl p-6 border-2 border-green-200 mb-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Current Discount</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {offer.pricing.currentDiscount}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Up to {offer.pricing.maxDiscount}% possible
                  </div>
                </div>
                
                <div className="text-center border-t pt-4">
                  <div className="text-sm text-gray-600 mb-1">Price per unit</div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {(offer.pricing.basePrice * (1 - offer.pricing.currentDiscount / 100)).toLocaleString()} {offer.pricing.currency}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {offer.pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Group Progress */}
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Group Progress</span>
                  <span className="text-sm text-gray-600">
                    {offer.groupDetails.currentMembers}/{offer.groupDetails.targetMembers} members
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{progressPercentage}% Complete</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft} days left</span>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleJoinGroup}
              >
                <Users className="w-5 h-5 mr-2" />
                Join Purchasing Group
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 cursor-pointer hover:scale-105"
      onClick={handleViewDetails}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge 
            variant="secondary" 
            className="bg-blue-100 text-blue-800 border-blue-200"
          >
            {offer.status}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{daysLeft}d left</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{offer.title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{offer.supplier.name}</span>
              {offer.supplier.verified && (
                <Shield className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="font-medium text-sm mb-1">{offer.product.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{offer.product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{offer.location.flag} {offer.location.country}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{offer.groupDetails.currentMembers}/{offer.groupDetails.targetMembers}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Discount Progress</span>
            <span className="font-medium text-green-600">{offer.pricing.currentDiscount}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(offer.pricing.currentDiscount / offer.pricing.maxDiscount) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500 line-through">
              {offer.pricing.basePrice.toLocaleString()} {offer.pricing.currency}
            </span>
            <div className="font-bold text-green-600">
              {(offer.pricing.basePrice * (1 - offer.pricing.currentDiscount / 100)).toLocaleString()} {offer.pricing.currency}
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleJoinGroup}
          >
            <Users className="w-4 h-4 mr-1" />
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupPurchasingOffer;
