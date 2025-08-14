
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Settings,
  FileText,
  MessageCircle,
  CreditCard,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import CreateOfferForm from './CreateOfferForm';
import PaymentSettingsForm from './PaymentSettingsForm';
import ComplaintsList from './ComplaintsList';

const SellerDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { 
    offers, 
    paymentSettings, 
    complaints, 
    isLoading, 
    updateOffer 
  } = useSupplierPanel();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalParticipants = offers.reduce((sum, offer) => sum + offer.current_participants, 0);
  const totalRevenue = offers.reduce((sum, offer) => {
    return sum + (offer.current_participants * offer.base_price);
  }, 0);
  const activeOffers = offers.filter(offer => offer.status === 'active').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your offers and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                <p className="text-sm text-gray-600">Total Offers</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{activeOffers}</p>
                <p className="text-sm text-gray-600">Active Offers</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="offers">My Offers</TabsTrigger>
            <TabsTrigger value="payments">Payment Settings</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="offers">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Offers</h2>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Offer
                </Button>
              </div>

              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
                    <p className="text-gray-600 mb-4">Create your first offer to start selling</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Offer
                    </Button>
                  </div>
                ) : (
                  offers.map((offer) => (
                    <Card key={offer.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{offer.title}</h3>
                            <Badge className={getStatusColor(offer.status)}>
                              {offer.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-600">Base Price</p>
                              <p className="font-semibold">${offer.base_price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Participants</p>
                              <p className="font-semibold">{offer.current_participants} / {offer.minimum_joiners}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Deadline</p>
                              <p className="font-semibold">{new Date(offer.deadline).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Revenue</p>
                              <p className="font-semibold">${(offer.current_participants * offer.base_price).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Settings</h2>
              <PaymentSettingsForm initialData={paymentSettings} />
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Customer Complaints</h2>
              <ComplaintsList complaints={complaints} />
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Performance Analytics</h2>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed performance metrics and insights will be available here</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Offer Modal */}
      <CreateOfferForm 
        isOpen={showCreateForm} 
        onClose={() => setShowCreateForm(false)} 
      />
    </div>
  );
};

export default SellerDashboard;
