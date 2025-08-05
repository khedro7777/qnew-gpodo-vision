
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  Vote, 
  FileText, 
  CheckSquare, 
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  Clock
} from 'lucide-react';

interface GroupOverviewProps {
  group: any;
  userRole: string;
}

const GroupOverview = ({ group, userRole }: GroupOverviewProps) => {
  const [stats, setStats] = useState({
    activeVotes: 0,
    pendingProposals: 0,
    completedTasks: 0,
    totalTasks: 0,
    activeCases: 0,
    memberActivity: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    loadOverviewData();
  }, [group.id]);

  const loadOverviewData = async () => {
    try {
      // Load statistics
      const [votesData, proposalsData, tasksData, casesData] = await Promise.all([
        supabase.from('votes').select('*').eq('group_id', group.id).eq('status', 'active'),
        supabase.from('proposals').select('*').eq('group_id', group.id).eq('status', 'submitted'),
        supabase.from('tasks').select('*').eq('group_id', group.id),
        supabase.from('arbitration_cases').select('*').eq('group_id', group.id).eq('status', 'in_progress')
      ]);

      const completedTasks = tasksData.data?.filter(t => t.status === 'completed') || [];
      
      setStats({
        activeVotes: votesData.data?.length || 0,
        pendingProposals: proposalsData.data?.length || 0,
        completedTasks: completedTasks.length,
        totalTasks: tasksData.data?.length || 0,
        activeCases: casesData.data?.length || 0,
        memberActivity: group.current_members * 0.8 // Mock activity rate
      });

      // Load recent activity (mock data for now)
      setRecentActivity([
        { id: 1, type: 'vote', title: 'New supplier vote created', time: '2 hours ago', user: 'John Doe' },
        { id: 2, type: 'proposal', title: 'Marketing proposal submitted', time: '4 hours ago', user: 'Jane Smith' },
        { id: 3, type: 'task', title: 'Task completed: Contract review', time: '6 hours ago', user: 'Mike Johnson' },
        { id: 4, type: 'member', title: 'New member joined', time: '1 day ago', user: 'Sarah Wilson' }
      ]);

      // Load milestones (mock data)
      setMilestones([
        { id: 1, title: 'Group Formation', status: 'completed', date: group.created_at },
        { id: 2, title: 'First 10 Members', status: group.current_members >= 10 ? 'completed' : 'pending', date: null },
        { id: 3, title: 'First Successful Vote', status: votesData.data && votesData.data.length > 0 ? 'completed' : 'pending', date: null },
        { id: 4, title: 'First Contract', status: 'pending', date: null }
      ]);

    } catch (error) {
      console.error('Load overview data error:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote': return <Vote className="w-4 h-4 text-blue-500" />;
      case 'proposal': return <FileText className="w-4 h-4 text-green-500" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'member': return <Users className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMilestoneIcon = (status: string) => {
    return status === 'completed' ? 
      <CheckSquare className="w-5 h-5 text-green-500" /> : 
      <Clock className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Votes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeVotes}</p>
            </div>
            <Vote className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Proposals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingProposals}</p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Task Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTasks}/{stats.totalTasks}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCases}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Group Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Group Progress
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Member Capacity</span>
                <span>{group.current_members}/{group.max_members}</span>
              </div>
              <Progress value={(group.current_members / group.max_members) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Task Completion</span>
                <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
              </div>
              <Progress value={stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Member Activity</span>
                <span>{Math.round(stats.memberActivity)}%</span>
              </div>
              <Progress value={stats.memberActivity} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" className="w-full mt-4 text-sm">
            View All Activity
          </Button>
        </Card>

        {/* Milestones */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Milestones
          </h3>
          
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center gap-3">
                {getMilestoneIcon(milestone.status)}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    milestone.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {milestone.title}
                  </p>
                  {milestone.date && (
                    <p className="text-xs text-gray-400">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                  {milestone.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
              <Vote className="w-4 h-4" />
              <span className="text-xs">Start Vote</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
              <FileText className="w-4 h-4" />
              <span className="text-xs">New Proposal</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
              <CheckSquare className="w-4 h-4" />
              <span className="text-xs">Add Task</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex flex-col gap-1 h-16">
              <Users className="w-4 h-4" />
              <span className="text-xs">Invite Member</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GroupOverview;
