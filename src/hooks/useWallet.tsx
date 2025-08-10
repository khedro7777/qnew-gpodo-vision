
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionData {
  id: string;
  wallet_id: string;
  user_id: string;
  type: 'recharge' | 'debit' | 'credit' | 'refund';
  amount: number;
  description: string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'failed';
  payment_reference?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useWallet = () => {
  const queryClient = useQueryClient();

  // Get user wallet balance
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('currency', 'USD')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Wallet fetch error:', error);
        throw error;
      }
      
      return data as WalletData;
    },
  });

  // Get wallet transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Transactions fetch error:', error);
        throw error;
      }
      
      return data as TransactionData[];
    },
  });

  // Add transaction (for manual entries)
  const addTransaction = useMutation({
    mutationFn: async (transactionData: {
      type: 'recharge' | 'debit' | 'credit' | 'refund';
      amount: number;
      description: string;
      payment_method?: string;
      payment_reference?: string;
    }) => {
      const { data, error } = await supabase.rpc('update_wallet_balance', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_amount: transactionData.amount,
        p_type: transactionData.type,
        p_description: transactionData.description,
        p_payment_method: transactionData.payment_method,
        p_payment_reference: transactionData.payment_reference,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction completed successfully');
    },
    onError: (error: any) => {
      console.error('Transaction error:', error);
      toast.error('Transaction failed');
    },
  });

  // Spend from wallet
  const spendFromWallet = useMutation({
    mutationFn: async ({ amount, description }: { amount: number; description: string }) => {
      const { data, error } = await supabase.rpc('spend_wallet_balance', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_amount: amount,
        p_description: description,
      });

      if (error) throw error;
      if (!data) throw new Error('Insufficient balance');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Payment successful');
    },
    onError: (error: any) => {
      console.error('Spend error:', error);
      toast.error('Payment failed - insufficient balance');
    },
  });

  return {
    wallet,
    balance: wallet?.balance || 0,
    transactions,
    isLoading: walletLoading || transactionsLoading,
    addTransaction: addTransaction.mutate,
    spendFromWallet: spendFromWallet.mutate,
    isAddingTransaction: addTransaction.isPending,
    isSpending: spendFromWallet.isPending,
  };
};
