
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useDemo } from '@/contexts/DemoContext';
import { useDemoCountries, useDemoIndustrySectors, useDemoGroups } from './useDemoSupabaseData';

export const useCountries = () => {
  const { isDemoMode } = useDemo();
  const demoQuery = useDemoCountries();
  
  const liveQuery = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !isDemoMode,
  });

  return isDemoMode ? demoQuery : liveQuery;
};

export const useIndustrySectors = () => {
  const { isDemoMode } = useDemo();
  const demoQuery = useDemoIndustrySectors();
  
  const liveQuery = useQuery({
    queryKey: ['industry_sectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industry_sectors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !isDemoMode,
  });

  return isDemoMode ? demoQuery : liveQuery;
};

export const useGroups = () => {
  const { isDemoMode } = useDemo();
  const demoQuery = useDemoGroups();
  
  const liveQuery = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
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
    enabled: !isDemoMode,
  });

  return isDemoMode ? demoQuery : liveQuery;
};

// Re-export productivity hooks for convenience
export * from './useProductivityData';
