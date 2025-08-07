
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  Building2, 
  FileText, 
  Scale, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdmin';

const AdminOverview = () => {
  const { data: stats, isLoading } = useAdminStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'Active Groups',
      value: stats?.totalGroups || 0,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%'
    },
    {
      title: 'Total Contracts',
      value: stats?.totalContracts || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+15%'
    },
    {
      title: 'Active Disputes',
      value: stats?.activeDisputes || 0,
      icon: Scale,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: '-5%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+22%'
    },
    {
      title: 'Pending KYC',
      value: stats?.kycPendingCount || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-3%'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: ahmed@example.com',
      timestamp: '2 minutes ago',
      icon: Users
    },
    {
      id: 2,
      type: 'group_created',
      message: 'New group created: Medical Equipment Purchasing',
      timestamp: '15 minutes ago',
      icon: Building2
    },
    {
      id: 3,
      type: 'contract_signed',
      message: 'Contract signed for Tech Solutions Group',
      timestamp: '1 hour ago',
      icon: FileText
    },
    {
      id: 4,
      type: 'kyc_approved',
      message: 'KYC approved for user sara@example.com',
      timestamp: '2 hours ago',
      icon: CheckCircle
    },
    {
      id: 5,
      type: 'dispute_resolved',
      message: 'Dispute resolved for Manufacturing Group',
      timestamp: '3 hours ago',
      icon: Scale
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to the gpodo5 admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                    <span className="text-xs text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database Performance</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">Optimal</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">245ms</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Connections</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">1,247</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-1 bg-gray-100 rounded-full">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Manage Users</span>
          </button>
          
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Building2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium">View Groups</span>
          </button>
          
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Review KYC</span>
          </button>
          
          <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <Scale className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <span className="text-sm font-medium">Handle Disputes</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
