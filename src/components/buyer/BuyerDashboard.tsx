
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  MapPin, 
  Clock, 
  CreditCard, 
  MessageCircle,
  Heart,
  Settings,
  History,
  User
} from 'lucide-react';

const BuyerDashboard = () => {
  const [subscribedOffers] = useState([
    {
      id: '1',
      title: 'Premium Office Furniture Bundle',
      supplier: 'Workspace Solutions Inc.',
      status: 'active',
      joined_date: '2024-01-15',
      base_price: 899,
      current_discount: 15,
      participants: 12,
      min_participants: 5,
      deadline: '2024-03-15',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      title: 'Industrial Grade Steel Components',
      supplier: 'MetalWorks International',
      status: 'completed',
      joined_date: '2024-01-10',
      base_price: 2500,
      current_discount: 22,
      participants: 25,
      min_participants: 20,
      deadline: '2024-02-28',
      image: '/placeholder.svg'
    }
  ]);

  const [orderHistory] = useState([
    {
      id: 'ORD-2024-001',
      offer_title: 'Industrial Grade Steel Components',
      supplier: 'MetalWorks International',
      order_date: '2024-02-28',
      amount: 1950,
      status: 'delivered',
      tracking_number: 'TRK123456789'
    },
    {
      id: 'ORD-2024-002',
      offer_title: 'Premium Tea Export Bulk',
      supplier: 'Ceylon Tea Exports Ltd.',
      order_date: '2024-01-20',
      amount: 450,
      status: 'processing',
      tracking_number: 'TRK987654321'
    }
  ]);

  const [savedAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'Home Address',
      address: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      is_default: true
    },
    {
      id: '2',
      type: 'office',
      name: 'Office Address',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'USA',
      is_default: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSavings = subscribedOffers.reduce((sum, offer) => {
    return sum + (offer.base_price * offer.current_discount / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your subscriptions and manage orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{subscribedOffers.length}</p>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{orderHistory.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${totalSavings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Savings</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Wishlist Items</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="account">Account Info</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">My Subscribed Offers</h2>
              
              <div className="space-y-4">
                {subscribedOffers.map((offer) => (
                  <Card key={offer.id} className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{offer.title}</h3>
                            <p className="text-gray-600">{offer.supplier}</p>
                          </div>
                          <Badge className={getStatusColor(offer.status)}>
                            {offer.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Current Price</p>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                ${(offer.base_price * (1 - offer.current_discount / 100)).toFixed(0)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ${offer.base_price}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Your Savings</p>
                            <p className="text-lg font-bold text-green-600">
                              ${(offer.base_price * offer.current_discount / 100).toFixed(0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Participants</p>
                            <p className="font-semibold">{offer.participants} / {offer.min_participants}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Deadline</p>
                            <p className="font-semibold">{new Date(offer.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Track Status
                          </Button>
                          {offer.status === 'active' && (
                            <Button variant="outline" size="sm" className="text-red-600">
                              Leave Offer
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order History</h2>
              
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">#{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-900 font-medium">{order.offer_title}</p>
                        <p className="text-gray-600">{order.supplier}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-semibold">{new Date(order.order_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="font-semibold">${order.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tracking</p>
                            <p className="font-semibold">{order.tracking_number}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {savedAddresses.map((address) => (
                  <Card key={address.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold capitalize">{address.name}</h3>
                      {address.is_default && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{address.address}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600">Delete</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">My Complaints</h2>
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
                <p className="text-gray-600">You haven't filed any complaints</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Account Information</h2>
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-600 mb-4">Manage your profile and preferences</p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
