
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  role: 'user' | 'supplier' | 'freelancer' | 'admin' | 'api';
  country_code?: string;
  industry_sector?: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  kyc_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  kyc_completed_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for development
const mockUser = {
  id: 'mock-user-id',
  email: 'demo@gpodo.com',
  user_metadata: {},
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User;

const mockProfile: Profile = {
  id: 'mock-user-id',
  email: 'demo@gpodo.com',
  full_name: 'Demo User',
  company_name: 'GPODO Demo',
  role: 'user',
  country_code: 'SA',
  industry_sector: 'Technology',
  phone: '+966501234567',
  is_verified: true,
  kyc_status: 'approved',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [profile, setProfile] = useState<Profile | null>(mockProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set mock data immediately for demo mode
    console.log('Demo mode: Using mock authentication data');
    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      // Mock sign up - just show success message
      toast.success('تم إنشاء الحساب بنجاح (وضع تجريبي)');
    } catch (error: any) {
      toast.error('خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock sign in - just show success message
      toast.success('تم تسجيل الدخول بنجاح (وضع تجريبي)');
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Mock sign out
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error('خطأ في تسجيل الخروج');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error: any) {
      toast.error('خطأ في تحديث الملف الشخصي');
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
