
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
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('my-groups');

  const tabs = [
    { id: 'my-groups', label: 'My Groups', shortLabel: 'Groups' },
    { id: 'group-rooms', label: 'Group Rooms', shortLabel: 'Rooms' },
    { id: 'wallet', label: 'Wallet', shortLabel: 'Wallet' },
    { id: 'mcp-assistant', label: 'MCP Assistant', shortLabel: 'MCP' },
    { id: 'discount-offers', label: 'Discount Offers', shortLabel: 'Offers' },
    { id: 'seller', label: 'Seller Dashboard', shortLabel: 'Seller' },
    { id: 'freelancer', label: 'Freelancer Dashboard', shortLabel: 'Freelancer' },
    { id: 'arbitration', label: 'Arbitration', shortLabel: 'Legal' },
    { id: 'archive', label: 'Archive', shortLabel: 'Archive' },
    { id: 'store', label: 'Store', shortLabel: 'Store' },
    { id: 'company-formation', label: 'Company Formation', shortLabel: 'Company' },
    { id: 'notifications', label: 'Notifications', shortLabel: 'Alerts' },
    { id: 'market-insights', label: 'Market Insights', shortLabel: 'Market' },
    { id: 'risk-management', label: 'Risk Management', shortLabel: 'Risk' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Demo Mode Banner */}
          <Card className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-4 sm:mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 text-sm sm:text-base">Demo Mode - Development Version</h3>
                <p className="text-xs sm:text-sm text-yellow-700">Authentication temporarily disabled • Mock data for development</p>
              </div>
            </div>
          </Card>

          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Client Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome, {profile?.full_name || user?.email}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile-friendly tabs with horizontal scroll */}
            <div className="mb-4 sm:mb-8">
              <ScrollArea className="w-full whitespace-nowrap">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full sm:min-w-0">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id}
                      value={tab.id}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm shrink-0"
                    >
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

export default ClientDashboard;
