
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Building2, ExternalLink, Plus, Crown } from 'lucide-react';
import { useGroups } from '@/hooks/useSupabaseData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import GroupCreationWizard from '@/components/workflow/GroupCreationWizard';

const MyGroupsTab = () => {
  const { data: groups = [], isLoading } = useGroups();
  const { user } = useAuth();
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Mock data for demonstration with role-based groups
  const myGroupsData = [
    {
      id: '1',
      name: 'مجموعة الشراء الجماعي للمعدات الطبية',
      description: 'شراء جماعي للمعدات الطبية بأسعار تنافسية',
      status: 'active',
      current_members: 12,
      max_members: 20,
      gateway_type: 'purchasing',
      userRole: 'founder',
      isManager: false,
      created_at: '2024-01-10T00:00:00Z',
      countries: { name: 'السعودية', flag_emoji: '🇸🇦' },
      industry_sectors: { name: 'الرعاية الصحية', icon: '🏥' }
    },
    {
      id: '2',
      name: 'تعاونية التسويق الرقمي',
      description: 'حملات تسويقية مشتركة للشركات الناشئة',
      status: 'active',
      current_members: 8,
      max_members: 15,
      gateway_type: 'marketing',
      userRole: 'member',
      isManager: true,
      created_at: '2024-01-05T00:00:00Z',
      countries: { name: 'الإمارات', flag_emoji: '🇦🇪' },
      industry_sectors: { name: 'التسويق', icon: '📢' }
    },
    {
      id: '3',
      name: 'مجموعة الاستثمار التعاوني',
      description: 'استثمار جماعي في المشاريع الناشئة',
      status: 'under_voting',
      current_members: 15,
      max_members: 25,
      gateway_type: 'investment',
      userRole: 'member',
      isManager: false,
      created_at: '2024-01-01T00:00:00Z',
      countries: { name: 'الكويت', flag_emoji: '🇰🇼' },
      industry_sectors: { name: 'الاستثمار', icon: '💰' }
    },
    {
      id: '4',
      name: 'فريق التطوير المستقل',
      description: 'فريق مطورين للعمل على المشاريع التقنية',
      status: 'under_arbitration',
      current_members: 6,
      max_members: 10,
      gateway_type: 'freelancers',
      userRole: 'admin',
      isManager: true,
      created_at: '2023-12-20T00:00:00Z',
      countries: { name: 'البحرين', flag_emoji: '🇧🇭' },
      industry_sectors: { name: 'التكنولوجيا', icon: '💻' }
    }
  ];

  const getGatewayTypeText = (type: string) => {
    switch (type) {
      case 'purchasing': return 'الشراء الجماعي';
      case 'marketing': return 'تعاونيات التسويق';
      case 'investment': return 'الاستثمار التعاوني';
      case 'freelancers': return 'فريق مستقل';
      case 'formation': return 'تأسيس الشركات';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-0">نشطة</Badge>;
      case 'under_voting':
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">تحت التصويت</Badge>;
      case 'under_arbitration':
        return <Badge className="bg-red-100 text-red-800 border-0">تحت التحكيم</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 border-0">معلقة</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">{status}</Badge>;
    }
  };

  const getRoleText = (role: string, isManager: boolean) => {
    if (isManager && role !== 'founder') {
      return 'مدير منتخب';
    }
    switch (role) {
      case 'founder': return 'مؤسس';
      case 'admin': return 'مدير';
      case 'member': return 'عضو';
      default: return role;
    }
  };

  const getLastUpdateText = (status: string) => {
    switch (status) {
      case 'active':
        return 'آخر نشاط: منذ ساعتين';
      case 'under_voting':
        return 'آخر تصويت: قرار اختيار المورد';
      case 'under_arbitration':
        return 'آخر قرار: رفع نزاع للتحكيم';
      default:
        return 'آخر تحديث: منذ يوم';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري تحميل المجموعات...</div>;
  }

  if (showCreateGroup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
            ← العودة إلى المجموعات
          </Button>
          <h2 className="text-xl font-semibold text-gray-900">إنشاء مجموعة جديدة</h2>
        </div>
        <GroupCreationWizard onComplete={() => {
          setShowCreateGroup(false);
          window.location.reload();
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">مجموعاتي</h3>
            <p className="text-gray-600">إدارة مجموعاتك والمشاركة في الأنشطة الجماعية</p>
          </div>
          <Button onClick={() => setShowCreateGroup(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 ml-2" />
            إنشاء مجموعة
          </Button>
        </div>

        {/* Group Type Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { type: 'purchasing', label: 'الشراء الجماعي', icon: '🛒', count: myGroupsData.filter(g => g.gateway_type === 'purchasing').length },
            { type: 'marketing', label: 'تعاونيات التسويق', icon: '📢', count: myGroupsData.filter(g => g.gateway_type === 'marketing').length },
            { type: 'investment', label: 'الاستثمار التعاوني', icon: '💰', count: myGroupsData.filter(g => g.gateway_type === 'investment').length },
            { type: 'freelancers', label: 'فريق مستقل', icon: '👥', count: myGroupsData.filter(g => g.gateway_type === 'freelancers').length }
          ].map((stat) => (
            <Card key={stat.type} className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h4 className="font-semibold text-gray-900">{stat.label}</h4>
              <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {myGroupsData.length === 0 ? (
            <Card className="p-6 col-span-full text-center">
              <p className="text-gray-600 mb-4">لم تنشئ أي مجموعات بعد.</p>
              <Button onClick={() => setShowCreateGroup(true)}>إنشاء مجموعتك الأولى</Button>
            </Card>
          ) : (
            myGroupsData.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-all duration-200 border-r-4 border-r-blue-500">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{group.name}</h4>
                        {group.isManager && (
                          <Crown className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        {getGatewayTypeText(group.gateway_type)}
                      </p>
                    </div>
                    {getStatusBadge(group.status)}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {group.description}
                  </p>

                  {/* Role and Status Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-500">دورك في المجموعة</span>
                      <p className="font-medium text-gray-900">
                        {getRoleText(group.userRole, group.isManager)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">آخر تحديث</span>
                      <p className="font-medium text-gray-900 text-sm">
                        {getLastUpdateText(group.status)}
                      </p>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.current_members}/{group.max_members} أعضاء</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.industry_sectors?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{group.countries?.flag_emoji} {group.countries?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{new Date(group.created_at).toLocaleDateString('ar')}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">امتلاء المجموعة</span>
                      <span className="text-gray-500">{Math.round((group.current_members / group.max_members) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/group/${group.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                      <ExternalLink className="w-4 h-4 ml-2" />
                      دخول إلى غرفة المجموعة
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Manager Privileges Info */}
      {myGroupsData.some(g => g.isManager) && (
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start gap-4">
            <Crown className="w-8 h-8 text-yellow-600 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-yellow-900 mb-2">صلاحيات المدير المنتخب</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-800">
                <div className="space-y-1">
                  <p>• الوصول إلى تبويب المديرين</p>
                  <p>• إنشاء وإدارة القرارات</p>
                  <p>• الموافقة على العروض المقدمة</p>
                </div>
                <div className="space-y-1">
                  <p>• التواصل المباشر مع MCP</p>
                  <p>• مراجعة تقارير أداء المجموعة</p>
                  <p>• دعوة أعضاء ومستقلين جدد</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyGroupsTab;
