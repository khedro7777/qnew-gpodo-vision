
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Settings
} from 'lucide-react';
import { useAdminStats, useAdminUsers } from '@/hooks/useAdmin';

const SellerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { data: stats } = useAdminStats();
  const { data: users } = useAdminUsers();

  // Mock data for offers and points settings
  const [offers] = useState([
    {
      id: '1',
      title: 'Premium Office Furniture Bundle',
      supplier: 'Workspace Solutions Inc.',
      status: 'pending_approval',
      participants: 12,
      revenue: 10800,
      created_date: '2024-01-15',
      deadline: '2024-03-15'
    },
    {
      id: '2',
      title: 'Industrial Grade Steel Components',
      supplier: 'MetalWorks International',
      status: 'approved',
      participants: 25,
      revenue: 62500,
      created_date: '2024-01-10',
      deadline: '2024-02-28'
    }
  ]);

  const [pointsSettings, setPointsSettings] = useState({
    publish_cost: 100,
    homepage_listing_cost: 250,
    featured_listing_cost: 500
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveOffer = (offerId: string) => {
    console.log('Approving offer:', offerId);
    // Implementation would update offer status
  };

  const handleRejectOffer = (offerId: string) => {
    console.log('Rejecting offer:', offerId);
    // Implementation would update offer status
  };

  const handleUpdatePointsSettings = () => {
    console.log('Updating points settings:', pointsSettings);
    // Implementation would save points settings
  };

  const handleSendInvitation = (email: string) => {
    console.log('Sending supplier invitation to:', email);
    // Implementation would send email invitation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seller Management</h1>
        <p className="text-gray-600 mt-2">Manage sellers, offers, and platform settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-gray-600">Total Sellers</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
              <p className="text-sm text-gray-600">Active Offers</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{offers.filter(o => o.status === 'pending_approval').length}</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">${offers.reduce((sum, o) => sum + o.revenue, 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="offers">Approve Offers</TabsTrigger>
          <TabsTrigger value="points">Points Pricing</TabsTrigger>
          <TabsTrigger value="invitations">Send Invitations</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {users?.map((user: any) => (
                <Card key={user.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.full_name || user.email}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(user.is_active ? 'active' : 'inactive')}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Offer Approval</h2>
            
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{offer.title}</h3>
                        <Badge className={getStatusColor(offer.status)}>
                          {offer.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{offer.supplier}</p>
                      
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Participants</p>
                          <p className="font-semibold">{offer.participants}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-semibold">${offer.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-semibold">{new Date(offer.created_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Deadline</p>
                          <p className="font-semibold">{new Date(offer.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    {offer.status === 'pending_approval' && (
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApproveOffer(offer.id)}
                          className="text-green-600 border-green-300"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectOffer(offer.id)}
                          className="text-red-600 border-red-300"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="points">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Points Pricing Management</h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Offer Cost (Points)
                </label>
                <Input
                  type="number"
                  value={pointsSettings.publish_cost}
                  onChange={(e) => setPointsSettings({
                    ...pointsSettings,
                    publish_cost: parseInt(e.target.value)
                  })}
                />
                <p className="text-sm text-gray-500 mt-1">Points required to publish a new offer</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Homepage Listing Cost (Points)
                </label>
                <Input
                  type="number"
                  value={pointsSettings.homepage_listing_cost}
                  onChange={(e) => setPointsSettings({
                    ...pointsSettings,
                    homepage_listing_cost: parseInt(e.target.value)
                  })}
                />
                <p className="text-sm text-gray-500 mt-1">Points required for homepage visibility</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Listing Cost (Points)
                </label>
                <Input
                  type="number"
                  value={pointsSettings.featured_listing_cost}
                  onChange={(e) => setPointsSettings({
                    ...pointsSettings,
                    featured_listing_cost: parseInt(e.target.value)
                  })}
                />
                <p className="text-sm text-gray-500 mt-1">Points required for featured placement</p>
              </div>
              
              <Button onClick={handleUpdatePointsSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Update Points Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invitations">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Send Supplier Invitations</h2>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="supplier@example.com"
                />
              </div>
              
              <Button onClick={() => handleSendInvitation('supplier@example.com')}>
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Recent Invitations</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm">supplier1@example.com</span>
                  <Badge variant="outline">Sent 2 days ago</Badge>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm">supplier2@example.com</span>
                  <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Global Settings</h2>
            
            <div className="space-y-6 max-w-md">
              <div>
                <h3 className="text-lg font-medium mb-4">Languages</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span>English</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span>Arabic</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Spanish</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Currencies</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span>USD</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span>EUR</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>GBP</span>
                  </label>
                </div>
              </div>
              
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Save Global Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerManagement;
