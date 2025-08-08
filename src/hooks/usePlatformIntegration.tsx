import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const usePlatformIntegration = () => {
  const { user } = useAuth();
  const [platformSettings, setPlatformSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformSettings = async () => {
      setLoading(true);
      try {
        if (!user) {
          console.warn('User not available, skipping platform settings fetch.');
          return;
        }

        const { data, error } = await supabase
          .from('platform_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching platform settings:', error);
          toast.error('Failed to load platform settings.');
        } else {
          setPlatformSettings(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformSettings();
  }, [user]);

  const updatePlatformSettings = async (updates: any) => {
    setLoading(true);
    try {
      if (!user) {
        toast.error('User not authenticated.');
        return false;
      }

      const { data, error } = await supabase
        .from('platform_settings')
        .upsert(
          {
            user_id: user.id,
            ...updates,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error updating platform settings:', error);
        toast.error('Failed to update platform settings.');
        return false;
      } else {
        setPlatformSettings(data);
        toast.success('Platform settings updated successfully!');
        return true;
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    platformSettings,
    loading,
    updatePlatformSettings,
  };
};

