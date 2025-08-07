
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  totalContracts: number;
  activeDisputes: number;
  monthlyRevenue: number;
  kycPendingCount: number;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      console.log('Fetching admin stats...');
      
      // Fetch all required data in parallel
      const [usersRes, groupsRes, contractsRes, kycRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('groups').select('id', { count: 'exact' }),
        supabase.from('group_proposals').select('id', { count: 'exact' }),
        supabase.from('kyc_documents').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      const stats: AdminStats = {
        totalUsers: usersRes.count || 0,
        totalGroups: groupsRes.count || 0,
        totalContracts: contractsRes.count || 0,
        activeDisputes: 0,
        monthlyRevenue: 0,
        kycPendingCount: kycRes.count || 0
      };

      return stats;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(user => ({
        id: user.id,
        email: user.email,
        role: user.role || 'user',
        is_active: user.is_verified,
        created_at: user.created_at,
        full_name: user.full_name
      }));
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, is_active }: { userId: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_verified: is_active })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      toast.success('User status updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update user status: ' + error.message);
    },
  });
};

export const useKYCDocuments = () => {
  return useQuery({
    queryKey: ['kyc_documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateKYCStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      documentId, 
      status, 
      reviewer_notes 
    }: { 
      documentId: string; 
      status: 'approved' | 'rejected'; 
      reviewer_notes?: string; 
    }) => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .update({ 
          status, 
          reviewer_notes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId)
        .select()
        .single();
      
      if (error) throw error;

      // Update profile KYC status
      if (status === 'approved') {
        await supabase
          .from('profiles')
          .update({ 
            kyc_status: 'approved',
            kyc_completed_at: new Date().toISOString()
          })
          .eq('id', data.user_id);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc_documents'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
      toast.success('KYC status updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update KYC status: ' + error.message);
    },
  });
};

export const useAPIKeys = () => {
  return useQuery({
    queryKey: ['api_keys'],
    queryFn: async () => {
      // Mock API keys for now
      const mockKeys: APIKey[] = [
        {
          id: '1',
          name: 'Main API Key',
          key: 'gpd_live_xxxxxxxxxxxxxxxxxx',
          permissions: ['read', 'write', 'admin'],
          is_active: true,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      return mockKeys;
    },
  });
};

export const useCreateAPIKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyData: {
      name: string;
      permissions: string[];
      expires_at?: string;
    }) => {
      console.log('Creating API key:', keyData);
      
      // Mock implementation
      const newKey: APIKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: keyData.name,
        key: `gpd_live_${Math.random().toString(36).substr(2, 20)}`,
        permissions: keyData.permissions,
        is_active: true,
        created_at: new Date().toISOString(),
        expires_at: keyData.expires_at
      };
      
      return newKey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
      toast.success('API key created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create API key: ' + error.message);
    },
  });
};

export const useRevokeAPIKey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (keyId: string) => {
      console.log('Revoking API key:', keyId);
      // Mock implementation
      return keyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
      toast.success('API key revoked successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to revoke API key: ' + error.message);
    },
  });
};
