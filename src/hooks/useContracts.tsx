
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Contract } from '@/types';

export const useContracts = (groupId?: string) => {
  const queryClient = useQueryClient();

  // Get contracts
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts', groupId],
    queryFn: async () => {
      let query = supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (groupId) {
        query = query.eq('group_id', groupId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching contracts:', error);
        return [];
      }
      
      return data as Contract[];
    },
  });

  // Create contract mutation
  const createContract = useMutation({
    mutationFn: async (contractData: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('contracts')
        .insert([contractData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', groupId] });
      toast.success('تم إنشاء العقد بنجاح');
    },
    onError: (error: any) => {
      console.error('Create contract error:', error);
      toast.error('حدث خطأ في إنشاء العقد');
    },
  });

  // Update contract mutation
  const updateContract = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Contract> & { id: string }) => {
      const { data, error } = await supabase
        .from('contracts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', groupId] });
      toast.success('تم تحديث العقد بنجاح');
    },
    onError: (error: any) => {
      console.error('Update contract error:', error);
      toast.error('حدث خطأ في تحديث العقد');
    },
  });

  return {
    contracts: contracts || [],
    isLoading,
    createContract: createContract.mutate,
    updateContract: updateContract.mutate,
    isCreatingContract: createContract.isPending,
    isUpdatingContract: updateContract.isPending,
  };
};
