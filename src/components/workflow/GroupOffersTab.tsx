
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Search, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

interface GroupOffersTabProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const GroupOffersTab = ({ groupId, userRole, isManager }: GroupOffersTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock supplier offers - in real app this would come from database
  const supplierOffers = [
    {
      id: '1',
      title: 'Medical Equipment Supply Package',
      companyName: 'MedTech Solutions LLC',
      contactEmail: 'contact@medtech.com',
      contactPhone: '+971-50-123-4567',
      price: '$45,000',
      deliveryTime: '2 weeks',
      description: 'High-quality medical equipment including monitors, ventilators, and diagnostic tools. All items come with 3-year warranty and technical support.',
      status: 'pending',
      submittedAt: '2024-01-20T10:30:00Z',
      attachments: [
        { name: 'product_catalog.pdf', size: '2.5MB' },
        { name: 'certifications.pdf', size: '1.2MB' }
      ]
    },
    {
      id: '2',
      title: 'IT Infrastructure Services',
      companyName: 'TechFlow Systems',
      contactEmail: 'sales@techflow.ae',
      contactPhone: '+971-55-987-6543',
      price: '$25,000',
      deliveryTime: '1 month',
      description: 'Complete IT setup including servers, networking equipment, security systems, and ongoing maintenance support.',
      status: 'approved',
      submittedAt: '2024-01-18T14:15:00Z',
      attachments: [
        { name: 'technical_specs.docx', size: '1.8MB' },
        { name: 'pricing_breakdown.xlsx', size: '890KB' }
      ]
    },
    {
      id: '3',
      title: 'Office Furniture & Equipment',
      companyName: 'Premium Office Solutions',
      contactEmail: 'info@premiumoffice.com',
      contactPhone: '+971-52-456-7890',
      price: '$15,500',
      deliveryTime: '1 week',
      description: 'Modern office furniture including desks, chairs, meeting tables, and storage solutions. Ergonomic designs with 2-year warranty.',
      status: 'under_review',
      submittedAt: '2024-01-19T09:45:00Z',
      attachments: [
        { name: 'furniture_catalog.pdf', size: '3.2MB' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredOffers = supplierOffers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveOffer = (offerId: string) => {
    console.log('Approving offer:', offerId);
    // In real app, this would update the offer status
  };

  const handleRejectOffer = (offerId: string) => {
    console.log('Rejecting offer:', offerId);
    // In real app, this would update the offer status
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Supplier Offers</h2>
            <p className="text-gray-600">Manage supplier offers submitted to the group</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          {filteredOffers.length} offers
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Offers</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-5 h-5 text-purple-600" />
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    {getStatusBadge(offer.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">Company: {offer.companyName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{offer.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{offer.contactPhone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">Price: {offer.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600">Delivery: {offer.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Submitted: {new Date(offer.submittedAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {offer.attachments.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Files ({offer.attachments.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4">{offer.description}</p>
              
              {/* Action Buttons for Managers */}
              {isManager && offer.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => handleApproveOffer(offer.id)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Approve Offer
                  </Button>
                  <Button 
                    onClick={() => handleRejectOffer(offer.id)}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    Reject Offer
                  </Button>
                </div>
              )}

              {/* Attachments List */}
              {offer.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                  <div className="space-y-1">
                    {offer.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{attachment.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">({attachment.size})</span>
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Offers Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No supplier offers have been submitted yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupOffersTab;
