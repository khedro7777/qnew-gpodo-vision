
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierOffer } from '@/hooks/useSupplierPanel';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Package
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupplierMyOffersProps {
  offers: SupplierOffer[];
  onViewOffer: (offerId: string) => void;
}

export const SupplierMyOffers: React.FC<SupplierMyOffersProps> = ({ offers, onViewOffer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  const filteredOffers = offers
    .filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           offer.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'participants':
          return (b.current_participants || 0) - (a.current_participants || 0);
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'price':
          return b.base_price - a.base_price;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (offer: SupplierOffer) => {
    return Math.min((offer.current_participants / offer.minimum_joiners) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Offers Grid */}
      {filteredOffers.length > 0 ? (
        <div className="grid gap-6">
          {filteredOffers.map((offer) => {
            const progressPercentage = getProgressPercentage(offer);
            const daysLeft = Math.ceil((new Date(offer.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <p className="text-muted-foreground mt-1 line-clamp-2">{offer.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Key Metrics */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">${offer.base_price}</div>
                        <div className="text-sm text-muted-foreground">Base Price</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xl font-bold">{offer.current_participants}</div>
                        <div className="text-sm text-muted-foreground">Participants</div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to minimum</span>
                          <span>{offer.current_participants}/{offer.minimum_joiners}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span>{offer.category || 'General'}</span>
                        </div>
                      </div>

                      {/* Discount Tiers Preview */}
                      {offer.group_discount_tiers && offer.group_discount_tiers.length > 0 && (
                        <div className="flex gap-1 overflow-x-auto">
                          {offer.group_discount_tiers.slice(0, 3).map((tier, index) => (
                            <div key={index} className="flex-shrink-0 text-xs bg-gray-100 px-2 py-1 rounded">
                              {tier.min_members}+ = {tier.discount_percent}% off
                            </div>
                          ))}
                          {offer.group_discount_tiers.length > 3 && (
                            <div className="flex-shrink-0 text-xs bg-gray-100 px-2 py-1 rounded">
                              +{offer.group_discount_tiers.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => onViewOffer(offer.id)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Offer
                      </Button>

                      {offer.status === 'draft' && (
                        <Button variant="outline" className="w-full">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">Views</div>
                        <div className="text-muted-foreground">284</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Interests</div>
                        <div className="text-muted-foreground">67</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Created</div>
                        <div className="text-muted-foreground">
                          {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">Revenue</div>
                        <div className="text-muted-foreground">
                          ${(offer.current_participants * offer.base_price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No offers found' : 'No offers yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search filters'
                : 'Create your first group discount offer to start attracting buyers'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button>
                <Package className="w-4 h-4 mr-2" />
                Create Your First Offer
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
