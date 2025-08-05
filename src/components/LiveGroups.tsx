
import React from 'react';
import { MapPin, Users, Clock, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const LiveGroups = () => {
  const liveGroups = [
    {
      id: 1,
      name: 'Tech Hardware Procurement Alliance',
      sector: 'Technology',
      country: 'United States',
      status: 'Active Negotiation',
      type: 'members',
      memberCount: 12,
      targetCount: 20,
      daysLeft: 5
    },
    {
      id: 2,
      name: 'Healthcare Marketing Consortium',
      sector: 'Healthcare',
      country: 'Canada',
      status: 'Member Voting',
      type: 'suppliers',
      memberCount: 8,
      targetCount: 15,
      daysLeft: 3
    },
    {
      id: 3,
      name: 'Manufacturing Supply Chain Network',
      sector: 'Manufacturing',
      country: 'Germany',
      status: 'Supplier Selection',
      type: 'freelancers',
      memberCount: 25,
      targetCount: 30,
      daysLeft: 7
    },
    {
      id: 4,
      name: 'Fintech Legal Documentation Group',
      sector: 'Finance',
      country: 'United Kingdom',
      status: 'Document Review',
      type: 'members',
      memberCount: 6,
      targetCount: 12,
      daysLeft: 2
    },
    {
      id: 5,
      name: 'E-commerce Marketing Alliance',
      sector: 'Retail',
      country: 'Australia',
      status: 'Campaign Planning',
      type: 'suppliers',
      memberCount: 15,
      targetCount: 18,
      daysLeft: 4
    },
    {
      id: 6,
      name: 'EdTech Development Collective',
      sector: 'Education',
      country: 'United States',
      status: 'Team Assembly',
      type: 'freelancers',
      memberCount: 9,
      targetCount: 15,
      daysLeft: 6
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Negotiation': return 'bg-blue-100 text-blue-800';
      case 'Member Voting': return 'bg-purple-100 text-purple-800';
      case 'Supplier Selection': return 'bg-green-100 text-green-800';
      case 'Document Review': return 'bg-orange-100 text-orange-800';
      case 'Campaign Planning': return 'bg-teal-100 text-teal-800';
      case 'Team Assembly': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'members': return '👥 Seeking Members';
      case 'suppliers': return '🏢 Seeking Suppliers';
      case 'freelancers': return '💼 Seeking Freelancers';
      default: return '🔍 Exploring';
    }
  };

  const categories = [
    { label: 'Seeking Members', count: liveGroups.filter(g => g.type === 'members').length },
    { label: 'Seeking Suppliers', count: liveGroups.filter(g => g.type === 'suppliers').length },
    { label: 'Seeking Freelancers', count: liveGroups.filter(g => g.type === 'freelancers').length }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Groups & Active Opportunities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join active groups or discover new collaboration opportunities in real-time
          </p>
          
          {/* Category Summary */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
                <span className="font-medium text-gray-900">{category.label}: </span>
                <span className="font-bold text-productivity-blue">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge className={`${getStatusColor(group.status)} border-0`}>
                  {group.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {group.daysLeft}d left
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                {group.name}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{group.sector} • {group.country}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount}/{group.targetCount} members</span>
                </div>

                <div className="text-sm font-medium text-productivity-blue">
                  {getTypeIcon(group.type)}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-productivity-blue to-productivity-purple h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(group.memberCount / group.targetCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              <Button className="w-full bg-productivity-blue hover:bg-productivity-blue/90">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-productivity-blue/10 to-productivity-purple/10 rounded-2xl p-8 border border-white/50">
            <TrendingUp className="w-16 h-16 text-productivity-blue mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Own Group?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't see a group that fits your needs? Create your own and we'll help you find the perfect members and partners.
            </p>
            <Button size="lg" className="bg-productivity-green hover:bg-productivity-green/90">
              Create New Group
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveGroups;
