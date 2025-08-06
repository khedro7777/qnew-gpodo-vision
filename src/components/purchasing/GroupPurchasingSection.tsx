
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingDown, Filter, Plus, ShoppingCart } from 'lucide-react';
import GroupPurchasingOffer from './GroupPurchasingOffer';
import { useNavigate } from 'react-router-dom';

const GroupPurchasingSection = () => {
  const navigate = useNavigate();

  // Mock data for group purchasing offers
  const purchasingOffers = [
    {
      id: '1',
      title: 'Medical Equipment Bulk Purchase - Hospital Grade',
      supplier: {
        name: 'MedTech Solutions Ltd.',
        verified: true
      },
      product: {
        name: 'Digital X-Ray Systems',
        description: 'Professional medical imaging equipment for healthcare facilities'
      },
      pricing: {
        basePrice: 85000,
        currentDiscount: 18,
        maxDiscount: 35,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 8,
        targetMembers: 25,
        minMembers: 5
      },
      location: {
        country: 'Germany',
        flag: '🇩🇪'
      },
      timing: {
        deadline: '2024-03-20',
        createdAt: '2024-01-15'
      },
      status: 'active' as const,
      category: 'Medical Equipment'
    },
    {
      id: '2',
      title: 'Industrial Machinery Group Purchase',
      supplier: {
        name: 'Global Manufacturing Corp',
        verified: true
      },
      product: {
        name: 'CNC Manufacturing Centers',
        description: '5-axis precision manufacturing equipment for industrial use'
      },
      pricing: {
        basePrice: 120000,
        currentDiscount: 22,
        maxDiscount: 40,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 12,
        targetMembers: 30,
        minMembers: 10
      },
      location: {
        country: 'Japan',
        flag: '🇯🇵'
      },
      timing: {
        deadline: '2024-03-15',
        createdAt: '2024-01-20'
      },
      status: 'active' as const,
      category: 'Industrial Equipment'
    },
    {
      id: '3',
      title: 'Restaurant Equipment Package Deal',
      supplier: {
        name: 'Commercial Kitchen Solutions',
        verified: false
      },
      product: {
        name: 'Complete Kitchen Setup',
        description: 'Professional commercial kitchen equipment package'
      },
      pricing: {
        basePrice: 45000,
        currentDiscount: 15,
        maxDiscount: 28,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 18,
        targetMembers: 40,
        minMembers: 15
      },
      location: {
        country: 'Italy',
        flag: '🇮🇹'
      },
      timing: {
        deadline: '2024-03-25',
        createdAt: '2024-01-10'
      },
      status: 'active' as const,
      category: 'Restaurant Equipment'
    }
  ];

  // Featured offer (first one)
  const featuredOffer = purchasingOffers[0];
  const regularOffers = purchasingOffers.slice(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Active Group Purchasing Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join group purchasing initiatives and unlock exclusive bulk discounts with other businesses
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/purchasing/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Purchasing Group
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Opportunities
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/purchasing')}>
              View All Groups
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <span className="font-medium text-gray-900">Active Groups: </span>
              <span className="font-bold text-blue-600">{purchasingOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">New Members Today: </span>
              <span className="font-bold text-green-600">89</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">Average Savings: </span>
              <span className="font-bold text-orange-600">24%</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="w-6 h-6 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Purchasing Opportunity</h3>
            </div>
            <GroupPurchasingOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Active Purchasing Groups</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => (
                <GroupPurchasingOffer key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for Bulk Purchasing Power?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your own purchasing group and invite other businesses to join for better negotiating power and exclusive bulk discounts
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/purchasing/create')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Start Purchasing Group
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupPurchasingSection;
