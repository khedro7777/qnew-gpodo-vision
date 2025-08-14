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

export interface Complaint {
  id: string;
  complaint_number: string;
  offer_id?: string;
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

  // TEMPORARILY USE MOCK USER ID FOR DEVELOPMENT
  const effectiveUserId = user?.id || 'temp-supplier-id';
  console.log('useSupplierPanel - using user ID:', effectiveUserId, '(temporary bypass active)');

  // Get supplier offers
  const { data: offers = [], isLoading: offersLoading, error: offersError } = useQuery({
    queryKey: ['supplier-offers', effectiveUserId],
    queryFn: async () => {
      console.log('Fetching offers for user:', effectiveUserId);
      
      // TEMPORARILY RETURN MOCK DATA FOR DEVELOPMENT
      const mockOffers = [
        {
          id: 'mock-offer-1',
          supplier_id: effectiveUserId,
          title: 'Sample Group Discount Offer',
          description: 'This is a sample offer for development purposes',
          category: 'Electronics',
          target_region: 'Global',
          base_price: 99.99,
          minimum_joiners: 10,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          visibility: 'public' as const,
          status: 'active' as const,
          kyc_required: false,
          points_required: 0,
          current_participants: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          group_discount_tiers: []
        }
      ];
      
      console.log('Returning mock offers for development');
      return mockOffers;
    },
    enabled: true, // Always enabled for development
  });

  // Get payment settings
  const { data: paymentSettings, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['supplier-payment-settings', effectiveUserId],
    queryFn: async () => {
      // TEMPORARILY RETURN MOCK DATA
      const mockSettings = {
        id: 'mock-settings-1',
        supplier_id: effectiveUserId,
        paypal_email: 'supplier@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Returning mock payment settings for development');
      return mockSettings;
    },
    enabled: true,
  });

  // Get complaints
  const { data: complaints = [], isLoading: complaintsLoading, error: complaintsError } = useQuery({
    queryKey: ['supplier-complaints', effectiveUserId],
    queryFn: async () => {
      // TEMPORARILY RETURN MOCK DATA
      const mockComplaints = [
        {
          id: 'mock-complaint-1',
          complaint_number: 'COMP-001',
          offer_id: 'mock-offer-1',
          from_user_id: 'user-123',
          supplier_id: effectiveUserId,
          subject: 'Sample Complaint',
          message: 'This is a sample complaint for development purposes',
          status: 'open' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      console.log('Returning mock complaints for development');
      return mockComplaints;
    },
    enabled: true,
  });

  // Create offer mutation (temporarily disabled)
  const createOffer = useMutation({
    mutationFn: async (offerData: any) => {
      console.log('Create offer temporarily disabled for development');
      toast.success('Offer creation temporarily disabled (development mode)');
      return { id: 'mock-new-offer', ...offerData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-offers'] });
    },
    onError: (error: any) => {
      console.error('Create offer error:', error);
      toast.error('Failed to create offer');
    },
  });

  // Update offer mutation (temporarily disabled)
  const updateOffer = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      console.log('Update offer temporarily disabled for development');
      toast.success('Offer update temporarily disabled (development mode)');
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-offers'] });
    },
    onError: (error: any) => {
      console.error('Update offer error:', error);
      toast.error('Failed to update offer');
    },
  });

  // Update payment settings mutation (temporarily disabled)
  const updatePaymentSettings = useMutation({
    mutationFn: async (settings: any) => {
      console.log('Update payment settings temporarily disabled for development');
      toast.success('Payment settings update temporarily disabled (development mode)');
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-payment-settings'] });
    },
    onError: (error: any) => {
      console.error('Update settings error:', error);
      toast.error('Failed to update payment settings');
    },
  });

  // Reply to complaint mutation (temporarily disabled)
  const replyToComplaint = useMutation({
    mutationFn: async ({ id, supplier_reply }: { id: string; supplier_reply: string }) => {
      console.log('Reply to complaint temporarily disabled for development');
      toast.success('Complaint reply temporarily disabled (development mode)');
      return { id, supplier_reply };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-complaints'] });
    },
    onError: (error: any) => {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    },
  });

  const isLoading = offersLoading || settingsLoading || complaintsLoading;
  const hasError = offersError || settingsError || complaintsError;
  
  console.log('useSupplierPanel state (development mode):', {
    isLoading,
    hasError: !!hasError,
    offersCount: offers?.length || 0,
    complaintsCount: complaints?.length || 0,
    hasPaymentSettings: !!paymentSettings
  });

  return {
    offers,
    paymentSettings,
    complaints,
    isLoading,
    hasError,
    createOffer: createOffer.mutate,
    updateOffer: updateOffer.mutate,
    updatePaymentSettings: updatePaymentSettings.mutate,
    replyToComplaint: replyToComplaint.mutate,
    isCreatingOffer: createOffer.isPending,
    isUpdatingOffer: updateOffer.isPending,
    isUpdatingSettings: updatePaymentSettings.isPending,
    isReplying: replyToComplaint.isPending,
  };
};
