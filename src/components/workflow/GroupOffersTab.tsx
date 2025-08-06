
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface GroupOffersTabProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const GroupOffersTab = ({ groupId, userRole, isManager }: GroupOffersTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const offers = [
    {
      id: '1',
      title: 'Desktop Computers - HP EliteDesk',
      company: 'Advanced Technology Company',
      price: '$650/unit',
      quantity: '50 units',
      status: 'pending',
      submittedDate: '2024-01-15',
      validUntil: '2024-01-30',
      description: 'High-performance desktop computers with 3-year warranty'
    },
    {
      id: '2',
      title: 'Digital Marketing Services',
      company: 'Digital Creative Agency',
      price: '$3,900/month',
      quantity: '6 months',
      status: 'approved',
      submittedDate: '2024-01-10',
      validUntil: '2024-01-25',
      description: 'Comprehensive digital marketing campaign including social media and Google Ads'
    },
    {
      id: '3',
      title: 'Specialized Legal Consulting',
      company: 'Distinguished Law Firm',
      price: '$130/hour',
      quantity: '20 hours',
      status: 'rejected',
      submittedDate: '2024-01-08',
      validUntil: '2024-01-20',
      description: 'Legal consulting in corporate and commercial contracts'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApproveOffer = (offerId: string) => {
    toast.success('Offer approved successfully');
  };

  const handleRejectOffer = (offerId: string) => {
    toast.success('Offer rejected');
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Submitted Offers</h2>
          <p className="text-gray-600">Review and manage group offers</p>
        </div>
        {isManager && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Request New Offer
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-3 py-2 border rounded-md">
          <option value="">All Status</option>
          <option value="pending">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Offers List */}
      <div className="grid gap-6">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{offer.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{offer.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(offer.status)}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{offer.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">{offer.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{offer.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="font-medium">{new Date(offer.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  
                  {isManager && offer.status === 'pending' && (
                    <>
                      <Button 
                        onClick={() => handleApproveOffer(offer.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleRejectOffer(offer.id)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Offers</h3>
            <p className="text-2xl font-bold text-blue-600">{offers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Under Review</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {offers.filter(o => o.status === 'pending').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Approved</h3>
            <p className="text-2xl font-bold text-green-600">
              {offers.filter(o => o.status === 'approved').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Value</h3>
            <p className="text-2xl font-bold text-purple-600">$47,000</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupOffersTab;
