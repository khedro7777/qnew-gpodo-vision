
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { useWallet } from '@/hooks/useWallet';
import { CreateOfferForm } from './CreateOfferForm';
import { ComplaintsList } from './ComplaintsList';
import { SupplierOffersWorkflow } from './SupplierOffersWorkflow';
import { OfferOrganizersPanel } from './OfferOrganizersPanel';
import { SupplierWalletDashboard } from './SupplierWalletDashboard';
import { EnhancedPayPalSettings } from './EnhancedPayPalSettings';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Package, 
  Settings, 
  MessageSquare, 
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Loader2,
  Wallet,
  CreditCard,
  UserCheck,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

export const EnhancedSupplierDashboard = () => {
  const { 
    offers, 
    paymentSettings, 
    complaints,
    isLoading, 
    hasError 
  } = useSupplierPanel();
  
  const { balance, transactions, isLoading: walletLoading } = useWallet();
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Loading state
  if (isLoading || walletLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading supplier dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">Failed to load supplier dashboard</p>
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
  const totalRevenue = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* PWA Install Button */}
      <PWAInstallButton />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supplier Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your offers, buyers, and earnings</p>
          </div>
          <Button 
            onClick={() => setShowCreateOffer(true)}
            disabled={balance < 10}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer {balance < 10 && '(Need Points)'}
          </Button>
        </div>

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance} Points</div>
              <p className="text-xs opacity-80">
                Available for creating offers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Package className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers?.length || 0}</div>
              <p className="text-xs opacity-80">
                {activeOffers.length} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
              <UserCheck className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParticipants}</div>
              <p className="text-xs opacity-80">
                Across all offers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue}</div>
              <p className="text-xs opacity-80">
                Total earnings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PayPal Ready</CardTitle>
              <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentSettings?.paypal_email ? 'Yes' : 'No'}
              </div>
              <p className="text-xs opacity-80">
                Payment integration
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <MessageSquare className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openComplaints.length}</div>
              <p className="text-xs opacity-80">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Points Warning */}
        {balance < 10 && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-800 mb-1">
                    Insufficient Points to Create Offers
                  </h4>
                  <p className="text-sm text-orange-700">
                    You need at least 10 points to create a new offer. Recharge your wallet to continue selling.
                  </p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Recharge Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              My Offers
            </TabsTrigger>
            <TabsTrigger value="organizers" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Buyers Data
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Support ({complaints?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers">
            <SupplierOffersWorkflow />
          </TabsContent>

          <TabsContent value="organizers">
            {selectedOfferId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Buyers for Offer</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedOfferId(null)}
                  >
                    Back to Offer Selection
                  </Button>
                </div>
                <OfferOrganizersPanel offerId={selectedOfferId} />
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Select an Offer to View Buyers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {offers && offers.length > 0 ? (
                      offers.map((offer) => (
                        <Card key={offer.id} className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{offer.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {offer.current_participants} buyers joined
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedOfferId(offer.id)}
                                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                              >
                                View Buyers
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No offers created yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first offer to start managing buyers</p>
                        <Button onClick={() => setShowCreateOffer(true)}>
                          Create First Offer
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet">
            <SupplierWalletDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <EnhancedPayPalSettings paymentSettings={paymentSettings} />
          </TabsContent>

          <TabsContent value="complaints">
            <ComplaintsList complaints={complaints || []} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{activeOffers.length}</div>
                    <div className="text-sm text-blue-800">Active Offers</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">{totalParticipants}</div>
                    <div className="text-sm text-green-800">Total Buyers</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">${totalRevenue}</div>
                    <div className="text-sm text-purple-800">Revenue Generated</div>
                  </div>
                </div>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Detailed Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">Advanced reporting and insights will be available in the next update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">Order Management System</h3>
                  <p className="text-muted-foreground">Track and manage all your orders in one place - coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Offer Modal */}
        <CreateOfferForm 
          isOpen={showCreateOffer}
          onClose={() => setShowCreateOffer(false)}
        />
      </main>

      <Footer />
    </div>
  );
};
