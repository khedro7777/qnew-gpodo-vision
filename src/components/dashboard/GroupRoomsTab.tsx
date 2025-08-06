
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Globe, 
  Lock, 
  Plus,
  Search,
  Filter,
  Database,
  Shield,
  MapPin,
  Building2,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import IPFSFileManager from '@/components/ipfs/IPFSFileManager';
import IPFSAnalytics from '@/components/ipfs/IPFSAnalytics';
import { useIPFS } from '@/hooks/useIPFS';

const GroupRoomsTab = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { getStorageStats } = useIPFS();
  
  // Enhanced mock data with more details
  const mockGroups = [
    {
      id: '1',
      name: 'Tech Innovators Hub',
      description: 'Connecting technology professionals and startups for collaborative projects',
      members: 42,
      maxMembers: 100,
      status: 'active',
      isPublic: true,
      entryFee: 0,
      createdAt: new Date('2024-01-15'),
      type: 'freelancers',
      country: 'UAE',
      countryFlag: '🇦🇪',
      industry: 'Technology',
      industryIcon: '💻',
      rating: 4.8,
      hasDiscountOffers: false,
    },
    {
      id: '2',
      name: 'Green Energy Coalition',
      description: 'Sustainable energy projects and bulk purchasing of solar equipment',
      members: 28,
      maxMembers: 50,
      status: 'active',
      isPublic: false,
      entryFee: 100,
      createdAt: new Date('2024-01-10'),
      type: 'purchasing',
      country: 'Saudi Arabia',
      countryFlag: '🇸🇦',
      industry: 'Energy',
      industryIcon: '⚡',
      rating: 4.6,
      hasDiscountOffers: true,
    },
    {
      id: '3',
      name: 'Digital Marketing Collective',
      description: 'Marketing professionals and agencies collaboration with special offers',
      members: 67,
      maxMembers: 150,
      status: 'active',
      isPublic: true,
      entryFee: 50,
      createdAt: new Date('2024-01-05'),
      type: 'marketing',
      country: 'Kuwait',
      countryFlag: '🇰🇼',
      industry: 'Marketing',
      industryIcon: '📢',
      rating: 4.9,
      hasDiscountOffers: true,
    },
    {
      id: '4',
      name: 'Healthcare Equipment Buyers',
      description: 'Medical equipment group purchasing for hospitals and clinics',
      members: 35,
      maxMembers: 80,
      status: 'active',
      isPublic: true,
      entryFee: 200,
      createdAt: new Date('2024-01-01'),
      type: 'purchasing',
      country: 'Qatar',
      countryFlag: '🇶🇦',
      industry: 'Healthcare',
      industryIcon: '🏥',
      rating: 4.7,
      hasDiscountOffers: false,
    }
  ];

  const countries = ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman'];
  const industries = ['Technology', 'Healthcare', 'Energy', 'Marketing', 'Finance', 'Education'];
  const groupTypes = ['purchasing', 'marketing', 'freelancers', 'investment', 'formation'];

  // Filter groups based on search and filters
  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || group.country === selectedCountry;
    const matchesIndustry = selectedIndustry === 'all' || group.industry === selectedIndustry;
    const matchesType = selectedType === 'all' || group.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || group.status === selectedStatus;
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'free' && group.entryFee === 0) ||
                        (priceRange === 'paid' && group.entryFee > 0) ||
                        (priceRange === 'low' && group.entryFee > 0 && group.entryFee <= 100) ||
                        (priceRange === 'high' && group.entryFee > 100);

    return matchesSearch && matchesCountry && matchesIndustry && matchesType && matchesStatus && matchesPrice;
  });

  const getGroupTypeLabel = (type: string) => {
    switch (type) {
      case 'purchasing': return 'Group Purchasing';
      case 'marketing': return 'Marketing Cooperatives';
      case 'freelancers': return 'Independent Teams';
      case 'investment': return 'Investment Groups';
      case 'formation': return 'Company Formation';
      default: return type;
    }
  };

  const { data: storageStats } = getStorageStats('default');

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setSelectedIndustry('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setPriceRange('all');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Group Rooms & IPFS Vault</h2>
          <p className="text-gray-600">Discover and join collaborative group rooms</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Group Rooms
          </TabsTrigger>
          <TabsTrigger value="ipfs" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            IPFS Vault
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Group Rooms</CardTitle>
              <CardDescription>Browse and join collaborative group rooms with advanced filtering</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Enhanced Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search groups by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {groupTypes.map(type => (
                        <SelectItem key={type} value={type}>{getGroupTypeLabel(type)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Entry Fee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="free">Free (0 USD)</SelectItem>
                      <SelectItem value="low">Low (1-100 USD)</SelectItem>
                      <SelectItem value="high">High (100+ USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredGroups.length} of {mockGroups.length} groups
                </p>
              </div>

              {/* Groups List */}
              <div className="grid gap-4">
                {filteredGroups.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No groups found matching your criteria</p>
                    <Button variant="outline" onClick={clearAllFilters} className="mt-2">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{group.name}</h3>
                              <Badge variant={group.isPublic ? 'default' : 'secondary'}>
                                {group.isPublic ? (
                                  <>
                                    <Globe className="w-3 h-3 mr-1" />
                                    Public
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 mr-1" />
                                    Private
                                  </>
                                )}
                              </Badge>
                              <Badge variant="outline" className="text-green-600">
                                {group.status}
                              </Badge>
                              {group.hasDiscountOffers && (
                                <Badge className="bg-orange-100 text-orange-800">
                                  Discount Offers
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{group.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{group.members}/{group.maxMembers} members</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{group.countryFlag} {group.country}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <span>{group.industryIcon} {group.industry}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{group.rating}/5.0</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Created {group.createdAt.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{getGroupTypeLabel(group.type)}</span>
                              </div>
                              {group.entryFee > 0 && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{group.entryFee} USD</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/group/${group.id}/profile`}>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </Link>
                            <Link to={`/group-room/${group.id}`}>
                              <Button size="sm">
                                Join Room
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Group Capacity</span>
                            <span className="text-sm text-gray-500">
                              {Math.round((group.members / group.maxMembers) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ipfs" className="space-y-6">
          <IPFSFileManager groupId="default" />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {storageStats && (
            <IPFSAnalytics stats={storageStats} groupId="default" />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Group Activity Analytics</CardTitle>
              <CardDescription>Insights into group participation and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Active Groups</h3>
                  <p className="text-2xl font-bold text-blue-600">{mockGroups.length}</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Total Members</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {mockGroups.reduce((sum, group) => sum + group.members, 0)}
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Files Stored</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {storageStats?.totalFiles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IPFS Configuration</CardTitle>
              <CardDescription>Manage your IPFS settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Group ID
                  </label>
                  <Input value="default" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-pin Files
                  </label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">DID Authentication</h4>
                <p className="text-sm text-gray-600 mb-2">Your DID Key:</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  did:key:z6Mkq6THPd7eczYjwWU62wmLWpiAPejWHvnj9BT9yi3RK4sS
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupRoomsTab;
