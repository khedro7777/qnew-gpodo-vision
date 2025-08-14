
import React from 'react';
import { TrendingUp, Users, Building, Award, Globe, Zap } from 'lucide-react';

const PlatformStats = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Members',
      description: 'Growing community of business professionals',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building,
      value: '187',
      label: 'Active Groups',
      description: 'Collaborative business groups worldwide',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      value: '$2.5M+',
      label: 'Total Savings',
      description: 'Generated through group collaborations',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      value: '98.5%',
      label: 'Success Rate',
      description: 'Successful group collaborations',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe,
      value: '45+',
      label: 'Countries',
      description: 'Global reach and presence',
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: Zap,
      value: '24/7',
      label: 'AI Support',
      description: 'Round-the-clock intelligent assistance',
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Platform That Delivers Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of businesses that have transformed their operations 
            through our collaborative platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`w-8 h-8 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} />
                </div>
                
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
