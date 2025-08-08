
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Mail, Lock, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ClientAuth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  if (user) {
    return <Navigate to="/client-dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (!error) {
        // Navigation will happen automatically via useAuth
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      if (!error) {
        // Success message is handled in useAuth
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من حالة المصادقة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">منصة GPODO</CardTitle>
          <p className="text-gray-600 mt-2">نظام إدارة المجموعات التجارية</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 text-right">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      dir="ltr"
                      className="pl-10 text-left"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="أدخل كلمة المرور"
                      required
                      dir="ltr"
                      className="pl-10 pr-10 text-left"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 ml-2" />
                      تسجيل الدخول
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-right block">الاسم الكامل</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      required
                      dir="rtl"
                      className="pl-10 text-right"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-right block">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                      dir="ltr"
                      className="pl-10 text-left"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-right block">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="أدخل كلمة مرور قوية"
                      required
                      dir="ltr"
                      className="pl-10 pr-10 text-left"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 ml-2" />
                      إنشاء حساب جديد
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-gray-500">
            تحتاج مساعدة؟{' '}
            <a href="mailto:support@gpodo.com" className="text-blue-600 hover:underline">
              تواصل مع الدعم
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAuth;
