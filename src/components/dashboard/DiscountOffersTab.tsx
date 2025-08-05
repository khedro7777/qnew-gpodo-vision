
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, Users, Clock, DollarSign, TrendingDown, Star } from 'lucide-react';

const DiscountOffersTab = () => {
  const [filter, setFilter] = useState('all');

  const discountOffers = [
    {
      id: '1',
      title: 'Bulk Tea Export - Premium Ceylon',
      supplier: 'Ceylon Tea Exports Ltd.',
      basePrice: 100,
      currentMembers: 8,
      maxMembers: 20,
      expiry: '2025-11-30T23:59:59Z',
      status: 'active',
      discountTiers: [
        { minMembers: 5, discount: 5 },
        { minMembers: 10, discount: 10 },
        { minMembers: 15, discount: 15 },
        { minMembers: 20, discount: 20 }
      ],
      category: 'Food & Beverages',
      rating: 4.8,
      joined: false
    },
    {
      id: '2',
      title: 'Industrial Steel Beams - Construction Grade',
      supplier: 'MetalWorks International',
      basePrice: 2500,
      currentMembers: 15,
      maxMembers: 25,
      expiry: '2025-09-15T23:59:59Z',
      status: 'active',
      discountTiers: [
        { minMembers: 10, discount: 8 },
        { minMembers: 20, discount: 15 },
        { minMembers: 25, discount: 22 }
      ],
      category: 'Manufacturing',
      rating: 4.6,
      joined: true
    },
    {
      id: '3',
      title: 'Office Furniture Bundle - Complete Setup',
      supplier: 'Workspace Solutions',
      basePrice: 800,
      currentMembers: 3,
      maxMembers: 15,
      expiry: '2025-08-20T23:59:59Z',
      status: 'active',
      discountTiers: [
        { minMembers: 5, discount: 10 },
        { minMembers: 10, discount: 18 },
        { minMembers: 15, discount: 25 }
      ],
      category: 'Office Supplies',
      rating: 4.4,
      joined: false
    }
  ];

  const getCurrentDiscount = (offer) => {
    let currentDiscount = 0;
    for (const tier of offer.discountTiers) {
      if (offer.currentMembers >= tier.minMembers) {
        currentDiscount = tier.discount;
      }
    }
    return currentDiscount;
  };

  const getNextTierDiscount = (offer) => {
    for (const tier of offer.discountTiers) {
      if (offer.currentMembers < tier.minMembers) {
        return { discount: tier.discount, membersNeeded: tier.minMembers - offer.currentMembers };
      }
    }
    return null;
  };

  const filteredOffers = discountOffers.filter(offer => {
    if (filter === 'joined') return offer.joined;
    if (filter === 'available') return !offer.joined;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Discount Offers</h2>
          <p className="text-gray-600">Join group-buying initiatives for better pricing</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Offers
          </Button>
          <Button 
            variant={filter === 'joined' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('joined')}
          >
            Joined
          </Button>
          <Button 
            variant={filter === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('available')}
          >
            Available
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Active Offers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Joined Groups</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">18%</p>
              <p className="text-sm text-gray-600">Avg. Discount</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">$2.4K</p>
              <p className="text-sm text-gray-600">Total Savings</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Discount Offers Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer) => {
          const currentDiscount = getCurrentDiscount(offer);
          const nextTier = getNextTierDiscount(offer);
          const progressPercentage = (offer.currentMembers / offer.maxMembers) * 100;
          const discountedPrice = offer.basePrice * (1 - currentDiscount / 100);
          
          return (
            <Card key={offer.id} className={`p-6 ${offer.joined ? 'ring-2 ring-green-500' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.title}</h3>
                  <p className="text-sm text-gray-600">{offer.supplier}</p>
                </div>
                <div className="flex items-center gap-2">
                  {offer.joined && (
                    <Badge className="bg-green-100 text-green-800 border-0">Joined</Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{offer.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <div className="flex items-center gap-2">
                      {currentDiscount > 0 && (
                        <span className="text-lg font-bold text-gray-400 line-through">
                          ${offer.basePrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">
                        ${discountedPrice.toFixed(0)}
                      </span>
                      {currentDiscount > 0 && (
                        <Badge className="bg-red-100 text-red-800 border-0">
                          -{currentDiscount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {offer.category}
                  </Badge>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {offer.currentMembers} / {offer.maxMembers} members
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Next Tier Info */}
                {nextTier && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">{nextTier.discount}% discount</span> 
                      {' '}unlocks with {nextTier.membersNeeded} more member{nextTier.membersNeeded > 1 ? 's' : ''}!
                    </p>
                  </div>
                )}

                {/* Discount Tiers */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Discount Tiers:</p>
                  <div className="flex gap-2 flex-wrap">
                    {offer.discountTiers.map((tier, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs ${
                          offer.currentMembers >= tier.minMembers 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'text-gray-500'
                        }`}
                      >
                        {tier.minMembers}+ = {tier.discount}%
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Expires: {new Date(offer.expiry).toLocaleDateString()}</span>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {offer.joined ? (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50">
                        Leave Group
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Join Group Buy
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOffers.length === 0 && (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {filter === 'joined' ? 'No Joined Offers' : filter === 'available' ? 'No Available Offers' : 'No Offers Found'}
          </h3>
          <p className="text-gray-500">
            {filter === 'joined' 
              ? "You haven't joined any group-buying offers yet." 
              : "Check back later for new discount opportunities."}
          </p>
        </Card>
      )}
    </div>
  );
};

export default DiscountOffersTab;
