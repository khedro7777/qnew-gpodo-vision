
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

  const approvedRoles = userRoles.filter(role => role.is_approved);
  const pendingRoles = userRoles.filter(role => !role.is_approved);
  
  const primaryRole = approvedRoles.length > 0 ? approvedRoles[0]?.role : null;
  
  const hasRole = (role: UserRole) => approvedRoles.some(r => r.role === role);

  const requestRole = async (role: UserRole) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.id,
        role,
        is_approved: ['buyer', 'group_member'].includes(role), // Auto-approve basic roles
        approved_at: ['buyer', 'group_member'].includes(role) ? new Date().toISOString() : null
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
