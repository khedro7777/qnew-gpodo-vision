
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ArbitrationCase } from '@/types';

export const useArbitration = () => {
  const queryClient = useQueryClient();

  // Get arbitration cases (mock data for now)
  const { data: cases, isLoading } = useQuery({
    queryKey: ['arbitration_cases'],
    queryFn: async () => {
      console.log('Fetching arbitration cases...');
      // Return empty array for now until Supabase types are updated
      return [] as ArbitrationCase[];
    },
  });

  // Create arbitration case mutation (mock for now)
  const createCase = useMutation({
    mutationFn: async (caseData: Omit<ArbitrationCase, 'id' | 'case_number' | 'created_at' | 'updated_at'>) => {
      console.log('Creating arbitration case:', caseData);
      // Mock implementation
      return { 
        id: 'mock-case-id', 
        case_number: `ARB-${Date.now()}`,
        ...caseData, 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      } as ArbitrationCase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arbitration_cases'] });
      toast.success('تم إنشاء قضية التحكيم بنجاح');
    },
    onError: (error: any) => {
      console.error('Create arbitration case error:', error);
      toast.error('حدث خطأ في إنشاء قضية التحكيم');
    },
  });

  return {
    cases: cases || [],
    isLoading,
    createCase: createCase.mutate,
    isCreating: createCase.isPending,
  };
};
