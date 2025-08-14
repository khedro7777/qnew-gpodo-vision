
import React from 'react';
import { ShoppingCart, Megaphone, Truck, Users, Building2, Scale, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GatewayIntroProps {
  gatewayType: string;
}

const GatewayIntro = ({ gatewayType }: GatewayIntroProps) => {
  const getGatewayInfo = (type: string) => {
    switch (type) {
      case 'purchasing':
        return {
          title: 'Collaborative Purchasing Gateway',
          subtitle: 'Leverage Collective Buying Power',
          description: 'Transform your procurement strategy by joining forces with other businesses. Our collaborative purchasing gateway enables you to negotiate better prices, access premium suppliers, and achieve significant cost savings through group buying power.',
          icon: ShoppingCart,
          gradient: 'from-blue-500 to-cyan-500',
          bgGradient: 'from-blue-50 to-cyan-50',
          howItWorks: [
            'Join or create purchasing groups based on your needs',
            'Collaborate with other businesses to increase buying power',
            'Negotiate directly with verified suppliers for better terms',
            'Execute group purchases with transparent cost sharing',
            'Track savings and manage orders through our platform'
          ],
          benefits: [
            'Reduce procurement costs by 30-50%',
            'Access to premium suppliers and exclusive deals',
            'Shared logistics and shipping costs',
            'Quality assurance through group verification',
            'Streamlined purchase order management',
            'Risk mitigation through collective bargaining'
          ],
          stats: { activeGroups: 45, totalMembers: '2.1k', avgSavings: '35%', completedDeals: '890+' }
        };
      case 'marketing':
        return {
          title: 'Collaborative Marketing Gateway',
          subtitle: 'Amplify Your Reach Together',
          description: 'Partner with complementary businesses to share marketing costs, expand audience reach, and create powerful joint campaigns. Our marketing gateway connects you with strategic partners for mutual growth.',
          icon: Megaphone,
          gradient: 'from-purple-500 to-pink-500',
          bgGradient: 'from-purple-50 to-pink-50',
          howItWorks: [
            'Find complementary businesses in your target market',
            'Propose and negotiate joint marketing campaigns',
            'Share costs and resources for maximum impact',
            'Execute coordinated marketing strategies',
            'Track performance and ROI across partnerships'
          ],
          benefits: [
            'Reduce marketing costs by sharing expenses',
            'Expand audience reach through cross-promotion',
            'Access diverse marketing expertise and tools',
            'Create more impactful joint campaigns',
            'Build strategic business relationships',
            'Achieve better ROI on marketing spend'
          ],
          stats: { activeGroups: 32, totalMembers: '1.8k', avgSavings: '50%', completedDeals: '450+' }
        };
      case 'suppliers':
        return {
          title: 'Verified Suppliers Gateway',
          subtitle: 'Connect with Trusted Partners',
          description: 'Access our curated network of verified suppliers offering exclusive deals, bulk discounts, and reliable partnership opportunities. Every supplier is thoroughly vetted for quality and reliability.',
          icon: Truck,
          gradient: 'from-green-500 to-emerald-500',
          bgGradient: 'from-green-50 to-emerald-50',
          howItWorks: [
            'Browse our verified supplier directory',
            'Review supplier profiles, ratings, and certifications',
            'Request quotes and negotiate terms directly',
            'Form buyer groups for better pricing',
            'Manage orders and track deliveries'
          ],
          benefits: [
            'Access to pre-vetted, reliable suppliers',
            'Exclusive deals and bulk pricing options',
            'Direct communication channels',
            'Quality guarantees and dispute resolution',
            'Streamlined procurement processes',
            'Risk-free partnerships with verified vendors'
          ],
          stats: { activeGroups: 28, totalMembers: '1.5k', avgSavings: '40%', completedDeals: '670+' }
        };
      case 'freelancers':
        return {
          title: 'Freelancer Networks Gateway',
          subtitle: 'Access Global Talent',
          description: 'Connect with skilled freelancers for individual projects or coordinated teams for complex, multi-disciplinary initiatives. Our network includes vetted professionals across all industries.',
          icon: Users,
          gradient: 'from-orange-500 to-red-500',
          bgGradient: 'from-orange-50 to-red-50',
          howItWorks: [
            'Post your project requirements or browse available talent',
            'Review freelancer profiles, portfolios, and ratings',
            'Form project teams or hire individual specialists',
            'Manage projects with built-in collaboration tools',
            'Handle payments and deliverables securely'
          ],
          benefits: [
            'Access to pre-vetted, skilled professionals',
            'Flexible engagement models (individual or team)',
            'Diverse skill sets and global expertise',
            'Integrated project management tools',
            'Secure payment and escrow services',
            'Quality assurance and dispute resolution'
          ],
          stats: { activeGroups: 52, totalMembers: '3.2k', avgSavings: '30%', completedDeals: '1.2k+' }
        };
      case 'formation':
        return {
          title: 'Business Formation Gateway',
          subtitle: 'Launch Your Business Right',
          description: 'Streamline your business setup with expert guidance, legal documentation, and regulatory compliance support. Get professional help to establish your business efficiently and correctly.',
          icon: Building2,
          gradient: 'from-teal-500 to-blue-500',
          bgGradient: 'from-teal-50 to-blue-50',
          howItWorks: [
            'Choose your business structure and jurisdiction',
            'Get matched with legal experts in your region',
            'Complete formation documents with guided assistance',
            'Handle regulatory filings and compliance requirements',
            'Receive ongoing support for business operations'
          ],
          benefits: [
            'Expert legal guidance throughout the process',
            'Streamlined incorporation and setup',
            'Regulatory compliance assistance',
            'Professional documentation services',
            'Ongoing business support and advice',
            'Cost-effective legal solutions'
          ],
          stats: { activeGroups: 18, totalMembers: '892', avgSavings: '60%', completedDeals: '234+' }
        };
      case 'legal':
        return {
          title: 'Legal & Arbitration Gateway',
          subtitle: 'Resolve Disputes Efficiently',
          description: 'Access professional dispute resolution services and create bulletproof contracts with our legal experts. Our arbitration services ensure fair, efficient resolution of business disputes.',
          icon: Scale,
          gradient: 'from-red-500 to-pink-500',
          bgGradient: 'from-red-50 to-pink-50',
          howItWorks: [
            'Submit your legal matter or dispute for review',
            'Get matched with qualified legal professionals',
            'Engage in mediation or arbitration proceedings',
            'Receive expert contract drafting and review',
            'Execute legally binding resolutions'
          ],
          benefits: [
            'Professional dispute resolution services',
            'Expert contract creation and review',
            'Efficient arbitration processes',
            'Legal compliance assurance',
            'Cost-effective legal solutions',
            'Enforceable legal agreements'
          ],
          stats: { activeGroups: 12, totalMembers: '567', avgSavings: '45%', completedDeals: '178+' }
        };
      default:
        return {
          title: 'Business Gateway',
          subtitle: 'Explore Opportunities',
          description: 'Discover business collaboration opportunities',
          icon: Users,
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-100',
          howItWorks: [],
          benefits: [],
          stats: { activeGroups: 0, totalMembers: '0', avgSavings: '0%', completedDeals: '0' }
        };
    }
  };

  const gatewayInfo = getGatewayInfo(gatewayType);
  const IconComponent = gatewayInfo.icon;

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-r ${gatewayInfo.bgGradient} flex items-center justify-center mx-auto mb-8 shadow-lg`}>
              <IconComponent className={`w-12 h-12 bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent`} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              {gatewayInfo.title}
            </h1>
            
            <p className="text-2xl text-blue-600 font-semibold mb-6">
              {gatewayInfo.subtitle}
            </p>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {gatewayInfo.description}
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent`}>
                  {gatewayInfo.stats.activeGroups}
                </div>
                <div className="text-gray-600 font-medium">Active Groups</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent`}>
                  {gatewayInfo.stats.totalMembers}
                </div>
                <div className="text-gray-600 font-medium">Total Members</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent`}>
                  {gatewayInfo.stats.avgSavings}
                </div>
                <div className="text-gray-600 font-medium">Avg Savings</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent`}>
                  {gatewayInfo.stats.completedDeals}
                </div>
                <div className="text-gray-600 font-medium">Completed Deals</div>
              </div>
            </div>

            <Button size="lg" className={`bg-gradient-to-r ${gatewayInfo.gradient} hover:opacity-90 text-white shadow-lg px-8 py-6 text-lg`}>
              Join This Gateway
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works & Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* How It Works */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
              <div className="space-y-6">
                {gatewayInfo.howItWorks.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gatewayInfo.gradient} text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Benefits</h2>
              <div className="space-y-4">
                {gatewayInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 bg-gradient-to-r ${gatewayInfo.gradient} bg-clip-text text-transparent flex-shrink-0 mt-0.5`} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Active Groups */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join Active Groups?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover and connect with active groups in {gatewayInfo.title.toLowerCase()} below
          </p>
        </div>
      </section>
    </div>
  );
};

export default GatewayIntro;
