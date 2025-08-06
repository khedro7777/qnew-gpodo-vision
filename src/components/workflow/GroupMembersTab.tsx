
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Crown, 
  Vote, 
  UserPlus, 
  Settings,
  Calendar,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  votes_count?: number;
}

interface GroupMembersTabProps {
  groupId: string;
  userRole: string;
}

const GroupMembersTab = ({ groupId, userRole }: GroupMembersTabProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [electionActive, setElectionActive] = useState(false);

  useEffect(() => {
    loadMembers();
    checkElectionStatus();
  }, [groupId]);

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles(full_name, email, avatar_url)
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Load members error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkElectionStatus = async () => {
    // Check if group has enough members and no active managers
    const { data: group } = await supabase
      .from('groups')
      .select('current_members')
      .eq('id', groupId)
      .single();

    if (group && group.current_members >= 5) {
      const { data: managers } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('role', 'admin');

      if (!managers || managers.length < 3) {
        setElectionActive(true);
      }
    }
  };

  const initiateElection = async () => {
    try {
      // Create election proposal
      const { error } = await supabase
        .from('group_proposals')
        .insert({
          group_id: groupId,
          title: 'انتخاب مديري المجموعة',
          description: 'انتخاب 3 مديرين لإدارة المجموعة لفترة 6 أشهر',
          status: 'active',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      // Notify all members
      toast.success('تم إطلاق عملية الانتخاب - 48 ساعة للتصويت');
      setElectionActive(true);
    } catch (error) {
      toast.error('فشل في إطلاق الانتخاب');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'founder':
        return <Badge className="bg-purple-100 text-purple-800">مؤسس</Badge>;
      case 'admin':
        return <Badge className="bg-yellow-100 text-yellow-800">مدير منتخب</Badge>;
      case 'member':
        return <Badge className="bg-green-100 text-green-800">عضو</Badge>;
      default:
        return <Badge variant="outline">مراقب</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Election Banner */}
      {electionActive && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vote className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">انتخاب مديري المجموعة</h3>
                  <p className="text-sm text-yellow-700">صوت لاختيار 3 مديرين - الجولة مفتوحة 48 ساعة</p>
                </div>
              </div>
              <Button variant="outline" className="border-yellow-300">
                <Vote className="w-4 h-4 mr-2" />
                صوت الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              أعضاء المجموعة ({members.length})
            </div>
            {userRole === 'admin' && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  دعوة عضو
                </Button>
                {!electionActive && members.length >= 5 && (
                  <Button onClick={initiateElection} size="sm">
                    <Crown className="w-4 h-4 mr-2" />
                    إطلاق الانتخاب
                  </Button>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.profile?.avatar_url} />
                    <AvatarFallback>
                      {member.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-medium">{member.profile?.full_name || 'مستخدم'}</h4>
                    <p className="text-sm text-gray-500">{member.profile?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        انضم في {new Date(member.joined_at).toLocaleDateString('ar')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getRoleBadge(member.role)}
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">{member.votes_count || 0}</div>
                    <div className="text-xs text-gray-500">أصوات</div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-500">نشط</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">المديرين</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {members.filter(m => m.role === 'admin').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">الأعضاء النشطين</h3>
            <p className="text-2xl font-bold text-blue-600">
              {members.filter(m => m.role === 'member').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">معدل المشاركة</h3>
            <p className="text-2xl font-bold text-green-600">87%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupMembersTab;
