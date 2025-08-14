
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
      // TEMPORARILY PROVIDE MOCK ROLES FOR DEVELOPMENT
      const mockRoles: UserRoleData[] = [
        {
          id: 'mock-role-1',
          role: 'supplier',
          is_approved: true,
          is_active: true,
          requested_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        },
        {
          id: 'mock-role-2',
          role: 'buyer',
          is_approved: true,
          is_active: true,
          requested_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        }
      ];
      
      console.log('Returning mock user roles for development');
      return mockRoles;
    },
    enabled: true, // Always enabled for development
  });

  const approvedRoles = userRoles.filter(role => role.is_approved);
  const pendingRoles = userRoles.filter(role => !role.is_approved);
  
  const primaryRole = approvedRoles.length > 0 ? approvedRoles[0]?.role : 'supplier'; // Default to supplier
  
  // TEMPORARILY ALLOW ALL ROLES
  const hasRole = (role: UserRole) => {
    console.log(`Role check for ${role}: temporarily granted (development mode)`);
    return true;
  };

  const requestRole = async (role: UserRole) => {
    console.log(`Role request for ${role} temporarily bypassed (development mode)`);
    // Mock successful role request
    return Promise.resolve();
  };

  return {
    userRoles,
    approvedRoles,
    pendingRoles,
    primaryRole,
    hasRole,
    requestRole,
    isLoading: false, // Override loading state
    error: null // Override error state
  };
};
