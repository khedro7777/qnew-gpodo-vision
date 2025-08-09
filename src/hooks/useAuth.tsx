
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user && event === 'SIGNED_IN') {
          // Check if profile exists, create if not
          setTimeout(async () => {
            try {
              if (!mounted) return;
              
              const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', session.user.id)
                .single();

              if (!profile && mounted) {
                await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email!,
                    full_name: session.user.user_metadata?.full_name || session.user.email
                  });
              }
            } catch (error) {
              console.error('Profile creation error:', error);
            }
          }, 100);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('تم تسجيل الدخول بنجاح');
      }

      return { error };
    } catch (err) {
      console.error('Sign in error:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('حدث خطأ في تسجيل الدخول');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName?.trim()
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('تم إنشاء الحساب بنجاح - تحقق من بريدك الإلكتروني');
      }

      return { error };
    } catch (err) {
      console.error('Sign up error:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('حدث خطأ في إنشاء الحساب');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('تم تسجيل الخروج بنجاح');
      }
    } catch (err) {
      console.error('Sign out error:', err);
      toast.error('حدث خطأ في تسجيل الخروج');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور');
      }

      return { error };
    } catch (err) {
      console.error('Reset password error:', err);
      const error = err instanceof Error ? err : new Error('Unknown error');
      toast.error('حدث خطأ في إعادة تعيين كلمة المرور');
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
