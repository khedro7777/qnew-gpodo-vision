
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  full_name?: string;
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
      const token = localStorage.getItem('admin_token');
      if (!token) return false;

      const { data, error } = await supabase
        .from('admin_sessions')
        .select(`
          admin_id,
          expires_at,
          admin_users (
            id,
            email,
            role,
            last_login
          )
        `)
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        localStorage.removeItem('admin_token');
        return false;
      }

      setAdminUser({
        id: data.admin_users.id,
        email: data.admin_users.email,
        role: data.admin_users.role,
        last_login: data.admin_users.last_login,
      });

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check credentials against admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // In production, this should be properly hashed
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        throw new Error('Invalid credentials or inactive account');
      }

      // Create session
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_id: adminData.id,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) throw sessionError;

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);

      localStorage.setItem('admin_token', token);
      
      setAdminUser({
        id: adminData.id,
        email: adminData.email,
        role: adminData.role,
        last_login: adminData.last_login,
      });

      toast.success('Welcome to Admin Dashboard');
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('token', token);
      }

      localStorage.removeItem('admin_token');
      setAdminUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initAuth();
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
