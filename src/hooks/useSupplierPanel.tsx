
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  console.log('useSupplierPanel - user:', user?.id);

  // Get supplier offers
  const { data: offers = [], isLoading: offersLoading, error: offersError } = useQuery({
    queryKey: ['supplier-offers', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID, returning empty offers');
        return [];
      }

      console.log('Fetching offers for user:', user.id);
      
      const { data, error } = await supabase
        .from('group_discount_offers')
        .select(`
          *,
          group_discount_tiers (*)
        `)
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
      
      console.log('Fetched offers:', data?.length || 0);
      return data as SupplierOffer[];
    },
    enabled: !!user?.id,
  });

  // Get payment settings
  const { data: paymentSettings, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['supplier-payment-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('supplier_payment_settings')
        .select('*')
        .eq('supplier_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching payment settings:', error);
        throw error;
      }
      return data as SupplierPaymentSettings | null;
    },
    enabled: !!user?.id,
  });

  // Get invoices
  const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['supplier-invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      return data as Invoice[];
    },
    enabled: !!user?.id,
  });

  // Get complaints
  const { data: complaints = [], isLoading: complaintsLoading, error: complaintsError } = useQuery({
    queryKey: ['supplier-complaints', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching complaints:', error);
        throw error;
      }
      return data as Complaint[];
    },
    enabled: !!user?.id,
  });

  // Create offer mutation
  const createOffer = useMutation({
    mutationFn: async (offerData: Omit<SupplierOffer, 'id' | 'created_at' | 'updated_at' | 'current_participants' | 'supplier_id'> & { tiers: Omit<DiscountTier, 'id' | 'offer_id' | 'created_at'>[] }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { tiers, ...offer } = offerData;
      const offerWithSupplier = { 
        ...offer, 
        supplier_id: user.id,
        current_participants: 0
      };
      
      const { data: offerResult, error: offerError } = await supabase
        .from('group_discount_offers')
        .insert(offerWithSupplier)
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
    mutationFn: async (settings: Omit<SupplierPaymentSettings, 'id' | 'created_at' | 'updated_at' | 'supplier_id'>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const settingsWithSupplier = { ...settings, supplier_id: user.id };
      
      const { data, error } = await supabase
        .from('supplier_payment_settings')
        .upsert(settingsWithSupplier, { onConflict: 'supplier_id' })
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
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'invoice_number' | 'supplier_id'>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const invoiceWithSupplier = {
        ...invoiceData,
        supplier_id: user.id,
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceWithSupplier)
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

  const isLoading = offersLoading || settingsLoading || invoicesLoading || complaintsLoading;
  const hasError = offersError || settingsError || invoicesError || complaintsError;
  
  console.log('useSupplierPanel state:', {
    isLoading,
    hasError: !!hasError,
    offersCount: offers?.length || 0,
    invoicesCount: invoices?.length || 0,
    complaintsCount: complaints?.length || 0,
    hasPaymentSettings: !!paymentSettings
  });

  return {
    offers,
    paymentSettings,
    invoices,
    complaints,
    isLoading,
    hasError,
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
