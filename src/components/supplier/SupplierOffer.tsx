
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, Truck, Package, Shield, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SupplierOfferProps {
  offer: {
    id: string;
    title: string;
    supplier: {
      name: string;
      verified: boolean;
      rating: number;
      reviewCount: number;
    };
    product: {
      name: string;
      description: string;
    };
    pricing: {
      unitPrice: number;
      minOrderQuantity: number;
      maxOrderQuantity: number;
      discount: number;
      currency: string;
    };
    details: {
      currentOrders: number;
      availableStock: number;
      moq: number;
    };
    location: {
      country: string;
      flag: string;
    };
    timing: {
      deliveryTime: string;
      validUntil: string;
      createdAt: string;
    };
    status: 'active' | 'limited_stock' | 'out_of_stock';
    category: string;
    features: string[];
    certifications: string[];
  };
  variant?: 'default' | 'featured';
}

const SupplierOffer = ({ offer, variant = 'default' }: SupplierOfferProps) => {
  const navigate = useNavigate();
  
  const stockPercentage = (offer.details.currentOrders / offer.details.availableStock) * 100;
  
  const handleCardClick = () => {
    navigate(`/group/${offer.id}/profile`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'limited_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cardClasses = variant === 'featured' 
    ? "border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
    : "hover:shadow-lg transition-shadow duration-300 cursor-pointer";

  return (
    <Card className={cardClasses} onClick={handleCardClick}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {offer.category}
              </Badge>
              <Badge className={getStatusColor(offer.status)}>
                {offer.status.replace('_', ' ')}
              </Badge>
            </div>
            <h3 className={`font-bold ${variant === 'featured' ? 'text-xl' : 'text-lg'} text-gray-900 mb-2 line-clamp-2`}>
              {offer.title}
            </h3>
          </div>
          <div className="text-right ml-4">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {offer.location.flag} {offer.location.country}
            </p>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Supplier:</span>
            <span className="font-medium text-gray-900">{offer.supplier.name}</span>
            {offer.supplier.verified && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                ✓ Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{offer.supplier.rating}</span>
              <span className="text-xs text-gray-500">({offer.supplier.reviewCount} reviews)</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {offer.product.description}
          </p>
        </div>

        {/* Pricing Details */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Unit Price</p>
              <p className="font-bold text-gray-900">
                ${offer.pricing.unitPrice} {offer.pricing.currency}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">MOQ</p>
              <p className="font-bold text-gray-900">
                {offer.pricing.minOrderQuantity.toLocaleString()} units
              </p>
            </div>
          </div>
          
          {offer.pricing.discount > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm font-medium text-green-800">
                {offer.pricing.discount}% Bulk Discount Available
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Key Features</p>
          <div className="flex flex-wrap gap-1">
            {offer.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {offer.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{offer.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Package className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">In Stock</p>
            <p className="font-bold text-sm text-gray-900">
              {offer.details.availableStock.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Truck className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Delivery</p>
            <p className="font-bold text-sm text-gray-900">
              {offer.timing.deliveryTime}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Calendar className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Valid Until</p>
            <p className="font-bold text-sm text-gray-900">
              {new Date(offer.timing.validUntil).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Certifications */}
        {offer.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Certifications</p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <div className="flex flex-wrap gap-1">
                {offer.certifications.slice(0, 2).map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/group/${offer.id}/profile`);
            }}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Request Quote
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SupplierOffer;
