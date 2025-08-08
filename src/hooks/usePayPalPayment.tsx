
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PayPalPaymentResponse {
  success: boolean;
  orderId?: string;
  approvalUrl?: string;
  error?: string;
}

interface PayPalCaptureResponse {
  success: boolean;
  status?: string;
  amount?: number;
  error?: string;
}

export const usePayPalPayment = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createPayment = async (amount: number, currency = 'USD'): Promise<PayPalPaymentResponse> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      console.log('Creating PayPal payment:', { amount, currency, userId: user.id });

      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: {
          amount,
          currency,
          userId: user.id,
        },
      });

      if (error) {
        throw error;
      }

      console.log('PayPal payment created:', data);
      return data;
    } catch (error: any) {
      console.error('PayPal payment creation failed:', error);
      toast.error('Failed to create payment: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const capturePayment = async (orderId: string): Promise<PayPalCaptureResponse> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      console.log('Capturing PayPal payment:', orderId);

      const { data, error } = await supabase.functions.invoke('paypal-capture', {
        body: {
          orderId,
          userId: user.id,
        },
      });

      if (error) {
        throw error;
      }

      console.log('PayPal payment captured:', data);
      return data;
    } catch (error: any) {
      console.error('PayPal payment capture failed:', error);
      toast.error('Failed to capture payment: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    capturePayment,
    loading,
  };
};
