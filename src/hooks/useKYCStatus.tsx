
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useKYCStatus = () => {
  const { user, profile } = useAuth();
  
  return useQuery({
    queryKey: ['kycStatus', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No authenticated user for KYC check');
        return { isKYCComplete: false, documents: [] };
      }

      // API users bypass KYC
      if (profile?.role === 'api') {
        console.log('API user detected, bypassing KYC');
        return { isKYCComplete: true, documents: [] };
      }

      console.log('Checking KYC status for user:', user.id);

      try {
        // Check if user has approved KYC documents
        const { data: kycDocuments, error } = await supabase
          .from('kyc_documents')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching KYC documents:', error);
          // Don't throw error, return default state
          return { isKYCComplete: false, documents: [] };
        }

        console.log('KYC documents found:', kycDocuments);

        const hasApprovedDocuments = kycDocuments && kycDocuments.length > 0 && 
          kycDocuments.some(doc => doc.status === 'approved');

        return {
          isKYCComplete: hasApprovedDocuments,
          documents: kycDocuments || []
        };
      } catch (error) {
        console.error('Error in KYC status check:', error);
        // Return default state instead of throwing
        return { isKYCComplete: false, documents: [] };
      }
    },
    enabled: !!user, // Only run if user exists
    retry: 1, // Only retry once
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
