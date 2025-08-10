import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Plus,
  FileText,
  MessageSquare,
  Settings,
  Wallet
} from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferForm } from './CreateOfferForm';
import { PaymentSettingsForm } from './PaymentSettingsForm';
import { InvoiceForm } from './InvoiceForm';
import { ComplaintsList } from './ComplaintsList';
import WalletBalance from '@/components/dashboard/WalletBalance';
import { useAuth } from '@/hooks/useAuth';

const SupplierDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    offers, 
    paymentSettings, 
    invoices, 
    complaints,
    isLoading 
  } = useSupplierPanel();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-productivity-blue"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access the Supplier Dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalOffers: offers.length,
    activeOffers: offers.filter(offer => offer.status === 'active').length,
    totalParticipants: offers.reduce((sum, offer) => sum + (offer.current_participants || 0), 0),
    pendingInvoices: invoices.filter(invoice => invoice.status === 'pending').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-productivity-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your group discount offers and business operations</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateInvoice(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
          <Button onClick={() => setShowCreateOffer(true)} className="bg-productivity-blue hover:bg-productivity-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOffers}</p>
              </div>
              <Package className="w-8 h-8 text-productivity-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeOffers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingInvoices}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Supplier Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setShowCreateOffer(true)} 
                      className="w-full justify-start bg-productivity-blue hover:bg-productivity-blue/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Offer
                    </Button>
                    <Button 
                      onClick={() => setShowCreateInvoice(true)} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('settings')} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Payment Settings
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Dashboard loaded successfully</p>
                    <p>• {offers.length} offers currently managed</p>
                    <p>• {invoices.length} invoices in system</p>
                    <p>• {complaints.length} complaints to review</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Group Discount Offers</CardTitle>
            </CardHeader>
            <CardContent>
              {offers.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
                  <p className="text-gray-600 mb-4">Create your first group discount offer to get started</p>
                  <Button onClick={() => setShowCreateOffer(true)} className="bg-productivity-blue hover:bg-productivity-blue/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Offer
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                          {offer.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{offer.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Participants: {offer.current_participants}</span>
                        <span>Deadline: {new Date(offer.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
                  <p className="text-gray-600 mb-4">Create invoices for your customers</p>
                  <Button onClick={() => setShowCreateInvoice(true)} className="bg-productivity-blue hover:bg-productivity-blue/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{invoice.invoice_number}</h3>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{invoice.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Amount: ${invoice.amount}</span>
                        <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <ComplaintsList complaints={complaints} />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-6">
          <WalletBalance />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <PaymentSettingsForm paymentSettings={paymentSettings} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateOfferForm 
        isOpen={showCreateOffer}
        onClose={() => setShowCreateOffer(false)} 
      />

      <InvoiceForm 
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)} 
      />
    </div>
  );
};

export default SupplierDashboard;
