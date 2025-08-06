
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
      title: 'HP EliteDesk Desktop Computers - Group Offer',
      supplier: {
        name: 'Advanced Technology Company',
        verified: true
      },
      product: {
        name: 'HP EliteDesk 800 G9',
        description: 'High-performance desktop computers'
      },
      pricing: {
        basePrice: 800,
        currentDiscount: 15,
        maxDiscount: 35,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 12,
        targetMembers: 50,
        minMembers: 10
      },
      location: {
        country: 'Saudi Arabia',
        flag: '🇸🇦'
      },
      timing: {
        deadline: '2024-02-15',
        createdAt: '2024-01-10'
      },
      status: 'active' as const,
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Comprehensive Digital Marketing Services - Group Package',
      supplier: {
        name: 'Digital Creative Agency',
        verified: true
      },
      product: {
        name: 'Digital Marketing Package',
        description: 'Complete marketing campaign for 6 months'
      },
      pricing: {
        basePrice: 6500,
        currentDiscount: 20,
        maxDiscount: 45,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 8,
        targetMembers: 20,
        minMembers: 5
      },
      location: {
        country: 'UAE',
        flag: '🇦🇪'
      },
      timing: {
        deadline: '2024-02-20',
        createdAt: '2024-01-08'
      },
      status: 'active' as const,
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'Premium Office Furniture - End of Month Offer',
      supplier: {
        name: 'Modern Furniture Corporation',
        verified: false
      },
      product: {
        name: 'Office Furniture Set',
        description: 'Modern and functional office furniture'
      },
      pricing: {
        basePrice: 4000,
        currentDiscount: 10,
        maxDiscount: 30,
        currency: 'USD'
      },
      groupDetails: {
        currentMembers: 25,
        targetMembers: 40,
        minMembers: 15
      },
      location: {
        country: 'Kuwait',
        flag: '🇰🇼'
      },
      timing: {
        deadline: '2024-01-31',
        createdAt: '2024-01-05'
      },
      status: 'active' as const,
      category: 'Furniture'
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
            Active Group Discount Offers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join group discount offers and get exclusive discounts when the required number is reached
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/offers/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group Offer
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Offers
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/offers')}>
              View All Offers
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <span className="font-medium text-gray-900">Active Offers: </span>
              <span className="font-bold text-blue-600">{groupOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">Members Joined Today: </span>
              <span className="font-bold text-green-600">127</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">Average Discount: </span>
              <span className="font-bold text-orange-600">28%</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Offer</h3>
            </div>
            <GroupDiscountOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Active Offers</h3>
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
              Have a Product for Group Sale?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your group offer now and start gathering buyers to get the best prices and discounts
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/supplier/dashboard')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Start as Supplier
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupOffersSection;
