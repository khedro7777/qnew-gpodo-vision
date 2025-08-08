import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User, UserRole, KycStatus } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: User | null; // Add profile property
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for development that matches our User interface
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@gpodo.com',
  full_name: 'Demo User',
  company_name: 'GPODO Demo',
  role: 'user' as UserRole,
  country_code: 'SA',
  industry_sector: 'التكنولوجيا',
  phone: '+966501234567',
  is_verified: true,
  kyc_status: 'approved' as KycStatus,
  kyc_completed_at: new Date().toISOString(),
  points: 1000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set mock data immediately for demo mode
    console.log('Demo mode: Using mock authentication data');
    setUser(mockUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      // Mock sign up - just show success message
      toast.success('Account created successfully (demo mode)');
    } catch (error: any) {
      toast.error('Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Mock sign in - just show success message
      toast.success('Signed in successfully (demo mode)');
    } catch (error: any) {
      toast.error('Error signing in');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Mock sign out
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setUser(prev => prev ? { 
        ...prev, 
        ...updates, 
        updated_at: new Date().toISOString() 
      } : null);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error: any) {
      toast.error('حدث خطأ في تحديث الملف الشخصي');
      throw error;
    }
  };

  const value = {
    user,
    profile: user, // Set profile to be same as user for now
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
