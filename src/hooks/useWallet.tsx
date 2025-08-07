
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description?: string;
  payment_method?: string;
  transaction_reference?: string;
  status: string;
  created_at: string;
}

interface UserBalance {
  user_id: string;
  balance: number;
  updated_at: string;
}

export const useWallet = (userId?: string) => {
  const queryClient = useQueryClient();

  // Get user balance
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['user_balance', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching balance:', error);
        return null;
      }
      
      return data as UserBalance | null;
    },
    enabled: !!userId,
  });

  // Get wallet transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['wallet_transactions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
      
      return data as WalletTransaction[];
    },
    enabled: !!userId,
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<WalletTransaction, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert([transaction])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet_transactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['user_balance', userId] });
      toast.success('تم إجراء المعاملة بنجاح');
    },
    onError: (error: any) => {
      console.error('Transaction error:', error);
      toast.error('حدث خطأ في المعاملة');
    },
  });

  // Update balance mutation
  const updateBalance = useMutation({
    mutationFn: async ({ userId, newBalance }: { userId: string; newBalance: number }) => {
      const { data, error } = await supabase
        .from('user_balances')
        .upsert({ 
          user_id: userId, 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_balance', userId] });
      toast.success('تم تحديث الرصيد بنجاح');
    },
    onError: (error: any) => {
      console.error('Balance update error:', error);
      toast.error('حدث خطأ في تحديث الرصيد');
    },
  });

  return {
    balance: balance?.balance || 0,
    transactions: transactions || [],
    isLoading: balanceLoading || transactionsLoading,
    createTransaction: createTransaction.mutate,
    updateBalance: updateBalance.mutate,
    isCreatingTransaction: createTransaction.isPending,
    isUpdatingBalance: updateBalance.isPending,
  };
};
