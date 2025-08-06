
import React from 'react';
import { MapPin, Users, Clock, Eye, Building, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGroups } from '@/hooks/useSupabaseData';
import { useNavigate } from 'react-router-dom';

interface GatewayGroupsProps {
  gatewayType: string;
}

const GatewayGroups = ({ gatewayType }: GatewayGroupsProps) => {
  const { data: allGroups, isLoading } = useGroups();
  const navigate = useNavigate();

  // Mock data for demonstration with proper English content
  const mockGroups = [
    {
      id: 'group-1',
      name: 'Medical Equipment Group Purchasing',
      description: 'Collaborative purchasing of medical equipment for healthcare facilities',
      gateway_type: 'purchasing',
      status: 'active',
      current_members: 12,
      max_members: 20,
      created_at: '2024-01-15T10:00:00Z',
      industry_sectors: { name: 'Healthcare', icon: '🏥' },
      countries: { name: 'Saudi Arabia', flag_emoji: '🇸🇦' }
    },
    {
      id: 'group-2',
      name: 'Tech Startups Marketing Alliance',
      description: 'Joint marketing campaigns for technology startups',
      gateway_type: 'marketing',
      status: 'active',
      current_members: 8,
      max_members: 15,
      created_at: '2024-01-20T14:30:00Z',
      industry_sectors: { name: 'Technology', icon: '💻' },
      countries: { name: 'United Arab Emirates', flag_emoji: '🇦🇪' }
    },
    {
      id: 'group-3',
      name: 'Construction Materials Suppliers',
      description: 'Premium suppliers offering bulk construction materials',
      gateway_type: 'suppliers',
      status: 'active',
      current_members: 15,
      max_members: 25,
      created_at: '2024-01-10T09:15:00Z',
      industry_sectors: { name: 'Construction', icon: '🏗️' },
      countries: { name: 'Egypt', flag_emoji: '🇪🇬' }
    },
    {
      id: 'group-4',
      name: 'Digital Design Freelancers',
      description: 'Professional freelancers specializing in digital design and branding',
      gateway_type: 'freelancers',
      status: 'active',
      current_members: 18,
      max_members: 30,
      created_at: '2024-01-25T16:45:00Z',
      industry_sectors: { name: 'Creative Services', icon: '🎨' },
      countries: { name: 'Jordan', flag_emoji: '🇯🇴' }
    },
    {
      id: 'group-5',
      name: 'E-commerce Business Formation',
      description: 'Support group for e-commerce business setup and incorporation',
      gateway_type: 'formation',
      status: 'active',
      current_members: 6,
      max_members: 12,
      created_at: '2024-02-01T11:20:00Z',
      industry_sectors: { name: 'E-commerce', icon: '🛍️' },
      countries: { name: 'Kuwait', flag_emoji: '🇰🇼' }
    },
    {
      id: 'group-6',
      name: 'Contract Dispute Resolution',
      description: 'Legal arbitration and documentation services for business contracts',
      gateway_type: 'legal',
      status: 'active',
      current_members: 4,
      max_members: 10,
      created_at: '2024-01-28T13:10:00Z',
      industry_sectors: { name: 'Legal Services', icon: '⚖️' },
      countries: { name: 'Bahrain', flag_emoji: '🇧🇭' }
    }
  ];

  const groups = mockGroups.filter(group => group.gateway_type === gatewayType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/group/${groupId}/profile`);
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

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/30">
      <div className="max-w-7xl mx-auto">
        {groups && groups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleGroupClick(group.id)}
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
                  View Group Profile
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
                Be the first to create a group in this gateway and start building your network!
              </p>
              <Button className="bg-productivity-blue hover:bg-productivity-blue/90">
                Create First Group
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GatewayGroups;
