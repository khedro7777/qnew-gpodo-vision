
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferWorkflow } from './CreateOfferWorkflow';
import { OfferDetailsPage } from './OfferDetailsPage';
import { SupplierMyOffers } from './SupplierMyOffers';
import { SupplierWalletPanel } from './SupplierWalletPanel';
import { SupplierComplaintsPanel } from './SupplierComplaintsPanel';
import { PaymentSettingsForm } from './PaymentSettingsForm';
import { 
  Package, 
  Plus,
  Wallet,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const SupplierOffersWorkflow = () => {
  const { 
    offers, 
    paymentSettings, 
    complaints,
    isLoading, 
    hasError 
  } = useSupplierPanel();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading supplier workflow...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">Failed to load supplier workflow</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const activeOffers = offers?.filter(offer => offer.status === 'active') || [];
  const totalParticipants = offers?.reduce((sum, offer) => sum + (offer.current_participants || 0), 0) || 0;
  const openComplaints = complaints?.filter(complaint => complaint.status === 'open') || [];
  const pendingOffers = offers?.filter(offer => offer.status === 'pending') || [];

  if (selectedOfferId) {
    const selectedOffer = offers?.find(offer => offer.id === selectedOfferId);
    if (selectedOffer) {
      return (
        <OfferDetailsPage 
          offer={selectedOffer} 
          onBack={() => setSelectedOfferId(null)} 
        />
      );
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplier Offers Workflow</h1>
          <p className="text-muted-foreground">Manage your offers, payments, and customer relationships</p>
        </div>
        <Button onClick={() => setShowCreateOffer(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create New Offer
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {activeOffers.length} active, {pendingOffers.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              Across all offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Setup</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentSettings?.paypal_email ? 'Ready' : 'Pending'}
            </div>
            <p className="text-xs text-muted-foreground">
              Payment integration status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openComplaints.length}</div>
            <p className="text-xs text-muted-foreground">
              Complaints requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workflow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            My Offers
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet & Points
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Complaints ({complaints?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offers?.slice(0, 3).map((offer) => (
                    <div key={offer.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {offer.current_participants} participants
                        </p>
                      </div>
                      <Badge variant={
                        offer.status === 'active' ? 'default' :
                        offer.status === 'completed' ? 'secondary' : 'outline'
                      }>
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                  {(!offers || offers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No offers created yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setShowCreateOffer(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Offer
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Setup Payment Methods
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setActiveTab('wallet')}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Manage Wallet & Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers">
          <SupplierMyOffers 
            offers={offers || []} 
            onViewOffer={setSelectedOfferId}
          />
        </TabsContent>

        <TabsContent value="wallet">
          <SupplierWalletPanel />
        </TabsContent>

        <TabsContent value="complaints">
          <SupplierComplaintsPanel complaints={complaints || []} />
        </TabsContent>

        <TabsContent value="settings">
          <PaymentSettingsForm paymentSettings={paymentSettings} />
        </TabsContent>
      </Tabs>

      {/* Create Offer Workflow Modal */}
      {showCreateOffer && (
        <CreateOfferWorkflow 
          isOpen={showCreateOffer}
          onClose={() => setShowCreateOffer(false)}
        />
      )}
    </div>
  );
};
