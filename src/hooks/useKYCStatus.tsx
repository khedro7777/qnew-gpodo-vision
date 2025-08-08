
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useKYCStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['kyc-status', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Mock KYC status for now
      return {
        status: 'pending',
        documents: [],
        lastUpdated: new Date().toISOString()
      };
    },
    enabled: !!user,
  });
};
