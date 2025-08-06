
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send,
  MessageCircle, 
  Building, 
  Briefcase,
  Search,
  Eye,
  Download,
  Calendar,
  Reply,
  CheckCircle
} from 'lucide-react';

interface GroupOutboxProps {
  groupId: string;
  userRole: string;
}

const GroupOutbox = ({ groupId, userRole }: GroupOutboxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock outbox messages - in real app this would come from database
  const outboxMessages = [
    {
      id: '1',
      originalMessageId: '1',
      recipientName: 'Ahmed Al-Rashid',
      recipientCompany: 'Tech Solutions LLC',
      subject: 'Re: Question about group purchasing terms',
      content: 'Thank you for your inquiry. Here are the details about our group purchasing terms...',
      sentAt: '2024-01-20T15:30:00Z',
      status: 'delivered',
      type: 'reply',
      originalType: 'contact',
      hasAttachments: true,
      attachments: [
        { name: 'terms_and_conditions.pdf', size: 245000, type: 'application/pdf' }
      ]
    },
    {
      id: '2',
      originalMessageId: '2',
      recipientName: 'Sarah Medical Corp',
      recipientCompany: 'Sarah Medical Corp',
      subject: 'Re: Medical Equipment Supply Offer',
      content: 'We appreciate your offer. We would like to discuss the pricing for bulk orders...',
      sentAt: '2024-01-19T16:45:00Z',
      status: 'read',
      type: 'reply',
      originalType: 'supplier',
      hasAttachments: false
    },
    {
      id: '3',
      originalMessageId: '3',
      recipientName: 'Mohammed Hassan',
      recipientCompany: 'Freelancer',
      subject: 'Re: Web Developer Application',
      content: 'Thank you for your application. We are interested in your profile and would like to schedule an interview...',
      sentAt: '2024-01-18T11:15:00Z',
      status: 'pending',
      type: 'reply',
      originalType: 'freelancer',
      hasAttachments: false
    }
  ];

  const getTypeIcon = (originalType: string) => {
    switch (originalType) {
      case 'contact':
        return <MessageCircle className="w-4 h-4" />;
      case 'supplier':
        return <Building className="w-4 h-4" />;
      case 'freelancer':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Reply className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (originalType: string) => {
    const configs = {
      contact: { label: 'Contact Reply', className: 'bg-blue-100 text-blue-800' },
      supplier: { label: 'Supplier Reply', className: 'bg-purple-100 text-purple-800' },
      freelancer: { label: 'Freelancer Reply', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = configs[originalType as keyof typeof configs] || { label: 'Reply', className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
      read: { label: 'Read', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Failed', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredMessages = outboxMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || message.originalType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Send className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Outbox</h2>
            <p className="text-gray-600">Your sent replies and messages</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50">
            {outboxMessages.filter(m => m.status === 'delivered').length} delivered
          </Badge>
          <Badge variant="outline" className="bg-yellow-50">
            {outboxMessages.filter(m => m.status === 'pending').length} pending
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search sent messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="px-3 py-2 border rounded-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Replies</option>
          <option value="contact">Contact Replies</option>
          <option value="supplier">Supplier Replies</option>
          <option value="freelancer">Freelancer Replies</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(message.originalType)}
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    {getTypeBadge(message.originalType)}
                    {getStatusBadge(message.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>To: {message.recipientName}</span>
                    <span>Company: {message.recipientCompany}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(message.sentAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {message.hasAttachments && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Files
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-3">{message.content}</p>
              
              {message.hasAttachments && message.attachments && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                        <Download className="w-3 h-3" />
                        <span className="text-xs">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {message.status === 'delivered' && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Message delivered successfully</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Send className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No sent messages</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Your sent replies will appear here'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupOutbox;
