
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('my-groups');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Demo Mode Banner */}
          <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-900">Demo Mode - Development Version</h3>
                <p className="text-sm text-yellow-700">Authentication temporarily disabled • Mock data for development</p>
              </div>
            </div>
          </Card>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Dashboard</h1>
            <p className="text-gray-600">Welcome, {profile?.full_name || user?.email}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 mb-8">
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              <TabsTrigger value="group-rooms">Group Rooms</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="mcp-assistant">MCP Assistant</TabsTrigger>
              <TabsTrigger value="discount-offers">Discount Offers</TabsTrigger>
              <TabsTrigger value="arbitration">Arbitration</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
              <TabsTrigger value="store">Store</TabsTrigger>
              <TabsTrigger value="company-formation">Company Formation</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="market-insights">Market Insights</TabsTrigger>
              <TabsTrigger value="risk-management">Risk Management</TabsTrigger>
            </TabsList>

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
