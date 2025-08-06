
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Filter, Plus, Briefcase } from 'lucide-react';
import FreelancerServiceOffer from './FreelancerServiceOffer';
import { useNavigate } from 'react-router-dom';

const FreelancerServicesSection = () => {
  const navigate = useNavigate();

  const freelancerOffers = [
    {
      id: '1',
      title: 'Mobile App Development Team - E-commerce Platform',
      client: {
        name: 'RetailTech Solutions',
        verified: true
      },
      service: {
        name: 'Mobile App Development',
        description: 'Looking for experienced mobile developers to build a comprehensive e-commerce mobile application'
      },
      budget: {
        minBudget: 15000,
        maxBudget: 25000,
        currency: 'USD',
        paymentType: 'fixed' as const
      },
      details: {
        currentApplicants: 12,
        targetFreelancers: 5,
        minFreelancers: 3
      },
      location: {
        country: 'United States',
        flag: '🇺🇸'
      },
      timing: {
        deadline: '2024-03-20',
        duration: '4-6 months',
        createdAt: '2024-01-15'
      },
      status: 'active' as const,
      category: 'Mobile Development',
      skillsRequired: ['React Native', 'iOS', 'Android', 'Node.js', 'MongoDB'],
      experienceLevel: 'expert' as const
    },
    {
      id: '2',
      title: 'Digital Marketing Campaign - B2B SaaS',
      client: {
        name: 'CloudSync Inc.',
        verified: true
      },
      service: {
        name: 'Digital Marketing',
        description: 'Seeking marketing specialists for comprehensive B2B digital marketing campaign'
      },
      budget: {
        minBudget: 50,
        maxBudget: 80,
        currency: 'USD',
        paymentType: 'hourly' as const
      },
      details: {
        currentApplicants: 8,
        targetFreelancers: 3,
        minFreelancers: 2
      },
      location: {
        country: 'Canada',
        flag: '🇨🇦'
      },
      timing: {
        deadline: '2024-03-15',
        duration: '3 months',
        createdAt: '2024-01-20'
      },
      status: 'active' as const,
      category: 'Digital Marketing',
      skillsRequired: ['SEO', 'Google Ads', 'LinkedIn Marketing', 'Content Strategy', 'Analytics'],
      experienceLevel: 'intermediate' as const
    },
    {
      id: '3',
      title: 'UI/UX Design for Fintech Platform',
      client: {
        name: 'FinanceFlow',
        verified: false
      },
      service: {
        name: 'UI/UX Design',
        description: 'Looking for creative designers to redesign our fintech platform user interface'
      },
      budget: {
        minBudget: 8000,
        maxBudget: 12000,
        currency: 'USD',
        paymentType: 'fixed' as const
      },
      details: {
        currentApplicants: 18,
        targetFreelancers: 2,
        minFreelancers: 1
      },
      location: {
        country: 'United Kingdom',
        flag: '🇬🇧'
      },
      timing: {
        deadline: '2024-03-25',
        duration: '2 months',
        createdAt: '2024-02-01'
      },
      status: 'active' as const,
      category: 'Design',
      skillsRequired: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      experienceLevel: 'intermediate' as const
    }
  ];

  const featuredOffer = freelancerOffers[0];
  const regularOffers = freelancerOffers.slice(1);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Active Freelancer Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover freelance projects and join collaborative teams for exciting business ventures
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => navigate('/freelancer/create')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Freelancer Job
            </Button>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Jobs
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/freelancer')}>
              View All Jobs
            </Button>
          </div>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-purple-50 rounded-full px-6 py-3 border border-purple-200">
              <span className="font-medium text-gray-900">Active Jobs: </span>
              <span className="font-bold text-purple-600">{freelancerOffers.filter(o => o.status === 'active').length}</span>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 border border-green-200">
              <span className="font-medium text-gray-900">Applications Today: </span>
              <span className="font-bold text-green-600">156</span>
            </div>
            <div className="bg-orange-50 rounded-full px-6 py-3 border border-orange-200">
              <span className="font-medium text-gray-900">Avg Rate: </span>
              <span className="font-bold text-orange-600">$65/hr</span>
            </div>
          </div>
        </div>

        {/* Featured Offer */}
        {featuredOffer && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-purple-500" />
              <h3 className="text-2xl font-bold text-gray-900">Featured Freelancer Opportunity</h3>
            </div>
            <FreelancerServiceOffer offer={featuredOffer} variant="featured" />
          </div>
        )}

        {/* Regular Offers Grid */}
        {regularOffers.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Active Freelancer Jobs</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularOffers.map((offer) => (
                <FreelancerServiceOffer key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
            <Briefcase className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for Talented Freelancers?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Post your project and connect with skilled freelancers ready to help you achieve your business goals
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/freelancer/create')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              Post Freelancer Job
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerServicesSection;
