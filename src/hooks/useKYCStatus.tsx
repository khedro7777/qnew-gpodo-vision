
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

export const useKYCStatus = () => {
  const { user, profile } = useAuth();
  
  return useQuery({
    queryKey: ['kycStatus', user?.id],
    queryFn: async () => {
      // Mock KYC status - always return approved for demo
      console.log('Demo mode: KYC check bypassed');
      return { 
        isKYCComplete: true, 
        documents: [
          {
            id: 'mock-doc-1',
            type: 'passport',
            status: 'approved',
            uploaded_at: new Date().toISOString()
          }
        ] 
      };
    },
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
