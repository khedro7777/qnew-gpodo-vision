
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferForm } from './CreateOfferForm';
import { PaymentSettingsForm } from './PaymentSettingsForm';
import { InvoiceForm } from './InvoiceForm';
import { ComplaintsList } from './ComplaintsList';
import { SupplierDashboardHeader } from './SupplierDashboardHeader';
import { SupplierStats } from './SupplierStats';
import { SupplierOverview } from './SupplierOverview';
import { SupplierOffersList } from './SupplierOffersList';
import { SupplierInvoicesList } from './SupplierInvoicesList';
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

  console.log('SupplierDashboard rendering:', { 
    offers: offers?.length || 0, 
    invoices: invoices?.length || 0, 
    isLoading 
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        <SupplierDashboardHeader 
          onCreateOffer={() => setShowCreateOffer(true)}
          onCreateInvoice={() => setShowCreateInvoice(true)}
        />

        <SupplierStats offers={offers || []} invoices={invoices || []} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="offers">My Offers</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SupplierOverview 
              offers={offers || []}
              invoices={invoices || []}
              complaints={complaints || []}
              onCreateOffer={() => setShowCreateOffer(true)}
              onCreateInvoice={() => setShowCreateInvoice(true)}
              onGoToSettings={() => setActiveTab('settings')}
            />
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <SupplierOffersList 
              offers={offers || []}
              onCreateOffer={() => setShowCreateOffer(true)}
            />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <SupplierInvoicesList 
              invoices={invoices || []}
              onCreateInvoice={() => setShowCreateInvoice(true)}
            />
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
