
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Bell, 
  MessageCircle, 
  Users, 
  FileText, 
  TrendingUp, 
  Shield,
  LogOut,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                GPODO
              </Link>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                لوحة العميل
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 ml-2" />
                  الرئيسية
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في لوحة التحكم
          </h1>
          <p className="text-gray-600">
            إدارة مجموعاتك التجارية ومتابعة أنشطتك بسهولة
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المجموعات</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الرسائل</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المشاريع</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">النشاط</p>
                  <p className="text-2xl font-bold text-gray-900">جديد</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  مجموعاتي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد مجموعات حالياً
                  </h3>
                  <p className="text-gray-600 mb-6">
                    ابدأ بإنشاء مجموعة جديدة أو انضم إلى مجموعة موجودة
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/dashboard">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        استكشاف المجموعات
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  الملف الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                      <p className="text-sm text-gray-600">عضو جديد</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Link to="/settings">
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 ml-2" />
                        إعدادات الحساب
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">لا توجد إشعارات جديدة</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  حالة الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">تم التحقق من البريد الإلكتروني</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">في انتظار التحقق من الهوية</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Shield className="w-4 h-4 ml-2" />
                    إكمال التحقق
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
