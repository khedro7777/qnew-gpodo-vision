import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PayPalHook {
  loading: boolean;
  error: string | null;
  createOrder: (amount: number) => Promise<string | null>;
  captureOrder: (orderID: string) => Promise<boolean>;
}

export const usePayPalPayment = (): PayPalHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createOrder = useCallback(async (amount: number): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok && data.orderID) {
        return data.orderID;
      } else {
        setError(data.message || 'Failed to create order.');
        toast.error(data.message || 'Failed to create order.');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const captureOrder = useCallback(async (orderID: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'COMPLETED') {
        toast.success('Payment successful!');
        // Update user profile or grant access here
        if (user?.id) {
          await supabase
            .from('profiles')
            .update({ has_paid: true })
            .eq('id', user.id);
        }
        return true;
      } else {
        setError(data.message || 'Failed to capture order.');
        toast.error(data.message || 'Failed to capture order.');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'An unexpected error occurred.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  return { loading, error, createOrder, captureOrder };
};
