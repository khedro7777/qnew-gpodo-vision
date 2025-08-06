
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Filter, Plus, DollarSign } from 'lucide-react';
import InvestmentProjectOffer from './InvestmentProjectOffer';
import { useNavigate } from 'react-router-dom';

const InvestmentProjectsSection = () => {
  const navigate = useNavigate();

  const investmentOffers = [
    {
      id: '1',
      title: 'AI-Powered Healthcare Platform - Series A Funding',
      entrepreneur: {
        name: 'TechHealth Solutions',
        verified: true
      },
      project: {
        name: 'MediCore AI Platform',
        description: 'Revolutionary AI platform for medical diagnosis and patient care optimization'
      },
      investment: {
        seekingAmount: 2000000,
        minimumInvestment: 50000,
        currentFunding: 800000,
        targetFunding: 2000000,
        currency: 'USD'
      },
      details: {
        currentInvestors: 8,
        targetInvestors: 25,
        minInvestors: 5
      },
      location: {
        country: 'United States',
        flag: '🇺🇸'
      },
      timing: {
        deadline: '2024-04-15',
        createdAt: '2024-01-15'
      },
      status: 'active' as const,
      category: 'HealthTech',
      roi: 300,
      riskLevel: 'medium' as const
    },
    {
      id: '2',
      title: 'Sustainable Energy Storage Solutions',
      entrepreneur: {
        name: 'GreenPower Innovations',
        verified: true
      },
      project: {
        name: 'EcoStore Battery Systems',
        description: 'Next-generation battery technology for renewable energy storage'
      },
      investment: {
        seekingAmount: 5000000,
        minimumInvestment: 100000,
        currentFunding: 2500000,
        targetFunding: 5000000,
        currency: 'USD'
      },
      details: {
        currentInvestors: 15,
        targetInvestors: 40,
        minInvestors: 10
      },
      location: {
        country: 'Germany',
        flag: '🇩🇪'
      },
      timing: {
        deadline: '2024-03-30',
        createdAt: '2024-01-20'
      },
      status: 'active' as const,
      category: 'CleanTech',
      roi: 250,
      riskLevel: 'low' as const
    },
    {
      id: '3',
      title: 'E-commerce Platform for Local Businesses',
      entrepreneur: {
        name: 'LocalMarket Inc.',
        verified: false
      },
      project: {
        name: 'LocalHub Platform',
        description: 'Connecting local businesses with customers through digital marketplace'
      },
      investment: {
        seekingAmount: 800000,
        minimumInvestment: 25000,
        currentFunding: 300000,
        targetFunding: 800000,
        currency: 'USD'
      },
      details: {
        currentInvestors: 12,
        targetInvestors: 30,
        minInvestors: 8
      },
      location: {
        country: 'United Kingdom',
        flag: '🇬🇧'
      },
      timing: {
        deadline: '2024-04-20',
        createdAt: '2024-02-01'
      },
      status: 'active' as const,
      category: 'E-commerce',
      roi: 180,
      riskLevel: 'high' as const
    }
  ];

  const featuredOffer = investmentOffers[0];
  const regularOffers = investmentOffers.slice(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Active Investment Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover promising startups and investment projects seeking funding from strategic investors
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/investment/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Investment Project
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Projects
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/investment')}>
              View All Projects
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <span className="font-medium text-gray-900">Active Projects: </span>
              <span className="font-bold text-blue-600">{investmentOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">Total Funding: </span>
              <span className="font-bold text-green-600">$12.5M</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">Average ROI: </span>
              <span className="font-bold text-orange-600">240%</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Investment Opportunity</h3>
            </div>
            <InvestmentProjectOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Active Investment Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => (
                <InvestmentProjectOffer key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for Investment for Your Project?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Present your business idea to potential investors and secure the funding you need to grow your venture
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/investment/create')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Submit Investment Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentProjectsSection;
