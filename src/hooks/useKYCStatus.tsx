
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useKYCStatus = () => {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ['kyc-status', user?.id],
    queryFn: async () => {
      if (!user || !profile) return { isKYCComplete: false, requiresTest: false };

      // Check if KYC is already approved
      if (profile.kyc_status === 'approved') {
        return { isKYCComplete: true, requiresTest: false };
      }

      // Check documents
      const { data: documents } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id);

      // For freelancers, also check MCP test
      let mcpTestResult = null;
      if (profile.role === 'freelancer') {
        const { data: testData } = await supabase
          .from('mcp_test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        mcpTestResult = testData;
      }

      const getRequiredDocTypes = () => {
        switch (profile.role) {
          case 'supplier':
            return ['company_registration', 'business_license'];
          default:
            return ['id_card', 'passport'];
        }
      };

      const requiredDocTypes = getRequiredDocTypes();
      const hasRequiredDocs = profile.role === 'user' 
        ? documents?.some(doc => ['id_card', 'passport'].includes(doc.document_type) && doc.status === 'approved')
        : requiredDocTypes.every(type => 
            documents?.some(doc => doc.document_type === type && doc.status === 'approved')
          );

      const hasPassedMCPTest = profile.role === 'freelancer' 
        ? mcpTestResult?.status === 'approved' && mcpTestResult.test_score >= 70
        : true;

      const isKYCComplete = hasRequiredDocs && hasPassedMCPTest;

      return {
        isKYCComplete,
        requiresTest: profile.role === 'freelancer',
        documents,
        mcpTestResult,
        profile
      };
    },
    enabled: !!user && !!profile,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
