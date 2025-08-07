
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Check, X, Users } from 'lucide-react';
import { useInvitations } from '@/hooks/useInvitations';
import { Skeleton } from '@/components/ui/skeleton';

const GroupInvitations = () => {
  const { 
    invitations, 
    isLoading, 
    acceptInvitation, 
    rejectInvitation,
    isAcceptingInvitation,
    isRejectingInvitation 
  } = useInvitations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <CardTitle>دعوات المجموعات</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-productivity-blue" />
            <CardTitle>دعوات المجموعات</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد دعوات جديدة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-productivity-blue" />
            <CardTitle>دعوات المجموعات</CardTitle>
          </div>
          <Badge variant="secondary">{invitations.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div 
              key={invitation.id}
              className="p-4 border rounded-lg space-y-3"
            >
              <div>
                <h4 className="font-medium">
                  {invitation.groups?.name || 'مجموعة غير محددة'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  دعوة من {invitation.invited_by_profile?.full_name || 'مستخدم غير معروف'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(invitation.created_at).toLocaleDateString('ar-SA')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => acceptInvitation(invitation.id)}
                  disabled={isAcceptingInvitation}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 ml-1" />
                  قبول
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectInvitation(invitation.id)}
                  disabled={isRejectingInvitation}
                >
                  <X className="w-4 h-4 ml-1" />
                  رفض
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInvitations;
