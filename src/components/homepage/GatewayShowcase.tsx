
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Megaphone, 
  Truck, 
  Users, 
  Building2, 
  Scale,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GatewayShowcase = () => {
  const navigate = useNavigate();

  const gateways = [
    {
      id: 'purchasing',
      title: 'Collaborative Purchasing',
      description: 'Unite with other businesses to leverage collective buying power and secure better deals through group negotiations.',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      features: ['Group Buying Power', 'Supplier Negotiations', 'Cost Savings', 'Quality Assurance'],
      stats: { groups: 45, members: '2.1k', savings: '35%' }
    },
    {
      id: 'marketing',
      title: 'Collaborative Marketing',
      description: 'Partner with complementary businesses to amplify your reach and share marketing costs effectively.',
      icon: Megaphone,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      features: ['Cross-Promotion', 'Shared Campaigns', 'Audience Expansion', 'Cost Sharing'],
      stats: { groups: 32, members: '1.8k', savings: '50%' }
    },
    {
      id: 'suppliers',
      title: 'Verified Suppliers',
      description: 'Connect with pre-vetted suppliers offering exclusive deals and reliable partnership opportunities.',
      icon: Truck,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      features: ['Verified Partners', 'Exclusive Deals', 'Quality Guaranteed', 'Direct Communication'],
      stats: { groups: 28, members: '1.5k', savings: '40%' }
    },
    {
      id: 'freelancers',
      title: 'Freelancer Networks',
      description: 'Access skilled professionals individually or as coordinated teams for your project needs.',
      icon: Users,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      features: ['Vetted Professionals', 'Team Coordination', 'Flexible Engagement', 'Quality Delivery'],
      stats: { groups: 52, members: '3.2k', savings: '30%' }
    },
    {
      id: 'formation',
      title: 'Business Formation',
      description: 'Streamline your business setup with expert guidance and comprehensive legal support.',
      icon: Building2,
      gradient: 'from-teal-500 to-blue-500',
      bgGradient: 'from-teal-50 to-blue-50',
      features: ['Legal Guidance', 'Document Preparation', 'Compliance Support', 'Fast Processing'],
      stats: { groups: 18, members: '892', savings: '60%' }
    },
    {
      id: 'legal',
      title: 'Legal & Arbitration',
      description: 'Resolve disputes efficiently and create solid contracts with our legal expertise.',
      icon: Scale,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      features: ['Dispute Resolution', 'Contract Creation', 'Legal Compliance', 'Expert Mediation'],
      stats: { groups: 12, members: '567', savings: '45%' }
    }
  ];

  const handleGatewayClick = (gatewayId: string) => {
    navigate(`/gateway/${gatewayId}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Specialized Business Gateways</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Business Gateway
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each gateway is designed for specific business needs, offering specialized tools, 
            communities, and opportunities for collaboration.
          </p>
        </div>

        {/* Gateway Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gateways.map((gateway) => {
            const IconComponent = gateway.icon;
            return (
              <Card 
                key={gateway.id}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm hover:scale-105"
                onClick={() => handleGatewayClick(gateway.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gateway.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-8 h-8 bg-gradient-to-r ${gateway.gradient} bg-clip-text text-transparent`} />
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {gateway.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {gateway.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {gateway.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gateway.gradient}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{gateway.stats.groups}</div>
                      <div className="text-gray-500">Groups</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{gateway.stats.members}</div>
                      <div className="text-gray-500">Members</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold bg-gradient-to-r ${gateway.gradient} bg-clip-text text-transparent`}>
                        {gateway.stats.savings}
                      </div>
                      <div className="text-gray-500">Avg Savings</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${gateway.gradient} hover:opacity-90 text-white shadow-lg group-hover:shadow-xl transition-all`}
                  >
                    Explore Gateway
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't Find the Right Gateway?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our AI will help you create a custom gateway and connect you with relevant businesses 
              from our global network.
            </p>
            <Button size="lg" variant="outline" className="bg-white border-blue-200 hover:bg-blue-50">
              Create Custom Gateway
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GatewayShowcase;
