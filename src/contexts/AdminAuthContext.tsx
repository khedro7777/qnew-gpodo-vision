
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
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return false;
      }

      const { data, error } = await supabase
        .from('admin_sessions')
        .select(`
          admin_id,
          expires_at,
          admin_users!inner (
            id,
            email,
            role,
            last_login
          )
        `)
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('admin_token');
        setLoading(false);
        return false;
      }

      if (!data || !data.admin_users) {
        localStorage.removeItem('admin_token');
        setLoading(false);
        return false;
      }

      setAdminUser({
        id: data.admin_users.id,
        email: data.admin_users.email,
        role: data.admin_users.role,
        last_login: data.admin_users.last_login,
      });

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
      setLoading(false);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Handle the known admin accounts with direct password matching
      const validAdmins = [
        { email: 'admin@gpodo.com', password: 'admin123', role: 'admin' },
        { email: 'khedrodo@gmail.com', password: 'Omarlo', role: 'admin' }
      ];

      const adminAccount = validAdmins.find(admin => 
        admin.email === email && admin.password === password
      );

      if (!adminAccount) {
        throw new Error('Invalid login credentials');
      }

      // Check if admin exists in database, if not create them
      let { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, role, is_active, last_login')
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError) {
        console.error('Database query error:', adminError);
      }

      // If admin doesn't exist, create them
      if (!adminData) {
        const { data: newAdmin, error: createError } = await supabase
          .from('admin_users')
          .insert({
            email: email,
            password_hash: password, // In production, this should be properly hashed
            role: adminAccount.role,
            is_active: true
          })
          .select('id, email, role, is_active, last_login')
          .single();

        if (createError) {
          throw new Error('Failed to create admin account: ' + createError.message);
        }

        adminData = newAdmin;
      }

      // Create session
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_id: adminData.id,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        throw new Error('Failed to create session: ' + sessionError.message);
      }

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
      console.error('Sign in error:', error);
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
