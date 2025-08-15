import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { useWallet } from '@/hooks/useWallet';
import { CreateOfferForm } from './CreateOfferForm';
import { EnhancedPaymentSettingsForm } from './EnhancedPaymentSettingsForm';
import { ComplaintsList } from './ComplaintsList';
import { SupplierOffersWorkflow } from './SupplierOffersWorkflow';
import { OfferOrganizersPanel } from './OfferOrganizersPanel';
import { PayPalRechargeButton } from '@/components/wallet/PayPalRechargeButton';
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
  UserCheck
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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
            <p className="text-muted-foreground">Manage your offers, buyers, and earnings</p>
          </div>
          <Button 
            onClick={() => setShowCreateOffer(true)}
            disabled={balance < 10} // Require minimum 10 points
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer {balance < 10 && '(Need Points)'}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{balance} Points</div>
              <p className="text-xs text-muted-foreground">
                Available for creating offers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {activeOffers.length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">PayPal Ready</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentSettings?.paypal_email ? 'Yes' : 'No'}
              </div>
              <p className="text-xs text-muted-foreground">
                Payment integration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openComplaints.length}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Points Warning */}
        {balance < 10 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">
                    Insufficient Points to Create Offers
                  </p>
                  <p className="text-sm text-orange-700">
                    You need at least 10 points to create a new offer. Recharge your wallet to continue.
                  </p>
                </div>
                <PayPalRechargeButton />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
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
              Payment Settings
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Complaints ({complaints?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
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
                        <Card key={offer.id} className="cursor-pointer hover:shadow-md transition-shadow">
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
                              >
                                View Buyers
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No offers created yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wallet">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Wallet Balance</CardTitle>
                    <PayPalRechargeButton />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">{balance} Points</div>
                  <p className="text-muted-foreground">
                    Use points to create new offers. Each offer requires 10 points minimum.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions && transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No transactions yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <EnhancedPaymentSettingsForm paymentSettings={paymentSettings} />
          </TabsContent>

          <TabsContent value="complaints">
            <ComplaintsList complaints={complaints || []} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Analytics coming soon</p>
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
