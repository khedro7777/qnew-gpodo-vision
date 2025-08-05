
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useIndustrySectors = () => {
  return useQuery({
    queryKey: ['industry_sectors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industry_sectors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useGroups = () => {
  return useQuery({
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
  });
};
