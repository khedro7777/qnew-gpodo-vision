
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  last_login?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    try {
      // TEMPORARILY BYPASS AUTH - Auto-authenticate as admin
      console.log('Temporarily bypassing admin authentication');
      
      const mockAdminUser: AdminUser = {
        id: 'temp-admin-id',
        email: 'admin@gpodo.com',
        role: 'admin',
        last_login: new Date().toISOString(),
      };

      setAdminUser(mockAdminUser);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Temporarily bypassing login validation for:', email);

      // TEMPORARILY BYPASS AUTH - Accept any credentials
      const mockAdminUser: AdminUser = {
        id: 'temp-admin-id',
        email: email,
        role: 'admin',
        last_login: new Date().toISOString(),
      };

      setAdminUser(mockAdminUser);
      toast.success('Welcome to Admin Dashboard (Temporary Access)');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Login failed: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setAdminUser(null);
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    adminUser,
    loading,
    signIn,
    signOut,
    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
