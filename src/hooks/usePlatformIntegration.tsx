import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PlatformIntegration {
  platform_name: string;
  api_key: string;
  user_id: string;
  created_at?: string;
}

export const usePlatformIntegration = (platformName: string) => {
  const { user } = useAuth();
  const [integration, setIntegration] = useState<PlatformIntegration | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchIntegration = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('platform_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform_name', platformName)
          .single();

        if (error) {
          console.error('Error fetching integration:', error);
          setIntegration(null);
        } else {
          setIntegration(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIntegration();
  }, [user, platformName]);

  const saveIntegration = async (apiKey: string) => {
    setLoading(true);
    try {
      if (!user) {
        toast.error('User not authenticated.');
        return;
      }

      const newIntegration = {
        platform_name: platformName,
        api_key: apiKey,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('platform_integrations')
        .upsert(newIntegration, { onConflict: 'user_id, platform_name' })
        .select()
        .single();

      if (error) {
        console.error('Error saving integration:', error);
        toast.error(`Failed to save ${platformName} integration.`);
      } else {
        setIntegration(data);
        toast.success(`${platformName} integration saved successfully!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteIntegration = async () => {
    setLoading(true);
    try {
      if (!user) {
        toast.error('User not authenticated.');
        return;
      }

      const { error } = await supabase
        .from('platform_integrations')
        .delete()
        .eq('user_id', user.id)
        .eq('platform_name', platformName);

      if (error) {
        console.error('Error deleting integration:', error);
        toast.error(`Failed to delete ${platformName} integration.`);
      } else {
        setIntegration(null);
        toast.success(`${platformName} integration deleted successfully!`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    integration,
    loading,
    saveIntegration,
    deleteIntegration,
  };
};
