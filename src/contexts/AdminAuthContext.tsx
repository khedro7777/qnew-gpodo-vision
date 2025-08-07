
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

      console.log('Checking auth with token:', token);

      const { data, error } = await supabase
        .from('admin_sessions')
        .select(`
          admin_id,
          expires_at,
          admin_users!inner (
            id,
            email,
            role,
            full_name,
            last_login
          )
        `)
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('admin_token');
        return false;
      }

      if (!data || !data.admin_users) {
        console.log('No valid session found');
        localStorage.removeItem('admin_token');
        return false;
      }

      console.log('Auth check successful:', data);

      setAdminUser({
        id: data.admin_users.id,
        email: data.admin_users.email,
        role: data.admin_users.role,
        full_name: data.admin_users.full_name,
        last_login: data.admin_users.last_login,
      });

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('admin_token');
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting to sign in with email:', email);

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .eq('is_active', true)
        .maybeSingle();

      if (adminError) {
        console.error('Admin query error:', adminError);
        throw new Error('خطأ في الاستعلام: ' + adminError.message);
      }

      if (!adminData) {
        console.log('No admin user found for:', email);
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      console.log('Admin user found:', { id: adminData.id, email: adminData.email, role: adminData.role });

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
        console.error('Session creation error:', sessionError);
        throw new Error('فشل في إنشاء الجلسة: ' + sessionError.message);
      }

      console.log('Session created successfully');

      // Update last login
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);

      if (updateError) {
        console.warn('Failed to update last login:', updateError);
      }

      localStorage.setItem('admin_token', token);
      
      setAdminUser({
        id: adminData.id,
        email: adminData.email,
        role: adminData.role,
        full_name: adminData.full_name,
        last_login: adminData.last_login,
      });

      toast.success('مرحباً بك في لوحة تحكم الإدارة');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('فشل تسجيل الدخول: ' + error.message);
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
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('خطأ في تسجيل الخروج');
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
