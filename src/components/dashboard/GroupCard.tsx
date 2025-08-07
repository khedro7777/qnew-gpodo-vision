
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Calendar, Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description: string;
    category: string;
    memberCount: number;
    location: string;
    status: 'active' | 'draft' | 'under_review';
    lastActivity: string;
    image?: string;
  };
  onViewDetails: (groupId: string) => void;
}

const GroupCard = ({ group, onViewDetails }: GroupCardProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-[320px] flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">
            {group.name}
          </CardTitle>
          <Badge className={`text-xs ${getStatusColor(group.status)} border-0 shrink-0 ml-2`}>
            {t(group.status)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {group.description}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="w-4 h-4 shrink-0" />
            <span>{group.memberCount} members</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="truncate">{group.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {new Date(group.lastActivity).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(group.id)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Eye className="w-4 h-4 mr-2" />
          {t('View Details')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
