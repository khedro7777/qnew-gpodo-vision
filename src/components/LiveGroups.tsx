
import React from 'react';
import { MapPin, Users, Clock, TrendingUp, Eye, Loader2, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGroups } from '@/hooks/useSupabaseData';

const LiveGroups = () => {
  const { data: groups, isLoading } = useGroups();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGatewayTypeDisplay = (type: string) => {
    switch (type) {
      case 'purchasing': return '🛒 Collaborative Purchasing';
      case 'marketing': return '📢 Collaborative Marketing';
      case 'suppliers': return '🏢 Supplier Network';
      case 'freelancers': return '💼 Freelancer Hub';
      case 'formation': return '🏗️ Company Formation';
      case 'legal': return '⚖️ Legal & Arbitration';
      default: return '🔍 Exploring';
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-productivity-blue" />
          </div>
        </div>
      </section>
    );
  }

  const activeGroups = groups?.filter(group => group.status === 'active') || [];
  const pendingGroups = groups?.filter(group => group.status === 'pending') || [];

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
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
              <span className="font-medium text-gray-900">Active Groups: </span>
              <span className="font-bold text-productivity-green">{activeGroups.length}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
              <span className="font-medium text-gray-900">Pending Groups: </span>
              <span className="font-bold text-productivity-blue">{pendingGroups.length}</span>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-white/50">
              <span className="font-medium text-gray-900">Total Opportunities: </span>
              <span className="font-bold text-productivity-purple">{groups?.length || 0}</span>
            </div>
          </div>
        </div>

        {groups && groups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <Badge className={`${getStatusColor(group.status)} border-0 capitalize`}>
                    {group.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {Math.ceil((new Date().getTime() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24))}d ago
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {group.name}
                </h3>

                {group.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {group.description}
                  </p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {group.industry_sectors?.name || 'General'} • {group.countries?.flag_emoji} {group.countries?.name || 'Global'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{group.current_members}/{group.max_members} members</span>
                  </div>

                  <div className="text-sm font-medium text-productivity-blue">
                    {getGatewayTypeDisplay(group.gateway_type)}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-productivity-blue to-productivity-purple h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
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
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Groups Yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to create a group and start building your B2B network!
              </p>
              <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
                Create First Group
              </Button>
            </div>
          </div>
        )}

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
