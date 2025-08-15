
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Truck,
  Clock,
  DollarSign
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OfferOrganizer {
  id: string;
  user_id: string;
  offer_id: string;
  joined_at: string;
  amount_paid: number;
  payment_status: 'pending' | 'completed' | 'failed';
  shipping_info?: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone: string;
  };
  user_profile?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

interface OfferOrganizersPanelProps {
  offerId: string;
}

export const OfferOrganizersPanel = ({ offerId }: OfferOrganizersPanelProps) => {
  const [selectedOrganizer, setSelectedOrganizer] = useState<OfferOrganizer | null>(null);

  // Fetch offer organizers (buyers who joined the offer)
  const { data: organizers = [], isLoading } = useQuery({
    queryKey: ['offer-organizers', offerId],
    queryFn: async () => {
      // Mock data for development - replace with actual Supabase query
      const mockOrganizers: OfferOrganizer[] = [
        {
          id: '1',
          user_id: 'user-1',
          offer_id: offerId,
          joined_at: new Date().toISOString(),
          amount_paid: 99.99,
          payment_status: 'completed',
          shipping_info: {
            full_name: 'Ahmed Mohammed',
            address_line_1: '123 King Abdulaziz Road',
            city: 'Riyadh',
            state: 'Riyadh Province',
            zip_code: '12345',
            country: 'Saudi Arabia',
            phone: '+966501234567'
          },
          user_profile: {
            full_name: 'Ahmed Mohammed',
            email: 'ahmed@example.com',
            phone: '+966501234567'
          }
        },
        {
          id: '2',
          user_id: 'user-2',
          offer_id: offerId,
          joined_at: new Date().toISOString(),
          amount_paid: 89.99,
          payment_status: 'pending',
          user_profile: {
            full_name: 'Fatima Ali',
            email: 'fatima@example.com',
            phone: '+966509876543'
          }
        }
      ];
      
      return mockOrganizers;
    },
    enabled: !!offerId,
  });

  const completedPayments = organizers.filter(org => org.payment_status === 'completed');
  const pendingPayments = organizers.filter(org => org.payment_status === 'pending');
  const totalRevenue = completedPayments.reduce((sum, org) => sum + org.amount_paid, 0);

  if (isLoading) {
    return <div>Loading organizers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Buyers</p>
                <p className="text-2xl font-bold">{organizers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Payments</p>
                <p className="text-2xl font-bold">{completedPayments.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Buyers & Organizers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Buyers ({organizers.length})</TabsTrigger>
              <TabsTrigger value="completed">Paid ({completedPayments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {organizers.map((organizer) => (
                <OrganizerCard 
                  key={organizer.id} 
                  organizer={organizer}
                  onViewDetails={() => setSelectedOrganizer(organizer)}
                />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedPayments.map((organizer) => (
                <OrganizerCard 
                  key={organizer.id} 
                  organizer={organizer}
                  onViewDetails={() => setSelectedOrganizer(organizer)}
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {pendingPayments.map((organizer) => (
                <OrganizerCard 
                  key={organizer.id} 
                  organizer={organizer}
                  onViewDetails={() => setSelectedOrganizer(organizer)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Organizer Details Modal */}
      <Dialog open={!!selectedOrganizer} onOpenChange={() => setSelectedOrganizer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buyer Details</DialogTitle>
          </DialogHeader>
          {selectedOrganizer && (
            <OrganizerDetailsModal organizer={selectedOrganizer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const OrganizerCard = ({ 
  organizer, 
  onViewDetails 
}: { 
  organizer: OfferOrganizer;
  onViewDetails: () => void;
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {organizer.user_profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="font-semibold">{organizer.user_profile?.full_name || 'Unknown User'}</h4>
                <p className="text-sm text-muted-foreground">{organizer.user_profile?.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount Paid</p>
                <p className="font-semibold">${organizer.amount_paid?.toFixed(2) || '0.00'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <Badge variant={
                  organizer.payment_status === 'completed' ? 'default' :
                  organizer.payment_status === 'pending' ? 'secondary' : 'destructive'
                }>
                  {organizer.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Joined Date</p>
                <p className="font-semibold">
                  {new Date(organizer.joined_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Shipping Info</p>
                <p className="font-semibold">
                  {organizer.shipping_info ? 'Provided' : 'Missing'}
                </p>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrganizerDetailsModal = ({ organizer }: { organizer: OfferOrganizer }) => {
  return (
    <div className="space-y-6">
      {/* User Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{organizer.user_profile?.full_name || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{organizer.user_profile?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{organizer.user_profile?.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>${organizer.amount_paid?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <Badge variant={
              organizer.payment_status === 'completed' ? 'default' :
              organizer.payment_status === 'pending' ? 'secondary' : 'destructive'
            }>
              {organizer.payment_status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Joined Date</p>
            <p>{new Date(organizer.joined_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {organizer.shipping_info && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p>{organizer.shipping_info.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{organizer.shipping_info.address_line_1}</p>
              {organizer.shipping_info.address_line_2 && (
                <p>{organizer.shipping_info.address_line_2}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p>{organizer.shipping_info.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p>{organizer.shipping_info.state}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ZIP Code</p>
                <p>{organizer.shipping_info.zip_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p>{organizer.shipping_info.country}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{organizer.shipping_info.phone}</p>
            </div>
          </div>
        </div>
      )}

      {!organizer.shipping_info && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Shipping information not provided yet</p>
        </div>
      )}
    </div>
  );
};
