
import { useQuery } from '@tanstack/react-query';
import { useDemo } from '@/contexts/DemoContext';
import { demoGroups, demoOffers, demoUserProfile } from '@/components/demo/DemoDataProvider';
import { supabase } from '@/integrations/supabase/client';

export const useDemoCountries = () => {
  const { isDemoMode } = useDemo();
  
  return useQuery({
    queryKey: ['countries', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return [
          { id: '1', code: 'US', name: 'United States', flag_emoji: '🇺🇸' },
          { id: '2', code: 'GB', name: 'United Kingdom', flag_emoji: '🇬🇧' },
          { id: '3', code: 'DE', name: 'Germany', flag_emoji: '🇩🇪' }
        ];
      }
      
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDemoIndustrySectors = () => {
  const { isDemoMode } = useDemo();
  
  return useQuery({
    queryKey: ['industry_sectors', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return [
          { id: '1', name: 'Technology', icon: '💻' },
          { id: '2', name: 'Healthcare', icon: '🏥' },
          { id: '3', name: 'Finance', icon: '💰' }
        ];
      }
      
      const { data, error } = await supabase
        .from('industry_sectors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDemoGroups = () => {
  const { isDemoMode } = useDemo();
  
  return useQuery({
    queryKey: ['groups', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return demoGroups;
      }
      
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          industry_sectors(name, icon),
          countries(name, flag_emoji)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDemoUserProfile = () => {
  const { isDemoMode } = useDemo();
  
  return useQuery({
    queryKey: ['user_profile', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return demoUserProfile;
      }
      
      // Return null for live mode - will be handled by actual auth
      return null;
    },
    enabled: isDemoMode,
  });
};
