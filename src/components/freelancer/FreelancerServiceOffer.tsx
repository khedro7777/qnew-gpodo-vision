
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Star, Users, Clock, Briefcase, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FreelancerServiceOfferProps {
  offer: {
    id: string;
    title: string;
    client: {
      name: string;
      verified: boolean;
    };
    service: {
      name: string;
      description: string;
    };
    budget: {
      minBudget: number;
      maxBudget: number;
      currency: string;
      paymentType: 'fixed' | 'hourly';
    };
    details: {
      currentApplicants: number;
      targetFreelancers: number;
      minFreelancers: number;
    };
    location: {
      country: string;
      flag: string;
    };
    timing: {
      deadline: string;
      duration: string;
      createdAt: string;
    };
    status: 'active' | 'in_progress' | 'completed';
    category: string;
    skillsRequired: string[];
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
  };
  variant?: 'default' | 'featured';
}

const FreelancerServiceOffer = ({ offer, variant = 'default' }: FreelancerServiceOfferProps) => {
  const navigate = useNavigate();
  
  const applicantPercentage = (offer.details.currentApplicants / offer.details.targetFreelancers) * 100;
  
  const handleCardClick = () => {
    navigate(`/group/${offer.id}/profile`);
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const cardClasses = variant === 'featured' 
    ? "border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300 cursor-pointer"
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
              <Badge className={getExperienceColor(offer.experienceLevel)}>
                {offer.experienceLevel}
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

        {/* Client Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Client:</span>
            <span className="font-medium text-gray-900">{offer.client.name}</span>
            {offer.client.verified && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {offer.service.description}
          </p>
        </div>

        {/* Budget Details */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Budget Range</p>
              <p className="font-bold text-gray-900">
                ${offer.budget.minBudget.toLocaleString()} - ${offer.budget.maxBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Type</p>
              <p className="font-bold text-gray-900 capitalize">
                {offer.budget.paymentType}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Applications Progress</span>
              <span className="text-xs font-medium text-gray-700">
                {applicantPercentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(applicantPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {offer.details.currentApplicants} of {offer.details.targetFreelancers} positions
            </p>
          </div>
        </div>

        {/* Skills Required */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Skills Required</p>
          <div className="flex flex-wrap gap-1">
            {offer.skillsRequired.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {offer.skillsRequired.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{offer.skillsRequired.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Applicants</p>
            <p className="font-bold text-sm text-gray-900">
              {offer.details.currentApplicants}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-bold text-sm text-gray-900">
              {offer.timing.duration}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Calendar className="w-4 h-4" />
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
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/group/${offer.id}/profile`);
            }}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FreelancerServiceOffer;
