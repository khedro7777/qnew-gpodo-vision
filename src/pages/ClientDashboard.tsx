
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletTab from '@/components/dashboard/WalletTab';
import { ClientPointsSection } from '@/components/dashboard/ClientPointsSection';
import { BuyPointsButton } from '@/components/wallet/BuyPointsButton';
import { 
  User, 
  Wallet, 
  Star,
  ShoppingCart, 
  TrendingUp, 
  Bell,
  Settings,
  CreditCard,
  Gift,
  Crown
} from 'lucide-react';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    membershipTier: 'Premium',
    joinDate: '2024-01-15',
    totalSpent: 15420,
    pointsBalance: 2500,
    activeOrders: 3,
    completedOrders: 27
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {userData.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <BuyPointsButton 
                currentPoints={userData.pointsBalance}
                variant="default"
              />
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Points
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="membership" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Membership
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{userData.pointsBalance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Available to spend</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${userData.totalSpent.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Lifetime spending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.activeOrders}</div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Membership</CardTitle>
                  <Crown className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userData.membershipTier}</div>
                  <p className="text-xs text-muted-foreground">Current tier</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Joined group purchase for Electronics</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Earned 100 bonus points</div>
                      <div className="text-sm text-muted-foreground">1 day ago</div>
                    </div>
                    <Badge variant="secondary">+100 pts</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Completed purchase from Supplier ABC</div>
                      <div className="text-sm text-muted-foreground">3 days ago</div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="points">
            <ClientPointsSection />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletTab />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your group purchases and individual orders
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Order management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rewards & Loyalty Program</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Earn points and unlock exclusive benefits
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Rewards program features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership & Subscriptions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your membership tier and benefits
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Membership management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
