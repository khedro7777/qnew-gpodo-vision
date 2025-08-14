
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Users, 
  Building, 
  ShoppingCart, 
  TrendingDown,
  Shield,
  CreditCard,
  Package,
  CheckCircle,
  Star,
  Globe,
  Handshake
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorksPage = () => {
  const navigate = useNavigate();

  const flows = [
    {
      type: 'B2B',
      title: 'Business to Business',
      description: 'Companies buying from suppliers in bulk',
      icon: Building,
      color: 'blue',
      steps: [
        'Supplier creates bulk offer',
        'Businesses join the group',
        'Volume discounts unlock',
        'Orders are processed',
        'Delivery to all participants'
      ],
      benefits: [
        'Volume pricing advantages',
        'Verified business suppliers',
        'Streamlined procurement',
        'Reduced administrative costs'
      ]
    },
    {
      type: 'B2C',
      title: 'Business to Consumer',
      description: 'Individual customers joining group purchases',
      icon: ShoppingCart,
      color: 'green',
      steps: [
        'Consumer finds group offer',
        'Joins buying group',
        'Waits for minimum participants',
        'Enjoys group discount',
        'Receives product delivery'
      ],
      benefits: [
        'Access to wholesale prices',
        'Quality products',
        'Consumer protection',
        'Community buying power'
      ]
    },
    {
      type: 'P2P',
      title: 'Peer to Peer',
      description: 'Individuals organizing group purchases together',
      icon: Users,
      color: 'purple',
      steps: [
        'Individual creates group offer',
        'Friends/community join',
        'Collective negotiation power',
        'Shared shipping costs',
        'Everyone saves money'
      ],
      benefits: [
        'Community-driven savings',
        'Shared shipping costs',
        'Social buying experience',
        'Local group coordination'
      ]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Discover Offers',
      description: 'Browse through various group buying opportunities across different categories',
      icon: Package
    },
    {
      step: 2,
      title: 'Join Groups',
      description: 'Join interesting offers and wait for minimum participants to unlock discounts',
      icon: Users
    },
    {
      step: 3,
      title: 'Unlock Savings',
      description: 'As more people join, better discounts are unlocked for everyone',
      icon: TrendingDown
    },
    {
      step: 4,
      title: 'Secure Payment',
      description: 'Pay securely through our platform with multiple payment options',
      icon: CreditCard
    },
    {
      step: 5,
      title: 'Get Delivered',
      description: 'Receive your products with the benefits of group pricing',
      icon: CheckCircle
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All payments are secure and protected with our advanced security measures'
    },
    {
      icon: Star,
      title: 'Quality Assurance',
      description: 'Verified suppliers and quality products with customer reviews and ratings'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with suppliers and buyers from around the world'
    },
    {
      icon: Handshake,
      title: 'Trust & Transparency',
      description: 'KYC verified users and transparent pricing with no hidden fees'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50';
      case 'green': return 'border-green-200 bg-green-50';
      case 'purple': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How Group Buying Works
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover the power of collective purchasing across B2B, B2C, and P2P markets
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/')}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Flow Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Three Powerful Buying Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform supports multiple buying models to serve different needs and markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {flows.map((flow) => {
              const IconComponent = flow.icon;
              return (
                <Card key={flow.type} className={`p-8 border-2 ${getColorClasses(flow.color)}`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center`}>
                      <IconComponent className={`w-8 h-8 ${getIconColor(flow.color)}`} />
                    </div>
                    <Badge className="mb-2" variant="outline">{flow.type}</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{flow.title}</h3>
                    <p className="text-gray-600">{flow.description}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">How it works:</h4>
                      <ol className="space-y-2">
                        {flow.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className={`w-5 h-5 rounded-full ${getIconColor(flow.color)} bg-white border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                      <ul className="space-y-1">
                        {flow.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 5-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              From discovery to delivery, here's how group buying works on our platform
            </p>
          </div>

          <div className="relative">
            {processSteps.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.step} className="flex items-center mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mr-8">
                    <IconComponent className="w-10 h-10" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Badge className="mr-3">Step {item.step}</Badge>
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{item.description}</p>
                  </div>

                  {index < processSteps.length - 1 && (
                    <div className="absolute left-12 mt-24">
                      <ArrowRight className="w-6 h-6 text-blue-400 transform rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600">
              Built with trust, security, and user experience in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Group Buying?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already saving money through the power of group buying
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Join as Buyer
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/seller/register')}
              >
                Become a Seller
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;
