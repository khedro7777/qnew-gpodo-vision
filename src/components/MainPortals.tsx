
import React from 'react';
import { 
  ShoppingCart, 
  Megaphone, 
  Truck, 
  Users, 
  Building2, 
  Scale,
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MainPortals = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 1,
      title: 'Collaborative Purchasing',
      description: 'Join forces with other businesses to negotiate better prices and terms with suppliers through group buying power.',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      route: 'purchasing'
    },
    {
      id: 2,
      title: 'Collaborative Marketing',
      description: 'Partner with complementary businesses to share marketing costs, expand reach, and create powerful joint campaigns.',
      icon: Megaphone,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      route: 'marketing'
    },
    {
      id: 3,
      title: 'Supplier Offers',
      description: 'Connect directly with verified suppliers offering exclusive deals, bulk discounts, and partnership opportunities.',
      icon: Truck,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      route: 'suppliers'
    },
    {
      id: 4,
      title: 'Freelancers (Solo / Group)',
      description: 'Access skilled freelancers for individual projects or coordinated teams for complex, multi-disciplinary initiatives.',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      route: 'freelancers'
    },
    {
      id: 5,
      title: 'Company Formation & Incorporation',
      description: 'Streamline business setup with expert guidance, legal documentation, and regulatory compliance support.',
      icon: Building2,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100',
      route: 'formation'
    },
    {
      id: 6,
      title: 'Arbitration & Legal Documentation',
      description: 'Resolve disputes efficiently and create bulletproof contracts with our legal experts and arbitration services.',
      icon: Scale,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      route: 'legal'
    }
  ];

  const handlePortalClick = (route: string) => {
    navigate(`/gateway/${route}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our B2B Portals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover specialized gateways designed to enhance every aspect of your business operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            return (
              <div
                key={portal.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handlePortalClick(portal.route)}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${portal.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-8 h-8 bg-gradient-to-r ${portal.color} bg-clip-text text-transparent`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-productivity-blue transition-colors">
                  {portal.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {portal.description}
                </p>
                
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-productivity-blue group-hover:text-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePortalClick(portal.route);
                  }}
                >
                  Explore Portal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MainPortals;
