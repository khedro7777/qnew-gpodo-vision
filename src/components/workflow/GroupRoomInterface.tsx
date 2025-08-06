
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGroupWorkflow } from '@/hooks/useGroupWorkflow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Calendar,
  Download,
  Settings,
  Crown
} from 'lucide-react';
import GroupRoomTabs from './GroupRoomTabs';

interface GroupRoomProps {
  groupId: string;
}

const GroupRoomInterface = ({ groupId }: GroupRoomProps) => {
  const { user } = useAuth();
  const workflow = useGroupWorkflow(groupId);
  const [group, setGroup] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('member');
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroupData();
  }, [groupId, user]);

  const loadGroupData = async () => {
    try {
      // Load group details with mock data for demo
      const mockGroup = {
        id: groupId,
        name: 'مجموعة الشراء الجماعي للمعدات الطبية',
        description: 'مجموعة متخصصة في الشراء الجماعي للمعدات الطبية بأسعار تنافسية',
        gateway_type: 'purchasing',
        status: 'active',
        current_members: 12,
        max_members: 20,
        is_public: true,
        created_at: new Date().toISOString(),
        creator_id: 'mock-creator-id',
        countries: {
          name: 'المملكة العربية السعودية',
          flag_emoji: '🇸🇦'
        },
        industry_sectors: {
          name: 'الرعاية الصحية',
          icon: '🏥'
        }
      };

      setGroup(mockGroup);

      // Mock user role - in real app this would come from database
      const mockUserRole = user?.id === 'mock-creator-id' ? 'founder' : 'member';
      setUserRole(mockUserRole);
      
      // Check if user is an elected manager
      const mockIsManager = Math.random() > 0.5; // 50% chance for demo
      setIsManager(mockIsManager);

      if (mockIsManager && mockUserRole !== 'founder') {
        toast.success('مرحباً بك في لوحة المديرين! أنت مدير منتخب لهذه المجموعة');
      }

    } catch (error) {
      console.error('Load group data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportGroupData = async () => {
    try {
      toast.success('تم تصدير تقرير المجموعة بنجاح');
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'pending': return 'قيد المراجعة';
      case 'closed': return 'مغلقة';
      case 'archived': return 'مؤرشفة';
      default: return status;
    }
  };

  const getGatewayTypeText = (type: string) => {
    switch (type) {
      case 'purchasing': return '🛒 الشراء الجماعي';
      case 'marketing': return '📢 التسويق التعاوني';
      case 'formation': return '🏢 تأسيس الشركات';
      case 'freelancers': return '👨‍💻 الفرق المستقلة';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">المجموعة غير موجودة</h2>
        <p className="text-gray-600 mt-2">المجموعة التي تبحث عنها غير موجودة أو ليس لديك صلاحية للوصول إليها.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Group Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <Badge className={getStatusColor(group.status)}>
                {getStatusText(group.status)}
              </Badge>
              {userRole === 'founder' && (
                <Badge className="bg-purple-100 text-purple-800">مؤسس</Badge>
              )}
              {isManager && userRole !== 'founder' && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Crown className="w-3 h-3 mr-1" />
                  مدير منتخب
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">{getGatewayTypeText(group.gateway_type)}</p>
            
            {group.description && (
              <p className="text-gray-600 mb-4">{group.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{group.current_members}/{group.max_members} عضو</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>تم الإنشاء {new Date(group.created_at).toLocaleDateString('ar')}</span>
              </div>

              {group.countries && (
                <div className="flex items-center gap-1">
                  <span>{group.countries.flag_emoji}</span>
                  <span>{group.countries.name}</span>
                </div>
              )}

              {group.industry_sectors && (
                <div className="flex items-center gap-1">
                  <span>{group.industry_sectors.icon}</span>
                  <span>{group.industry_sectors.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportGroupData}>
              <Download className="w-4 h-4 mr-2" />
              تصدير PDF
            </Button>
            
            {(userRole === 'founder' || isManager) && (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                الإعدادات
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">سعة المجموعة</span>
            <span className="text-sm text-gray-500">
              {Math.round((group.current_members / group.max_members) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-productivity-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(group.current_members / group.max_members) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Manager Welcome Message */}
      {isManager && (
        <Card className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-900">أنت الآن مدير منتخب لهذه المجموعة</h3>
              <p className="text-sm text-yellow-700">يمكنك الآن الوصول إلى لوحة المديرين وإنشاء القرارات والموافقة على العروض</p>
            </div>
          </div>
        </Card>
      )}

      {/* Group Room Tabs */}
      <GroupRoomTabs 
        group={group} 
        userRole={userRole} 
        isManager={isManager}
        groupId={groupId}
      />
    </div>
  );
};

export default GroupRoomInterface;
