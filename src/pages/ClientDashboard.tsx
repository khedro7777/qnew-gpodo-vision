import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, ShoppingCart, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { GroupOffersSection } from '@/components/offers/GroupOffersSection';
import { FreelancerServicesSection } from '@/components/freelancer/FreelancerServicesSection';
import { InvestmentProjectsSection } from '@/components/investment/InvestmentProjectsSection';
import { GroupPurchasingSection } from '@/components/purchasing/GroupPurchasingSection';
import { SupplierOffersSection } from '@/components/supplier/SupplierOffersSection';

const ClientDashboard = () => {
  const { offers = [], isLoading } = useSupplierPanel();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeOffers = offers.filter(offer => offer.status === 'active');
  const pendingOffers = offers.filter(offer => offer.status === 'pending');
  const completedOffers = offers.filter(offer => offer.status === 'completed');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-semibold mb-6">Client Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">3,457</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold">$45,789</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue Growth</p>
                    <p className="text-2xl font-bold">+12.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Users className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New Users</p>
                    <p className="text-2xl font-bold">123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="group-offers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="group-offers">Group Offers</TabsTrigger>
              <TabsTrigger value="freelance-services">Freelance Services</TabsTrigger>
              <TabsTrigger value="investment-projects">Investment Projects</TabsTrigger>
              <TabsTrigger value="group-purchasing">Group Purchasing</TabsTrigger>
              <TabsTrigger value="supplier-offers">Supplier Offers ({activeOffers.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="group-offers">
              <GroupOffersSection />
            </TabsContent>
            <TabsContent value="freelance-services">
              <FreelancerServicesSection />
            </TabsContent>
            <TabsContent value="investment-projects">
              <InvestmentProjectsSection />
            </TabsContent>
            <TabsContent value="group-purchasing">
              <GroupPurchasingSection />
            </TabsContent>
             <TabsContent value="supplier-offers">
              <SupplierOffersSection offers={activeOffers} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ClientDashboard;
