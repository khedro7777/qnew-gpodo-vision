
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';

export const useRoleRedirect = () => {
  const { user } = useAuth();
  const { primaryRole, isLoading } = useUserRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || isLoading) return;

    // Auto-redirect to appropriate dashboard based on primary role
    if (primaryRole) {
      const roleRoutes = {
        supplier: '/seller-board',
        buyer: '/dashboard/buyer',
        freelancer: '/dashboard/freelancer',
        group_member: '/dashboard/group-buying',
        investor: '/dashboard/investor',
        judge: '/dashboard/judge',
        admin: '/admin/overview',
        ai_agent: '/dashboard/ai-agent'
      };

      const targetRoute = roleRoutes[primaryRole];
      if (targetRoute && window.location.pathname === '/dashboard') {
        console.log(`Redirecting ${primaryRole} to ${targetRoute}`);
        navigate(targetRoute, { replace: true });
      }
    }
  }, [user, primaryRole, isLoading, navigate]);

  return { primaryRole, isLoading };
};
