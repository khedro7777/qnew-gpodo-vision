
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupplierOffer {
  id: string;
  supplier_id: string;
  title: string;
  description?: string;
  category?: string;
  target_region?: string;
  base_price: number;
  minimum_joiners: number;
  deadline: string;
  visibility: 'public' | 'invite_only';
  status: 'draft' | 'pending' | 'active' | 'completed' | 'expired' | 'cancelled';
  kyc_required: boolean;
  points_required: number;
  sales_agreement_template?: string;
  product_images?: string[];
  pdf_attachments?: string[];
  did_identifier?: string;
  current_participants: number;
  created_at: string;
  updated_at: string;
  group_discount_tiers?: DiscountTier[];
}

export interface DiscountTier {
  id: string;
  offer_id: string;
  min_members: number;
  discount_percent?: number;
  fixed_price?: number;
  tier_order: number;
  created_at: string;
}

export interface SupplierPaymentSettings {
  id: string;
  supplier_id: string;
  paypal_email?: string;
  paypal_client_id?: string;
  crypto_wallet_btc?: string;
  crypto_wallet_eth?: string;
  crypto_wallet_usdt?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  supplier_id: string;
  buyer_id: string;
  offer_id?: string;
  invoice_number: string;
  description: string;
  amount: number;
  currency: string;
  payment_method?: 'PayPal' | 'BTC' | 'ETH' | 'USDT';
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_reference?: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  offer_id?: string;
  invoice_id?: string;
  from_user_id: string;
  supplier_id?: string;
  subject: string;
  message: string;
  attachments?: string[];
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  supplier_reply?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useSupplierPanel = () => {
  const queryClient = useQueryClient();

  // Get supplier offers
  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ['supplier-offers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_discount_offers')
        .select(`
          *,
          group_discount_tiers (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupplierOffer[];
    },
  });

  // Get payment settings
  const { data: paymentSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['supplier-payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplier_payment_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as SupplierPaymentSettings;
    },
  });

  // Get invoices
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['supplier-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
  });

  // Get complaints
  const { data: complaints = [], isLoading: complaintsLoading } = useQuery({
    queryKey: ['supplier-complaints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Complaint[];
    },
  });

  // Create offer mutation
  const createOffer = useMutation({
    mutationFn: async (offerData: Partial<SupplierOffer> & { tiers: Omit<DiscountTier, 'id' | 'offer_id' | 'created_at'>[] }) => {
      const { tiers, ...offer } = offerData;
      
      const { data: offerResult, error: offerError } = await supabase
        .from('group_discount_offers')
        .insert([offer])
        .select()
        .single();
      
      if (offerError) throw offerError;
      
      if (tiers.length > 0) {
        const tiersWithOfferId = tiers.map(tier => ({
          ...tier,
          offer_id: offerResult.id,
        }));
        
        const { error: tiersError } = await supabase
          .from('group_discount_tiers')
          .insert(tiersWithOfferId);
        
        if (tiersError) throw tiersError;
      }
      
      return offerResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-offers'] });
      toast.success('Offer created successfully');
    },
    onError: (error: any) => {
      console.error('Create offer error:', error);
      toast.error('Failed to create offer');
    },
  });

  // Update offer mutation
  const updateOffer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SupplierOffer> & { id: string }) => {
      const { data, error } = await supabase
        .from('group_discount_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-offers'] });
      toast.success('Offer updated successfully');
    },
    onError: (error: any) => {
      console.error('Update offer error:', error);
      toast.error('Failed to update offer');
    },
  });

  // Update payment settings mutation
  const updatePaymentSettings = useMutation({
    mutationFn: async (settings: Partial<SupplierPaymentSettings>) => {
      const { data, error } = await supabase
        .from('supplier_payment_settings')
        .upsert([settings])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-payment-settings'] });
      toast.success('Payment settings updated');
    },
    onError: (error: any) => {
      console.error('Update settings error:', error);
      toast.error('Failed to update payment settings');
    },
  });

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (invoiceData: Partial<Invoice>) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error: any) => {
      console.error('Create invoice error:', error);
      toast.error('Failed to create invoice');
    },
  });

  // Reply to complaint mutation
  const replyToComplaint = useMutation({
    mutationFn: async ({ id, supplier_reply }: { id: string; supplier_reply: string }) => {
      const { data, error } = await supabase
        .from('complaints')
        .update({ 
          supplier_reply,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-complaints'] });
      toast.success('Reply sent successfully');
    },
    onError: (error: any) => {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    },
  });

  return {
    offers,
    paymentSettings,
    invoices,
    complaints,
    isLoading: offersLoading || settingsLoading || invoicesLoading || complaintsLoading,
    createOffer: createOffer.mutate,
    updateOffer: updateOffer.mutate,
    updatePaymentSettings: updatePaymentSettings.mutate,
    createInvoice: createInvoice.mutate,
    replyToComplaint: replyToComplaint.mutate,
    isCreatingOffer: createOffer.isPending,
    isUpdatingOffer: updateOffer.isPending,
    isUpdatingSettings: updatePaymentSettings.isPending,
    isCreatingInvoice: createInvoice.isPending,
    isReplying: replyToComplaint.isPending,
  };
};
