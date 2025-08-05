
import React from 'react';
import { ShoppingCart, Megaphone, Truck, Users, Building2, Scale } from 'lucide-react';

interface GatewayIntroProps {
  gatewayType: string;
}

const GatewayIntro = ({ gatewayType }: GatewayIntroProps) => {
  const getGatewayInfo = (type: string) => {
    switch (type) {
      case 'purchasing':
        return {
          title: 'Collaborative Purchasing',
          description: 'Join forces with other businesses to negotiate better prices and terms with suppliers through group buying power. Leverage collective purchasing to reduce costs and improve supplier relationships.',
          icon: ShoppingCart,
          color: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-50 to-blue-100',
          benefits: [
            'Negotiate better prices through group buying power',
            'Access to premium suppliers and exclusive deals',
            'Shared logistics and shipping costs',
            'Quality assurance through group verification'
          ]
        };
      case 'marketing':
        return {
          title: 'Collaborative Marketing',
          description: 'Partner with complementary businesses to share marketing costs, expand reach, and create powerful joint campaigns. Build strategic marketing alliances that benefit all participants.',
          icon: Megaphone,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'from-purple-50 to-purple-100',
          benefits: [
            'Share marketing costs and resources',
            'Expand audience reach through cross-promotion',
            'Create powerful joint campaigns',
            'Access to diverse marketing expertise'
          ]
        };
      case 'suppliers':
        return {
          title: 'Supplier Offers',
          description: 'Connect directly with verified suppliers offering exclusive deals, bulk discounts, and partnership opportunities. Access a curated network of reliable business partners.',
          icon: Truck,
          color: 'from-green-500 to-green-600',
          bgColor: 'from-green-50 to-green-100',
          benefits: [
            'Access to verified and trusted suppliers',
            'Exclusive deals and bulk discounts',
            'Direct communication channels',
            'Quality-assured partnerships'
          ]
        };
      case 'freelancers':
        return {
          title: 'Freelancers (Solo / Group)',
          description: 'Access skilled freelancers for individual projects or coordinated teams for complex, multi-disciplinary initiatives. Find the right talent for your business needs.',
          icon: Users,
          color: 'from-orange-500 to-orange-600',
          bgColor: 'from-orange-50 to-orange-100',
          benefits: [
            'Access to pre-vetted freelancers',
            'Individual or team-based projects',
            'Diverse skill sets and expertise',
            'Flexible engagement models'
          ]
        };
      case 'formation':
        return {
          title: 'Company Formation & Incorporation',
          description: 'Streamline business setup with expert guidance, legal documentation, and regulatory compliance support. Get professional help for your business formation needs.',
          icon: Building2,
          color: 'from-teal-500 to-teal-600',
          bgColor: 'from-teal-50 to-teal-100',
          benefits: [
            'Expert legal guidance and support',
            'Streamlined incorporation process',
            'Regulatory compliance assistance',
            'Professional documentation services'
          ]
        };
      case 'legal':
        return {
          title: 'Arbitration & Legal Documentation',
          description: 'Resolve disputes efficiently and create bulletproof contracts with our legal experts and arbitration services. Ensure your business relationships are protected.',
          icon: Scale,
          color: 'from-red-500 to-red-600',
          bgColor: 'from-red-50 to-red-100',
          benefits: [
            'Professional dispute resolution',
            'Expert contract creation and review',
            'Efficient arbitration services',
            'Legal compliance assurance'
          ]
        };
      default:
        return {
          title: 'Gateway',
          description: 'Explore business opportunities',
          icon: Users,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'from-gray-50 to-gray-100',
          benefits: []
        };
    }
  };

  const gatewayInfo = getGatewayInfo(gatewayType);
  const IconComponent = gatewayInfo.icon;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${gatewayInfo.bgColor} flex items-center justify-center mx-auto mb-6`}>
            <IconComponent className={`w-10 h-10 bg-gradient-to-r ${gatewayInfo.color} bg-clip-text text-transparent`} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {gatewayInfo.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            {gatewayInfo.description}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {gatewayInfo.benefits.map((benefit, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gatewayInfo.bgColor} flex items-center justify-center mb-4`}>
                <span className="text-lg">✓</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">{benefit}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Active Groups in {gatewayInfo.title}
          </h2>
          <p className="text-gray-600 mb-8">
            Discover and join active groups that match your business needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default GatewayIntro;
