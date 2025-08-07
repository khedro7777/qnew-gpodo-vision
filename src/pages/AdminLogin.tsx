
import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminLogin = () => {
  const { adminUser, signIn, loading } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: 'admin@gpodo.com',
    password: 'admin123',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (adminUser) {
    return <Navigate to="/admin/overview" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', formData.email);
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري التحقق من صلاحيات الدخول...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">لوحة تحكم الإدارة</CardTitle>
          <p className="text-gray-600 mt-2">منصة GPODO - تسجيل دخول المدير</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-right">
                <div className="font-semibold mb-2">خطأ في تسجيل الدخول:</div>
                <div className="text-sm">{error}</div>
              </AlertDescription>
            </Alert>
          )}
          
          <Alert className="border-blue-200 bg-blue-50">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-right">
              <strong>بيانات الدخول المتاحة:</strong>
              <div className="mt-3 space-y-3 text-sm">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="font-semibold text-blue-800">الحساب الأول:</div>
                  <div className="flex items-center mt-1">📧 admin@gpodo.com</div>
                  <div className="flex items-center">🔑 admin123</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="font-semibold text-blue-800">الحساب الثاني:</div>
                  <div className="flex items-center mt-1">📧 khedrodo@gmail.com</div>
                  <div className="flex items-center">🔑 Omarlo</div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@gpodo.com"
                required
                dir="ltr"
                className="text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="أدخل كلمة المرور"
                required
                dir="ltr"
                className="text-left"
              />
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
                  <Shield className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

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

export default AdminLogin;
