import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useKYCStatus } from './useKYCStatus';

export type UserRole = 'supplier' | 'buyer' | 'freelancer' | 'group_member' | 'investor' | 'judge' | 'admin' | 'ai_agent';

interface UserRoleData {
  id: string;
  role: UserRole;
  is_approved: boolean;
  is_active: boolean;
  requested_at: string;
  approved_at?: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const { data: kycData } = useKYCStatus();

  const { data: userRoles = [], isLoading, error } = useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data as UserRoleData[];
    },
    enabled: !!user?.id,
  });

  // Auto-approve supplier role if KYC is complete and user doesn't have supplier role
  const autoApproveSupplierRole = async () => {
    if (!user?.id || !kycData?.isKYCComplete) return;
    
    const hasSupplierRole = userRoles.some(role => role.role === 'supplier');
    if (hasSupplierRole) return;

    try {
      await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'supplier',
          is_approved: true,
          approved_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error auto-approving supplier role:', error);
    }
  };

  // Auto-approve if conditions are met
  React.useEffect(() => {
    if (kycData?.isKYCComplete && userRoles.length > 0) {
      autoApproveSupplierRole();
    }
  }, [kycData?.isKYCComplete, userRoles, user?.id]);

  const approvedRoles = userRoles.filter(role => role.is_approved);
  const pendingRoles = userRoles.filter(role => !role.is_approved);
  
  const primaryRole = approvedRoles.length > 0 ? approvedRoles[0]?.role : null;
  
  const hasRole = (role: UserRole) => approvedRoles.some(r => r.role === role);

  const requestRole = async (role: UserRole) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    // Auto-approve supplier role if KYC is complete
    const shouldAutoApprove = role === 'supplier' && kycData?.isKYCComplete;
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role,
        is_approved: shouldAutoApprove || ['buyer', 'group_member'].includes(role),
        approved_at: shouldAutoApprove || ['buyer', 'group_member'].includes(role) ? new Date().toISOString() : null
      });

    if (error) throw error;
  };

  return {
    userRoles,
    approvedRoles,
    pendingRoles,
    primaryRole,
    hasRole,
    requestRole,
    isLoading,
    error
  };
};
