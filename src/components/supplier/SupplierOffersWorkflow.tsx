
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Package, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferForm } from './CreateOfferForm';
import { SupplierMyOffers } from './SupplierMyOffers';

const SupplierOffersWorkflow = () => {
  const { offers, isLoading } = useSupplierPanel();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fix the filtering logic to avoid TypeScript errors
  const allOffers = offers || [];
  const activeOffers = allOffers.filter(offer => offer.status === 'active');
  const pendingOffers = allOffers.filter(offer => offer.status === 'pending' || offer.status === 'draft');
  const completedOffers = allOffers.filter(offer => offer.status === 'completed');
  const expiredOffers = allOffers.filter(offer => offer.status === 'expired' || offer.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Offer</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateForm(false)}
          >
            Back to Overview
          </Button>
        </div>
        <CreateOfferForm 
          isOpen={true} 
          onClose={() => setShowCreateForm(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supplier Offers Management</h2>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Offer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOffers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOffers.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOffers.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Offers</p>
                    <p className="text-2xl font-bold">{activeOffers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">{pendingOffers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">{completedOffers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expired</p>
                    <p className="text-2xl font-bold">{expiredOffers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <SupplierMyOffers />
        </TabsContent>

        <TabsContent value="active">
          <SupplierMyOffers filter="active" />
        </TabsContent>

        <TabsContent value="pending">
          <SupplierMyOffers filter="pending" />
        </TabsContent>

        <TabsContent value="completed">
          <SupplierMyOffers filter="completed" />
        </TabsContent>

        <TabsContent value="expired">
          <SupplierMyOffers filter="expired" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierOffersWorkflow;
