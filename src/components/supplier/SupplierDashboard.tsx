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

const SupplierDashboard: React.FC = () => {
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

  const stats = {
    totalOffers: offers.length,
    activeOffers: offers.filter(offer => offer.status === 'active').length,
    totalParticipants: offers.reduce((sum, offer) => sum + offer.current_participants, 0),
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
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add overview content here */}
              <p>This is the overview tab content.</p>
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
      {showCreateOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Offer</h2>
            </div>
            <div className="p-6">
              <CreateOfferForm onClose={() => setShowCreateOffer(false)} />
            </div>
          </div>
        </div>
      )}

      {showCreateInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Invoice</h2>
            </div>
            <div className="p-6">
              <InvoiceForm onClose={() => setShowCreateInvoice(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;
