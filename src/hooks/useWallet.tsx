
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WalletTransaction, UserBalance } from '@/types';

export const useWallet = () => {
  const queryClient = useQueryClient();

  // Get user balance (mock data for now)
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['user_balance'],
    queryFn: async () => {
      console.log('Fetching user balance...');
      // Return mock balance for now
      return { user_id: 'mock-user-id', balance: 0, updated_at: new Date().toISOString() } as UserBalance;
    },
  });

  // Get wallet transactions (mock data for now)
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['wallet_transactions'],
    queryFn: async () => {
      console.log('Fetching wallet transactions...');
      // Return empty array for now until Supabase types are updated
      return [] as WalletTransaction[];
    },
  });

  // Add transaction mutation (mock for now)
  const addTransaction = useMutation({
    mutationFn: async (transactionData: Omit<WalletTransaction, 'id' | 'created_at'>) => {
      console.log('Adding transaction:', transactionData);
      // Mock implementation
      return { 
        id: 'mock-transaction-id', 
        ...transactionData, 
        created_at: new Date().toISOString() 
      } as WalletTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet_transactions'] });
      queryClient.invalidateQueries({ queryKey: ['user_balance'] });
      toast.success('تم إضافة المعاملة بنجاح');
    },
    onError: (error: any) => {
      console.error('Add transaction error:', error);
      toast.error('حدث خطأ في إضافة المعاملة');
    },
  });

  return {
    balance: balance?.balance || 0,
    transactions: transactions || [],
    isLoading: balanceLoading || transactionsLoading,
    addTransaction: addTransaction.mutate,
    isAddingTransaction: addTransaction.isPending,
  };
};
