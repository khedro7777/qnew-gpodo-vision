
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRoles, UserRole } from '@/hooks/useUserRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Scale, 
  Settings, 
  Bot,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const roleConfigs = {
  supplier: {
    title: 'Supplier Dashboard',
    description: 'Manage your products and supplier offers',
    icon: Store,
    route: '/dashboard/supplier',
    color: 'bg-blue-500',
    requiresApproval: false
  },
  buyer: {
    title: 'Buyer Dashboard', 
    description: 'Browse and purchase products',
    icon: ShoppingCart,
    route: '/dashboard/buyer',
    color: 'bg-green-500',
    requiresApproval: false
  },
  freelancer: {
    title: 'Freelancer Dashboard',
    description: 'Offer your services and manage projects',
    icon: Briefcase,
    route: '/dashboard/freelancer', 
    color: 'bg-purple-500',
    requiresApproval: false
  },
  group_member: {
    title: 'Group Buying Dashboard',
    description: 'Join group purchases and save money',
    icon: Users,
    route: '/dashboard/group-buying',
    color: 'bg-orange-500',
    requiresApproval: false
  },
  investor: {
    title: 'Investment Dashboard',
    description: 'Explore investment opportunities',
    icon: TrendingUp,
    route: '/dashboard/investor',
    color: 'bg-indigo-500',
    requiresApproval: false
  },
  judge: {
    title: 'Judges Dashboard',
    description: 'Handle disputes and arbitration',
    icon: Scale,
    route: '/dashboard/judge',
    color: 'bg-red-500',
    requiresApproval: true
  },
  admin: {
    title: 'Admin Dashboard',
    description: 'Platform administration and management',
    icon: Settings,
    route: '/admin/overview',
    color: 'bg-gray-500',
    requiresApproval: true
  },
  ai_agent: {
    title: 'AI Agent Dashboard',
    description: 'AI-powered automation and analysis',
    icon: Bot,
    route: '/dashboard/ai-agent',
    color: 'bg-cyan-500',
    requiresApproval: true
  }
};

const BoardSelector = () => {
  const navigate = useNavigate();
  const { approvedRoles, pendingRoles, hasRole, requestRole, isLoading } = useUserRoles();
  const [requesting, setRequesting] = useState<UserRole | null>(null);

  const handleBoardSelect = (role: UserRole) => {
    const config = roleConfigs[role];
    if (hasRole(role)) {
      navigate(config.route);
    }
  };

  const handleRequestRole = async (role: UserRole) => {
    setRequesting(role);
    try {
      await requestRole(role);
      toast.success(`${roleConfigs[role].title} access requested successfully!`);
    } catch (error) {
      toast.error('Failed to request role access');
      console.error('Role request error:', error);
    } finally {
      setRequesting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Select Your Dashboard</h1>
          <p className="text-xl text-gray-600">Choose the dashboard that matches your role and needs</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(roleConfigs).map(([roleKey, config]) => {
            const role = roleKey as UserRole;
            const hasAccess = hasRole(role);
            const isPending = pendingRoles.some(r => r.role === role);
            const Icon = config.icon;
            
            return (
              <Card key={role} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`absolute top-0 left-0 right-0 h-2 ${config.color}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-gray-700" />
                    <div className="flex gap-2">
                      {hasAccess && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                      {isPending && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      {config.requiresApproval && !hasAccess && !isPending && (
                        <Badge variant="outline" className="border-red-500 text-red-700">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Approval Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{config.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-6">{config.description}</p>
                  
                  {hasAccess ? (
                    <Button 
                      onClick={() => handleBoardSelect(role)}
                      className="w-full"
                    >
                      Enter Dashboard
                    </Button>
                  ) : isPending ? (
                    <Button disabled className="w-full">
                      Request Pending...
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => handleRequestRole(role)}
                      disabled={requesting === role}
                      className="w-full"
                    >
                      {requesting === role ? 'Requesting...' : 'Request Access'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {approvedRoles.length > 0 && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Access</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {approvedRoles.map((roleData) => {
                const config = roleConfigs[roleData.role];
                const Icon = config.icon;
                return (
                  <Button
                    key={roleData.role}
                    onClick={() => handleBoardSelect(roleData.role)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {config.title}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardSelector;
