
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { useWallet } from '@/hooks/useWallet';
import { CreateOfferForm } from './CreateOfferForm';
import { PaymentSettingsForm } from './PaymentSettingsForm';
import { InvoiceForm } from './InvoiceForm';
import { ComplaintsList } from './ComplaintsList';
import { WalletBalance } from '@/components/dashboard/WalletBalance';

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  const { 
    offers, 
    paymentSettings, 
    invoices, 
    complaints,
    isLoading,
    updateOffer
  } = useSupplierPanel();
  
  const { balance, wallet } = useWallet();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalOffers: offers.length,
    activeOffers: offers.filter(o => o.status === 'active').length,
    totalParticipants: offers.reduce((sum, o) => sum + o.current_participants, 0),
    pendingInvoices: invoices.filter(i => i.status === 'pending').length,
    openComplaints: complaints.filter(c => c.status === 'open').length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Manage your offers, invoices, and payments</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateOffer(true)} className="bg-productivity-blue hover:bg-productivity-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </Button>
          <Button onClick={() => setShowInvoiceForm(true)} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                <p className="text-2xl font-bold text-productivity-blue">${balance.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-productivity-blue" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold">{stats.totalOffers}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
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
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants</p>
                <p className="text-2xl font-bold">{stats.totalParticipants}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-orange-600">{stats.openComplaints}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Offers */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offers.slice(0, 5).map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        <p className="text-sm text-gray-600">${offer.base_price} • {offer.current_participants} participants</p>
                      </div>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Wallet Overview */}
            <WalletBalance />
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>My Offers</CardTitle>
                <Button onClick={() => setShowCreateOffer(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Offer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <p className="text-gray-600">{offer.description}</p>
                      </div>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Base Price</p>
                        <p className="font-medium">${offer.base_price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Participants</p>
                        <p className="font-medium">{offer.current_participants}/{offer.minimum_joiners}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deadline</p>
                        <p className="font-medium">{new Date(offer.deadline).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium">{offer.category || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {offer.status === 'draft' && (
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateOffer({ id: offer.id, status: 'active' })}
                        disabled={offer.status === 'active'}
                      >
                        Activate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoices</CardTitle>
                <Button onClick={() => setShowInvoiceForm(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{invoice.invoice_number}</h3>
                        <p className="text-gray-600">{invoice.description}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${invoice.amount}</p>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints">
          <ComplaintsList complaints={complaints} />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletBalance />
        </TabsContent>

        <TabsContent value="settings">
          <PaymentSettingsForm paymentSettings={paymentSettings} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCreateOffer && (
        <CreateOfferForm
          isOpen={showCreateOffer}
          onClose={() => setShowCreateOffer(false)}
        />
      )}

      {showInvoiceForm && (
        <InvoiceForm
          isOpen={showInvoiceForm}
          onClose={() => setShowInvoiceForm(false)}
        />
      )}
    </div>
  );
};

export default SupplierDashboard;
