import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { useWallet } from '@/hooks/useWallet';
import { CreateOfferForm } from './CreateOfferForm';
import { EnhancedPaymentSettingsForm } from './EnhancedPaymentSettingsForm';
import { ComplaintsList } from './ComplaintsList';
import { SupplierWalletPanel } from './SupplierWalletPanel';
import PayPalRechargeButton from '@/components/wallet/PayPalRechargeButton';
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
  Star,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

  // Points pricing configuration
  const POINTS_PER_OFFER = 100; // Points required to create an offer
  const pointsBalance = Math.floor(balance * 10); // Convert balance to points (1 USD = 10 points)

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

  const handleCreateOffer = () => {
    if (pointsBalance < POINTS_PER_OFFER) {
      // Show insufficient points alert
      return;
    }
    setShowCreateOffer(true);
  };

  const canCreateOffer = pointsBalance >= POINTS_PER_OFFER;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Manage your offers, wallet, and customer relationships</p>
        </div>
        <div className="flex gap-2">
          <PayPalRechargeButton onSuccess={() => window.location.reload()} />
          <Button 
            onClick={handleCreateOffer}
            disabled={!canCreateOffer}
            className={!canCreateOffer ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer ({POINTS_PER_OFFER} pts)
          </Button>
        </div>
      </div>

      {/* Points Requirement Alert */}
      {!canCreateOffer && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You need at least {POINTS_PER_OFFER} points to create an offer. 
            Current balance: {pointsBalance} points. Please recharge your wallet to continue.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {pointsBalance} points available
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
            <CardTitle className="text-sm font-medium">PayPal Ready</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentSettings?.paypal_email ? 'Yes' : 'No'}
            </div>
            <p className="text-xs text-muted-foreground">
              PayPal integration
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="offers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="offers" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            My Offers
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet & Points
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Payment Settings
          </TabsTrigger>
          <TabsTrigger value="complaints" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Complaints ({complaints?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-6">
          {offers && offers.length > 0 ? (
            <div className="grid gap-6">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{offer.description}</p>
                      </div>
                      <Badge variant={
                        offer.status === 'active' ? 'default' :
                        offer.status === 'completed' ? 'secondary' :
                        offer.status === 'expired' ? 'destructive' : 'outline'
                      }>
                        {offer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Base Price</p>
                        <p className="font-semibold">${offer.base_price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold">{offer.current_participants}/{offer.minimum_joiners}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-semibold">
                          {formatDistanceToNow(new Date(offer.deadline), { addSuffix: true })}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-semibold">{offer.category || 'General'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first group discount offer to start attracting buyers
                </p>
                <Button 
                  onClick={handleCreateOffer}
                  disabled={!canCreateOffer}
                  className={!canCreateOffer ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Offer ({POINTS_PER_OFFER} pts)
                </Button>
                {!canCreateOffer && (
                  <p className="text-sm text-orange-600 mt-2">
                    Recharge your wallet to get started
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="wallet">
          <SupplierWalletPanel />
        </TabsContent>

        <TabsContent value="settings">
          <EnhancedPaymentSettingsForm paymentSettings={paymentSettings} />
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintsList complaints={complaints || []} />
        </TabsContent>
      </Tabs>

      {/* Create Offer Modal */}
      <CreateOfferForm 
        isOpen={showCreateOffer}
        onClose={() => setShowCreateOffer(false)}
      />
    </div>
  );
};
