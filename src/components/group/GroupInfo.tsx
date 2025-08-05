
import React from 'react';
import { Calendar, Users, MapPin, Building2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GroupInfoProps {
  groupId: string;
}

const GroupInfo = ({ groupId }: GroupInfoProps) => {
  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          industry_sectors(name, icon),
          countries(name, flag_emoji)
        `)
        .eq('id', groupId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: creatorProfile } = useQuery({
    queryKey: ['creator-profile', group?.creator_id],
    queryFn: async () => {
      if (!group?.creator_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, company_name')
        .eq('id', group.creator_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!group?.creator_id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Under Review';
      case 'closed': return 'Closed';
      case 'archived': return 'Archived';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-productivity-blue" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
        <p className="text-center text-gray-600">Group not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {group.name}
          </h1>
          <p className="text-gray-600">
            Created by {creatorProfile?.full_name || 'Unknown'} 
            {creatorProfile?.company_name && ` from ${creatorProfile.company_name}`}
          </p>
        </div>
        <Badge className={`${getStatusColor(group.status)} border-0`}>
          {getStatusText(group.status)}
        </Badge>
      </div>

      {group.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Purpose</h3>
          <p className="text-gray-700 leading-relaxed">{group.description}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Creation Date</p>
              <p className="font-medium text-gray-900">
                {new Date(group.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="font-medium text-gray-900">
                {group.current_members} / {group.max_members}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Industry</p>
              <p className="font-medium text-gray-900">
                {group.industry_sectors?.icon} {group.industry_sectors?.name || 'General'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">
                {group.countries?.flag_emoji} {group.countries?.name || 'Global'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Group Capacity</span>
          <span className="text-sm text-gray-500">
            {Math.round((group.current_members / group.max_members) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-productivity-blue to-productivity-purple h-3 rounded-full transition-all duration-300"
            style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
