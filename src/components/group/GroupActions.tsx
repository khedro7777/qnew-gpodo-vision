import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Users, MessageSquare, Calendar, Settings, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface GroupActionsProps {
  groupId: string;
  isLoggedIn: boolean;
}

const GroupActions: React.FC<GroupActionsProps> = ({ groupId, isLoggedIn }) => {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false); // Mock state

  const handleJoinGroup = () => {
    // Implement the logic to join the group
    setIsMember(true);
    toast.success('تم الانضمام إلى المجموعة بنجاح');
  };

  const handleLeaveGroup = () => {
    // Implement the logic to leave the group
    setIsMember(false);
    toast.success('تم مغادرة المجموعة بنجاح');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          إجراءات المجموعة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">الأعضاء</span>
            </div>
            <Badge variant="secondary">10 أعضاء</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">الرسائل</span>
            </div>
            <Badge variant="secondary">5 رسائل جديدة</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">الاجتماعات القادمة</span>
            </div>
            <Badge variant="secondary">2 اجتماع</Badge>
          </div>
        </div>

        {isLoggedIn ? (
          isMember ? (
            <Button variant="destructive" className="w-full" onClick={handleLeaveGroup}>
              مغادرة المجموعة
            </Button>
          ) : (
            <Button className="w-full" onClick={handleJoinGroup}>
              الانضمام إلى المجموعة
            </Button>
          )
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <UserPlus className="w-4 h-4 ml-2" />
            تسجيل الدخول للانضمام
          </Button>
        )}

        <Button variant="secondary" className="w-full">
          <Shield className="w-4 h-4 ml-2" />
          طلب التحقق
        </Button>
      </CardContent>
    </Card>
  );
};

export default GroupActions;
