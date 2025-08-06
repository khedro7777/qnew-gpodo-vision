
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, TrendingUp, Users, DollarSign, Target, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvestmentProjectOfferProps {
  offer: {
    id: string;
    title: string;
    entrepreneur: {
      name: string;
      verified: boolean;
    };
    project: {
      name: string;
      description: string;
    };
    investment: {
      seekingAmount: number;
      minimumInvestment: number;
      currentFunding: number;
      targetFunding: number;
      currency: string;
    };
    details: {
      currentInvestors: number;
      targetInvestors: number;
      minInvestors: number;
    };
    location: {
      country: string;
      flag: string;
    };
    timing: {
      deadline: string;
      createdAt: string;
    };
    status: 'active' | 'funded' | 'closed';
    category: string;
    roi: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  variant?: 'default' | 'featured';
}

const InvestmentProjectOffer = ({ offer, variant = 'default' }: InvestmentProjectOfferProps) => {
  const navigate = useNavigate();
  
  const fundingPercentage = (offer.investment.currentFunding / offer.investment.targetFunding) * 100;
  const investorPercentage = (offer.details.currentInvestors / offer.details.targetInvestors) * 100;
  
  const handleCardClick = () => {
    navigate(`/group/${offer.id}/profile`);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cardClasses = variant === 'featured' 
    ? "border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
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
              <Badge className={getRiskColor(offer.riskLevel)}>
                {offer.riskLevel} risk
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

        {/* Entrepreneur Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Entrepreneur:</span>
            <span className="font-medium text-gray-900">{offer.entrepreneur.name}</span>
            {offer.entrepreneur.verified && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {offer.project.description}
          </p>
        </div>

        {/* Investment Details */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Target Funding</p>
              <p className="font-bold text-gray-900">
                {offer.investment.targetFunding.toLocaleString()} {offer.investment.currency}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Min Investment</p>
              <p className="font-bold text-gray-900">
                {offer.investment.minimumInvestment.toLocaleString()} {offer.investment.currency}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Funding Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {fundingPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {offer.investment.currentFunding.toLocaleString()} of {offer.investment.targetFunding.toLocaleString()} {offer.investment.currency}
            </p>
          </div>
        </div>

        {/* ROI and Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Expected ROI</p>
            <p className="font-bold text-sm text-gray-900">{offer.roi}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Investors</p>
            <p className="font-bold text-sm text-gray-900">
              {offer.details.currentInvestors}/{offer.details.targetInvestors}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Deadline</p>
            <p className="font-bold text-sm text-gray-900">
              {new Date(offer.timing.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/group/${offer.id}/profile`);
            }}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            View Investment
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InvestmentProjectOffer;
