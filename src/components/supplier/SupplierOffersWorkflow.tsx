
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { CreateOfferForm } from './CreateOfferForm';
import { 
  Package, 
  Plus,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SupplierOffersWorkflow = () => {
  const { offers, isLoading } = useSupplierPanel();
  const [showCreateOffer, setShowCreateOffer] = useState(false);

  if (isLoading) {
    return <div>Loading offers...</div>;
  }

  // Fix the filtering logic by using proper status comparisons
  const allOffers = offers || [];
  const activeOffers = allOffers.filter(offer => offer.status === 'active');
  const pendingOffers = allOffers.filter(offer => offer.status === 'pending' || offer.status === 'draft');
  const completedOffers = allOffers.filter(offer => offer.status === 'completed');
  const expiredOffers = allOffers.filter(offer => offer.status === 'expired' || offer.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Offers</h2>
          <p className="text-muted-foreground">Manage your group discount offers</p>
        </div>
        <Button onClick={() => setShowCreateOffer(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Offer
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Active ({activeOffers.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingOffers.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOffers.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredOffers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeOffers.length > 0 ? (
            activeOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active offers</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingOffers.length > 0 ? (
            pendingOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pending offers</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOffers.length > 0 ? (
            completedOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No completed offers</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredOffers.length > 0 ? (
            expiredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No expired offers</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateOfferForm 
        isOpen={showCreateOffer}
        onClose={() => setShowCreateOffer(false)}
      />
    </div>
  );
};

const OfferCard = ({ offer }: { offer: any }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{offer.title}</CardTitle>
            <p className="text-muted-foreground mt-1">{offer.description}</p>
          </div>
          <Badge variant={
            offer.status === 'active' ? 'default' :
            offer.status === 'completed' ? 'secondary' :
            offer.status === 'expired' || offer.status === 'cancelled' ? 'destructive' : 
            'outline'
          }>
            {offer.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
