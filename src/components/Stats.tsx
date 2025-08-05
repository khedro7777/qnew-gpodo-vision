
import React from 'react';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Stats = () => {
  const stats = [
    {
      icon: Target,
      label: 'Focus Sessions',
      value: '12',
      change: '+3',
      color: 'text-productivity-orange'
    },
    {
      icon: Clock,
      label: 'Time Focused',
      value: '5h 30m',
      change: '+45m',
      color: 'text-productivity-blue'
    },
    {
      icon: Zap,
      label: 'Tasks Completed',
      value: '8',
      change: '+2',
      color: 'text-productivity-green'
    },
    {
      icon: TrendingUp,
      label: 'Productivity',
      value: '85%',
      change: '+12%',
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

export default Stats;
