
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Briefcase, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

const AdminOverview = () => {
  // Mock data - in real app, fetch from API
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: Users,
      trend: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Active Groups',
      value: '89',
      icon: Building2,
      trend: '+8%',
      color: 'text-green-600'
    },
    {
      title: 'Live Offers',
      value: '156',
      icon: Briefcase,
      trend: '+24%',
      color: 'text-purple-600'
    },
    {
      title: 'Open Disputes',
      value: '3',
      icon: AlertTriangle,
      trend: '-2%',
      color: 'text-red-600'
    },
    {
      title: 'Revenue (Month)',
      value: '$12,456',
      icon: DollarSign,
      trend: '+18%',
      color: 'text-yellow-600'
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      icon: TrendingUp,
      trend: '+5%',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
        <p className="text-gray-600">Key performance indicators and system status</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium mt-1">
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registered', time: '2 minutes ago' },
                { action: 'Group "Tech Suppliers" created', time: '15 minutes ago' },
                { action: 'Payment processed: $450', time: '1 hour ago' },
                { action: 'Dispute resolved', time: '2 hours ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium text-green-600">145ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Database Performance</span>
                <span className="text-sm font-medium text-green-600">Excellent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage Usage</span>
                <span className="text-sm font-medium text-yellow-600">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Sessions</span>
                <span className="text-sm font-medium text-blue-600">892</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
