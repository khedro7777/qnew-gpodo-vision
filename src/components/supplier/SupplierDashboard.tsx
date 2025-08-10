
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, FileText, DollarSign, AlertCircle, Settings, Wallet } from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferForm } from './CreateOfferForm';
import { InvoiceForm } from './InvoiceForm';
import { PaymentSettingsForm } from './PaymentSettingsForm';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supplier Dashboard</h1>
            <p className="text-muted-foreground">Manage your offers and business operations</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowCreateInvoice(true)} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
            <Button onClick={() => setShowCreateOffer(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {offers?.filter(o => o.status === 'active').length || 0} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {invoices?.filter(i => i.status === 'pending').length || 0} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0).toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Total earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complaints</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complaints?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {complaints?.filter(c => c.status === 'open').length || 0} open
              </p>
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
                      <Button onClick={() => setShowCreateOffer(true)} className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Offer
                      </Button>
                      <Button onClick={() => setShowCreateInvoice(true)} variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Create Invoice
                      </Button>
                      <Button onClick={() => setActiveTab('settings')} variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Payment Settings
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Dashboard loaded successfully</p>
                      <p>• {offers?.length || 0} offers currently managed</p>
                      <p>• {invoices?.length || 0} invoices in system</p>
                      <p>• {complaints?.length || 0} complaints to review</p>
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
                {!offers || offers.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No offers yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first group discount offer to get started</p>
                    <Button onClick={() => setShowCreateOffer(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Offer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div key={offer.id} className="border rounded-lg p-4 hover:bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{offer.title}</h3>
                          <Badge variant={offer.status === 'active' ? 'default' : 'secondary'}>
                            {offer.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{offer.description}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
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
                {!invoices || invoices.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No invoices yet</h3>
                    <p className="text-muted-foreground mb-4">Create invoices for your customers</p>
                    <Button onClick={() => setShowCreateInvoice(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Invoice
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="border rounded-lg p-4 hover:bg-muted/50">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{invoice.invoice_number}</h3>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{invoice.description}</p>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
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
            <ComplaintsList complaints={complaints || []} />
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
    </div>
  );
};

export default SupplierDashboard;
