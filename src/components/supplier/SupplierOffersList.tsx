
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus } from 'lucide-react';
import { SupplierOffer } from '@/hooks/useSupplierPanel';

interface SupplierOffersListProps {
  offers: SupplierOffer[];
  onCreateOffer: () => void;
}

export const SupplierOffersList: React.FC<SupplierOffersListProps> = ({ offers, onCreateOffer }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Group Discount Offers</CardTitle>
      </CardHeader>
      <CardContent>
        {!offers || offers.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers yet</h3>
            <p className="text-gray-600 mb-4">Create your first group discount offer to get started</p>
            <Button onClick={onCreateOffer} className="bg-productivity-blue hover:bg-productivity-blue/90">
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
  );
};
