
import React from 'react';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useFocusSessions, useTasks, useGoals } from '@/hooks/useProductivityData';

const EnhancedStats = () => {
  const { data: focusSessions = [] } = useFocusSessions();
  const { data: tasks = [] } = useTasks();
  const { data: goals = [] } = useGoals();

  // Calculate today's stats
  const today = new Date().toDateString();
  const todaysSessions = focusSessions.filter(session => 
    new Date(session.started_at).toDateString() === today && session.completed
  );
  const todaysTasks = tasks.filter(task => 
    task.completed_at && new Date(task.completed_at).toDateString() === today
  );
  
  const totalFocusTime = todaysSessions.reduce((sum, session) => sum + session.duration_minutes, 0);
  const completedGoals = goals.filter(goal => goal.current_value >= goal.target_value).length;
  const productivity = tasks.length > 0 ? Math.round((todaysTasks.length / tasks.length) * 100) : 0;

  const stats = [
    {
      icon: Target,
      label: 'Focus Sessions',
      value: todaysSessions.length.toString(),
      change: `+${todaysSessions.length}`,
      color: 'text-productivity-orange'
    },
    {
      icon: Clock,
      label: 'Time Focused',
      value: `${Math.floor(totalFocusTime / 60)}h ${totalFocusTime % 60}m`,
      change: `+${totalFocusTime}m`,
      color: 'text-productivity-blue'
    },
    {
      icon: Zap,
      label: 'Tasks Completed',
      value: todaysTasks.length.toString(),
      change: `+${todaysTasks.length}`,
      color: 'text-productivity-green'
    },
    {
      icon: TrendingUp,
      label: 'Goals Achieved',
      value: completedGoals.toString(),
      change: `${productivity}%`,
      color: 'text-productivity-purple'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
              {stat.change}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedStats;
