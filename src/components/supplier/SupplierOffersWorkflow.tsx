import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit, Trash2, Users, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { CreateOfferForm } from './CreateOfferForm';
import { OfferDetailsPage } from './OfferDetailsPage';
import { OfferOrganizersPanel } from './OfferOrganizersPanel';
import { SupplierOffer, DiscountTier } from '@/hooks/useSupplierPanel';

// Mock data for supplier offers - using the correct SupplierOffer type
const mockOffers: SupplierOffer[] = [
  {
    id: '1',
    supplier_id: 'supplier-1',
    title: 'Premium Office Chairs - Group Discount',
    description: 'High-quality ergonomic office chairs with bulk pricing',
    status: 'active',
    base_price: 250,
    minimum_joiners: 10,
    current_participants: 25,
    deadline: '2024-02-15T00:00:00Z',
    visibility: 'public',
    kyc_required: false,
    points_required: 0,
    target_region: 'Global',
    category: 'Office Furniture',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    group_discount_tiers: [
      { 
        id: 'tier-1-1',
        offer_id: '1',
        min_members: 10, 
        discount_percent: 10, 
        tier_order: 1,
        created_at: '2024-01-01T00:00:00Z'
      },
      { 
        id: 'tier-1-2',
        offer_id: '1',
        min_members: 20, 
        discount_percent: 15, 
        tier_order: 2,
        created_at: '2024-01-01T00:00:00Z'
      }
    ]
  },
  {
    id: '2',
    supplier_id: 'supplier-1',
    title: 'Industrial Laptops Bulk Sale',
    description: 'Rugged laptops perfect for industrial environments',
    status: 'pending',
    base_price: 1200,
    minimum_joiners: 5,
    current_participants: 3,
    deadline: '2024-02-20T00:00:00Z',
    visibility: 'public',
    kyc_required: false,
    points_required: 0,
    target_region: 'Global',
    category: 'Electronics',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    group_discount_tiers: [
      { 
        id: 'tier-2-1',
        offer_id: '2',
        min_members: 5, 
        discount_percent: 8, 
        tier_order: 1,
        created_at: '2024-01-05T00:00:00Z'
      },
      { 
        id: 'tier-2-2',
        offer_id: '2',
        min_members: 10, 
        discount_percent: 12, 
        tier_order: 2,
        created_at: '2024-01-05T00:00:00Z'
      }
    ]
  },
  {
    id: '3',
    supplier_id: 'supplier-1',
    title: 'Medical Supplies Package',
    description: 'Essential medical supplies for clinics and hospitals',
    status: 'completed',
    base_price: 500,
    minimum_joiners: 20,
    current_participants: 45,
    deadline: '2023-12-31T00:00:00Z',
    visibility: 'public',
    kyc_required: true,
    points_required: 5,
    target_region: 'North America',
    category: 'Medical',
    created_at: '2023-11-15T00:00:00Z',
    updated_at: '2023-11-15T00:00:00Z',
    group_discount_tiers: [
      { 
        id: 'tier-3-1',
        offer_id: '3',
        min_members: 20, 
        discount_percent: 12, 
        tier_order: 1,
        created_at: '2023-11-15T00:00:00Z'
      },
      { 
        id: 'tier-3-2',
        offer_id: '3',
        min_members: 50, 
        discount_percent: 18, 
        tier_order: 2,
        created_at: '2023-11-15T00:00:00Z'
      }
    ]
  },
  {
    id: '4',
    supplier_id: 'supplier-1',
    title: 'Construction Tools Set',
    description: 'Professional grade construction tools for contractors',
    status: 'expired',
    base_price: 800,
    minimum_joiners: 8,
    current_participants: 2,
    deadline: '2023-12-25T00:00:00Z',
    visibility: 'public',
    kyc_required: false,
    points_required: 0,
    target_region: 'Europe',
    category: 'Tools',
    created_at: '2023-11-01T00:00:00Z',
    updated_at: '2023-11-01T00:00:00Z',
    group_discount_tiers: [
      { 
        id: 'tier-4-1',
        offer_id: '4',
        min_members: 8, 
        discount_percent: 10, 
        tier_order: 1,
        created_at: '2023-11-01T00:00:00Z'
      },
      { 
        id: 'tier-4-2',
        offer_id: '4',
        min_members: 15, 
        discount_percent: 15, 
        tier_order: 2,
        created_at: '2023-11-01T00:00:00Z'
      }
    ]
  }
];

export const SupplierOffersWorkflow = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [showOrganizers, setShowOrganizers] = useState<string | null>(null);

  // Filter offers based on status
  const allOffers = mockOffers;
  const activeOffers = allOffers.filter(offer => offer.status === 'active');
  const pendingOffers = allOffers.filter(offer => offer.status === 'pending');
  const completedOffers = allOffers.filter(offer => offer.status === 'completed');
  const expiredOffers = allOffers.filter(offer => offer.status === 'expired');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      expired: { color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderOfferCard = (offer: SupplierOffer) => (
    <Card key={offer.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {offer.title}
            </CardTitle>
            <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
            <div className="flex items-center gap-2">
              {getStatusBadge(offer.status)}
              <Badge variant="outline" className="text-xs">
                {offer.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Base Price</p>
            <p className="font-semibold text-lg text-green-600">
              ${offer.base_price}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Participants</p>
            <p className="font-semibold text-lg">
              {offer.current_participants}/{offer.minimum_joiners}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Min Joiners</p>
            <p className="font-semibold">{offer.minimum_joiners} users</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-semibold">{new Date(offer.deadline).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedOffer(offer.id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowOrganizers(offer.id)}
            className="flex items-center gap-1"
          >
            <Users className="w-4 h-4" />
            Buyers ({offer.current_participants})
          </Button>

          {offer.status === 'active' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Offer</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateForm(false)}
          >
            Back to Offers
          </Button>
        </div>
        <CreateOfferForm 
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)} 
        />
      </div>
    );
  }

  if (selectedOffer) {
    const offer = allOffers.find(o => o.id === selectedOffer);
    if (!offer) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Offer Details</h2>
          <Button 
            variant="outline" 
            onClick={() => setSelectedOffer(null)}
          >
            Back to Offers
          </Button>
        </div>
        <OfferDetailsPage 
          offer={offer}
          onBack={() => setSelectedOffer(null)}
        />
      </div>
    );
  }

  if (showOrganizers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Offer Buyers</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowOrganizers(null)}
          >
            Back to Offers
          </Button>
        </div>
        <OfferOrganizersPanel 
          offerId={showOrganizers}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Offers</h2>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          Create New Offer
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({allOffers.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOffers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOffers.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOffers.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredOffers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allOffers.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers yet</h3>
              <p className="text-gray-600 mb-4">Create your first offer to start selling to groups.</p>
              <Button onClick={() => setShowCreateForm(true)}>Create First Offer</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allOffers.map(renderOfferCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeOffers.map(renderOfferCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingOffers.map(renderOfferCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedOffers.map(renderOfferCard)}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expiredOffers.map(renderOfferCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
