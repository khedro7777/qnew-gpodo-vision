import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface PlatformGroup {
  id: string;
  name: string;
  description: string;
  gateway_type: 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal';
  current_members: number;
  max_members: number;
  status: string;
  is_public: boolean;
  created_at: string;
  countries?: { name: string; flag_emoji: string };
  industry_sectors?: { name: string; icon: string };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  kyc_status: 'pending' | 'approved' | 'rejected' | 'submitted';
  is_verified: boolean;
  company_name?: string;
  country_code?: string;
  industry_sector?: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'api' | 'supplier';
}

export const usePlatformGroups = () => {
  return useQuery({
    queryKey: ['platform_groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          countries(name, flag_emoji),
          industry_sectors(name, icon)
        `)
        .eq('is_public', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error);
        throw error;
      }

      return data as PlatformGroup[];
    },
  });
};

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user_profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data as UserProfile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileData: Partial<Omit<UserProfile, 'id'>>) => {
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        ...profileData,
        ...(profileData.kyc_status && {
          kyc_status: profileData.kyc_status as 'pending' | 'approved' | 'rejected' | 'submitted'
        })
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error('Error updating profile: ' + error.message);
    },
  });
};

export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this group');
      }

      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      const { data: currentGroup } = await supabase
        .from('groups')
        .select('current_members')
        .eq('id', groupId)
        .single();

      if (currentGroup) {
        await supabase
          .from('groups')
          .update({ current_members: (currentGroup.current_members || 0) + 1 })
          .eq('id', groupId);
      }

      return groupId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform_groups'] });
      queryClient.invalidateQueries({ queryKey: ['user_groups'] });
      toast.success('Successfully joined group');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error joining group');
    },
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (groupData: {
      name: string;
      description: string;
      gateway_type: 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal';
      max_members?: number;
      is_public?: boolean;
      country_id?: string;
      industry_sector_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('groups')
        .insert({
          ...groupData,
          creator_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'founder'
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform_groups'] });
      queryClient.invalidateQueries({ queryKey: ['user_groups'] });
      toast.success('Group created successfully');
    },
    onError: (error: any) => {
      toast.error('Error creating group: ' + error.message);
    },
  });
};

export const useUserGroups = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user_groups', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          role,
          joined_at,
          groups!inner(
            *,
            countries(name, flag_emoji),
            industry_sectors(name, icon)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user groups:', error);
        throw error;
      }

      return data.map(item => ({
        ...item.groups,
        user_role: item.role,
        joined_at: item.joined_at
      }));
    },
    enabled: !!user,
  });
};

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platform_stats'],
    queryFn: async () => {
      const [usersRes, groupsRes, contractsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('groups').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('group_proposals').select('id', { count: 'exact' })
      ]);

      return {
        totalUsers: usersRes.count || 0,
        activeGroups: groupsRes.count || 0,
        totalContracts: contractsRes.count || 0,
        monthlyGrowth: 15.2,
        platformHealth: 99.9
      };
    },
  });
};

export const useCountriesAndSectors = () => {
  return useQuery({
    queryKey: ['countries_sectors'],
    queryFn: async () => {
      const [countriesRes, sectorsRes] = await Promise.all([
        supabase.from('countries').select('*').order('name'),
        supabase.from('industry_sectors').select('*').order('name')
      ]);

      if (countriesRes.error) throw countriesRes.error;
      if (sectorsRes.error) throw sectorsRes.error;

      return {
        countries: countriesRes.data || [],
        sectors: sectorsRes.data || []
      };
    },
  });
};
