
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import MyGroupsTab from '@/components/dashboard/MyGroupsTab';
import GroupRoomsTab from '@/components/dashboard/GroupRoomsTab';
import WalletTab from '@/components/dashboard/WalletTab';
import MCPAssistantTab from '@/components/dashboard/MCPAssistantTab';
import DiscountOffersTab from '@/components/dashboard/DiscountOffersTab';
import ArbitrationTab from '@/components/dashboard/ArbitrationTab';
import ArchiveTab from '@/components/dashboard/ArchiveTab';
import StoreTab from '@/components/dashboard/StoreTab';
import CompanyFormationTab from '@/components/dashboard/CompanyFormationTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import MarketInsightsTab from '@/components/dashboard/MarketInsightsTab';
import RiskManagementTab from '@/components/dashboard/RiskManagementTab';
import { SupplierDashboard } from '@/components/supplier/SupplierDashboard';
import FreelancerDashboardTab from '@/components/dashboard/FreelancerDashboardTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Vote, 
  Package,
  Zap,
  Star,
  Award,
  Activity
} from 'lucide-react';

const EnhancedClientDashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('my-groups');

  const tabs = [
    { id: 'my-groups', label: 'My Groups', shortLabel: 'Groups', icon: Users },
    { id: 'group-rooms', label: 'Group Rooms', shortLabel: 'Rooms', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', shortLabel: 'Wallet', icon: Package },
    { id: 'mcp-assistant', label: 'MCP Assistant', shortLabel: 'MCP', icon: Zap },
    { id: 'discount-offers', label: 'Discount Offers', shortLabel: 'Offers', icon: Star },
    { id: 'seller', label: 'Seller Dashboard', shortLabel: 'Seller', icon: Package },
    { id: 'freelancer', label: 'Freelancer Dashboard', shortLabel: 'Freelancer', icon: Award },
    { id: 'arbitration', label: 'Arbitration', shortLabel: 'Legal', icon: Shield },
    { id: 'archive', label: 'Archive', shortLabel: 'Archive', icon: Package },
    { id: 'store', label: 'Store', shortLabel: 'Store', icon: Package },
    { id: 'company-formation', label: 'Company Formation', shortLabel: 'Company', icon: Package },
    { id: 'notifications', label: 'Notifications', shortLabel: 'Alerts', icon: Activity },
    { id: 'market-insights', label: 'Market Insights', shortLabel: 'Market', icon: TrendingUp },
    { id: 'risk-management', label: 'Risk Management', shortLabel: 'Risk', icon: Shield }
  ];

  // Mock dashboard stats
  const dashboardStats = {
    activeGroups: 5,
    totalMessages: 142,
    activeProposals: 3,
    completedDeals: 8,
    walletBalance: 1250.00,
    reputation: 4.8,
    thisWeekActivity: 23,
    recentAchievements: ['Deal Maker', 'Active Participant', 'Trusted Member']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Demo Mode Banner */}
          <Card className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-4 sm:mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 text-sm sm:text-base">Demo Mode - Development Version</h3>
                <p className="text-xs sm:text-sm text-yellow-700">Enhanced with Snapshot.js, Loomio, and ODR integrations • Mock data for development</p>
              </div>
              <PWAInstallButton />
            </div>
          </Card>

          {/* Enhanced Welcome Section */}
          <Card className="mb-6 sm:mb-8 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
            <CardContent className="relative -mt-12 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Manage your groups, participate in governance, and collaborate effectively
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {dashboardStats.reputation}/5.0 Reputation
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-green-500" />
                      {dashboardStats.thisWeekActivity} actions this week
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${dashboardStats.walletBalance.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Wallet Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 mx-auto mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-foreground">{dashboardStats.activeGroups}</div>
                <div className="text-sm text-muted-foreground">Active Groups</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-2xl font-bold text-foreground">{dashboardStats.totalMessages}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 mx-auto mb-2">
                  <Vote className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-foreground">{dashboardStats.activeProposals}</div>
                <div className="text-sm text-muted-foreground">Active Votes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 mx-auto mb-2">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-foreground">{dashboardStats.completedDeals}</div>
                <div className="text-sm text-muted-foreground">Deals</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced Mobile-friendly tabs */}
            <div className="mb-4 sm:mb-8">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id}
                      value={tab.id}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm shrink-0"
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      <span className="sm:hidden">{tab.shortLabel}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>

            <TabsContent value="my-groups">
              <MyGroupsTab />
            </TabsContent>

            <TabsContent value="group-rooms">
              <GroupRoomsTab />
            </TabsContent>

            <TabsContent value="wallet">
              <WalletTab />
            </TabsContent>

            <TabsContent value="mcp-assistant">
              <MCPAssistantTab />
            </TabsContent>

            <TabsContent value="discount-offers">
              <DiscountOffersTab />
            </TabsContent>

            <TabsContent value="seller">
              <SupplierDashboard />
            </TabsContent>

            <TabsContent value="freelancer">
              <FreelancerDashboardTab />
            </TabsContent>

            <TabsContent value="arbitration">
              <ArbitrationTab />
            </TabsContent>

            <TabsContent value="archive">
              <ArchiveTab />
            </TabsContent>

            <TabsContent value="store">
              <StoreTab />
            </TabsContent>

            <TabsContent value="company-formation">
              <CompanyFormationTab />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="market-insights">
              <MarketInsightsTab />
            </TabsContent>

            <TabsContent value="risk-management">
              <RiskManagementTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EnhancedClientDashboard;
