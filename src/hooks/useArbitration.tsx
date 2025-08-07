
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ArbitrationCase } from '@/types';

export const useArbitration = () => {
  const queryClient = useQueryClient();

  // Get arbitration cases
  const { data: cases, isLoading } = useQuery({
    queryKey: ['arbitration_cases'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('arbitration_cases')
        .select('*')
        .or(`complainant_id.eq.${user.user.id},respondent_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching arbitration cases:', error);
        return [];
      }
      
      return data as ArbitrationCase[];
    },
  });

  // Create arbitration case mutation
  const createCase = useMutation({
    mutationFn: async (caseData: Omit<ArbitrationCase, 'id' | 'case_number' | 'created_at' | 'updated_at'>) => {
      // Generate case number
      const caseNumber = `ARB-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('arbitration_cases')
        .insert([{ ...caseData, case_number: caseNumber }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arbitration_cases'] });
      toast.success('تم تقديم طلب التحكيم بنجاح');
    },
    onError: (error: any) => {
      console.error('Create arbitration case error:', error);
      toast.error('حدث خطأ في تقديم طلب التحكيم');
    },
  });

  // Update case status mutation
  const updateCaseStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('arbitration_cases')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arbitration_cases'] });
      toast.success('تم تحديث حالة القضية بنجاح');
    },
    onError: (error: any) => {
      console.error('Update case status error:', error);
      toast.error('حدث خطأ في تحديث حالة القضية');
    },
  });

  return {
    cases: cases || [],
    isLoading,
    createCase: createCase.mutate,
    updateCaseStatus: updateCaseStatus.mutate,
    isCreatingCase: createCase.isPending,
    isUpdatingStatus: updateCaseStatus.isPending,
  };
};
